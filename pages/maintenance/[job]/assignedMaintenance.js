import { useState, useEffect } from "react"
import connectMongo from "../../../lib/mongodb"
import jobModel from "../../../lib/schemas/maintenance/jobSchema"
import styled from 'styled-components'
import { useRouter } from "next/router";
import { useUser } from '@auth0/nextjs-auth0'

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
  position: relative;
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
  width: 100%;
  margin: 0 auto;
  margin-bottom: 20px;
  background-color: #6c757d;
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

const MarkAsCompleteButton = styled.button`
  position: absolute;
  bottom: 2px;
  right: 2px;
  margin: 10px;
  background-color: #28a745;
  color: #fff;
  padding: 12px 7px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 12px;
  font-weight: 600;

  &:hover {
    background-color: #1f8333;
  }
  @media print {
    display: none;
  }
`

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

export default function AssignedMaintenance({maintenance, job}) {
  const { user, error, isLoading } = useUser()
  const [userContacts, setUserContacts] = useState([])
  const [supervisor, setSupervisorEmail] = useState('')
  const [datavan, setDatavanEmail] = useState('')
  const [updatedMaintenance, setUpdatedMaintenance] = useState(maintenance);

  const router = useRouter()
  
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
  }, [user]);

  const handleGoBack = async () => {
    // Get the previous page's path
    const previousPath = router.asPath.split('/').slice(0, -1).join('/')

    // Navigate to the previous page, forcing a re-run of getServerSideProps
    await router.push(previousPath, previousPath, { scroll: false })
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
    }
  };
  //add button to unassign maintenance
  const markAsComplete = async (unitNumber) => {
    const componentUpdates = Object.entries(maintenance[unitNumber]).reduce((acc, [component, data]) => {
      if (component !== 'fixer') {
        const componentNumbers = data.numbers;
        const componentStatuses = data.status;

        componentNumbers.forEach((number, index) => {
          acc.push({
            component: `${component}.${number}`,
            componentNumber: Number(number),
          });
        });
      }
      return acc;
    }, []);

    const filter = { number: unitNumber };
    const update = {
      $set: {},
    };

    componentUpdates.forEach(({ component, componentNumber }) => {
      update.$set[`${component}.status`] = 'green';
    });

    const options = {
      new: true,
      runValidators: true,
    };
    const response = await fetch('/api/maintenance/resetUnitMaintenance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ unit: unitNumber, update, job }),
    });
    if (response.ok) {
      console.log(response.status);
      const data = await response.json();
      console.log(data);

      // Remove the unit number from the updatedMaintenance state
      const newMaintenance = { ...updatedMaintenance };
      delete newMaintenance[unitNumber];
      setUpdatedMaintenance(newMaintenance);
    } else {
      console.error('Error marking unit as complete:', response.status);
    }
  }
  //add button to mark as complete
    return (
      <Container>
      <BackButton onClick={handleGoBack}>Go Back</BackButton>
      <h2>Assigned Maintenance</h2>
      {Object.entries(updatedMaintenance).map(([unitNumber, componentTypes]) => (
        <UnitContainer key={unitNumber}>
          <IssueUnitWithFixer>
            <IssueUnit>{unitNumber}</IssueUnit>
            {componentTypes.fixer && (
              <FixerName>Assigned to: {componentTypes.fixer.name}</FixerName>
            )}
            {user?.role?.includes('supervisor') && (
            <MarkAsCompleteButton onClick={() => markAsComplete(unitNumber)}>Mark as Complete</MarkAsCompleteButton>
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
      {user?.role?.includes('supervisor') && (
      <PrintButton onClick={handlePrint}>Print Assigned Maintenance</PrintButton>
      )}
      
      {user?.role?.includes('supervisor') && (
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
      )}
      
      
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
      maintenance: JSON.parse(JSON.stringify(maintenance)),
      job: JSON.parse(JSON.stringify(job.jobNumber)),
    },
  };
}