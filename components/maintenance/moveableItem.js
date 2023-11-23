import styled from 'styled-components';

const ArrowButton = styled.button`
  background-color: #28a745;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin: 0 5px;

  &:hover {
    background-color: #218838;
  }
`;

const SwapButton = styled.button`
  background-color: #007BFF;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-left: 10px;

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
  width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 10px;
`;

const RemoveButton = styled.button`
  background-color: #dc3545;
  color: #fff;
  padding: 5px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: #c82333;
  }
`;

const MoveableItem = ({ item, onMoveUp, onMoveDown, onSwapToOppositeSide, onRemove }) => {
  return (
    <MoveableItemContainer key={item.unit}>
      <ArrowButton onClick={onMoveUp}>↑</ArrowButton>
      <ItemContent>{item.unit}</ItemContent>
      <ArrowButton onClick={onMoveDown}>↓</ArrowButton>
      <SwapButton onClick={onSwapToOppositeSide}>Swap</SwapButton>
      <RemoveButton onClick={onRemove}>Remove</RemoveButton>
    </MoveableItemContainer>
  );
};

export default MoveableItem;