import Link from 'next/link';
import Card from '../components/cards';
import styled from 'styled-components';


const IndexContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export default function Home() {
  return (
    <>
      
      <IndexContainer>
        <Link href="/heads">
          <button>
            <Card
              image="/pictures/parts.jpg"
              alt="picture of consumables"
              title="Head Smart"
              description="find the right part for the right fluid end"
            />
          </button>
        </Link>
        <Link href="/">
          <button>
            <Card
              image="/"
              alt="someone send me a picture of someone doing head maintenance"
              title="Maintenance Tracker"
              description="**This area is under active development**"
            />
          </button>
        </Link>
      </IndexContainer>
    </>
  )
}