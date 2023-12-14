const WebSocket = require('ws');
const port = process.env.PORT || 3000; // Render 使用环境变量设置端口

const wss = new WebSocket.Server({ port: port });

// 用于存储 Unity 客户端的 WebSocket 连接
let unityClient = null;

wss.on('connection', function connection(ws) {
    // 当新的客户端连接时
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);

        // 解析接收到的消息
        let parsedMessage = JSON.parse(message);

        if (parsedMessage.type === "changeGravity") {
            // 如果是从 HTML 网页发来的特定消息，转发给 Unity 客户端
            if (unityClient) {
                unityClient.send(message);
                console.log('message send')
            }
        } else {
            // 处理其他普通客户端的消息
            // 这里可以添加逻辑来处理从客户端接收到的消息
        }
    });

    // 根据连接来源进行标识
    if (ws.protocol === 'unity') {
        unityClient = ws;
    }

    // 如果是 Unity 客户端连接，可以在首次连接时发送一个特定的消息
    if (unityClient) {
        unityClient.send('Hello from the server!');
    }
});

console.log(`WebSocket Server is running on port ${port}`);
