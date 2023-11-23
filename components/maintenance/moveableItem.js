import styled from 'styled-components';

const ArrowContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ArrowButton = styled.button`
  background-color: #007BFF;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin: 0 5px;

  &:hover {
    background-color: #0056b3;
  }
`;

const MoveableItemContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ItemContent = styled.div`
  text-align: center;
  width: 120px; /* Set a fixed width based on the maximum character count */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 10px;
`;

const MoveableItem = ({ item, onMoveUp, onMoveDown }) => {
  return (
    <MoveableItemContainer key={item.unit}>
      <ArrowButton onClick={onMoveUp}>↑</ArrowButton>
      <ItemContent>{item.unit}</ItemContent>
      <ArrowButton onClick={onMoveDown}>↓</ArrowButton>
    </MoveableItemContainer>
  );
};

export default MoveableItem;