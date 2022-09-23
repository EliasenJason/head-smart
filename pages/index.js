import Head from 'next/head';
import styled, { createGlobalStyle } from 'styled-components';
import Title from '../components/title';
import data from '../public/data.json';
import Link from 'next/link';

const GlobalStyle = createGlobalStyle`
 h1 {
   font-size: 1rem;
 }
`

const StyledContainer = styled.div`
  display: grid; 
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-areas:
  "Title Title Title Title"
  ;
  background-color: #363534;
`
const StyledHeadButton = styled.a`
  font-family: "Roboto";
  text-align: center;
  grid-column: 1 / 5;
  border: solid #d4be92 4px;
  border-radius: .7em;
  padding: .9em;
  font-size: 1.4rem;
  margin: .5em;
  background-color: #b8a286;
  color: white;
  font-weight: bolder;
  text-transform: uppercase;
  letter-spacing: 3px;
`


export default function Home() {
  console.log(data)
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Maven+Pro:wght@400;700;900&family=Roboto:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>
      <GlobalStyle />
      <StyledContainer>
        <Title />
        {data.heads.map((item) => {
          return (
            <Link href="/">
              <StyledHeadButton onClick={() => console.log('clicked')}>{item.name}</StyledHeadButton>
            </Link>
          )
        })}
      </StyledContainer>
    </>
  )
}