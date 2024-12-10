import styled from "styled-components"
import Title from "../components/title"
import Link from "next/link"
import jobModel from "../lib/schemas/maintenance/jobSchema";
import connectMongo from "../lib/mongodb";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";
import NotificationComponent from "../components/maintenance/notification";
import { useState } from "react";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const JobList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0 auto;
  margin-top: 10px;
  justify-content: right;
  width: 100%;
`;

const JobButton = styled.button`
  background-color: #007BFF;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ActionButton = styled.button`
  background-color: #28a745;
  color: #000;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 10px;
  &:hover {
    background-color: #1f8333;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export default function Maintenance({data}) {
  const [notificationInfo, setNotificationInfo] = useState({show: false, message: ''})
  
  const router = useRouter()
  const {user, error, isloading} = useUser()

  const navigateToJob = (jobNumber) => {
    router.push(`/maintenance/${jobNumber}`)
  }
  const createJob = () => {
    if (user?.role?.includes('admin') || user?.role?.includes('supervisor')) {
      router.push(`/maintenance/createjob`)
    } else {
      setNotificationInfo({show: true, message: 'You must be logged in as a supervisor to create a job'})
    }
  }
  const inspectOldJobs = () => {
    router.push(`/maintenance/pastjobs`)
  }
  return (
    <Container>
      <Title backButtonHref={"/"} Text={'Active Jobs'} />
        <JobList>
            {data.map((item, index) => {
              return (
                <JobButton key={index} onClick={() => navigateToJob(item.jobNumber)}>{item.jobNumber}</JobButton>
              )
            })}
        </JobList>
      <ButtonContainer>
      <ActionButton onClick={() => createJob()}>Create New Job</ActionButton>
      <ActionButton onClick={() => inspectOldJobs()}>See Past Jobs</ActionButton>
      </ButtonContainer>
      
      <NotificationComponent
        show={notificationInfo.show}
        message={notificationInfo.message}
        onClose={() => setNotificationInfo({show: false, message: ""})}
      />
    </Container>
  )
}

export async function getServerSideProps() {
  let data
  // Make an API request to fetch job data based on the job number
  try {
    console.log('getJob route triggered')
    console.log('connecting to mongo')
    await connectMongo()
    console.log('connected to mongo')

    console.log('requesting data')
    const response = await jobModel.find()
    data = JSON.parse(JSON.stringify(response))
    console.log('data received')
  } catch(error) {
    console.log('there has been an error!')
    data = 'ERROR'
  }
  return {
    props: {
      data,
    },
  };
}