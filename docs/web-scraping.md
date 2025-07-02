# Web Scraping for Kenyan Law Sources

JuaKatiba now supports scraping and indexing content from trusted Kenyan law websites to expand the knowledge base beyond just PDF documents.

## Supported Websites

- **Kenya Law Reports** (`kenyalaw.org`) - Official legal database
- **Parliament of Kenya** (`parliament.go.ke`) - Parliamentary procedures and legislation
- **Judiciary of Kenya** (`judiciary.go.ke`) - Court decisions and judicial information

## Usage

### API Endpoint

**POST** `/api/scrape`

**Request Body:**

```json
{
  "url": "https://www.parliament.go.ke/some-legal-document",
  "source": "Parliamentary Procedures Manual" // optional
}
```

**Response:**

```json
{
  "message": "Web content scraped and indexed successfully.",
  "documentsProcessed": 15,
  "source": "Parliament of Kenya - https://www.parliament.go.ke/some-legal-document",
  "url": "https://www.parliament.go.ke/some-legal-document"
}
```

### Using the Script

A helper script is provided to easily scrape Kenyan law content:

```bash
# Local development
node scripts/scrape-kenyan-law.js http://localhost:7071 "https://www.parliament.go.ke/procedures" "Parliamentary Procedures"

# Production
node scripts/scrape-kenyan-law.js https://your-function-app.azurewebsites.net "https://www.judiciary.go.ke/laws" "Judiciary Laws"
```

### Example URLs to Scrape

- Constitution: `http://www.kenyalaw.org/kl/index.php?id=398`
- Parliamentary Procedures: `https://www.parliament.go.ke/the-national-assembly/procedures`
- Judiciary Laws: `https://www.judiciary.go.ke/laws-and-policies/`
- Kenya Law Reports: `http://www.kenyalaw.org/kl/index.php?id=86`

## Security Features

- **Domain Validation**: Only allows scraping from trusted Kenyan government and legal websites
- **Content Filtering**: Uses specific CSS selectors to extract relevant legal content
- **Metadata Tracking**: Records source URL, domain, and scraping timestamp for each document

## How It Works

1. **URL Validation**: Checks that the URL is from a trusted Kenyan law source
2. **Content Extraction**: Uses Cheerio web scraper with domain-specific selectors
3. **Text Processing**: Splits content into chunks for better search performance
4. **Embedding Generation**: Creates embeddings using Azure OpenAI or Ollama
5. **Storage**: Stores in Azure Cosmos DB or local Faiss database
6. **Integration**: Content becomes searchable through the chat interface

## Benefits

- **Expanded Knowledge Base**: Access to live, up-to-date legal information
- **Comprehensive Coverage**: Combines static PDFs with dynamic web content
- **Real-time Updates**: Can re-scrape sources to get latest legal information
- **Trusted Sources**: Only allows content from official Kenyan government websites

## Next Steps

After scraping content, test the chat interface to see if it can access and reference the new web-scraped content in responses about Kenyan law.
