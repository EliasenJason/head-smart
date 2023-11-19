import { useRouter } from "next/router"
import { useState } from "react"
import connectMongo from "../../../lib/mongodb"
import jobModel from "../../../lib/schemas/maintenance/jobSchema"
import Title from "../../../components/title"
import styled from "styled-components"
import LoadingSpinner from "../../../components/maintenance/loadingSpinner"


/*
TODO:
1. fetch the job object from mongodb
2. display the job object similarly to the [job] page with units on the left and right
  -create arrows to move units up or down adjusting the unit array which in turn adjusts the displayed units
  -ability to add a unit
  -ability to remove a unit
3. update the database with the new unit arrays for left and right
4. add spinner in for when loading
5. route back to [job] page
*/

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

export default function AdjustJob({job}) {
  const [jobUpdate, setJobUpdate] = useState(job)
  const [isLoading, setIsLoading] = useState(false)

  // const router = useRouter()
  // const { job } = router.query
  console.log(job.unitsOnLeft)
  return (
    <Container>
        <Title backButtonHref={"/maintenance"} Text={"change this"}></Title>
        <UnitsContainer>
          <LeftUnits>
          <h3>Left</h3>
            {job.unitsOnLeft.map((item, index) => {
              if (item !== null) {
              return (
                <div 
                    key={index} 
                  >
                  {item.unit}
                  </div>
              )}
            })}
          </LeftUnits>
          <RightUnits>
            <h3>Right</h3>
          {job.unitsOnRight.map((item, index) => {
                if (item !== null) {
                return (
                  <div 
                    key={index}
                  >
                  {item.unit}
                  </div>
                )}
              })}
          </RightUnits>
        </UnitsContainer>
        <LoadingSpinner isLoading={isLoading}/>
      </Container>
  )
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
    job = await jobModel.findOne(query).lean()
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