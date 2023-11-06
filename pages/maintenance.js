import styled from "styled-components"
import Title from "../components/title"
import Link from "next/link"
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

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
    <>
      <Title backButtonHref={"/"} Text={'Maintenance'}/>
      {loading ? (
        <p>Loading Jobs...</p>
      ): (
        <div>
            {data.map((item, index) => {
              return (
                <button key={index} onClick={() => navigateToJob(item.jobNumber)}>{item.jobNumber}</button>
              )
            })}
        </div>
      )}
      <Link href="/maintenance/createjob"><button>Create New Job</button></Link>
    </>
  )
}