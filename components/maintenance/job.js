//TODO after deleting a job need to go back to main maintenance page and refresh to see changes

import styled from "styled-components"
import Confirm from "./confirm"
import { useState } from "react"
import { useRouter } from "next/router"

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

const DeleteButton = styled.button`

`

export default function Job({job, back}) {
  const [showDeletePopUp, setShowDeletePopUp] = useState(false)

  const router = useRouter()
  const toggleDeletePopUp = () => {
    showDeletePopUp ? setShowDeletePopUp(false) : setShowDeletePopUp(true)
  }

  const deleteJob = async () => {
    try {
      const res = await fetch('/api/deleteJob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(job._id)
      })
      if (res.ok) {
        console.log('job deleted')
        router.reload()
      } else {
        console.error('Error in deleting job:', res.statusText)
      }
    } catch (error) {
      console.error('Error deleting job:', error)
    }
  }
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
      <DeleteButton onClick={() => toggleDeletePopUp()}>Delete job</DeleteButton>
      {showDeletePopUp ? 'show popup is set to: true' : 'show popup is set to: false'}
      {showDeletePopUp && <Confirm action={deleteJob} popUpToggle={toggleDeletePopUp}/>}
    </>
  )
}