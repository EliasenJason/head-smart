import styled from "styled-components"
import { useState } from "react"

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

export default function AddComponents({toggle, maintenance, setMaintenance, unit}) {
  const [addedComponents, setAddedComponents] = useState([])

  console.log('this is the unit prop:')
  console.log(unit)
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

  const handleComponentSelect = (component, hole) => {
    // Check if the component and hole combination already exists
    const componentExists = addedComponents.some(
      (item) => item.component === component && item.hole === hole
    );
  
    if (!componentExists) {
      // If it doesn't exist, add it to the array
      setAddedComponents([...addedComponents, { component, hole }]);
    } else {
      // If it exists, you can show an alert or do nothing
      alert(`${component} has already been added to hole ${hole}`);
    }
  };

  const handleRemoveComponent = (component, hole) => {
    const updatedComponents = addedComponents.filter(
      (item) => !(item.component === component && item.hole === hole)
    );
    setAddedComponents(updatedComponents);
  };


  const confirmHandler = () => {
    console.log(maintenance)
    let maintenanceCopy = { ...maintenance };

    addedComponents.forEach(({ component, hole }) => {
      if (!maintenanceCopy[unit][component]) {
        maintenanceCopy[unit][component] = {
          numbers: [],
          status: []
        };
      }
      if (maintenanceCopy[unit][component].numbers.includes(hole.toString())) {
        console.log('Component already exists for this hole.')
      } else {
        maintenanceCopy[unit][component].numbers.push(hole.toString());
        maintenanceCopy[unit][component].status.push('yellow');
      }
    });
    setMaintenance(maintenanceCopy);
    toggle()
  }
  return (
    <PopUp>
      <PopUpContent>
        {components.map((component, index) => (
          <div key={index}>
            <label htmlFor={`${component}-select`}>{component}</label>
            <select
              id={`${component}-select`}
              onChange={(e) => handleComponentSelect(component, e.target.value)}
            >
              <option className={'hole'} value="">Select Hole</option>
              {[1, 2, 3, 4, 5].map(hole => (
                <option key={hole} value={hole}>
                  {hole}
                </option>
              ))}
            </select>
          </div>
        ))}
        <div>
          <h3>Added Components:</h3>
          <ul>
            {addedComponents.map((item, index) => (
              <li key={index}>{item.component} - Hole {item.hole} <button onClick={() => handleRemoveComponent(item.component,item.hole)}>remove</button></li>
            ))}
          </ul>
        </div>
        <button onClick={() => confirmHandler()}>Confirm</button>
      </PopUpContent>
    </PopUp>
  )
}