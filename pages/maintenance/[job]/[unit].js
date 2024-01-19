import unitModel from "../../../lib/schemas/maintenance/unitSchema";
import connectMongo from "../../../lib/mongodb";
import styled from 'styled-components';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LoadingSpinner from "../../../components/maintenance/loadingSpinner";
import ChatBox from "../../../components/maintenance/chatBox";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const ExitButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px 10px;
  background-color: #ff0000;
  color: #fff;
  z-index: 2;
  cursor: pointer;
  user-select: none;
  &:hover {
    background-color: #660000;
  }
`
const GridContainer = styled.div`
    display: grid;
    width: 100%;
    height: 100vh;
    padding-right: 1em;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    gap: 5px;
    overflow: auto;
    grid-template-areas: 
      "unitNumber unitNumber unitNumber unitNumber unitNumber unitNumber"
      ". hole-1 hole-2 hole-3 hole-4 hole-5"
      "dischargeValve dischargeValve1 dischargeValve2 dischargeValve3 dischargeValve4 dischargeValve5"
      "suctionValve suctionValve1 suctionValve2 suctionValve3 suctionValve4 suctionValve5"
      "dischargeSeat dischargeSeat1 dischargeSeat2 dischargeSeat3 dischargeSeat4 dischargeSeat5"
      "suctionSeat suctionSeat1 suctionSeat2 suctionSeat3 suctionSeat4 suctionSeat5"
      "packing pack1 pack2 pack3 pack4 pack5"
      "plunger plunger1 plunger2 plunger3 plunger4 plunger5"
      "stuffingBox stuffingBox1 stuffingBox2 stuffingBox3 stuffingBox4 stuffingBox5"
      "suctionSeal suctionSeal1 suctionSeal2 suctionSeal3 suctionSeal4 suctionSeal5"
      "dischargeSeal dischargeSeal1 dischargeSeal2 dischargeSeal3 dischargeSeal4 dischargeSeal5"
    ;
    
