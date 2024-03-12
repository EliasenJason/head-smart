import styled from "styled-components"
import Title from "../../../components/title"
import { useUser } from "@auth0/nextjs-auth0";
import Image from "next/image";

/* 
  create a user profile page
*/

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const ProfileImg = styled(Image)`
  border-radius: 50%;
`

const TeamContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  padding: 0px 20px 20px 20px;
  background-color: grey;
  
  h2 {
    text-align: center;
  }
  form {
    display: flex;
    flex-direction: column;
  }
`

const SideContainer = styled.div`

`

export default function Team() {
    const { user, error, isLoading } = useUser()
    console.log(user?.picture)
    return (
        <Container>
            <Title backButtonHref={"/maintenance"}></Title>
            <ProfileContainer>
            {user?.name && <h1>{user.name}</h1>}
            {!isLoading && user?.picture &&
                <ProfileImg 
                    src={user?.picture}
                    width={100}
                    height={100}
                    alt="profile picture"
                />
            }
            <p>Email: {user?.email}</p>
            </ProfileContainer> 
            <TeamContainer>
              <SideContainer>
              <h2>Create New Contact</h2>
              <form>
                <label for="username">Username:</label>
                <input type="text" id="username" />

                <label for="email">Email:</label> 
                <input type="email" id="email" />

                <input type="submit" value="Create Contact" />
              </form>
              </SideContainer>
              <SideContainer>
                <h2>Current Contacts</h2>
              </SideContainer>
              
            </TeamContainer>
            

            

        </Container>
    )
}