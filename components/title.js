import styled from "styled-components"

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

export default function Title() {
  return <StyledTitle>Head Smart</StyledTitle>
};