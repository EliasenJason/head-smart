import connectMongo from '../../lib/mongodb';
import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Confirm from '../../components/maintenance/confirm';
import UnitDisplay from '../../components/maintenance/unitDisplay';
import jobModel from '../../lib/schemas/maintenance/jobSchema';
import unitModel from '../../lib/schemas/maintenance/unitSchema';
import checkForIssues from '../../lib/checks/checkForIssues';

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

export default function JobDetail({ job }) {
  const [showDeletePopUp, setShowDeletePopUp] = useState(false)
  console.log(job)
  const router = useRouter()

  const toggleDeletePopUp = () => {
    showDeletePopUp ? setShowDeletePopUp(false) : setShowDeletePopUp(true)
  }

  const back = () => {
    router.push('/maintenance')
  }

  const deleteJob = async() => {
    try {
      const res = await fetch('/api/maintenance/deleteJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(job.jobNumber)
      })
      if (res.ok) {
        console.log('job deleted')
        router.push("/maintenance/")
      } else {
        console.error('Error in deleting job:', res.statusText)
      }
    } catch (error) {
      console.error('Error deleting job:', error)
    }
  }
    return (
      <>
      <ActionButton onClick={() => back()}>go back</ActionButton>
      <JobNumberContainer>{job.jobNumber}</JobNumberContainer>
      <UnitsContainer>
        <LeftUnits>
        <h3>Left</h3>
          {job.unitsOnLeft.map((unit, index) => {
            return (
              <UnitDisplay 
                  key={index}
                  onClick={() => {
                    router.push(`/maintenance/${job.jobNumber}/${unit.number}`)
                  }}
                  elements={checkForIssues(unit)} 
                  unitNumber={unit.number}  
                />
            )
          })}
        </LeftUnits>
        <RightUnits>
          <h3>Right</h3>
        {job.unitsOnRight.map((unit, index) => {
            return (
                <UnitDisplay 
                  key={index}
                  elements={checkForIssues(unit)} 
                  onClick={() => {
                    router.push(`/maintenance/${job.jobNumber}/${unit.number}`)
                  }}
                  unitNumber={unit.number} 
                />
            )
          })}
        </RightUnits>
      </UnitsContainer>
      <ActionButton onClick={() => toggleDeletePopUp()}>Delete job</ActionButton>
      {showDeletePopUp && <Confirm action={deleteJob} popUpToggle={toggleDeletePopUp}/>}
      </>
    );
  }

export async function getServerSideProps(context) {
  const number = context.params.job;
  const query = {jobNumber: number}
  console.log(query)
  let job
  // Make an API request to fetch job data based on the job number
  try {
    console.log('getJob route triggered')
    console.log('connecting to mongo')
    await connectMongo()
    console.log('connected to mongo')

    console.log('requesting data')
    job = await jobModel
      .findOne(query)
      .populate({
        path: 'unitsOnLeft.unit unitsOnRight.unit',
        model: unitModel,
        foreignField: 'number',
        })
      .exec()
    job.unitsOnLeft = job.unitsOnLeft.map(entry => entry.unit);
    job.unitsOnRight = job.unitsOnRight.map(entry => entry.unit);
      console.log('*')
      console.log(job)
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