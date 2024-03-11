import React from 'react';
import styled from 'styled-components';

const IssueUnit = styled.span`
  color: #007BFF;
  font-weight: bold;
`;

const IssueComponentType = styled.span`
  font-weight: bold;
`;

const IssueComponentNumber = styled.span`
  font-weight: bold;
`;

const UnitContainer = styled.div`
  border: 2px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px;
  background: #f9f9f9
`;

const UnitSummary = ({ job }) => {
  if (!job || !job.unitsOnLeft || !job.unitsOnRight) {
    return <div>No units data available</div>;
  }

  const allUnits = job.unitsOnLeft.concat(job.unitsOnRight);

  // Get all component types
  const componentTypes = [...new Set(allUnits.flatMap(unit => Object.keys(unit)).filter(key => key !== '_id' && key !== 'number' && key !== 'type'))];
  
  // Filter units with issues and group them by unit number and component type
  const unitsWithIssues = allUnits.flatMap(unit => {
    return Object.entries(unit)
      .filter(([key, value]) => componentTypes.includes(key))
      .flatMap(([componentType, componentData]) => {
        return Object.entries(componentData)
          .filter(([componentNumber, component]) => component.status === 'red' || component.status === 'yellow')
          .map(([componentNumber, component]) => ({ ...component, componentType, componentNumber, unitNumber: unit.number }));
      });
  });

  // Group units with issues by unit number
  const groupedUnitsWithIssues = unitsWithIssues.reduce((acc, issue) => {
    if (!acc[issue.unitNumber]) {
      acc[issue.unitNumber] = {};
    }
    if (!acc[issue.unitNumber][issue.componentType]) {
      acc[issue.unitNumber][issue.componentType] = { numbers: [], status: [] };
    }
    acc[issue.unitNumber][issue.componentType].numbers.push(issue.componentNumber);
    acc[issue.unitNumber][issue.componentType].status.push(issue.status);
    return acc;
  }, {});

  if (Object.keys(groupedUnitsWithIssues).length === 0) {
    return <div>No units with issues found</div>;
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/([A-Z])/g, ' $1');
  };

  /* List of Maintenance made into an array of objects */

// Initialize an array to store unit maintenance data
const unitMaintenanceArray = [];

// Iterate over each unit
allUnits.forEach(unit => {
    // Initialize an object to store unit maintenance
    const unitMaintenance = {
        unitNumber: unit.number,
        maintenance: []
    };

    // Iterate over each component type in the unit
    Object.entries(unit).forEach(([componentType, componentData]) => {
        if (componentType !== '_id' && componentType !== 'number' && componentType !== 'type') {
            // Iterate over each component in the component type
            Object.entries(componentData).forEach(([componentNumber, component]) => {
                // Check if the component needs maintenance
                if (component.status === 'red' || component.status === 'yellow') {
                    // Push the component to the unit maintenance array
                    unitMaintenance.maintenance.push({
                        componentType,
                        componentNumber,
                        status: component.status
                    });
                }
            });
        }
    });

    // Push the unit maintenance object to the array
    unitMaintenanceArray.push(unitMaintenance);
});

console.log(unitMaintenanceArray);


  return (
    <div>
      <h2>Units with Issues</h2>
      {Object.entries(groupedUnitsWithIssues).map(([unitNumber, componentTypes]) => (
        <UnitContainer key={unitNumber}>
          <h3><IssueUnit>{unitNumber}</IssueUnit></h3>
          {Object.entries(componentTypes).map(([componentType, { numbers, status }]) => (
            <div key={componentType}>
              <IssueComponentType>{capitalizeFirstLetter(componentType)}:</IssueComponentType>
              {' '}
              {numbers.map((number, index) => (
                <IssueComponentNumber key={index} style={{ color: status[index] === 'red' ? '#DC3545' : '#FFC107' }}>
                  {number + " "}
                </IssueComponentNumber>
              ))}
            </div>
          ))}
        </UnitContainer>
      ))}
    </div>
  );
};

export default UnitSummary;