const WebSocket = require('ws');
const port = process.env.PORT || 3000;

const wss = new WebSocket.Server({ port: port });

let unityClient = null;

wss.on('connection', function connection(ws) {
    console.log('Client connected');

    ws.on('message', function incoming(message) {
        console.log('Received message: %s', message);

        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message);
            console.log('Parsed message:', parsedMessage);
        } catch (error) {
            console.error('Error parsing message:', error);
            return;
        }

        // 检查 Unity 客户端是否连接
        if (unityClient) {
            const messageString = message.toString(); // 将Buffer转换为字符串
            unityClient.send(messageString);
            console.log('Message forwarded to Unity client:', messageString);
        } else {
            console.log('No Unity client connected to forward the message.');
        }
    });

    ws.on('close', function close() {
        console.log('Client disconnected');
        if (ws === unityClient) {
            unityClient = null;
            console.log('Unity client disconnected');
        }
    });

    if (ws.protocol === 'unity') {
        unityClient = ws;
        console.log('Unity client connected');
    }
});

console.log(`WebSocket Server is running on port ${port}`);