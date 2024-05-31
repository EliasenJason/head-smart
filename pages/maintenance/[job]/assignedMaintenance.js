import { useState,useEffect } from "react"
import connectMongo from "../../../lib/mongodb"
import jobModel from "../../../lib/schemas/maintenance/jobSchema"
import styled from 'styled-components'
import { useRouter } from "next/router";
import { useUser } from '@auth0/nextjs-auth0';
import { set } from "mongoose";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const IssueUnit = styled.span`
  color: #007BFF;
  font-weight: bold;
  font-size: 21px;
  flex: 1 1 40%;
  margin-bottom: .5em;
`;

const IssueUnitWithFixer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const FixerName = styled.span`
  color: #6c757d;
  font-size: 16px;
  font-weight: normal;
`;

const Issues = styled.div`
  flex: 1 1 100%;
`;

const IssueComponentType = styled.span`
  font-weight: bold;
`;

const IssueComponentNumber = styled.span`
  font-weight: bold;
`;

const UnitContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: 2px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px;
  background: #f9f9f9;
`;

const BackButton = styled.button`
  margin: 10px;
  background-color: #007BFF;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
  font-weight: 600;

  &:hover {
    background-color: #0056b3;
  }
  @media print {
    display: none;
  }
`;

const PrintButton = styled.button`
  margin: 10px;
  background-color: #28a745;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
  font-weight: 600;

  &:hover {
    background-color: #218838;
  }
  @media print {
    display: none;
  }
`;

const EmailButton = styled.button`
  margin: 10px;
  background-color: #6c757d;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 16px;
  font-weight: 600;

  @media print {
    display: none;
  }
`;

const EmailContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 10px;
  background: #f9f9f9;

  @media print {
    display: none;
  }
`

const SupervisorDropDown = styled.select`
  flex: 1 1 60%;
  margin-bottom: .5em;

  @media print {
    display: none;
  }
`
const DatavanDropDown = styled.select`
  flex: 1 1 60%;
  margin-bottom: .5em;

  @media print {
    display: none;
  }
`

