import connectMongo from '../../lib/mongodb';
import jobModel from '../../lib/schemas/Job';
import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Unit from '../../components/maintenance/unit';
import Confirm from '../../components/maintenance/confirm';

const JobNumberContainer = styled.div`
  width: 100%;
  font-size: 2em;
  text-align: center;
`
const UnitContainer = styled.div`
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
`

const RightUnits = styled.div`
  width: 50%;
  display:flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
`

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
      <button onClick={() => back()}>go back</button>
      <JobNumberContainer>{jobData.jobNumber}</JobNumberContainer>
      <UnitContainer>
        <LeftUnits>
        <h3>Left</h3>
          {jobData.unitsOnLeft.map((unit, index) => {
            return <p key={index} onClick={() => setShowUnitPopUp({unit, jobData, side:'left'})}>{unit.unitNumber}</p>
          })}
        </LeftUnits>
        <RightUnits>
          <h3>Right</h3>
        {jobData.unitsOnRight.map((unit, index) => {
            return <p key={index} onClick={() => setShowUnitPopUp({unit, jobData, side:'right'})}>{unit.unitNumber}</p>
          })}
        </RightUnits>
      </UnitContainer>
      <DeleteButton onClick={() => toggleDeletePopUp()}>Delete job</DeleteButton>
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