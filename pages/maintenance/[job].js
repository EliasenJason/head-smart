import connectMongo from '../../lib/mongodb';
import styled from 'styled-components';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Confirm from '../../components/maintenance/confirm';
import UnitDisplay from '../../components/maintenance/unitDisplay';
import jobModel from '../../lib/schemas/maintenance/jobSchema';
import unitModel from '../../lib/schemas/maintenance/unitSchema';
import Title from '../../components/title';
import LoadingSpinner from '../../components/maintenance/loadingSpinner';
import MaintenanceSummary from '../../components/maintenance/summary';
import NotificationComponent from '../../components/maintenance/notification';
import { useUser } from '@auth0/nextjs-auth0';

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
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
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
  const [showMaintenanceSummary, setShowMaintenanceSummary] = useState(false)
  const [notificationInfo, setNotificationInfo] = useState({show: false, message: ''})
  
  
  const router = useRouter()
  const {user, error, isloading} = useUser()

  const toggleDeletePopUp = () => {
    showDeletePopUp ? setShowDeletePopUp(false) : setShowDeletePopUp(true)
  }

  const adjustJob = () => {
    router.push(`/maintenance/[job]/adjust`, `/maintenance/${job.jobNumber}/adjust`)
  }

  const deleteJob = async() => {
    if (user?.role?.includes('admin') || user?.role?.includes('supervisor')) {
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
    } else {
      setNotificationInfo({show: true, message: 'You must be logged in and be a supervisor to delete a job'})
    }
    
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
        <ButtonContainer>
          <ActionButton onClick={() => toggleDeletePopUp()}>Delete job</ActionButton>
          <ActionButton onClick={() => adjustJob()}>Adjust job</ActionButton>
        </ButtonContainer>
        {showDeletePopUp && <Confirm action={deleteJob} popUpToggle={toggleDeletePopUp}/>}
        <LoadingSpinner isLoading={isLoading}/>
        <MaintenanceSummary show={showMaintenanceSummary} job={job}/>
        <NotificationComponent
        show={notificationInfo.show}
        message={notificationInfo.message}
        onClose={() => setNotificationInfo({show: false, message: ""})}
      />
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