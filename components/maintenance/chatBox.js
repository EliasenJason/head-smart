import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { useUser } from "@auth0/nextjs-auth0";

const ChatBoxWrapper = styled.div`
  width: 100%;
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
  flex-direction: column;
`;

const MessagesContainer = styled.div`
  overflow-y: auto;
  max-height: 200px;
  margin-bottom: 10px;
`;

const MessageWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const MessageContent = styled.div`
  background-color: #f0f0f0;
  padding: 5px;
  margin-bottom: 5px;
  flex: 1;
`;

const DeleteButton = styled.button`
  padding: 5px;
  background-color: #e74c3c;
  color: #fff;
  border: white solid 12px;
  cursor: pointer;
  font-size: 10px;
`;

const MessageInfo = styled.div`
  font-size: 9px;
  color: #777;
`;

const InputContainer = styled.div`
  display: flex;
`;

const Input = styled.input`
  flex: 1;
  padding: 5px;
  margin-right: 5px;
`;

const SendButton = styled.button`
  padding: 5px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  cursor: pointer;
`;

export default function ChatBox({unitNumber, chatMessages, setIsLoading}) {
  const [messages, setMessages] = useState(chatMessages);
  const [newMessage, setNewMessage] = useState('');

  const {user, error, isloading} = useUser()
  
  const messagesContainerRef = useRef();

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  //console.log(chatMessages)
  const formattedDate = (date) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric'  
    }
    return new Date(date).toLocaleDateString('en-US', options);
  }

  const handleSendMessage = async () => {
    setIsLoading(true)
    if (user?.name && newMessage !== '') {
      //setMessages([...messages, {message: newMessage, sender: user.name, _id: messages.length}]);
      let dataToBackend = {
        unit: unitNumber,
        message: newMessage,
        sender: user.name,
      }
      try {
        const res = await fetch('/api/maintenance/addUnitMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToBackend)
      })
      if (res.ok) {
        console.log('Message sent successfully')
        const data = await res.json()
        setMessages(data.messages)
        setNewMessage('')
      }
      } catch (error) {
        console.error('Error sending message:', error)
        setNewMessage('')
      }
    } else {
      console.log('you must be signed in and have a message written')
    }
    setIsLoading(false)
  };

  const handleDeleteMessage = async (_id) => {
    setIsLoading(true)
    let dataToBackend = {
      message_id: _id,
      unit: unitNumber,
    }
    try {
      const res = await fetch('/api/maintenance/deleteUnitMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToBackend)
    })
    if (res.ok) {
      console.log('Message successfully deleted')
      const data = await res.json()
      setMessages(data.messages)
      setNewMessage('');
    }
    } catch (error) {
      console.error('Error sending message:', error)
      setNewMessage('')
    }
    setIsLoading(false)
  }

  
  return (
    <ChatBoxWrapper>
      <MessagesContainer ref={messagesContainerRef}>
        {messages.map((messageObject, index) => (
          <MessageWrapper key={index}>
          <MessageContent>
            {messageObject.message}
            <MessageInfo>{`${messageObject.sender} wrote on: ${formattedDate(messageObject.timestamp)}`}</MessageInfo>
          </MessageContent>
          <DeleteButton onClick={() => handleDeleteMessage(messageObject._id)}>Delete</DeleteButton>
        </MessageWrapper>
        ))}
      </MessagesContainer>
      <InputContainer>
        <Input
          type="text"
          placeholder="Create a comment for this unit..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <SendButton onClick={handleSendMessage}>Send</SendButton>
      </InputContainer>
    </ChatBoxWrapper>
  );
};
