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

  //load data from database and put in state
  const createUnit = async function() {
    try {
      const res = await fetch('/api/maintenance/createUnit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createEmptyUnit(620227, 'quintuplex'))
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
      <CreateJobButton onClick={() => createUnit()}>Create Unit</CreateJobButton>
      <Link href="/maintenance/createjob"><CreateJobButton>Create New Job</CreateJobButton></Link>
    </Container>
  )
}