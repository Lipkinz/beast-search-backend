const { Client } = require('@elastic/elasticsearch');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a new ElasticSearch client with the correct cloud URL and credentials
const client = new Client({
    node: process.env.ELASTICSEARCH_URL,  // Use the Elastic Cloud URL
    auth: {
        username: process.env.ELASTICSEARCH_USERNAME, // Use the cloud username (usually 'elastic')
        password: process.env.ELASTICSEARCH_PASSWORD  // Use the password provided by Elastic Cloud
    },
    tls: {
        rejectUnauthorized: false // Only use this if you're sure the certificate is self-signed or unverified.
    }
});

// Function to test the connection to ElasticSearch
const testConnection = async () => {
    try {
        const health = await client.cluster.health();
        console.log('Elasticsearch Cluster Health:', health);
    } catch (error) {
        console.error('Elasticsearch Connection Error:', error.message);
    }
};

// Function to perform a search query in ElasticSearch
const searchQuery = async (query) => {
    try {
        const result = await client.search({
            index: 'beast-search-index', // Ensure this matches your created index in Elastic Cloud
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
        console.error('Search Query Error:', error.meta.body.error); // Log detailed Elasticsearch error
        throw new Error('Failed to perform search query');
    }
};

module.exports = { client, testConnection, searchQuery };
