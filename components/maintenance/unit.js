import { useState } from "react"
import styled from "styled-components"

const PopUp = styled.div`
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
const PopUpContent = styled.div`
background: #fff;
padding: 20px;
border-radius: 4px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
text-align: center;
`
const ExitButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  background-color: #ff0000;
  color: #fff;
`
const GridContainer = styled.div`
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr; 
    grid-template-rows: 0.3fr 0.3fr 1.5fr; 
    gap: 5px; 
    grid-template-areas: 
      "unitNumber unitNumber unitNumber unitNumber unitNumber unitNumber"
      ". hole-1 hole-2 hole-3 hole-4 hole-5"
      "packing pack1 pack2 pack3 pack4 pack5";
`
const UnitNutNumber = styled.div`
grid-area: unitNumber;
font-size: 2rem;
box-sizing: border-box;
width: 90vw;
height: 10vh;
`
const Hole1 = styled.div`
grid-area: hole-1;;
`
const Hole2 = styled.div`
grid-area: hole-2;
`
const Hole3 = styled.div`
grid-area: hole-3;
`
const Hole4 = styled.div`
grid-area: hole-4;
`
const Hole5 = styled.div`
grid-area: hole-5;
`
const Packing = styled.div`
grid-area: packing;
display:flex;
justify-content: center;
align-items: center;
`
const PackingComponent = styled.button`
grid-area: ${props => props.gridArea};
background-color: ${props => props.color};
`
const Pack2  = styled.div`
grid-area: pack2; 
`
const Pack3  = styled.div`
grid-area: pack3; 
`
const Pack4  = styled.div`
grid-area: pack4; 
`
const Pack5  = styled.div`
grid-area: pack5; 
`

export default function Unit({unit, popUpToggle}) {
  const [packingState, setPackingState] = useState(unit)

  const handlePackingClick = (holeNumber) => {
    if (packingState[`pack${holeNumber}`] === "green") {
      setPackingState({...packingState, [`pack${holeNumber}`]: 'yellow'})
    } else if (packingState[`pack${holeNumber}`] === "yellow") {
      setPackingState({...packingState, [`pack${holeNumber}`]: 'red'})
    } else if (packingState[`pack${holeNumber}`] === "red") {
      setPackingState({...packingState, [`pack${holeNumber}`]: 'green'})
    }
    console.log(packingState)
  }

  // console.log(unit)
  return (
    <PopUp>
      <PopUpContent>
      <ExitButton onClick={() => popUpToggle()}>x</ExitButton>
      <GridContainer>
        <UnitNutNumber>{unit.unitNumber}</UnitNutNumber>
        <Hole1>1</Hole1>
        <Hole2>2</Hole2>
        <Hole3>3</Hole3>
        <Hole4>4</Hole4>
        <Hole5>5</Hole5>
        <Packing>Packing</Packing>
        <PackingComponent gridArea="pack1" color={packingState.pack1} onClick={() => handlePackingClick(1)}></PackingComponent>
        <PackingComponent gridArea="pack2" color={packingState.pack2} onClick={() => handlePackingClick(2)}></PackingComponent>
        <PackingComponent gridArea="pack3" color={packingState.pack3} onClick={() => handlePackingClick(3)}></PackingComponent>
        <PackingComponent gridArea="pack4" color={packingState.pack4} onClick={() => handlePackingClick(4)}></PackingComponent>
        <PackingComponent gridArea="pack5" color={packingState.pack5} onClick={() => handlePackingClick(5)}></PackingComponent>
      </GridContainer>
      
      </PopUpContent>
    </PopUp>
  )
}