import styled from "styled-components"
import Title from "../components/title"
import Link from "next/link"
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import createEmptyUnit from "../lib/createEmptyUnit";

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
  const [job, setJob] = useState({})
  //load data from database and put in state

  useEffect(() => {
    console.log(job)
  },[job])
  const createUnit = async function() {
    try {
      const res = await fetch('/api/maintenance/createUnit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createEmptyUnit(620111, 'quintuplex'))
      })
      if (res.ok) {
        console.log('great success!')
        console.log(res)
      } else {
        console.error('Error submitting data:', res.statusText)
      }
    } catch (error) {
      console.error('Error submitting data:', error)
    }
  }
  const createJob = async function() {
    try {
      const res = await fetch('/api/maintenance/createJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobNumber: 'FR-7000111',
          createdBy: 'Jason',
          unitsOnLeft: [{unit: '655023b735f97daf9766089f'}, {unit: '6550535d35f97daf976608ce'}],
          unitsOnRight: [{unit: '6550536335f97daf976608fd'}]
        })
      })
      if (res.ok) {
        const data = await res.json()
        console.log('great success!')
        setJob(data.mongoResponse)
      } else {
        console.error('Error submitting data:', res.statusText)
      }
    } catch (error) {
      console.error('Error submitting data:', error)
    }
  }
  
  return (
    <Container>
      <Title backButtonHref={"/maintenance"} Text={'Maintenance'}/>
      {loading ? (
        <p>Loading Jobs...</p>
      ): (
        <JobList>
            {/* {data.map((item, index) => {
              return (
                <JobButton key={index} onClick={() => navigateToJob(item.jobNumber)}>{item.jobNumber}</JobButton>
              )
            })} */}
        </JobList>
      )}
      <CreateJobButton onClick={() => createJob()}>Create Job</CreateJobButton>
      <CreateJobButton onClick={() => createUnit()}>Create Unit</CreateJobButton>
      <Link href="/maintenance/createjob"><CreateJobButton>Create New Job</CreateJobButton></Link>
    </Container>
  )
}