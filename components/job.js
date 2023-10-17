import styled from "styled-components"
import Title from "./title"

const JobNumberContainer = styled.div`
  width: 100%;
  font-size: 2em;
  text-align: center;
`
const UnitContainer = styled.div`
  width: 100%;
  display:flex;
  flex-direction: row ;
`

const LeftUnits = styled.div`
  width: 50%;
  display:flex;
  flex-direction: column;
  justify-content: Start;
  align-items: center;
`

const RightUnits = styled.div`
  width: 50%;
  display:flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
`

const jobPlaceHolder = {
  jobNumber: null,
  unitsOnLeft: [1,2],
  unitsOnRight: [1,2]
}

export default function Job({job = {jobPlaceHolder}, back}) {
  console.log(job)
  return (
    <>
      <button onClick={() => back()}>go back</button>
      <JobNumberContainer>{job.jobNumber}</JobNumberContainer>
      <UnitContainer>
        <LeftUnits>
        <h3>Left</h3>
          {job.unitsOnLeft.map((unit, index) => {
            return <p key={index}>{unit.unitNumber}</p>
          })}
        </LeftUnits>
        <RightUnits>
          <h3>Right</h3>
        {job.unitsOnRight.map((unit, index) => {
            return <p key={index}>{unit.unitNumber}</p>
          })}
        </RightUnits>
      </UnitContainer>
    </>
  )
}