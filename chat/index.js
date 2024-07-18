const peer = new Peer();

peer.on('open', id => {
    console.log('My peer ID is: ' + id);
    document.getElementById("my-id-input").value = id;
});

let conn;

document.getElementById('connect-button').addEventListener('click', () => {
    if(document.getElementById("connect-button").style.backgroundColor == "red")
      window.location.reload();

    const peerId = document.getElementById('peer-id-input').value;
    conn = peer.connect(peerId);

    conn.on('open', () => {
        console.log('Connected to: ' + peerId);
        displayMessage("System: You have joined!", "green");
        document.getElementById("peer-id-input").classList.add("disable");
        document.getElementById("connect-button").innerHTML = "&nbsp&nbsp&nbsp&nbspExit&nbsp&nbsp&nbsp&nbsp";
        document.getElementById("connect-button").style.backgroundColor = "red";

        conn.on('data', data => {
            if (data.type === 'message') {
                displayMessage(data.content, "black");
            } else if (data.type === 'image') {
                displayImage('Peer', data.content);
            }
        });
    });

    conn.on('close', () => {
        displayMessage('System: Peer has disconnected', "red");
    });
});

document.getElementById('send-button').addEventListener('click', () => {
    const message = document.getElementById('message-input').value;
    sendMessage(message, 'message');
});

document.getElementById('attach-button').addEventListener('click', () => {
    document.getElementById('file-input').click();
});

document.getElementById('file-input').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imageData = e.target.result;
            sendMessage(imageData, 'image');
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select an image file.');
    }
});

peer.on('connection', connection => {
    conn = connection;
    document.getElementById("peer-id-input").value = connection.peer;
    document.getElementById("peer-id-input").classList.add("disable");
    document.getElementById("connect-button").innerHTML = "&nbsp&nbsp&nbsp&nbspExit&nbsp&nbsp&nbsp&nbsp";
    document.getElementById("connect-button").style.backgroundColor = "red";

    displayMessage("System: Peer has joined!", "green");
    conn.on('data', data => {
        if (data.type === 'message') {
            displayMessage(data.content, "black");
        } else if (data.type === 'image') {
            displayImage('Peer', data.content);
        }
    });

    conn.on('close', () => {
        displayMessage('System: Peer has disconnected!', "red");
    });
});

peer.on('disconnected', () => {
    displayMessage('System: You have been disconnected from the server');
});

peer.on('close', () => {
    displayMessage('System: The connection to the server has been closed');
});

function displayMessage(message, color) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = "chat-msg";
    messageElement.style.color = color;
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function displayImage(sender, imageData) {
  const chatBox = document.getElementById('chat-box');
  const imgContainer = document.createElement('div');
  imgContainer.className = "chat-msg";
  imgContainer.style.textAlign = 'left';  // Ensures images are on the left
  const imgElement = document.createElement('img');
  imgElement.style.Width = "16rem";
  imgElement.style.display = "block";  // Ensures images do not flow with text
  imgElement.src = imageData;
  const senderMessage = document.createElement('div');
  senderMessage.textContent = sender + ":";
  senderMessage.style.fontWeight = 'bold';
  senderMessage.style.marginBottom = '5px';  // Adds some space between sender and image
  imgContainer.appendChild(senderMessage);
  imgContainer.appendChild(imgElement);
  chatBox.appendChild(imgContainer);
  chatBox.scrollTop = chatBox.scrollHeight;
}


function sendMessage(content, type) {
  if (conn && conn.open) {
      content = content.trim(); // Trim leading and trailing whitespace

      if (content !== '') {
          conn.send({ type: type, content: content });
          if (type === 'message') {
              displayMessage("~ " + content, "gray");
          } else if (type === 'image') {
              displayImage('Me', content);
          }
      }
      document.getElementById('message-input').value = ''; // Clear input after sending
  } else {
    if(content != ''){
      displayMessage("~ " + content + " ⚠️", "orange");
    }
    document.getElementById('message-input').value = ''; // Clear input after sending
  }
}

// Handle sending message from textarea on Enter key press
document.getElementById('message-input').addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && !event.shiftKey) { // Check if Enter is pressed without Shift
      event.preventDefault(); // Prevent default Enter behavior (submitting the form)

      // Get current value of textarea
      const currentValue = this.value;

      // Send the message
      sendMessage(currentValue, 'message');
  }
});

// Handle sending message from button click
document.getElementById('send-button').addEventListener('click', function() {
  sendMessage(document.getElementById('message-input').value, 'message');
});





function copy() {
    var input = document.getElementById("my-id-input");
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

addEventListener("load", (event) => {
  document.getElementById('peer-id-input').value = '';
});