import io from 'socket.io-client';

const socket = io('http://localhost:9090');

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

