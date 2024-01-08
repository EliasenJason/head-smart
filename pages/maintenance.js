import styled from "styled-components"
import Title from "../components/title"
import Link from "next/link"
import jobModel from "../lib/schemas/maintenance/jobSchema";
import connectMongo from "../lib/mongodb";
import { useRouter } from "next/router";
import { useUser } from "@auth0/nextjs-auth0";


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

export default function Maintenance({data}) {
  
  const router = useRouter()

  const navigateToJob = (jobNumber) => {
    router.push(`/maintenance/${jobNumber}`)
  }
  return (
    <Container>
      <Title backButtonHref={"/"} Text={'Jobs'} />
        <JobList>
            {data.map((item, index) => {
              return (
                <JobButton key={index} onClick={() => navigateToJob(item.jobNumber)}>{item.jobNumber}</JobButton>
              )
            })}
        </JobList>
      <Link href="/maintenance/createjob"><ActionButton>Create New Job</ActionButton></Link>
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