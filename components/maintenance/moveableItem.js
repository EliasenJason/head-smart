import styled from 'styled-components';

const ArrowButton = styled.button`
  background-color: #007BFF;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin: 5px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ArrowContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const SwapButton = styled.button`
  background-color: #007BFF;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin: 10px;

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
  width: 65px;
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

  &:hover {
    background-color: #c82333;
  }
`;

const MoveableItem = ({ item, onMoveUp, onMoveDown, onSwapToOppositeSide, onRemove, side }) => {
  if (side === 'left') {
    return (
      <MoveableItemContainer key={item.unit}>
        <RemoveButton onClick={onRemove}>X</RemoveButton>
        <ArrowContainer>
        <ArrowButton onClick={onMoveUp}>↑</ArrowButton>
        <ArrowButton onClick={onMoveDown}>↓</ArrowButton>
        </ArrowContainer>
        
        <ItemContent>{item.unit}</ItemContent>
        
        <SwapButton onClick={onSwapToOppositeSide}>→</SwapButton>
        
      </MoveableItemContainer>
    )
  } else {
    return (
      <MoveableItemContainer key={item.unit}>
        <SwapButton onClick={onSwapToOppositeSide}>←</SwapButton>
        <ItemContent>{item.unit}</ItemContent>
        <ArrowContainer>
          <ArrowButton onClick={onMoveUp}>↑</ArrowButton>
          <ArrowButton onClick={onMoveDown}>↓</ArrowButton>
        </ArrowContainer>
        <RemoveButton onClick={onRemove}>X</RemoveButton>
      </MoveableItemContainer>
    )
  }
};

export default MoveableItem;