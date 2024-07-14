// Initialize PeerJS with your own API key if needed
const peer = new Peer();

// Display and copy Peer ID
peer.on('open', (id) => {
  document.getElementById('peerIdDisplay').textContent = id;
});

// Function to copy Peer ID to clipboard
function copyPeerId() {
  const peerId = document.getElementById('peerIdDisplay').textContent;
  navigator.clipboard.writeText(peerId).then(() => {
    alert('Peer ID copied to clipboard');
  }).catch(err => {
    console.error('Could not copy text: ', err);
  });
}

// Function to connect to a peer
function connectToPeer() {
  const peerId = document.getElementById('peerIdInput').value;
  const conn = peer.connect(peerId);

  console.log("sad")

  conn.on('open', () => {
    console.log("das")
    document.getElementById('chat-container').classList.remove('hidden');
    document.getElementById('connect-container').classList.add('hidden');

    // Receive messages
    conn.on('data', (data) => {
      appendMessage(data, 'incoming');
    });

    // Send messages
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  });

  conn.on('error', (err) => {
    console.error('Connection error:', err);
    alert('Error connecting to peer. Please check the Peer ID.');
  });
}

// Function to send a message
function sendMessage() {
  const message = document.getElementById('messageInput').value.trim();
  if (message === '') return;

  const conn = peer.connect(document.getElementById('peerIdInput').value);
  conn.on('open', () => {
    conn.send(message);
    appendMessage(message, 'outgoing');
    document.getElementById('messageInput').value = '';
  });
}

// Function to append messages to the chat
function appendMessage(message, type) {
  const messagesDiv = document.getElementById('messages');
  const messageElem = document.createElement('div');
  messageElem.classList.add('message', type);
  messageElem.textContent = message;
  messagesDiv.appendChild(messageElem);

  // Scroll to bottom
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
