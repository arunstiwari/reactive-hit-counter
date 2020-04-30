const io = require('socket.io')(9090);
const redis = require('redis');
const client = redis.createClient();

io.on('connection', (socket) => {
    console.log('client is connected');
    
    socket.on('hello', data => {
        socket.join(data.hashId);
        // console.log(data.hashId);
        client.incr(data.hashId, (err, count) => {
            io.to(data.hashId).emit('stats',count);
            // console.log(count);
            // socket.emit('stats',count);
        })
    });
})