const peerConnection = new RTCPeerConnection();

const handleCallUser = async (socket, userIdToCall, localStream,type,name,profile) => {
  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  socket.emit('call-user', {
    to: userIdToCall,
    offer,
    type,
    name,
    profile
  });
};



export { handleCallUser  };