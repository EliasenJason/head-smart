import jobHistoryModel from "../../../lib/schemas/maintenance/jobHistorySchema";
import connectMongo from "../../../lib/mongodb";
import { useState } from "react";
import styled from "styled-components"
import { useUser } from '@auth0/nextjs-auth0'


const BackButton = styled.button`
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

const HistoryContainer = styled.div`
  margin: 20px;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const HistoryTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const FixerInfo = styled.p`
  font-size: 16px;
  margin-bottom: 10px;
`;

const MaintenanceTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const MaintenanceList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const MaintenanceItem = styled.li`
  font-size: 16px;
  margin-bottom: 5px;
`;

const TotalCountContainer = styled.div`
  margin-top: 20px;
`;

const TotalCountTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const TotalCountList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const TotalCountItem = styled.li`
  font-size: 16px;
  margin-bottom: 5px;
`;

const formatComponentName = (word) => {
  // split the word before the capital letter if there is one
  const splitWord = word.replace(/([A-Z])/g, ' $1');
  // capitalize the first letter of each word
  return splitWord.charAt(0).toUpperCase() + splitWord.slice(1);
};



export default function History({ completedMaintenance, jobNumber }) {
  const { user, error, isLoading } = useUser()
  const [completedMaintenanceState, setCompletedMaintenanceState] = useState(completedMaintenance);
  console.log(completedMaintenanceState)
  
  
  
  const deleteMaintenance = (id) => {
    //use fetch to call api route removeCompletedMaintenance.js by sending the id and the jobNumber
    fetch(`/api/maintenance/removeCompletedMaintenance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jobNumber, id }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Success:', data);
        //remove the item from the state
        setCompletedMaintenanceState(completedMaintenanceState.filter((item) => item._id !== id));
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }
  
  const componentCounts = {};
  // Count the occurrences of each component
  completedMaintenanceState.forEach((item) => {
    item.maintenanceCompleted.forEach((maintenance) => {
      const { component } = maintenance;
      componentCounts[component] = (componentCounts[component] || 0) + 1;
    });
  });

  return (
    <>
      <BackButton onClick={() => window.history.back()}>Back</BackButton>
      <HistoryTitle>Maintenance History</HistoryTitle>
      {completedMaintenanceState.map((item) => (
        <HistoryContainer key={item._id}>
          {user?.role?.includes('supervisor') && (
          <button onClick={() => deleteMaintenance(item._id)}>delete this record</button>
          )}
          <FixerInfo>
            <p>Unit: {item.unit}</p>
            Fixer: {item.fixer}
            <br />
            {new Date(item.timestamp).toLocaleString()}
          </FixerInfo>
          <MaintenanceTitle>Maintenance Completed</MaintenanceTitle>
          <MaintenanceList>
            {item.maintenanceCompleted.map((maintenance) => (
              <MaintenanceItem key={maintenance._id}>
                {formatComponentName(maintenance.component)} {maintenance.hole}
              </MaintenanceItem>
            ))}
          </MaintenanceList>
        </HistoryContainer>
      ))}
      <TotalCountContainer>
        <TotalCountTitle>Total used Components</TotalCountTitle>
        <TotalCountList>
          {Object.entries(componentCounts).map(([component, count]) => (
            <TotalCountItem key={component}>
              {formatComponentName(component)}: {count}
            </TotalCountItem>
          ))}
        </TotalCountList>
      </TotalCountContainer>
    </>
  );
}



export async function getServerSideProps(context) {
  const number = context.params.job;
  const query = {jobNumber: number}
  console.log('******')
  console.log(query)
  let job
  let completedMaintenance
  // Make an API request to fetch job data based on the job number
  try {
    console.log('getJob route triggered')
    await connectMongo()
    job = await jobHistoryModel.findOne(query).lean()
    completedMaintenance = job.completedMaintenance
    console.log('data received')
  } catch(error) {
    console.log('there has been an error!')
    console.log(error)
    maintenance = 'ERROR'
  }
  return {
    props: {
      completedMaintenance: JSON.parse(JSON.stringify(completedMaintenance)),
      jobNumber: JSON.parse(JSON.stringify(number)),
    },
  };
}