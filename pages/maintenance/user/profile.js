import styled from "styled-components"
import Title from "../../../components/title"
import { useUser } from "@auth0/nextjs-auth0";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import NotificationComponent from "../../../components/maintenance/notification";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const ProfileImg = styled(Image)`
  border-radius: 50%;
`

const TeamContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding: 0px 10px 20px 10px;
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
width: 85%;
`

const ContactItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  padding: 10px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
`;

const ContactName = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

const ContactEmail = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const DeleteButton = styled.button`
  background-color: #ff6b6b;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
`;

export default function Team() {
  const { user, error, isLoading } = useUser()
  const [contacts, setContacts] = useState([])
  const [notificationInfo, setNotificationInfo] = useState({show: false, message: ''})
  const [filteredContacts, setFilteredContacts] = useState(contacts);


  const router = useRouter();

    useEffect(() => {
        const getContacts = async () => {
            try {
                const response = await fetch(`/api/maintenance/getContacts?subscriber=${user.sub}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setContacts(data.teamMembers);
                } else {
                    console.error('Error:', response.status);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        if (user) {
            getContacts();
        }
    }, [user, router.asPath]);

    

  const addContactForUser = async (event) => {
    event.preventDefault()
    const userName = event.target[0].value
    const userEmail = event.target[1].value
    const userRole = event.target[2].value;
    console.log(userRole)
    
    const duplicateEmail = contacts.find(contact => contact.email === userEmail)

    if (!duplicateEmail && user) {
      try {
        const subscriber = user.sub
        const response = await fetch('/api/maintenance/createContact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userEmail, userName, subscriber, userRole })
        });
  
        if (response.ok) {
            const data = await response.json();
            setContacts(data.teamMembers);
            event.target.reset()
        } else {
            console.error('Error:', response.status);
            // Handle error
        }
    } catch (error) {
        console.error('Error:', error);
        setNotificationInfo({show: true, message: `uh oh, something went wrong: ${error.message}`})
    }
    } else {
      setNotificationInfo({show: true, message: 'You are not logged in or you already have a contact with this email'})
    }
  }

  const deleteMember = async (contact) => {
    try {
      const response = await fetch("/api/maintenance/deleteContact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriber: user.sub, memberId: contact._id }),
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data);
        console.log(data)
       }
    } catch (error) {
      console.error("Error:", error);
      setNotificationInfo({
        show: true,
        message: `Uh oh, something went wrong: ${error.message}`,
      });
    }
  };
  const filterContacts = (role) => {
    if (role === 'all') {
      setFilteredContacts(contacts);
    } else {
      setFilteredContacts(contacts.filter((contact) => contact.role === role));
    }
  };

  useEffect(() => {
    filterContacts('all');
  }, [contacts]);


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
            <form onSubmit={addContactForUser}>
              <label htmlFor="username" required>Username:</label>
              <input type="text" id="username" />

              <label htmlFor="email" required>Email:</label>
              <input type="email" id="email" />

              <label htmlFor="role">Role:</label>
              <select id="role" required>
                <option value="">Select a role</option>
                <option value="operator">Operator</option>
                <option value="supervisor">Supervisor</option>
                <option value="datavan">Datavan</option>
              </select>

              <input type="submit" value="Create Contact" />
            </form>
            </SideContainer>
            <SideContainer>
              <h2>Current Contacts</h2>
              <p>filter by:</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <button onClick={() => filterContacts('all')}>All</button>
                <button onClick={() => filterContacts('operator')}>Operator</button>
                <button onClick={() => filterContacts('supervisor')}>Supervisor</button>
                <button onClick={() => filterContacts('datavan')}>Datavan</button>
              </div>
              {filteredContacts.map((contact) => (
                <ContactItem key={contact._id}>
                  <div>
                    <ContactName>{contact.name}</ContactName>
                    <ContactEmail>{contact.email}</ContactEmail>
                  </div>
                  <DeleteButton onClick={() => deleteMember(contact)}>Delete</DeleteButton>
                </ContactItem>
              ))}
            </SideContainer>
          </TeamContainer>
          <NotificationComponent
            show={notificationInfo.show}
            message={notificationInfo.message}
            onClose={() => setNotificationInfo({show: false, message: ""})}
          />
      </Container>
  )
}