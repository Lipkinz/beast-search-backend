const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add CORS
const { testConnection, searchQuery } = require('./elasticClient'); // Import the search function

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS to allow frontend requests

// Root Route
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
        const results = await searchQuery(query); // Call the search function
        res.json(results); // Return the search results
    } catch (error) {
        console.error('Error searching Elasticsearch:', error);
        res.status(500).send({ message: 'Error searching Elasticsearch' });
    }
});

// Start Server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await testConnection();
});
