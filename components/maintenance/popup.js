import styled from 'styled-components';

const PopupContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const PopupContent = styled.div`
  background-color: #f9f9f9;
  border: 2px solid #ccc;
  border-radius: 5px;
  padding: 20px;
  max-width: 400px;
  width: 100%;
`;

const PopupTitle = styled.h3`
  margin-top: 0;
`;

const PopupMessage = styled.p`
  margin-bottom: 20px;
`;

const PopupButtons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const PopupButton = styled.button`
  background-color: #007BFF;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
  font-weight: 600;
  
  &:hover {
    background-color: #0056b3;
  }
`;

export default function Popup({ isOpen, onConfirm, onCancel, title, message }) {
  if (!isOpen) return null;

  return (
    <PopupContainer>
      <PopupContent>
        <PopupTitle>{title}</PopupTitle>
        <PopupMessage>{message}</PopupMessage>
        <PopupButtons>
          <PopupButton onClick={onConfirm}>Confirm</PopupButton>
          <PopupButton onClick={onCancel}>Cancel</PopupButton>
        </PopupButtons>
      </PopupContent>
    </PopupContainer>
  );
};
