const fetch = require('node-fetch');

/**
 * Script to scrape and ingest content from Kenyan law websites
 * Usage: node scrape-kenyan-law.js <api_url> <website_url> [source_name]
 */

const KENYAN_LAW_EXAMPLES = {
  Constitution: 'http://www.kenyalaw.org/kl/index.php?id=398',
  'Parliamentary Procedures': 'https://www.parliament.go.ke/the-national-assembly/procedures',
  'Judiciary Laws': 'https://www.judiciary.go.ke/laws-and-policies/',
  'Kenya Law Reports': 'http://www.kenyalaw.org/kl/index.php?id=86',
};

async function scrapeKenyanLaw(apiUrl, websiteUrl, sourceName) {
  try {
    console.log(`🔍 Scraping Kenyan law content from: ${websiteUrl}`);
    console.log(`📡 API endpoint: ${apiUrl}/api/scrape`);

    const response = await fetch(`${apiUrl}/api/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: websiteUrl,
        source: sourceName || `Kenyan Law - ${new URL(websiteUrl).hostname}`,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Successfully scraped and indexed content!`);
      console.log(`📄 Documents processed: ${result.documentsProcessed}`);
      console.log(`📚 Source: ${result.source}`);
      console.log(`🔗 URL: ${result.url}`);
    } else {
      const error = await response.text();
      console.error(`❌ Failed to scrape content: ${error}`);
    }
  } catch (error) {
    console.error(`💥 Error scraping Kenyan law content:`, error.message);
  }
}

if (require.main === module) {
  const arguments_ = process.argv.slice(2);

  if (arguments_.length < 2) {
    console.log('Usage: node scrape-kenyan-law.js <api_url> <website_url> [source_name]');
    console.log('');
    console.log('Examples:');
    console.log(
      'node scrape-kenyan-law.js http://localhost:7071 "http://www.kenyalaw.org/kl/index.php?id=398" "Constitution"',
    );
    console.log(
      'node scrape-kenyan-law.js https://func-api-x4etqdttf3ng2.azurewebsites.net "https://www.parliament.go.ke/the-national-assembly/procedures" "Parliamentary Procedures"',
    );
    console.log('');
    console.log('Suggested Kenyan Law URLs to scrape:');
    for (const [name, url] of Object.entries(KENYAN_LAW_EXAMPLES)) {
      console.log(`  ${name}: ${url}`);
    }

    throw new Error('Missing required arguments: api_url and website_url');
  }

  const [apiUrl, websiteUrl, sourceName] = arguments_;
  await scrapeKenyanLaw(apiUrl, websiteUrl, sourceName);
}

module.exports = { scrapeKenyanLaw, KENYAN_LAW_EXAMPLES };
