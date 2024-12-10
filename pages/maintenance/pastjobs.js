import connectMongo from "../../lib/mongodb"
import jobHistoryModel from "../../lib/schemas/maintenance/jobHistorySchema";
import styled from "styled-components";
import Title from "../../components/title";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";

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
  justify-content: right;
`

export default function PastJobs({pastJobs}) {
  const router = useRouter()
  const navigateToJobHistory = (jobNumber) => {
    router.push(`/maintenance/${jobNumber}/pastjobhistory`)
  }
  const seeActiveJobs = () => {
    router.push(`/maintenance`)
  }
  console.log(pastJobs)
  return (
    <Container>
      <Title backButtonHref={"/"} Text={'All Jobs History'} />
        <JobList>
            {pastJobs.map((item, index) => {
              return (
                <JobButton key={index} onClick={() => navigateToJobHistory(item.jobNumber)}>{item.jobNumber}</JobButton>
              )
            })}
        </JobList>
      <ButtonContainer>
      <ActionButton onClick={() => seeActiveJobs()}>See Active Jobs</ActionButton>
      </ButtonContainer>
    </Container>
  )
}

export async function getServerSideProps() {
  //make an api request to get all the past jobs
  let pastjobs
  try {
    console.log('getJob route triggered')
    await connectMongo()
    //get all the pastjobs
    pastjobs = await jobHistoryModel.find()
    console.log('data received')
  } catch(error) {
    console.log('there has been an error!')
    console.log(error)
    job = 'ERROR'
  }
  return {
    props: {
      pastJobs: JSON.parse(JSON.stringify(pastjobs))
    },
  };
}