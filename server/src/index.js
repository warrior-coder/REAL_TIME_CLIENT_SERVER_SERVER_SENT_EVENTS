const express = require('express');
const cors = require('cors');
const events = require('events');

const app = express();
const port = 3001;
const eventEmitter = new events.EventEmitter();

app.use(express.json());
app.use(cors());

app.get('/connect', (request, response) => {
    // define headers for event sourcing
    response.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
    });

    eventEmitter.on('post-message', (message) => {
        // writing data in a specific format
        const data = {
            message: message,
        };
        const chunk = 'data:' + JSON.stringify(data) + '\n\n';

        // write data to the stream
        response.write(chunk);
    });
});

app.post('/messages', (request, response) => {
    const message = request.body.message;

    if (!message) {
        response.status(404).send('Message not found.');
    }

    // emit event only when someone posts message
    eventEmitter.emit('post-message', message);

    response.status(200).send();
});

app.listen(port, () => {
    console.log(`Server started on port ${port}.`);
});
