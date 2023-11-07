import styled from 'styled-components';

const TitleContainer = styled.div`
  background-color: #343a40;
  color: #fff;
  padding: 20px;
  width: 100%;
`;

const TitleText = styled.h1`
  font-size: 24px;
  margin: 0;
  text-align: center;
`;

const BackButton = styled.a`
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

export default function Title({ backButtonHref, Text }) {
  return (
    <TitleContainer>
      <BackButton href={backButtonHref}>Back</BackButton>
      <TitleText>{Text}</TitleText>
    </TitleContainer>
  );
}