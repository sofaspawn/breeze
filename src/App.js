import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

//const socket = io('https://breeze-vo0j.onrender.com', {
const socket = io('http://localhost:4000', {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [shifted, setShifted] = useState([]);
  const [nickname, setNickname] = useState('');
  const [isNicknameEntered, setIsNicknameEntered] = useState(false);

  //-----------------------------
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input) return; // Prevent sending empty messages

    const randomX = Math.floor(Math.random() * (window.innerWidth - 200)); // Random x position
    const randomY = Math.floor(100 + Math.random() * (window.innerHeight - 200)); // Random y position

    socket.emit('chat message', { text: `${nickname}: ${input}`, x: randomX, y: randomY });
    setMessages([...messages, { text: input, x: randomX, y: randomY }]);
    setInput('');
  };
  //-------------------------------

  const goDown = () => {
    if (messages.length > 1) {
      const firstMessage = messages[1];
      setMessages(prevMessages => prevMessages.slice(2));
      setShifted(prevShifted => [...prevShifted, firstMessage]);
    }
  };

  useEffect(() => {
    if (messages.length > 9) {
      goDown();
    }
  }, [messages]);

  //socket code------------------------------
  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (isNicknameEntered) { // Ensure input is not empty and nickname is entered
      const randomX = Math.floor(Math.random() * (window.innerWidth - 200)); // Random x position
      const randomY = Math.floor(Math.random() * (window.innerHeight - 100)); // Random y position
      setInput('');
    } else {
      console.error('Message not sent: Input is empty or nickname not entered');
      window.alert("Message not sent: Input is empty or nickname not entered");
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setShifted([]);
  };

  const goUp = () => {
    if (shifted.length > 0) { // Check if there are shifted messages
      const lastShiftedMessage = shifted[shifted.length - 1]; // Get the last shifted message
      setMessages(prevMessages => [lastShiftedMessage, ...prevMessages]); // Add it to the messages
      setShifted(prevShifted => prevShifted.slice(0, -1)); // Remove the last shifted message
    }
  };

  return (
    <div className="chat-container">
      <p>*THIS IS PROOF OF CONCEPT. NOT THE FINAL PRODUCT*</p>
      <p>*WEBSOCKETS IMPLEMENTED.*</p>
      <p>*THE CORNY 2000s UI IS INTENTIONAL🙏*</p>
      <h1>breeze</h1>
      <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="chat-box" style={{ position: 'absolute', left: msg.x, top: msg.y }}>
              {msg.text}
            </div>
        ))}
      </div>
        <form className="bottom-elements" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          className="input-box"
        />
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Enter your nickname"
          className="input-box"
        />
        <button type='submit' className="send-button">Send</button>
        <button type='button' onClick={clearMessages} className="clear-button">Clear</button>
        </form>
    </div>
  );

    {/*}
    <div className="App">
      <p>*THIS IS PROOF OF CONCEPT. NOT THE FINAL PRODUCT*</p>
      <p>*WEBSOCKETS IMPLEMENTED.*</p>
      <p>*THE CORNY 2000s UI IS INTENTIONAL🙏*</p>
      <h1>breeze</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <form onSubmit={sendMessage}>
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
        />
        <input 
          value={nickname} 
          onChange={(e) => {
            setNickname(e.target.value);
            setIsNicknameEntered(!!e.target.value);
          }} 
          placeholder="Enter your nickname"
        />
        <button type="submit" disabled={!isNicknameEntered}>Send</button>
        <button onClick={clearMessages}>clear</button>
        <button onClick={goUp}>↑</button>
        <button onClick={goDown}>↓</button>
      </form>
      <p className='goof'>GDSC cannot keep getting away with high effort 'modern' frontends.</p>
      <p className='goof'>here's high effort yet goofy 2000s frontend</p>
    </div>
    {*/}
}

export default App;