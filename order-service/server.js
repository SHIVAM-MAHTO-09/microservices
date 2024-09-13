const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const path = require('path');  
const port = 3001;


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));  // Correct static path usage

// Body parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Store orders in memory (replace with a database in production)
let orders = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));  // Serve index.html
});
// API to place an order

app.get('/' , async(req,res)  =>{
    res.status(201).send(index.html);

})
app.post('/api/order', async (req, res) => {
    const order = req.body;
    orders.push(order);

    // Notify the notification service about the new order
    try {
        await axios.post('http://localhost:3002/api/notify', order);
    } catch (error) {
        console.error('Error notifying notification service:', error.message);
    }

    res.status(201).send({ message: 'Order received!' });
});

app.listen(port, () => {
    console.log(`Order service is running on http://localhost:${port}`);
});
