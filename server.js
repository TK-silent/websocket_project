const WebSocket = require('ws');
const port = process.env.PORT || 3000; // Render 使用环境变量设置端口

const wss = new WebSocket.Server({ port: port });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    // 这里可以添加逻辑来处理从客户端接收到的消息
  });

  ws.send('Message from server'); // 向连接的客户端发送消息
});

console.log(`WebSocket Server is running on port ${port}`);
