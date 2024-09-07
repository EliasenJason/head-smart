import styled from "styled-components";

const Container = styled.div`
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CurrentMaintenance = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  height: 90%;
`;

// a popup overlay that will show what components are getting fixed and also a way to remove and add other comnponents

export default function ModifyMaintenanceComponents({toggle, maintenance, setMaintenance, unit}) {

  const components = [
    "dischargeValve",
    "suctionValve",
    "dischargeSeat",
    "suctionSeat",
    "packing",
    "plunger",
    "stuffingBox",
    "suctionSeal",
    "dischargeSeal",
    "keeper",
    "brass",
    "sandRing",
    "glandNut",
    "greaserCheckValve",
    "spring",
    "ponyRodClamp"
  ]
  // console.log('test')
  // console.log(unit)
  // console.log(maintenance)
  return (
    <Container>
      <CurrentMaintenance>
    
      </CurrentMaintenance>
    </Container>
  );
}