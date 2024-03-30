import { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

const UnitContainer = styled.div`
  width: 100%; /* Fixed width for the unit container */
  height: 120px; /* Fixed height for the unit container */
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #0077B6;
  border-radius: 10px;
  padding: 10px 5px;
  cursor: pointer;
  transition: border-color 0.3s ease-in-out;

  &:hover {
    border-color: #005082;
  }
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const UnitNumber = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  border: solid red 1px;
`;

const MessageIndicatorContainer = styled.div`
  width: 25%;
`

const wiggleAnimation = keyframes`
  0% { transform: rotate(0deg); }
  50% { transform: rotate(10deg); }
  100% { transform: rotate(0deg); }
`
const MessageIndicator = styled.div`
  position: relative;
  width: 30px;
  height: 19px;
  background-color: #007bff;
  border-radius: 50%;
  cursor: pointer;
  text-align: center;
  color: white;
  ${({ latestMessageTimeStamp }) => latestMessageTimeStamp === true && css`animation: ${wiggleAnimation} 2s ease infinite;`};
  
  &:after {
    content: "";
    position: absolute;
    top: 13px;
    left: 6px;
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-left: 10px solid #007bff;
    border-bottom: 5px solid transparent;
  }
`

const MessagesPopUp = styled.div`
  position: sticky;
  display: block;
  position: absolute;
  top: -30px;
  left: -50%;
  width: 300px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px;
  border-radius: 5px;
`

const Space = styled.div`
  width: 25%;
`

const ElementsContainer = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
`;

const Circle = styled.div`
  width: 25px;
  height: 25px;
  border: 2px solid #0077B6;
  border-radius: 50%;
  display: flex;
  visibility:  ${props => props.color ? "visible" : "hidden"};
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: bold;
  color: #000;
  background-color: ${props => props.color};
`;

export default function UnitDisplay({ unitNumber, unit, onClick, messages }) {
  console.log(messages)
  const [showMessagesPopUp, setMessagesPopUp] = useState(false)


  const isWithinlast24Hours = (timestamp) => {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);
    const messageTimestamp = new Date(timestamp);
    return messageTimestamp > twentyFourHoursAgo;
  }

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
      <TopContainer>
        <MessageIndicatorContainer>
          {messages.length > 0 && 
          <MessageIndicator 
            latestMessageTimeStamp={isWithinlast24Hours(messages[messages.length-1].timestamp)}
            onMouseEnter={() => setMessagesPopUp(true)}
            onMouseLeave={() => setMessagesPopUp(false)}
            >
              ...
              {showMessagesPopUp && <MessagesPopUp>
                {messages.map((item, index) => (
                <div key={index}>{item.message}</div>
              ))}
                </MessagesPopUp>}
            </MessageIndicator>}
        </MessageIndicatorContainer>
        <UnitNumber>{unitNumber}</UnitNumber>
        <Space></Space>
      </TopContainer>
      
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
