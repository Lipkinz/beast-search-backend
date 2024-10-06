const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { testConnection, searchQuery } = require('./elasticClient'); // Import the search function

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Enable CORS with your specific frontend domain
app.use(cors({
    origin: ['https://lipkinz.github.io'], // Replace with your actual frontend GitHub Pages URL or other domains if needed
    methods: ['GET', 'POST'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Specify allowed headers
}));

// Root Route to check if the server is running
app.get('/', (req, res) => {
    res.send('Beast Search Backend is Running');
});

// Search Route
app.get('/search', async (req, res) => {
    const query = req.query.q; // Get search query from request
    if (!query) {
        return res.status(400).send({ message: 'Query is required' });
    }

    try {
        // Call the search function and get the results
        const results = await searchQuery(query);

        // Return the search results if successful
        res.json(results);
    } catch (error) {
        console.error('Error searching Elasticsearch:', error.message || error); // Log the specific error

        // Respond with an error message
        res.status(500).send({ message: 'Error searching Elasticsearch' });
    }
});

// Start Server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    // Test connection to Elasticsearch on startup
    try {
        await testConnection();
        console.log('Elasticsearch connected successfully');
    } catch (error) {
        console.error('Error connecting to Elasticsearch:', error.message || error);
    }
});

