import styled from "styled-components";
import { useRouter } from 'next/router';
import data from '../../public/data.json'
import Image from "next/image";

const StyledTitle = styled.h2`
  font-size: 3rem;
  margin: 0 auto;
  text-align: center;
  text-transform: uppercase;
  color: red;
  z-index: 99;
`

const ImageWrapper = styled.div`
  width: 75%;
  margin: 0 auto;
  z-index: 1;
`

const PartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr .5fr;
`

const GridLine = styled.div`
  border-bottom: 1px solid black;
`

const GridBox = styled.div`
  margin: 0 auto;
  font-size: 1.2rem;
  padding: .2em;
`

const SeeIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`


export default function Head({headFromUrl}) {
  
  const selectedHead = data.heads.filter((head) => { //filter thru the data file and match up the correct head from static props
    return head.name === headFromUrl.head
  })[0]
  return (
    <>
      <StyledTitle>{selectedHead.name.split('_').join(' ')}</StyledTitle>
      <ImageWrapper>
        <Image
          src={selectedHead.picture}
          alt={`image of the ${selectedHead.name.split('_').join(' ')} head`}
          layout="responsive"
          width="300px"
          height="200px"
          priority="true"
        />
      </ImageWrapper>
      <PartsGrid>
        <GridBox>Part</GridBox><GridBox>Trican #</GridBox><GridBox>Details</GridBox>
        <GridLine /><GridLine /><GridLine />
        {selectedHead.parts.map(part => {
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
        })}
      </PartsGrid>
    </>
  )
}

export async function getStaticProps({ params }) { //pass the headtype being displayed to the component as props
  return {
    props: {
      headFromUrl: params
    }
  }
}

export async function getStaticPaths() { //will need to be asynchronous when pulling from database

  const pathsFromData = data.heads.map((item) => { //create all the possible paths from the datafile
    return (
      {
        params: {
          head: item.name
        }
      }
    )
  })

  let paths = pathsFromData

  return {
    paths,
    fallback: false
  }
}