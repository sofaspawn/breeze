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
  const [isOpen, setIsOpen] = useState(false);

  var currentdate = new Date();
  var datetime = "\n" + currentdate.getDate() + "/"
    + (currentdate.getMonth() + 1) + "/"
    + currentdate.getFullYear() + " @ "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();

  //-----------------------------
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input || !nickname) return; // Prevent sending empty messages

    const randomX = Math.floor(Math.random() * (window.innerWidth - 200)); // Random x position
    const randomY = Math.floor(100 + Math.random() * (window.innerHeight - 200)); // Random y position

    socket.emit('chat message', { datetime: `${datetime}`, nickname: `${nickname}`, message: `${input}`, x: randomX, y: randomY });
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

  const toggleModal = () => {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    if (messages.length >= 25) {
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


  return (
    <div className="chat-container">
      <p>*THE CORNY 2000s UI IS INTENTIONAL*</p>
      <h1>breeze</h1>
      <button className='clunky-button' onClick={toggleModal}>ME</button>

      {isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <p><a href='https://github.com/sofaspawn'>sofaspawn</a></p>
            <p>i don't do webdev, first time doing frontend</p>
            <p>But I do code in C, Rust and Go</p>
            <p>currently working on <a href='https://github.com/sofaspawn/srchngin'>srchngin</a></p>
            <p>proud of: <a href='https://github.com/k1ut3h/png'>png</a>(alt account)</p>
            <p>(CRINGE ALERT)blog: <a href='https://sofaspirit.bearblog.dev'>sofaspirit</a></p>
            <button onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}

      <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="chat-box" style={{ position: 'absolute', left: msg.x, top: msg.y }}>
              <div className="chat-header">
                <div>
                  {msg.nickname}
                  {msg.datetime}
                </div>
              </div>
              {msg.message}
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