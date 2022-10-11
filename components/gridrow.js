import styled from 'styled-components'
import Image from 'next/image'

const EachLine = styled.div`
`

const GridBox = styled.div`
display: flex;
justify-content: center;
align-items: center;
font-size: .7rem;
padding: .2em;
width: 100%;
height: 100%;
border-bottom: solid 1px black;
`

const SeeIconContainer = styled.div`
display: flex;
align-items: center;
justify-content: center;
width: 100%;
height: 100%;
border-bottom: solid 1px black;
`

export default function GridRow({part}) {
  return (
    <>
      <GridBox key={part.name}>{part.name}</GridBox>
      <GridBox>{part.tricanPartNumber}</GridBox>
      <SeeIconContainer>
        <Image
          src={"/pictures/eye.png"}
          alt="eye"
          layout="intrinsic"
          width="50"
          height="30"
        />
      </SeeIconContainer>
    </>
  )
}