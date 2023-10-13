import styled from "styled-components"
import Title from "../components/title"
import Link from "next/link"

const Notification = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function Maintenance() {
  


  const handleClick = async () => {
    console.log('hitting api')
    const res = await fetch('/api/createJob', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jobNumber: "FR-7000123"
    })
    })
  }

  return (
    <>
      <Title backButtonHref={"/"} Text={'Maintenance'}/>
      <p>{process.env.NEXT_PUBLIC_GREETING}</p>
      <button onClick={() => handleClick()}>test this</button>
    </>
  )
}