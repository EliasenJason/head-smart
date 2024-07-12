import jobHistoryModel from "../../../lib/schemas/maintenance/jobHistorySchema";
import connectMongo from "../../../lib/mongodb";
import { useState, Fragment } from "react";
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

const HistoryTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f2f2f2;
`;

const TableRow = styled.tr`
  border-bottom: 2px solid black;
`;

const TableHeader = styled.th`
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
`;

const TableBody = styled.tbody``;

const TableData = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
  &.center {
    text-align: center;
  }
`;

const DeleteButton = styled.button`
  background-color: #ff4d4d;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
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
        //console.log('Success:', data);
        //remove the item from the state
        setCompletedMaintenanceState(completedMaintenanceState.filter((item) => item._id !== id));
      })
      .catch((error) => {
        //console.error('Error:', error);
      });

  }
  
  const componentCounts = {};
  // Count the occurrences of each component
  completedMaintenanceState.forEach((item) => {
    
    item.maintenanceCompleted.forEach((maintenance) => {

      let { component } = maintenance;
      // console.log(component)
      if (component === 'suctionSeat' || component === 'dischargeSeat') {
        component = 'seats';
      }
      if (component === 'suctionValve' || component === 'dischargeValve') {
        component = 'valves';
      }
      if (component === 'plunger') {
        component = 'plungers'
      }
      if (component.includes('Seal')) {
        component = component + 's'
      }
      if (component === 'stuffingBox') {
        component = 'stuffing boxes'
      }
      componentCounts[component] = (componentCounts[component] || 0) + 1;
      // console.log(componentCounts)
    });
  });

  return (
    <>
      <BackButton onClick={() => window.history.back()}>Back</BackButton>
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
      <HistoryTitle>Maintenance History</HistoryTitle>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Unit</TableHeader>
            <TableHeader>Fixer</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Component</TableHeader>
            <TableHeader>Hole</TableHeader>
            <TableHeader>Action</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {completedMaintenanceState.map((item) => (
            <Fragment key={item._id}>
              <TableRow>
                <TableData rowSpan={item.maintenanceCompleted.length}>
                  {item.unit}
                </TableData>
                <TableData rowSpan={item.maintenanceCompleted.length}>
                  {item.fixer}
                </TableData>
                <TableData rowSpan={item.maintenanceCompleted.length}>
                  {new Date(item.timestamp).toLocaleString()}
                </TableData>
                <TableData>{formatComponentName(item.maintenanceCompleted[0].component)}</TableData>
                <TableData>{item.maintenanceCompleted[0].hole}</TableData>
                <TableData className="center" rowSpan={item.maintenanceCompleted.length}>
                  {user?.role?.includes("supervisor") && (
                    <DeleteButton onClick={() => deleteMaintenance(item._id)}>
                      Delete
                    </DeleteButton>
                  )}
                </TableData>
              </TableRow>
              {item.maintenanceCompleted.length > 1 &&
                item.maintenanceCompleted.slice(1).map((maintenance, index) => (
                  <TableRow key={maintenance._id}>
                    <TableData>{formatComponentName(maintenance.component)}</TableData>
                    <TableData>{maintenance.hole}</TableData>
                  </TableRow>
                ))}
            </Fragment>
          ))}
        </TableBody>
      </Table>
      
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