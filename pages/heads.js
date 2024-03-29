import Head from 'next/head';
import styled, { createGlobalStyle } from 'styled-components';
import Title from '../components/title';
import data from '../public/data.json';
import Link from 'next/link';

const StyledContainer = styled.div`
  display: grid; 
  grid-template-columns: 1fr;
  grid-template-areas:
  "Title Title Title Title"
  ;
  width: 100%;
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
  :hover {
    background: white;
    color: #b8a286;
    cursor: pointer;
  }
`

export default function Heads() {
  return (
    <>
      <StyledContainer>
        <Title backButtonHref={"/"} Text={'Head Smart'}/>
        {data.heads.map((item) => {
          const url = `/heads/${item.name.toLowerCase()}`
          return (
            <Link href={url} key={item.name}>
              <StyledHeadButton>{item.name.split('_').join(' ')}</StyledHeadButton>
            </Link>
          )
        })}
      </StyledContainer>
    </>
  )
}