export default function AssignedMaintenance({maintenance}) {
  //const [maintenanceState, setMaintenanceState] = useState(maintenance)
  const { user, error, isLoading } = useUser()
  const [userContacts, setUserContacts] = useState([])
  const [supervisor, setSupervisorEmail] = useState('')
  const [datavan, setDatavanEmail] = useState('')

  const router = useRouter()
  console.log(`this is before the useEffect: ${user}`)
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
                console.log('Contacts fetched successfully');
                const data = await response.json();
                console.log(data)
                setUserContacts(data.teamMembers);
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

  const handleGoBack = () => {
    router.back()
  }

  const handlePrint = () => {
    window.print()
  }

  const handleEmail = () => {
    try {
      let emailBody = 'Assigned maintenance\n\n';
      let emailTo = '';
      let emailCc = '';
  
      Object.entries(maintenance).forEach(([unitNumber, componentTypes]) => {
        emailBody += `Unit ${unitNumber}\n`;
        if (componentTypes.fixer) {
          emailBody += `Assigned to: ${componentTypes.fixer.name}\n`;
          emailTo += `${componentTypes.fixer.email},`;
        }
  
        Object.entries(componentTypes).forEach(([componentTypeKey, { numbers, status }]) => {
          if (componentTypeKey !== 'fixer') {
            emailBody += `${componentTypeKey}: ${numbers.join(', ')}\n`;
          }
        });
        emailBody += '\n';
      });
  
      // Remove the trailing comma from the emailTo string
      emailTo = emailTo.slice(0, -1);

      // Add the supervisor and datavan email addresses to the Cc field
    if (supervisor) {
      emailCc += supervisor;
    }
    if (datavan) {
      if (emailCc) {
        emailCc += `,${datavan}`;
      } else {
        emailCc = datavan;
      }
    }
  
    const mailtoLink = `mailto:${emailTo}?cc=${encodeURIComponent(emailCc)}&subject=You have been assigned pump maintenance&body=${encodeURIComponent(emailBody)}`;
      window.open(mailtoLink, '_blank');
    } catch (error) {
      console.error('Error in handleEmail:', error);
  
      // Fallback option: Open a modal or a new page with a pre-filled email form
      const emailForm = (
        <div>
          <h3>Email Assigned Maintenance</h3>
          <textarea value={emailBody} readOnly />
          <button onClick={() => window.open(`mailto:?subject=Assigned Maintenance&body=${encodeURIComponent(emailBody)}`)}>
            Send Email
          </button>
        </div>
      );
      // Render the email form in a modal or a new page
    }
  };
  //get assigned maintenance from database
  //display assigned maintenance
  //add button to unassign maintenance
  //add button to mark as complete
    return (
      <Container>
      <BackButton onClick={handleGoBack}>Go Back</BackButton>
      <h2>Assigned Maintenance</h2>
      {Object.entries(maintenance).map(([unitNumber, componentTypes]) => (
        <UnitContainer key={unitNumber}>
          <IssueUnitWithFixer>
            <IssueUnit>{unitNumber}</IssueUnit>
            {componentTypes.fixer && (
              <FixerName>Assigned to: {componentTypes.fixer.name}</FixerName>
            )}
          </IssueUnitWithFixer>

          {Object.entries(componentTypes).map(
            ([componentTypeKey, { numbers, status }]) =>
              componentTypeKey !== 'fixer' && (
                <Issues key={componentTypeKey}>
                  <IssueComponentType>
                    {componentTypeKey.charAt(0).toUpperCase() +
                      componentTypeKey.slice(1)}
                    :
                  </IssueComponentType>{' '}
                  {numbers.map((number, index) => (
                    <IssueComponentNumber
                      key={index}
                      style={{
                        color:
                          status[index] === 'red'
                            ? '#DC3545'
                            : status[index] === 'yellow'
                            ? '#FFC107'
                            : 'inherit',
                      }}
                    >
                      {number + ' '}
                    </IssueComponentNumber>
                  ))}
                </Issues>
              )
          )}
        </UnitContainer>
      ))}
      <PrintButton onClick={handlePrint}>Print Assigned Maintenance</PrintButton>
      
      <EmailContainer>
        <h3>Select a supervisor and datavan operator if you would like to CC them in the email</h3>
        <SupervisorDropDown onChange={(event) => {
          if (event.target.value) {
            setSupervisorEmail(event.target.value);
          } else {
            setSupervisorEmail('');
          }
        }}>
          <option value="">Select a Supervisor</option>
          {userContacts.filter((member) => member.role === 'supervisor')
          .map((member) => (
              <option key={member._id} value={member.email}>
                {member.name}
              </option>
            ))}
        </SupervisorDropDown>
        <DatavanDropDown onChange={(event) => {
          if (event.target.value) {
            setDatavanEmail(event.target.value);
          } else {
            setDatavanEmail('');
          }
        }}>
          <option value="">Select a Datavan</option>
          {userContacts.filter((member) => member.role === 'datavan')
          .map((member) => (
              <option key={member._id} value={member.email}>
                {member.name}
              </option>
            ))}
        </DatavanDropDown>
        <EmailButton onClick={handleEmail}>Email Assigned Maintenance</EmailButton>
      </EmailContainer>
    </Container>
    )
}

export async function getServerSideProps(context) {
  const number = context.params.job;
  const query = {jobNumber: number}
  console.log(query)
  let job
  let maintenance
  // Make an API request to fetch job data based on the job number
  try {
    console.log('getJob route triggered')
    await connectMongo()
    job = await jobModel.findOne(query).lean()
    maintenance = job.currentMaintenance
    console.log('data received')
  } catch(error) {
    console.log('there has been an error!')
    console.log(error)
    maintenance = 'ERROR'
  }
  return {
    props: {
      maintenance: JSON.parse(JSON.stringify(maintenance))
    },
  };
}