`
const UnitNumber = styled.div`
grid-area: unitNumber;
font-size: 2rem;
position: sticky;
top: 0;
background-color: white;
z-index: 1;
border-bottom: solid 2px black;
`
const Hole1 = styled.div`
grid-area: hole-1;
text-align: center;
`
const Hole2 = styled.div`
grid-area: hole-2;
text-align: center;
`
const Hole3 = styled.div`
grid-area: hole-3;
text-align: center;
`
const Hole4 = styled.div`
grid-area: hole-4;
text-align: center;
`
const Hole5 = styled.div`
grid-area: hole-5;
text-align: center;
`
const ComponentType = styled.div`
grid-area: ${props => props.gridArea};
display:flex;
justify-content: left;
align-items: center;
`
const Component = styled.button`
grid-area: ${props => props.gridArea};
background-color: ${props => props.color};
height: 70px;
`

export default function Unit({unit, job}) {
  const [unitState, setUnitState] = useState(unit)
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()

  // console.log(unitState)

  const handleStatusChange = (component, holeNumber) => {
    if (unitState[component][holeNumber].status === "green") {
      setUnitState({
        ...unitState,
        [component]: {
          ...unitState[component],
          [holeNumber]: {
            ...unitState[component][holeNumber],
            status: 'yellow'
          }
        }
      });
    } else if (unitState[component][holeNumber].status === "yellow") {
      setUnitState({
        ...unitState,
        [component]: {
          ...unitState[component],
          [holeNumber]: {
            ...unitState[component][holeNumber],
            status: 'red'
          }
        }
      });
    } else if (unitState[component][holeNumber].status === "red") {
      setUnitState({
        ...unitState,
        [component]: {
          ...unitState[component],
          [holeNumber]: {
            ...unitState[component][holeNumber],
            status: 'green'
          }
        }
      });
    }
  }

  const handleClose = async () => {
    setIsLoading(true)
    if (unit === unitState) {
      router.push(`/maintenance/${job}`)
    } else {
      try {
        const res = await fetch('/api/maintenance/updateUnit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(unitState)
        })
        if (res.ok) {
          console.log('job updated')
          router.push(`/maintenance/${job}`)
        } else {
          console.error('Error in updating job:', res.statusText)
        }
      } catch (error) {
        console.error('Error updating job:', error)
      }
    }
    setIsLoading(false)
  }
  

  return (
    <Container>
      <ExitButton onClick={() => handleClose()}>x</ExitButton>
      <GridContainer>
        <UnitNumber>{unit.number}</UnitNumber>
        <Hole1>1</Hole1>
        <Hole2>2</Hole2>
        <Hole3>3</Hole3>
        <Hole4>4</Hole4>
        <Hole5>5</Hole5>

        <ComponentType gridArea="dischargeValve">Discharge Valve</ComponentType>
        <Component gridArea="dischargeValve1" color={unitState.dischargeValve[1].status} onClick={() => handleStatusChange("dischargeValve", 1)}></Component>
        <Component gridArea="dischargeValve2" color={unitState.dischargeValve[2].status} onClick={() => handleStatusChange("dischargeValve", 2)}></Component>
        <Component gridArea="dischargeValve3" color={unitState.dischargeValve[3].status} onClick={() => handleStatusChange("dischargeValve", 3)}></Component>
        <Component gridArea="dischargeValve4" color={unitState.dischargeValve[4].status} onClick={() => handleStatusChange("dischargeValve", 4)}></Component>
        <Component gridArea="dischargeValve5" color={unitState.dischargeValve[5].status} onClick={() => handleStatusChange("dischargeValve", 5)}></Component>

        <ComponentType gridArea="suctionValve">Suction Valve</ComponentType>
        <Component gridArea="suctionValve1" color={unitState.suctionValve[1].status} onClick={() => handleStatusChange("suctionValve", 1)}></Component>
        <Component gridArea="suctionValve2" color={unitState.suctionValve[2].status} onClick={() => handleStatusChange("suctionValve", 2)}></Component>
        <Component gridArea="suctionValve3" color={unitState.suctionValve[3].status} onClick={() => handleStatusChange("suctionValve", 3)}></Component>
        <Component gridArea="suctionValve4" color={unitState.suctionValve[4].status} onClick={() => handleStatusChange("suctionValve", 4)}></Component>
        <Component gridArea="suctionValve5" color={unitState.suctionValve[5].status} onClick={() => handleStatusChange("suctionValve", 5)}></Component>

        <ComponentType gridArea="dischargeSeat">Discharge Seat</ComponentType>
        <Component gridArea="dischargeSeat1" color={unitState.dischargeSeat[1].status} onClick={() => handleStatusChange("dischargeSeat", 1)}></Component>
        <Component gridArea="dischargeSeat2" color={unitState.dischargeSeat[2].status} onClick={() => handleStatusChange("dischargeSeat", 2)}></Component>
        <Component gridArea="dischargeSeat3" color={unitState.dischargeSeat[3].status} onClick={() => handleStatusChange("dischargeSeat", 3)}></Component>
        <Component gridArea="dischargeSeat4" color={unitState.dischargeSeat[4].status} onClick={() => handleStatusChange("dischargeSeat", 4)}></Component>
        <Component gridArea="dischargeSeat5" color={unitState.dischargeSeat[5].status} onClick={() => handleStatusChange("dischargeSeat", 5)}></Component>

        <ComponentType gridArea="suctionSeat">Suction Seat</ComponentType>
        <Component gridArea="suctionSeat1" color={unitState.suctionSeat[1].status} onClick={() => handleStatusChange("suctionSeat", 1)}></Component>
        <Component gridArea="suctionSeat2" color={unitState.suctionSeat[2].status} onClick={() => handleStatusChange("suctionSeat", 2)}></Component>
        <Component gridArea="suctionSeat3" color={unitState.suctionSeat[3].status} onClick={() => handleStatusChange("suctionSeat", 3)}></Component>
        <Component gridArea="suctionSeat4" color={unitState.suctionSeat[4].status} onClick={() => handleStatusChange("suctionSeat", 4)}></Component>
        <Component gridArea="suctionSeat5" color={unitState.suctionSeat[5].status} onClick={() => handleStatusChange("suctionSeat", 5)}></Component>

        <ComponentType gridArea="packing">Packing</ComponentType>
        <Component gridArea="pack1" color={unitState.packing[1].status} onClick={() => handleStatusChange("packing", 1)}></Component>
        <Component gridArea="pack2" color={unitState.packing[2].status} onClick={() => handleStatusChange("packing", 2)}></Component>
        <Component gridArea="pack3" color={unitState.packing[3].status} onClick={() => handleStatusChange("packing", 3)}></Component>
        <Component gridArea="pack4" color={unitState.packing[4].status} onClick={() => handleStatusChange("packing", 4)}></Component>
        <Component gridArea="pack5" color={unitState.packing[5].status} onClick={() => handleStatusChange("packing", 5)}></Component>
        
        <ComponentType gridArea="plunger">Plunger</ComponentType>
        <Component gridArea="plunger1" color={unitState.plunger[1].status} onClick={() => handleStatusChange("plunger", 1)}></Component>
        <Component gridArea="plunger2" color={unitState.plunger[2].status} onClick={() => handleStatusChange("plunger", 2)}></Component>
        <Component gridArea="plunger3" color={unitState.plunger[3].status} onClick={() => handleStatusChange("plunger", 3)}></Component>
        <Component gridArea="plunger4" color={unitState.plunger[4].status} onClick={() => handleStatusChange("plunger", 4)}></Component>
        <Component gridArea="plunger5" color={unitState.plunger[5].status} onClick={() => handleStatusChange("plunger", 5)}></Component>

        <ComponentType gridArea="stuffingBox">Stuffing Box</ComponentType>
        <Component gridArea="stuffingBox1" color={unitState.stuffingBox[1].status} onClick={() => handleStatusChange("stuffingBox", 1)}></Component>
        <Component gridArea="stuffingBox2" color={unitState.stuffingBox[2].status} onClick={() => handleStatusChange("stuffingBox", 2)}></Component>
        <Component gridArea="stuffingBox3" color={unitState.stuffingBox[3].status} onClick={() => handleStatusChange("stuffingBox", 3)}></Component>
        <Component gridArea="stuffingBox4" color={unitState.stuffingBox[4].status} onClick={() => handleStatusChange("stuffingBox", 4)}></Component>
        <Component gridArea="stuffingBox5" color={unitState.stuffingBox[5].status} onClick={() => handleStatusChange("stuffingBox", 5)}></Component>

        <ComponentType gridArea="suctionSeal">Suction Seal</ComponentType>
        <Component gridArea="suctionSeal1" color={unitState.suctionSeal[1].status} onClick={() => handleStatusChange("suctionSeal", 1)}></Component>
        <Component gridArea="suctionSeal2" color={unitState.suctionSeal[2].status} onClick={() => handleStatusChange("suctionSeal", 2)}></Component>
        <Component gridArea="suctionSeal3" color={unitState.suctionSeal[3].status} onClick={() => handleStatusChange("suctionSeal", 3)}></Component>
        <Component gridArea="suctionSeal4" color={unitState.suctionSeal[4].status} onClick={() => handleStatusChange("suctionSeal", 4)}></Component>
        <Component gridArea="suctionSeal5" color={unitState.suctionSeal[5].status} onClick={() => handleStatusChange("suctionSeal", 5)}></Component>

        <ComponentType gridArea="dischargeSeal">Discharge Seal</ComponentType>
        <Component gridArea="dischargeSeal1" color={unitState.dischargeSeal[1].status} onClick={() => handleStatusChange("dischargeSeal", 1)}></Component>
        <Component gridArea="dischargeSeal2" color={unitState.dischargeSeal[2].status} onClick={() => handleStatusChange("dischargeSeal", 2)}></Component>
        <Component gridArea="dischargeSeal3" color={unitState.dischargeSeal[3].status} onClick={() => handleStatusChange("dischargeSeal", 3)}></Component>
        <Component gridArea="dischargeSeal4" color={unitState.dischargeSeal[4].status} onClick={() => handleStatusChange("dischargeSeal", 4)}></Component>
        <Component gridArea="dischargeSeal5" color={unitState.dischargeSeal[5].status} onClick={() => handleStatusChange("dischargeSeal", 5)}></Component>
      </GridContainer>
      {/* create chat window */}
      <ChatBox unitNumber={unit.number} chatMessages={unit.messages} loading={setIsLoading} setUnitState={setUnitState} unitState={unitState} setIsLoading={setIsLoading} />
      <LoadingSpinner isLoading={isLoading} />
    </Container>
  )
}

export async function getServerSideProps(context) {
  const unitNumber = context.params.unit;
  const jobNumber = context.params.job
  const query = {number: unitNumber}
  console.log(query)
  let unit
  try {
    console.log('getJob route triggered')
    console.log('connecting to mongo')
    await connectMongo()
    console.log('connected to mongo')

    console.log('requesting data')
    unit = await unitModel.findOne(query)
      console.log('*')
      console.log(unit)
    console.log('data received')
  } catch(error) {
    console.log('there has been an error!')
    console.log(error)
    job = 'ERROR'
  }
  return {
    props: {
      unit: JSON.parse(JSON.stringify(unit)),
      job: jobNumber
    },
  };
}