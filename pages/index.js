import Link from 'next/link';
import Card from '../components/cards';
import styled from 'styled-components';


const IndexContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const LoginButton = styled.a`
  background-color: #007BFF;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background-color: #0056b3;
  }
`;

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
        <Link href="/maintenance">
          <button>
            <Card
              image="/pictures/hammer.jpg"
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