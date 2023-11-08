import connectMongo from '../../lib/mongodb';
import jobModel from '../../lib/schemas/Job';
import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Unit from '../../components/maintenance/unit';
import Confirm from '../../components/maintenance/confirm';
import checkForIssues from '../../lib/checks/checkForIssues';
import UnitDisplay from '../../components/maintenance/unitDisplay';

const JobNumberContainer = styled.div`
  width: 100%;
  text-align: center;
  background-color: #343a40;
  color: #fff;
  padding: 10px 0;
  font-size: 24px;
  border-radius: 5px;
  margin: 20px 0;
`
const UnitsContainer = styled.div`
  width: 100%;
  display:flex;
  flex-direction: row ;
`

const LeftUnits = styled.div`
  width: 50%;
  display:flex;
  flex-direction: column;
  justify-content: Start;
  align-items: center;
  gap: 1em;
  margin: 1em;
`

const RightUnits = styled.div`
  width: 50%;
  display:flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 1em;
  margin: 1em;
`
const ActionButton = styled.button`
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

const DeleteButton = styled.button`

`

export default function JobDetail({ jobData }) {
  const [showDeletePopUp, setShowDeletePopUp] = useState(false)
  const [showUnitPopUp, setShowUnitPopUp] = useState('')
  
  const router = useRouter()

  const toggleDeletePopUp = () => {
    showDeletePopUp ? setShowDeletePopUp(false) : setShowDeletePopUp(true)
  }
  const toggleUnitPopUp = () => {
    showUnitPopUp && setShowUnitPopUp('')
  }

  const back = () => {
    router.push('/maintenance')
  }

  const deleteJob = async () => {
    try {
      const res = await fetch('/api/deleteJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(job._id)
      })
      if (res.ok) {
        console.log('job deleted')
        router.reload()
      } else {
        console.error('Error in deleting job:', res.statusText)
      }
    } catch (error) {
      console.error('Error deleting job:', error)
    }
  }

  if (jobData === "ERROR") {
    return (
      <h2>ERROR fetching Data Check network connection and try again</h2>
    )
  } else {
    return (
      <>
      <ActionButton onClick={() => back()}>go back</ActionButton>
      <JobNumberContainer>{jobData.jobNumber}</JobNumberContainer>
      <UnitsContainer>
        <LeftUnits>
        <h3>Left</h3>
          {jobData.unitsOnLeft.map((unit, index) => {
            return (
              <UnitDisplay 
                  key={index}
                  onClick={() => setShowUnitPopUp({unit, jobData, side:'left'})}
                  unitNumber={unit.unitNumber} 
                  elements={checkForIssues(unit)} 
                />
            )
          })}
        </LeftUnits>
        <RightUnits>
          <h3>Right</h3>
        {jobData.unitsOnRight.map((unit, index) => {
            return (
                <UnitDisplay 
                  key={index}
                  onClick={() => setShowUnitPopUp({unit, jobData, side:'right'})}
                  unitNumber={unit.unitNumber} 
                  elements={checkForIssues(unit)} 
                />
            )
          })}
        </RightUnits>
      </UnitsContainer>
      <ActionButton onClick={() => toggleDeletePopUp()}>Delete job</ActionButton>
      {showDeletePopUp && <Confirm action={deleteJob} popUpToggle={toggleDeletePopUp}/>}
      {showUnitPopUp && <Unit unitAndJob={showUnitPopUp} popUpToggle={toggleUnitPopUp}/>}
    </>
    );
  }
  
}

export async function getServerSideProps(context) {
  const number = context.params.job;
  const query = {jobNumber: number}
  let jobData
  // Make an API request to fetch job data based on the job number
  try {
    console.log('getJob route triggered')
    console.log('connecting to mongo')
    await connectMongo()
    console.log('connected to mongo')

    console.log('requesting data')
    const response = await jobModel.findOne(query)
    jobData = JSON.parse(JSON.stringify(response))
    console.log('data received')
  } catch(error) {
    console.log('there has been an error!')
    jobData = 'ERROR'
  }
  return {
    props: {
      jobData,
    },
  };
}