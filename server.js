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

        if (parsedMessage.type === "changeGravity") {
            console.log('Received changeGravity message');
        
            if (unityClient) {
                const messageString = message.toString(); // 将Buffer转换为字符串
                unityClient.send(messageString);
                console.log('Message forwarded to Unity client:', messageString);
            } else {
                console.log('No Unity client connected to forward the message.');
            }
        } else {
            console.log('Received a different type of message:', parsedMessage.type);
            // 这里可以添加处理其他类型消息的逻辑
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
        ws.send('Hello from the server!');
    }
});

console.log(`WebSocket Server is running on port ${port}`);
