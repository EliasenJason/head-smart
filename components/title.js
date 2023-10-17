import styled from "styled-components";
import Link from "next/link";

const StyledTitle = styled.h1`
    margin: 0;
    margin-bottom: .5em;
    font-size: 3rem;
    font-family: 'Maven Pro', sans-serif;
    grid-area: Title;
    background: red;
    text-align: center;
    background-color: rgb(243, 242, 241);
  ` 
  const BackButton = styled.button`
    position: absolute;
    aspect-ratio: 1/1;
  `

export default function Title({backButtonHref, Text}) {
  return (
    <>
    <BackButton><Link href={backButtonHref}>Back</Link></BackButton><StyledTitle>{Text}</StyledTitle>
    </>
  )
};