import { useState, useEffect } from "react"
import styled from "styled-components"
import { useRouter } from "next/router"

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

export default function Unit({unitAndJob, popUpToggle}) {
  const [unitState, setunitState] = useState(unitAndJob.unit)
  
  console.log(unitState)

  const handlePackingClick = (holeNumber) => {
    if (unitState[`pack${holeNumber}`] === "green") {
      setunitState({...unitState, [`pack${holeNumber}`]: 'yellow'})
    } else if (unitState[`pack${holeNumber}`] === "yellow") {
      setunitState({...unitState, [`pack${holeNumber}`]: 'red'})
    } else if (unitState[`pack${holeNumber}`] === "red") {
      setunitState({...unitState, [`pack${holeNumber}`]: 'green'})
    }
  }

  const router = useRouter()

  //if the unitState has changed than this fires:
  const updateConsumables = async () => {
    console.log('this is getting sent to the backend:')
    console.log(unitState)
    console.log('this is the unitAndJob initial state:')
    console.log(unitAndJob)
    console.log('this is the side:')
    console.log(unitAndJob.side)
    try {
      const res = await fetch('/api/updateUnit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          side: unitAndJob.side,
          unitObject: unitState,
          job: unitAndJob.jobData.jobNumber
        })
      })
      if (res.ok) {
        console.log('Unit Updated')
        const response = await res.json()
        console.log(response.mongoResponse)
        router.reload()
      } else {
        console.error('Error in updating unit:', res.statusText)
      }
    } catch (error) {
      console.error('Error updating unit:', error)
    }
  }
  //this closes the popup and checks if any changes were made
  const handleClose = () => {
    if (unitAndJob.unit === unitState) {
      console.log('no change')
      popUpToggle()
    } else {
      console.log('there is a change, updating database')
      updateConsumables()
    }
  }

  return (
    <PopUp>
      <PopUpContent>
      <ExitButton onClick={() => handleClose()}>x</ExitButton>
      <GridContainer>
        <UnitNutNumber>{unitState.unitNumber}</UnitNutNumber>
        <Hole1>1</Hole1>
        <Hole2>2</Hole2>
        <Hole3>3</Hole3>
        <Hole4>4</Hole4>
        <Hole5>5</Hole5>
        <Packing>Packing</Packing>
        <PackingComponent gridArea="pack1" color={unitState.pack1} onClick={() => handlePackingClick(1)}></PackingComponent>
        <PackingComponent gridArea="pack2" color={unitState.pack2} onClick={() => handlePackingClick(2)}></PackingComponent>
        <PackingComponent gridArea="pack3" color={unitState.pack3} onClick={() => handlePackingClick(3)}></PackingComponent>
        <PackingComponent gridArea="pack4" color={unitState.pack4} onClick={() => handlePackingClick(4)}></PackingComponent>
        <PackingComponent gridArea="pack5" color={unitState.pack5} onClick={() => handlePackingClick(5)}></PackingComponent>
      </GridContainer>
      
      </PopUpContent>
    </PopUp>
  )
}