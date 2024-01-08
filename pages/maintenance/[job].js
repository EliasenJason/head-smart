import connectMongo from '../../lib/mongodb';
import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Confirm from '../../components/maintenance/confirm';
import UnitDisplay from '../../components/maintenance/unitDisplay';
import jobModel from '../../lib/schemas/maintenance/jobSchema';
import unitModel from '../../lib/schemas/maintenance/unitSchema';
import checkForIssues from '../../lib/checks/checkForIssues';
import Title from '../../components/title';
import LoadingSpinner from '../../components/maintenance/loadingSpinner';

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

export default function JobDetail({ job }) {
  const [showDeletePopUp, setShowDeletePopUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()

  const toggleDeletePopUp = () => {
    showDeletePopUp ? setShowDeletePopUp(false) : setShowDeletePopUp(true)
  }

  const adjustJob = () => {
    router.push(`/maintenance/[job]/adjust`, `/maintenance/${job.jobNumber}/adjust`)
  }

  const deleteJob = async() => {
    setIsLoading(true)
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
    setIsLoading(false)
  }
    return (
      <Container>
        <Title backButtonHref={"/maintenance"} Text={job.jobNumber}></Title>
        <UnitsContainer>
          <LeftUnits>
          <h3>Left</h3>
            {job.unitsOnLeft.map((unit, index) => {
              if (unit !== null) {
              return (
                <UnitDisplay 
                    key={index}
                    onClick={() => {
                      router.push(`/maintenance/${job.jobNumber}/${unit.number}`)
                    }}
                    unit={unit}
                    unitNumber={unit.number}  
                  />
              )}
            })}
          </LeftUnits>
          <RightUnits>
            <h3>Right</h3>
          {job.unitsOnRight.map((unit, index) => {
                if (unit !== null) {
                return (
                  <UnitDisplay 
                      key={index}
                      onClick={() => {
                        router.push(`/maintenance/${job.jobNumber}/${unit.number}`)
                      }}
                      unit={unit}
                      unitNumber={unit.number}  
                    />
                )}
              })}
          </RightUnits>
        </UnitsContainer>
        <ActionButton onClick={() => toggleDeletePopUp()}>Delete job</ActionButton>
        <ActionButton onClick={() => adjustJob()}>Adjust job</ActionButton>
        {showDeletePopUp && <Confirm action={deleteJob} popUpToggle={toggleDeletePopUp}/>}
        <LoadingSpinner isLoading={isLoading}/>
      </Container>
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
    await connectMongo()
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