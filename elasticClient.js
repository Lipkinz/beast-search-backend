const { Client } = require('@elastic/elasticsearch');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a new ElasticSearch client with the correct node URL
const client = new Client({
    node: process.env.ELASTICSEARCH_URL // Ensure this is correctly referencing the .env variable
});

// Function to test the connection to ElasticSearch
const testConnection = async () => {
    try {
        const health = await client.cluster.health();
        console.log('Elasticsearch Cluster Health:', health);
    } catch (error) {
        console.error('Elasticsearch Connection Error:', error);
    }
};

// Function to perform a search query in ElasticSearch
const searchQuery = async (query) => {
    try {
        const result = await client.search({
            index: 'beast-search-index', // Updated to your actual index name
            body: {
                query: {
                    match: {
                        content: query // Ensure this field exists in your indexed documents
                    }
                }
            }
        });

        // Log and return the search results
        console.log('Search results:', result.hits.hits);
        return result.hits.hits; // Return only the relevant search hits
    } catch (error) {
        console.error('Search Query Error:', error);
        throw error;
    }
};

module.exports = { client, testConnection, searchQuery };
