import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const IssueUnit = styled.span`
  color: #007BFF;
  font-weight: bold;
  font-size: 21px;
  flex: 1 1 40%;
  margin-bottom: .5em;
`;

const Issues = styled.div`
  flex: 1 1 100%;
`

const TeamMemberDropDown = styled.select`
  flex: 1 1 60%;
  margin-bottom: .5em;
`

const IssueComponentType = styled.span`
  font-weight: bold;
`;

const IssueComponentNumber = styled.span`
  font-weight: bold;
`;

const UnitContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: 2px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px;
  background: #f9f9f9;
`;

const ActionButton = styled.button`
  margin: 10px;
  background-color: #007BFF;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
  font-weight: 600;
  
  &:hover {
    background-color: #0056b3;
  }
`;

export default function Summary({ job, user }) {
  const [unitMaintenance, setUnitMaintenance] = useState()
  const [userContacts, setUserContacts] = useState()

  const router = useRouter()
  
  //get contacts for user.sub on page load using useEffect and api route getContacts.js
    useEffect(() => {
      if (user && user.sub) {
        fetch(`/api/maintenance/getContacts?subscriber=${user.sub}`)
          .then(res => res.json())
          .then(data => {
            // console.log(data.teamMembers);
            setUserContacts(data.teamMembers);
          });
      }
    }, [user]);



  // useEffect(() => {
  //   console.log(unitMaintenance)
  // }, [unitMaintenance])

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

  //inialitze unitMaintenance state with groupedUnitsWithIssues
  unitMaintenance === undefined && setUnitMaintenance(groupedUnitsWithIssues)

  if (Object.keys(groupedUnitsWithIssues).length === 0) {
    return <div>No units with issues found</div>;
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/([A-Z])/g, ' $1');
  };

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

  const handleTeamMemberSelect = (unitNumber, name, email, id) => {
    // add fixer property to unitMaintenance state with the person's name or if no name remove the fixer property and value from the object
    const newUnitMaintenance = {...unitMaintenance}
    if (!name) {
      delete newUnitMaintenance[unitNumber].fixer
    } else {
      newUnitMaintenance[unitNumber].fixer = {
        name: name,
        email: email,
        id: id
      }
    }
    setUnitMaintenance(newUnitMaintenance)
  };

  const handleAssignMaintenance = async () => {
    const assignedMaintenance = { ...unitMaintenance };
    Object.keys(assignedMaintenance).forEach(unitNumber => {
      if (!assignedMaintenance[unitNumber].fixer) {
        delete assignedMaintenance[unitNumber];
      }
    });
    // console.log(assignedMaintenance)
    // use api route assignMaintenanceToJob to assign maintenance to the job for currentMaintenance
    try {
      const response = await fetch('/api/maintenance/assignMaintenanceToJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ maintenance: assignedMaintenance, jobNumber: job.jobNumber })
      });
    
      if (response.ok) {
        console.log('Maintenance assigned successfully');
        const responseData = await response.json();
        console.log(responseData);
      } else {
        const errorData = await response.json();
        console.error('Failed to assign maintenances:', errorData.message);
      }
    } catch (error) {
      console.error('Error assigning maintenance!:', error.message);
    }
  }
  return (
    <div>
    <h2>Units with Issues</h2>
    {Object.entries(groupedUnitsWithIssues).map(([unitNumber, componentTypes]) => (
      <UnitContainer key={unitNumber}>
          <IssueUnit>{unitNumber}</IssueUnit>

          {userContacts && (
          <TeamMemberDropDown onChange={(event) => {
            if (event.target.value) {
              const { name, email, id } = JSON.parse(event.target.value);
              handleTeamMemberSelect(unitNumber, name, email, id);
            } else {
              handleTeamMemberSelect(unitNumber, null, null, null);
            }
          }}>
            <option value="">Assign to team member</option>
            {userContacts.filter((member) => member.role === 'operator')
            .map((member) => (
              <option key={member._id} value={JSON.stringify({ name: member.name, email: member.email, id: member._id })}>
                {member.name}
              </option>
            ))}
          </TeamMemberDropDown>
        )}

          {Object.entries(componentTypes).map(([componentTypeKey, { numbers, status }]) => (
            <Issues key={componentTypeKey}>
              <IssueComponentType>{capitalizeFirstLetter(componentTypeKey)}:</IssueComponentType>{' '}
              {numbers.map((number, index) => (
                <IssueComponentNumber key={index} style={{ color: status[index] === 'red' ? '#DC3545' : '#FFC107' }}>
                  {number + ' '}
                </IssueComponentNumber>
              ))}
            </Issues>
          ))}


      
      </UnitContainer>
    ))}
    {user?.role?.includes('supervisor') && <ActionButton onClick={() => handleAssignMaintenance()}>Assign Maintenance</ActionButton>}
  </div>
  );
};

