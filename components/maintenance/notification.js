import { useState, useEffect } from 'react';
import styled from 'styled-components';

const NotificationContainer = styled.div`
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Notification = styled.div`
  background-color: #ff0000;
  color: white;
  padding: 15px;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  max-width: 600px;
`;

const Button = styled.button`
  background-color: #007BFF;
  color: #fff;
  padding: 8px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
  font-weight: 600;
  margin-left: 10px;
  &:hover {
    background-color: #0056b3;
  }
`;

const NotificationComponent = ({ show, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  const handleClose = () => {
    setIsVisible(false);
    onClose && onClose(); // Call the callback function from the parent, if provided
  };

  return (
    <>
      {isVisible && (
      <NotificationContainer>
          <Notification>
            <p>{message}</p>
            <Button onClick={handleClose}>Okay</Button>
          </Notification>
      </NotificationContainer>
      )}
    </>
  );
};

export default NotificationComponent;
