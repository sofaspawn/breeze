import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

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

  const goDown = () => {
    setShifted(prevShifted => [...prevShifted, messages.shift()]);
  }

  if (messages.length > 8) {
    goDown();
  }

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
    if (input) {
      socket.emit('chat message', input);
      setInput('');
    }
  };

  const clearMessages = () => {
    setMessages([]);
  }

  const goUp= () => {
    let m = messages;
    m.pop();
    m.unshift(shifted[-1]);
    setMessages(m);
  }


  return (
    <div className="App">
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
        <button type="submit">Send</button>
        <button onClick={clearMessages}>clear</button>
        <button onClick={goUp}>↑</button>
        <button onClick={goDown}>↓</button>
      </form>
    </div>
  );
}

export default App;