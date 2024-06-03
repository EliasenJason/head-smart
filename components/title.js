import styled from 'styled-components';
import { useUser } from "@auth0/nextjs-auth0";

const TitleContainer = styled.div`
  background-color: #343a40;
  color: #fff;
  padding: 10px;
  width: 100%;
  position: relative;
  min-height: 130px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const TitleText = styled.h1`
  font-size: 22px;
  margin: 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ButtonBase = styled.a`
  background-color: #007bff;
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

const BackButton = styled(ButtonBase)`
  position: absolute;
  top: 10px;
  left: 10px;

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const LoginButton = styled(ButtonBase)`
  position: absolute;
  top: 10px;
  right: 10px;

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

const LogoutButton = styled(ButtonBase)`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const Profile = styled(ButtonBase)`
  position: absolute;
  bottom: 10px;
  right: 10px;

  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const GreetingBox = styled.p`
  position: absolute;
  left: 10px;
  bottom: 10px;
  margin: 0;

  @media (max-width: 768px) {
    margin-top: 10px;
    top: 45px;
    right: 70px;
  }
`;

export default function Title({ backButtonHref, Text }) {
  const { user, error, isloading } = useUser();

  return (
    <TitleContainer>
      <BackButton href={backButtonHref}>Back</BackButton>
      <TitleText>{Text}</TitleText>
      {user ? (
        <GreetingBox>Welcome, {user.name}</GreetingBox>
      ) : (
        <GreetingBox>
          Supervisors, login then contact Jason Eliasen for access.
        </GreetingBox>
      )}
      {user ? (
        <LogoutButton href="/api/auth/logout">Logout</LogoutButton>
      ) : (
        <LoginButton href="/api/auth/login">Login</LoginButton>
      )}
      {user?.role?.includes('supervisor') && (
        <Profile href="/maintenance/user/profile">My Profile</Profile>
      )}
    </TitleContainer>
  );
}