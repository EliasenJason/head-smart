import { useRouter } from "next/router"
import { useState } from "react"
import connectMongo from "../../../lib/mongodb"
import jobModel from "../../../lib/schemas/maintenance/jobSchema"
import Title from "../../../components/title"
import styled from "styled-components"
import LoadingSpinner from "../../../components/maintenance/loadingSpinner"
import MoveableItem from "../../../components/maintenance/moveableItem"


/*
TODO:
2. 
  -create arrows to move units up or down adjusting the unit array which in turn adjusts the displayed units
  -ability to add a unit
  -ability to remove a unit
3. update the database with the new unit arrays for left and right
4. add spinner in for when loading
5. route back to [job] page
*/

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const UnitsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const LeftUnits = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  margin: 1em;
`

const RightUnits = styled.div`
  width: 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
  margin: 1em;
`
const ActionButton = styled.button`
  background-color: #28a745;
  color: #000;
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

export default function AdjustJob({job}) {
  const [jobUpdate, setJobUpdate] = useState(job)
  const [isLoading, setIsLoading] = useState(false)

  const moveUnitUp = (side, index) => {
    const updatedJob = { ...jobUpdate };
  
    const unitsArray = side === 'left' ? updatedJob.unitsOnLeft : updatedJob.unitsOnRight;
    // Ensure the index is within valid bounds and not at the top of the array
    if (index > 0 && index < unitsArray.length) {
      // Swap the units at the selected index and the one above it
      [unitsArray[index - 1], unitsArray[index]] = [unitsArray[index], unitsArray[index - 1]];
  
      // Update the jobUpdate state with the modified units array
      if (side === 'left') {
        updatedJob.unitsOnLeft = unitsArray;
      } else {
        updatedJob.unitsOnRight = unitsArray;
      }
      console.log('this is the state:')
      console.log(jobUpdate)
      console.log('this is the update after the move:')
      console.log(updatedJob)
      // Update the state to trigger a re-render
      setJobUpdate(updatedJob);
    }
  };

  const moveUnitDown = (side, index) => {
    // Create a copy of the jobUpdate state
    const updatedJob = { ...jobUpdate };
  
    // Determine the array to update based on the side parameter
    const unitsArray = side === 'left' ? updatedJob.unitsOnLeft : updatedJob.unitsOnRight;
  
    // Ensure the index is within valid bounds and not at the bottom of the array
    if (index >= 0 && index < unitsArray.length - 1) {
      // Swap the units at the selected index and the one below it
      [unitsArray[index], unitsArray[index + 1]] = [unitsArray[index + 1], unitsArray[index]];
  
      // Update the jobUpdate state with the modified units array
      if (side === 'left') {
        updatedJob.unitsOnLeft = unitsArray;
      } else {
        updatedJob.unitsOnRight = unitsArray;
      }
  
      // Update the state to trigger a re-render
      setJobUpdate(updatedJob);
    }
  };

  const addUnit = () => {
    /*
    TODO:
    1. update the database with the new unit number if it doesn't already exist, using the 
    createEmptyUnit lib function for the update and hitting the createUnit api route
    2. if the unit is confirmed in the database update the jobUpdate state with the unit
    */
  }

  const updateDatabaseAndRouteBack = async () => {
    //TODO: route back to the job after update
    console.log('this is the update:')
    console.log(jobUpdate.jobNumber)
    if(jobUpdate === job) {
      console.log('no changes')
    } else {
      console.log('changes to job detected, updating database')
      setIsLoading(true)
      try {
        const res = await fetch('/api/maintenance/updateJob', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(jobUpdate)
        })
        if (res.ok) {
          console.log('job updated')
        } else {
          console.error('Error in updating job:', res.statusText)
        }
      } catch (error) {
        console.error('Error updating job:', error)
      }
      setIsLoading(false)
    }
    
  }

  return (
    <Container>
        <Title backButtonHref={"/maintenance"} Text={"Adjust Units"}></Title>
        <UnitsContainer>
          <LeftUnits>
          <h3>Left</h3>
            {jobUpdate.unitsOnLeft.map((item, index) => {
              if (item !== null) {
              return (
                <MoveableItem
                  key={`left-unit-${index}`}
                  item={item}
                  onMoveUp={() => moveUnitUp('left', index)}
                  onMoveDown={() => moveUnitDown('left', index)}
                />
              )}
            })}
          </LeftUnits>
          <RightUnits>
            <h3>Right</h3>
          {jobUpdate.unitsOnRight.map((item, index) => {
                if (item !== null) {
                return (
                  <MoveableItem
                  key={`right-unit-${index}`}
                  item={item}
                  onMoveUp={() => moveUnitUp('right', index)}
                  onMoveDown={() => moveUnitDown('right', index)}
                />
                )}
              })}
          </RightUnits>
        </UnitsContainer>
        <LoadingSpinner isLoading={isLoading}/>
        <ActionButton onClick={() => updateDatabaseAndRouteBack()}>Save Changes</ActionButton>
      </Container>
  )
}

export async function getServerSideProps(context) {
  const number = context.params.job;
  const query = {jobNumber: number}
  console.log(query)
  let job
  // Make an API request to fetch job data based on the job number
  try {
    console.log('getJob route triggered')
    await connectMongo()
    job = await jobModel.findOne(query).lean()
    console.log('data received')
  } catch(error) {
    console.log('there has been an error!')
    console.log(error)
    job = 'ERROR'
  }
  return {
    props: {
      job: JSON.parse(JSON.stringify(job))
    },
  };
}