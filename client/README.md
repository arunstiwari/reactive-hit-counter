### 1. npm i -D webpack

### 2. npm i -D webpack-cli

### 3. npm i -D webpack-dev-server html-webpack-plugin

### 4. create webpack.config.js

### 5. Add the following content in it as shown in the file

### 6. create src/index.html file with relevant contents

### 7. Modify the package.json to add the --config ./webpack.config.js argument

### 8. npm start (look at the browser http://localhost:8080)

### 9. npm i -D babel-core babel-loader babel-preset-env

### 10. Add the babel configuration in the package.json

### 11. npm i -D socket.io-client

### 12. Add the following code in index.js
```
    import io from 'socket.io-client';

    const socket = io('http://localhost:9090');

    socket.on('connect',()=> {
        console.log('connected')
    });

    if (window.location.hash) {
        const hashId = window.location.hash.substring(1);
        console.log(hashId);
    }
```
### 13. Start the server and client both, then go to the browser http://localhost:8080/#test1 and you should see in the console hashId getting printed

### 14. Now modify the index.js in the client code 
```
import io from 'socket.io-client';

const socket = io('http://localhost:9090');

socket.on('connect',()=> {
    console.log('connected')
    if (window.location.hash) {
        const hashId = window.location.hash.substring(1);
        console.log(hashId);
        socket.emit('hello', {hashId})
    }
    
});
```
### 15. Modify the server.js code in the server directory
```
    const io = require('socket.io')(9090);

    io.on('connection', (socket) => {
        console.log('client is connected');
        socket.on('hello', hashId => console.log(hashId));
    })
```

### 16. Now we will add the code to support redis

### 17. First install the redis in the server directory by npm i redis

### 18. Add the following code to the server.js to support the redis 
```
const io = require('socket.io')(9090);
const redis = require('redis');
const client = redis.createClient();

io.on('connection', (socket) => {
    console.log('client is connected');
    socket.on('hello', data => {
        // console.log(data.hashId);
        client.incr(data.hashId, (err, count) => {
            console.log(count);
        })
    });
})
```

### 19. First we need to start the redis server by running the following command
```bash
    docker pull redis

    docker volume create redis_vol

    docker run -v redis_vol:/data --name my-redis -p 6379:6379  -d redis redis-server --appendonly yes
```
### 20. Now you need to start the server and go to the browser and hit the refresh button on the url http://localhost:8080/#test few times

### 21. Modify the server.js to support emitting the hashId 
```
const io = require('socket.io')(9090);
const redis = require('redis');
const client = redis.createClient();

io.on('connection', (socket) => {
    console.log('client is connected');
    socket.on('hello', data => {
        // console.log(data.hashId);
        client.incr(data.hashId, (err, count) => {
            // console.log(count);
            socket.emit('stats',count);
        })
    });
})
```

### 22. Now after modifying the server.js we can add the following content to the index.js in the client code
```
import io from 'socket.io-client';

const socket = io('http://localhost:9090');

socket.on('connect',()=> {
    console.log('connected')
    if (window.location.hash) {
        const hashId = window.location.hash.substring(1);
        console.log(hashId);
        socket.emit('hello', {hashId});
        socket.on('stats',data => console.log(data));
    }
    
});
```
### 23. Start the client and server both and go to the browser http://localhost:8080/#test and refresh multiple times. You can see the console having incremental count value

### 24. Now modify the client code to add the hit element in the html, first modify the index.js 
```
socket.on('connect',()=> {
    console.log('connected')
    if (window.location.hash) {
        const hashId = window.location.hash.substring(1);
        console.log(hashId);
        socket.emit('hello', {hashId});
        socket.on('stats',hits => {
            // console.log(data);
            document.getElementById('hitCount').innerText= hits
        });
    }
    
});

```

--- Modify the index.html file
```html
<body>
    <h1>This link has been clicked <span id="hitCount">0</span> times</h1>
</body>
```

### 25. Idea is to create a socket room, so modify the server.js code  
```

```