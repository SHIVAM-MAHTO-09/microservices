const express = require('express');
const { Server } = require('ws');
const bodyParser = require('body-parser');
const app = express();
 
const path = require('path');  
const port = 3002;



// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));  // Correct static path usage

// Body parser middleware to parse form data

// Body parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Store clients (connected counters) and orders in memory
let clients = [];
let orders = [];


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'counter.html'));  // Serve index.html
});
// API to receive notifications about new orders
app.post('/api/notify', (req, res) => {
    const order = req.body;
    orders.push(order);

    // Notify all connected clients (counter systems)
    clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify([order]));
        }
    });

    res.status(200).send({ message: 'Notification sent to counters' });
});

// Start HTTP server
const server = app.listen(port, () => {
    console.log(`Notification service is running on http://localhost:${port}`);
});

// WebSocket server for live updates to counter systems
const wss = new Server({ server });

wss.on('connection', (ws) => {
    console.log('Counter connected');
    clients.push(ws);

    // Send current orders to the newly connected client
    ws.send(JSON.stringify(orders));

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log('Counter disconnected');
    });
});
