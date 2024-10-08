import { useState, useEffect } from "react"
import connectMongo from "../../../lib/mongodb"
import jobModel from "../../../lib/schemas/maintenance/jobSchema"
import styled from 'styled-components'
import { useRouter } from "next/router";
import { useUser } from '@auth0/nextjs-auth0'
import AddComponentPopUp from '../../../components/maintenance/addComponentPopUp'
import formatComponentName from "../../../lib/formatComponentName"

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const IssueUnit = styled.span`
  color: #007BFF;
  font-weight: bold;
  font-size: 21px;
  flex: 1 1 20%;
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
  font-size: 10px;
  font-weight: normal;
  margin-left: 10px;
`;

const MarkAsCompleteButton = styled.button`
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
const MarkAsInCompleteButton = styled.button`
  margin: 10px;
  background-color: red;
  color: #fff;
  padding: 12px 7px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 12px;
  font-weight: 600;

  &:hover {
    background-color: darkred;
  }
  @media print {
    display: none;
  }
`

const AddComponentButton = styled.button`
  margin: 10px;
  background-color: #007BFF;
  color: #fff;
  padding: 12px 7px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 12px;
  font-weight: 600;

  &:hover {
    background-color: #0056b3;
  }
  @media print {
    display: none;
  }
`
const IssuesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: .3em;
`

const Issues = styled.div`
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
  min-height: 10px;
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

let selectedUnit

export default function AssignedMaintenance({maintenance, job}) {
  const { user, error, isLoading } = useUser()
  const [userContacts, setUserContacts] = useState([])
  const [supervisor, setSupervisorEmail] = useState('')
  const [datavan, setDatavanEmail] = useState('')
  const [updatedMaintenance, setUpdatedMaintenance] = useState(maintenance);
  const [showAddComponentPopUp, setShowAddComponentPopUp] = useState(false);

  const router = useRouter()

  //for debugging to see updatedMaintenance:
  // console.log("updatedMaintenance state:")
  // console.log(updatedMaintenance)

  useEffect((updatedMaintenance) => {
    console.log(updatedMaintenance)
  },[updatedMaintenance])

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
                // console.log('Contacts fetched successfully');
                const data = await response.json();
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
  
      updatedMaintenance.filter((item) => item.fixer).forEach((unit) => {
        emailBody += `Unit ${unit.unit}\n`;
        if (unit.fixer) {
          emailBody += `Assigned to: ${unit.fixer.name}\n`;
          emailTo += `${unit.fixer.email},`;
        }
  
        unit.components.forEach((component) => {
          emailBody += `${formatComponentName(component.type)}: `;
          const holeNumbers = component.details.map((detail) => detail.hole);
          emailBody += `${holeNumbers.join(', ')}\n`;
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
    }
  };
  

  const finalize = async (completed, unitNumber, fixer) => {
    const unitInformation = updatedMaintenance.find((unit) => unit.unit === unitNumber);
    // console.log(unitInformation)
    // console.log(updatedMaintenance)

    

    if (completed) {
      //update the unitStatuses with the same statuses from unitInformation from unitModel schema
      const response = await fetch('/api/maintenance/resetUnitStatuses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({unitInformation}),
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Unit statuses reset successfully:', data);
        //call resetUnitInJobMaintenance from api folder to reset the maintenance for the job
        const resetResponse = await fetch('/api/maintenance/resetUnitInJobMaintenance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({unitNumber, job}),
        });
        //update history database
        const historyResponse = await fetch('/api/maintenance/addUnitMaintenanceToJobHistory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({jobNumber: job, maintenance: unitInformation}),
        });
        const historyResponseData = await historyResponse.json();
        console.log(historyResponseData)
        //clear the updatedMaintenance for the particular unit
        setUpdatedMaintenance((prevMaintenance) =>
          prevMaintenance.map((unit) =>
            unit.unit === unitNumber
              ? {
                  ...unit,
                  components: [],
                  fixer: null,
                }
              : unit
          )
        )
      } else {
        console.error('Error resetting unit statuses:', response.status);
      }
    } else {
      //remove button is clicked
      //remove the unit from maintenance (remove the fixer)
      const resetResponse = await fetch('/api/maintenance/resetUnitInJobMaintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({unitNumber, job}),
      });
      //clear the updatedMaintenance for the particular unit
      setUpdatedMaintenance((prevMaintenance) =>
        prevMaintenance.map((unit) =>
          unit.unit === unitNumber
            ? {
                ...unit,
                components: [],
                fixer: null,
              }
            : unit
        )
      )
    }
    
  };

  const toggleAddComponentPopUp = (unitNumber) => {
    selectedUnit = unitNumber
    showAddComponentPopUp ? setShowAddComponentPopUp(false) : setShowAddComponentPopUp(true)
  }
  
    return (
      <Container>
        <BackButton onClick={handleGoBack}>Go Back</BackButton>
        <h2>Assigned Maintenance</h2>
        
        {updatedMaintenance.filter((unit) => unit.fixer).map((unit) => ( //filter out units without a fixer than display those with issues
          <UnitContainer key={unit.unit}>
            {unit.fixer && (
              <FixerName>
                Assigned to: {unit.fixer.name}
              </FixerName>
            )}
            <IssueUnitWithFixer>
              <IssueUnit>{unit.unit}</IssueUnit>
                {user?.role?.includes('supervisor') && (
                <MarkAsCompleteButton onClick={() => finalize(true, unit.unit, unit.fixer.name)}>Completed</MarkAsCompleteButton>
                )}
                {user?.role?.includes('supervisor') && (
                <MarkAsInCompleteButton onClick={() => finalize(false, unit.unit, unit.fixer.name)}>Remove</MarkAsInCompleteButton>
                )}
            </IssueUnitWithFixer>
            <IssuesContainer>
              {unit.components.map((component) => (
                <Issues key={component.type}>
                  <IssueComponentType>{formatComponentName(component.type)}: {/* Added a space after the colon */}
                  {component.details.map((detail, index) => (
                    <span
                      key={`${component.type}-${detail.hole}`}
                      style={{
                        color:
                          detail.status === 'yellow'
                            ? 'orange'
                            : detail.status === 'red'
                            ? 'red'
                            : 'green',
                      }}
                    >
                      {index > 0 ? ', ' : ''}
                      {detail.hole}
                    </span>
                  ))}
                  </IssueComponentType>
                </Issues>
              ))}
              {user?.role?.includes('supervisor') && (
                <AddComponentButton onClick={() => toggleAddComponentPopUp(unit.unit)}>Modify</AddComponentButton>
              )}
            </IssuesContainer>
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

      {showAddComponentPopUp && (
        <AddComponentPopUp toggle={toggleAddComponentPopUp} updatedMaintenance={updatedMaintenance} setUpdatedMaintenance={setUpdatedMaintenance} unit={selectedUnit} job={job}/>
      )}

    </Container>
    )
}

export async function getServerSideProps(context) {
  const number = context.params.job;
  const query = {jobNumber: number}
  //console.log(query)
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