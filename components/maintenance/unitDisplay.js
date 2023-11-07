import styled from 'styled-components';

const UnitContainer = styled.div`
  width: 220px; /* Fixed width for the unit container */
  height: 120px; /* Fixed height for the unit container */
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #0077B6;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  transition: border-color 0.3s ease-in-out;

  &:hover {
    border-color: #005082;
  }
`;

const UnitNumber = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const ElementsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Circle = styled.div`
  width: 40px;
  height: 40px;
  border: 2px solid #0077B6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #0077B6;
  background-color: #E5E5E5;
  transition: background-color 0.3s ease-in-out;
`;

const UnitDisplay = ({ unitNumber, elements, onClick }) => {
  return (
    <UnitContainer onClick={onClick}>
      <UnitNumber>{unitNumber}</UnitNumber>
      <ElementsContainer>
        {elements.map((element, index) => (
          <Circle key={index}>{element}</Circle>
        ))}
      </ElementsContainer>
    </UnitContainer>
  );
};

export default UnitDisplay;
