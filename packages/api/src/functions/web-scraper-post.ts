import fs from 'node:fs/promises';
import { type HttpRequest, type HttpResponseInit, type InvocationContext, app } from '@azure/functions';
import { AzureOpenAIEmbeddings } from '@langchain/openai';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { AzureCosmosDBNoSQLVectorStore } from '@langchain/azure-cosmosdb';
import { OllamaEmbeddings } from '@langchain/ollama';
import { FaissStore } from '@langchain/community/vectorstores/faiss';
import 'dotenv/config';
import { badRequest, serviceUnavailable, ok } from '../http-response.js';
import { ollamaEmbeddingsModel, faissStoreFolder } from '../constants.js';
import { getAzureOpenAiTokenProvider, getCredentials } from '../security.js';

// Kenyan law websites that can be scraped
const KENYAN_LAW_SOURCES = {
  'kenyalaw.org': {
    baseUrl: 'https://new.kenyalaw.org/',
    selector: '.content, .article-body, .law-content, p, div.text-content',
    name: 'Kenya Law Reports',
  },
  'parliament.go.ke': {
    baseUrl: 'http://www.parliament.go.ke/',
    selector: '.content, .article, .main-content, p',
    name: 'Parliament of Kenya',
  },
  'judiciary.go.ke': {
    baseUrl: 'https://www.judiciary.go.ke/',
    selector: '.content, .article-content, .main-content, p',
    name: 'Judiciary of Kenya',
  },
};

export async function postWebScraper(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const azureOpenAiEndpoint = process.env.AZURE_OPENAI_API_ENDPOINT;

  try {
    context.log('Starting web scraping process');

    // Get the URL and optional selector from the request
    const requestBody = (await request.json()) as { url: string; selector?: string; source?: string };
    const { url, selector, source } = requestBody;

    if (!url) {
      return badRequest('URL is required in the request body.');
    }

    // Validate that the URL is from a trusted Kenyan law source
    const domain = new URL(url).hostname.replace('www.', '');
    const trustedSource = Object.keys(KENYAN_LAW_SOURCES).find((key) => domain.includes(key));

    if (!trustedSource) {
      return badRequest(
        `URL must be from a trusted Kenyan law source. Supported domains: ${Object.keys(KENYAN_LAW_SOURCES).join(', ')}`,
      );
    }

    const sourceConfig = KENYAN_LAW_SOURCES[trustedSource as keyof typeof KENYAN_LAW_SOURCES];
    const contentSelector = selector || sourceConfig.selector;

    context.log(`Scraping content from: ${url}`);
    context.log(`Using selector: ${contentSelector}`);

    // Load content from the web page
    const loader = new CheerioWebBaseLoader(url, {
      selector: contentSelector as any, // Type assertion for selector
    });

    const rawDocuments = await loader.load();

    if (!rawDocuments || rawDocuments.length === 0) {
      return badRequest('No content could be extracted from the provided URL.');
    }

    // Set metadata for the documents
    for (const document of rawDocuments) {
      document.metadata = {
        ...document.metadata,
        source: source || `${sourceConfig.name || 'Kenyan Law'} - ${url}`,
        url,
        domain,
        scrapedAt: new Date().toISOString(),
      };
    }

    context.log(`Extracted ${rawDocuments[0].pageContent.length} characters from web page`);

    // Split the text into smaller chunks
    context.log('Starting text splitting');
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1500,
      chunkOverlap: 100,
    });
    const documents = await splitter.splitDocuments(rawDocuments);
    context.log(`Split into ${documents.length} chunks`);

    // Generate embeddings and save in database
    context.log(`Azure OpenAI endpoint: ${azureOpenAiEndpoint ? 'configured' : 'not configured'}`);
    if (azureOpenAiEndpoint) {
      context.log('Using Azure OpenAI for embeddings');
      const credentials = getCredentials();
      const azureADTokenProvider = getAzureOpenAiTokenProvider();

      // Initialize embeddings model and vector database
      const embeddings = new AzureOpenAIEmbeddings({ azureADTokenProvider });
      context.log('Storing documents in Azure Cosmos DB');
      await AzureCosmosDBNoSQLVectorStore.fromDocuments(documents, embeddings, { credentials });
    } else {
      // If no environment variables are set, it means we are running locally
      context.log('No Azure OpenAI endpoint set, using Ollama models and local DB');
      const embeddings = new OllamaEmbeddings({ model: ollamaEmbeddingsModel });
      const folderExists = await checkFolderExists(faissStoreFolder);
      context.log(`Faiss folder exists: ${folderExists}`);
      if (folderExists) {
        context.log('Loading existing Faiss store');
        const store = await FaissStore.load(faissStoreFolder, embeddings);
        await store.addDocuments(documents);
        await store.save(faissStoreFolder);
      } else {
        context.log('Creating new Faiss store');
        const store = await FaissStore.fromDocuments(documents, embeddings, {});
        await store.save(faissStoreFolder);
      }
    }

    return ok({
      message: 'Web content scraped and indexed successfully.',
      documentsProcessed: documents.length,
      source: rawDocuments[0].metadata.source,
      url,
    });
  } catch (_error: unknown) {
    const error = _error as Error;
    context.error(`Error when processing web scraper request: ${error.message}`);
    context.error(`Error stack: ${error.stack}`);

    return serviceUnavailable(`Service temporarily unavailable. Error: ${error.message}`);
  }
}

async function checkFolderExists(folderPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(folderPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

app.http('web-scraper-post', {
  route: 'scrape',
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: postWebScraper,
});
