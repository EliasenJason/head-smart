import styled from "styled-components";
import { useState } from "react";

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
  overflow-y: auto;
`;

const PopUpContent = styled.div`
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-width: 600px;
  height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 100vh;
  overflow-y: auto;
`;

const PopUpHeader = styled.div`
  display: flex;
  position: sticky;
  width: 100%;
  border-bottom: 1px solid #ccc;
  top: 0;
  background: white;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
`;

const IssuesContainer = styled.div`
  width: 80%;
  padding-top: 20px;
`

const UnitNumber = styled.h2`
  margin: 0;
  text-align: center;
  flex-grow: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

const ComponentList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 20px;
`;

const ComponentButton = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const ComponentRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ComponentName = styled.div`
  flex: 1;
  text-align: left;
  font-size: 14px;
`;

const HoleBoxes = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
`;

const HoleBox = styled.div`
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  cursor: pointer;
  background-color: ${(props) => (props.isSelected ? "#dc3545" : "#fff")};
  color: ${(props) => (props.isSelected ? "#fff" : "#000")};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.isSelected ? "#c82333" : "#e6e6e6")};
  }
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1e7e34;
  }
`;

export default function ModifyMaintenance({ toggle, updatedMaintenance, setUpdatedMaintenance, unit, job }) {
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
    "ponyRodClamp",
  ];

  const thisUnit = updatedMaintenance.find((item) => item.unit === unit);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedHoles, setSelectedHoles] = useState([]);

  const handleAddComponent = () => {
    if (selectedComponent && selectedHoles.length > 0) {
      const newDetails = selectedHoles.map((hole) => ({
        hole: `${hole}`,
        status: "yellow",
      }))

      const existingComponent = thisUnit.components.find((component) => component.type === selectedComponent)

      if (existingComponent) {
        const updatedDetails = [
          ...existingComponent.details.filter((detail) => !newDetails.some((newDetail) => newDetail.hole === detail.hole)),
          ...newDetails,
        ]

        updatedDetails.sort((a, b) => a.hole.localeCompare(b.hole))

        const updatedComponents = thisUnit.components.map((component) =>
          component.type === selectedComponent
            ? { ...component, details: updatedDetails }
            : component
        )

        const updatedUnit = { ...thisUnit, components: updatedComponents }

        setUpdatedMaintenance([
          ...updatedMaintenance.filter((item) => item.unit !== unit),
          updatedUnit,
        ])
      } else {
        const newComponent = {
          type: selectedComponent,
          details: newDetails,
        }

        const updatedUnit = {
          ...thisUnit,
          components: [...thisUnit.components, newComponent],
        }

        setUpdatedMaintenance([
          ...updatedMaintenance.filter((item) => item.unit !== unit),
          updatedUnit,
        ])
      }

      setSelectedComponent(null)
      setSelectedHoles([])
    }
  };

  const handleHoleSelection = (hole) => {
    if (selectedHoles.includes(hole)) {
      setSelectedHoles(selectedHoles.filter((h) => h !== hole));
    } else {
      setSelectedHoles([...selectedHoles, hole])
    }
  }

  const handleRemoveComponent = (componentType, holeNumber) => {
    const updatedComponents = thisUnit.components.map((component) => {
      if (component.type === componentType) {
        const updatedDetails = component.details.filter(
          (detail) => detail.hole !== `${holeNumber}`
        )
        return { ...component, details: updatedDetails }
      }
      return component
    })

    const updatedUnit = {
      ...thisUnit,
      components: updatedComponents.filter((component) => component.details.length > 0),
    }

    setUpdatedMaintenance([
      ...updatedMaintenance.filter((item) => item.unit !== unit),
      updatedUnit,
    ])
  }

  const handleClosePopUp = async () => {
    //add all the added components to the currentMaintenance for the job in the database
    
    const response = await fetch('/api/maintenance/assignMaintenanceToJob', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({maintenance: updatedMaintenance, jobNumber: job})
    })
    toggle()
  }

  return (
    <PopUp>
      <PopUpContent>
        <PopUpHeader>
          <UnitNumber>{unit}</UnitNumber>
          <CloseButton onClick={() => handleClosePopUp()}>x</CloseButton>
        </PopUpHeader>
        <IssuesContainer>
        {thisUnit &&
          thisUnit.components.map((component, index) => (
            <ComponentRow key={index}>
              <ComponentName>{component.type}</ComponentName>
              <HoleBoxes>
                {component.details.map((detail, detailIndex) => (
                  <HoleBox
                    key={detailIndex}
                    onClick={() => handleRemoveComponent(component.type, detail.hole)}
                  >
                    {detail.hole}
                  </HoleBox>
                ))}
              </HoleBoxes>
            </ComponentRow>
          ))}
        </IssuesContainer>
        <h3>Add Component</h3>
        <ComponentList>
          {components.map((component, index) => (
            <ComponentButton
              key={index}
              onClick={() => setSelectedComponent(component)}
              // disabled={selectedComponent !== null}
            >
              {component}
            </ComponentButton>
          ))}
        </ComponentList>
        {selectedComponent && (
          <>
            <ComponentRow>
              <ComponentName>{selectedComponent}</ComponentName>
              <HoleBoxes>
                {["1", "2", "3", "4", "5"].map((hole) => (
                  <HoleBox
                    key={hole}
                    isSelected={selectedHoles.includes(hole)}
                    onClick={() => handleHoleSelection(hole)}
                  >
                    {hole}
                  </HoleBox>
                ))}
              </HoleBoxes>
            </ComponentRow>
            <ActionButton onClick={handleAddComponent}>
              Add Selected
            </ActionButton>
          </>
        )}
      </PopUpContent>
    </PopUp>
  );
}