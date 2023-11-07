import styled from "styled-components"
import Title from "../components/title"
import Link from "next/link"
import { useState, useEffect } from "react";
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

const CreateJobButton = styled.button`
  background-color: #28a745;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1f8333;
  }
`;

export default function Maintenance() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/getJobs')
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setData(data);
          setLoading(false);
        } else {
          console.error('Error fetching data:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData();
  }, []);

  const router = useRouter()

  const navigateToJob = (jobNumber) => {
    router.push(`/maintenance/${jobNumber}`)
  }

  return (
    <Container>
      <Title backButtonHref={"/"} Text={'Maintenance'}/>
      {loading ? (
        <p>Loading Jobs...</p>
      ): (
        <JobList>
            {data.map((item, index) => {
              return (
                <JobButton key={index} onClick={() => navigateToJob(item.jobNumber)}>{item.jobNumber}</JobButton>
              )
            })}
        </JobList>
      )}
      <Link href="/maintenance/createjob"><CreateJobButton>Create New Job</CreateJobButton></Link>
    </Container>
  )
}