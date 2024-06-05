const socket = io();
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
let localStream;
let peer;

// Get user media
navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
    localVideo.srcObject = stream;
    localStream = stream;
    
    // Join room
    const roomId = 'some-room-id'; // In a real app, this would be dynamic
    socket.emit('join', roomId);
    
    socket.on('user-joined', userId => {
        peer = createPeer(userId);
        localStream.getTracks().forEach(track => peer.addTrack(track, localStream));
    });
    
    socket.on('signal', data => {
        peer.signal(data.signal);
    });
});

function createPeer(userId) {
    const peer = new SimplePeer({ initiator: true, trickle: false });

    peer.on('signal', signal => {
        socket.emit('signal', { signal, to: userId, from: socket.id });
    });

    peer.on('stream', stream => {
        remoteVideo.srcObject = stream;
    });

    return peer;
}
