import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

function App() {
  const [messageList, setMessageList] = useState([]);
  const [nickName, setNickName] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const [socket, setSocket] = useState(null);

  const handleSubmit = e => {
    e.preventDefault();
    socket.emit('messageFromClient', {
      author: nickName,
      text: newMessageText,
    });
  };

  useEffect(() => {
    const sock = socketIOClient('http://localhost:3001');
    setSocket(sock);
    sock.on('initialMessageList', messages => setMessageList(messages));
    sock.on('messageFromServer', newMessage =>
      setMessageList(currentMessageList => [...currentMessageList, newMessage])
    );

    return () => {
      sock.disconnect();
    };
  }, []);

  return (
    <div className='App'>
      <h2>Messages</h2>
      {messageList.map(({ id, author, text }) => (
        <div key={id}>
          {author} : {text}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <h2>New Message</h2>
        <input
          type='text'
          name='author'
          placeholder='nickname'
          value={nickName}
          required
          onChange={e => setNickName(e.target.value)}
        />
        <input
          type='text'
          name='messageContent'
          placeholder='message'
          value={newMessageText}
          required
          onChange={e => setNewMessageText(e.target.value)}
        />
        <input type='submit' value='send' />
      </form>
    </div>
  );
}

export default App;
