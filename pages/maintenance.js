import styled from "styled-components"
import Title from "../components/title"

const Notification = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function Maintenance() {
  return (
    <>
      <Title backButtonHref={"/"} Text={'Maintenance'}/>
      <Notification><p>This area is under development</p></Notification>
    </>
  )
}