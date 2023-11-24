import styled from 'styled-components';

const UnitContainer = styled.div`
  width: 100%; /* Fixed width for the unit container */
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
  width: 100%;
`;

const Circle = styled.div`
  width: 40px;
  height: 40px;
  border: 2px solid #0077B6;
  border-radius: 50%;
  display: flex;
  visibility:  ${props => props.color ? "visible" : "hidden"}; ;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #000;
  background-color: ${props => props.color};
`;

export default function UnitDisplay({ unitNumber, unit, onClick }) {
  
  const checkForPackingIssue = () => {
    let color
    for (const key in unit.packing) {
      if (unit.packing[key].status === 'yellow') {
        color='yellow'
      }
      if (unit.packing[key].status === 'red') {
        color='red'
      }
    }
    return color
  }
  const checkForPlungerIssue = () => {
    let color
    for (const key in unit.plunger) {
      if (unit.plunger[key].status === 'yellow') {
        color='yellow'
      }
      if (unit.plunger[key].status === 'red') {
        color='red'
      }
    }
    return color
  }
  const checkForStuffingBoxIssue = () => {
    let color
    for (const key in unit.stuffingBox) {
      if (unit.stuffingBox[key].status === 'yellow') {
        color='yellow'
      }
      if (unit.stuffingBox[key].status === 'red') {
        color='red'
      }
    }
    return color
  }
  const checkForDischargeSealIssue = () => {
    let color
    for (const key in unit.dischargeSeal) {
      if (unit.dischargeSeal[key].status === 'yellow') {
        color='yellow'
      }
      if (unit.dischargeSeal[key].status === 'red') {
        color='red'
      }
    }
    return color
  }
  const checkForSuctionSealIssue = () => {
    let color
    for (const key in unit.suctionSeal) {
      if (unit.suctionSeal[key].status === 'yellow') {
        color='yellow'
      }
      if (unit.suctionSeal[key].status === 'red') {
        color='red'
      }
    }
    return color
  }
  const checkForSeatIssue = () => {
    let color
    for (const key in unit.suctionSeat) {
      if (unit.suctionSeat[key].status === 'yellow' || unit.dischargeSeat[key].status === 'yellow') {
        color='yellow'
      }
      if (unit.suctionSeat[key].status === 'red' || unit.dischargeSeat[key].status === 'red') {
        color='red'
      }
    }
    return color
  }

  const checkForValveIssue = () => {
    let color
    for (const key in unit.suctionValve) {
      if (unit.suctionValve[key].status === 'yellow' || unit.dischargeValve[key].status === 'yellow') {
        color='yellow'
      }
      if (unit.suctionValve[key].status === 'red' || unit.dischargeValve[key].status === 'red') {
        color='red'
      }
    }
    return color
  }
  return (
    <UnitContainer onClick={onClick}>
      <UnitNumber>{unitNumber}</UnitNumber>
      <ElementsContainer>
        <Circle color={checkForValveIssue()}>V</Circle>
        <Circle color={checkForPackingIssue()}>P</Circle>
        <Circle color={checkForSeatIssue()}>S</Circle>
        <Circle color={checkForPlungerIssue()}>PL</Circle>
        <Circle color={checkForStuffingBoxIssue()}>SB</Circle>
        <Circle color={checkForDischargeSealIssue()}>DS</Circle>
        <Circle color={checkForSuctionSealIssue()}>SS</Circle>
      </ElementsContainer>
    </UnitContainer>
  );
};
