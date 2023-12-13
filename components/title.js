import styled from 'styled-components';
import { useUser } from "@auth0/nextjs-auth0";

const TitleContainer = styled.div`
  background-color: #343a40;
  color: #fff;
  padding: 10px;
  padding-bottom: 40px;
  width: 100%;
  position: relative;
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

const LoginButton = styled.a`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #007BFF;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
  font-weight: 600;
`

const LogoutButton = styled.a`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #007BFF;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 14px;
  font-weight: 600;
`
const GreetingBox = styled.p`
  position: absolute;
  top: 50px;
  right: 20px;
`

export default function Title({ backButtonHref, Text }) {
  const {user, error, isloading} = useUser()
  console.log(user)
  return (
    <TitleContainer>
      <BackButton href={backButtonHref}>Back</BackButton>
      <TitleText>{Text}</TitleText>
      {user ? <GreetingBox>Welcome, {user.name}</GreetingBox> : <GreetingBox>Please login to be able to modify anything</GreetingBox>}
      {user ? <LogoutButton href='/api/auth/logout'>Logout</LogoutButton> : <LoginButton href='/api/auth/login'>Login</LoginButton>}
    </TitleContainer>
  );
}