import styled from "styled-components"
import Title from "../components/title"
import Link from "next/link"
import { useState, useEffect } from "react";
<<<<<<< HEAD
import Job from "../components/maintenance/job";
=======
import Job from "./maintenance/job";
>>>>>>> parent of 415369d (nope)

const JobButton = styled.div`
  font-size: 1.5rem;
  text-align: center;
  border: solid black;
  margin: 1em;
`

export default function Maintenance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/getJobs');
        if (response.ok) {
          const data = await response.json();
          setData(data);
          setLoading(false);
        } else {
          console.error('Error fetching data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <Title backButtonHref={"/"} Text={'Maintenance'}/>
      {selectedJob ? (
        <Job job={selectedJob} back={setSelectedJob} />
      ) : (
      <>
      {loading ? (
        <p>Loading Jobs...</p>
      ): (
        <div>
            {data.map((item, index) => {
              return (
                <JobButton key={index} onClick={() => setSelectedJob(item)}>
                    <p>{item.jobNumber}</p>
                </JobButton>
              )
            })}
        </div>
      )}
      <Link href="/maintenance/createjob"><button>Create New Job</button></Link>
      </>
      )}
    </>
  )
}