import { useState,useEffect } from "react"
import connectMongo from "../../../lib/mongodb"
import jobModel from "../../../lib/schemas/maintenance/jobSchema"
import styled from 'styled-components'
import { useRouter } from "next/router";

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

export default function AssignedMaintenance({maintenance}) {
  //const [maintenanceState, setMaintenanceState] = useState(maintenance)
  const router = useRouter()

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
  
      Object.entries(maintenance).forEach(([unitNumber, componentTypes]) => {
        emailBody += `Unit ${unitNumber}:\n`;
        if (componentTypes.fixer) {
          emailBody += `Assigned to: ${componentTypes.fixer.name}\n`;
          emailTo += `${componentTypes.fixer.email},`;
        }
        Object.entries(componentTypes).forEach(([componentTypeKey, { numbers, status }]) => {
          if (componentTypeKey !== 'fixer') {
            emailBody += `  ${componentTypeKey.charAt(0).toUpperCase() + componentTypeKey.slice(1)}:\n`;
            numbers.forEach((number, index) => {
              emailBody += `    ${number} (Status: ${status[index]})\n`;
            });
          }
        });
        emailBody += '\n';
      });
  
      // Remove the trailing comma from the emailTo string
      emailTo = emailTo.slice(0, -1);
  
      const mailtoLink = `mailto:${emailTo}?subject=You have been assigned pump maintenance&body=${encodeURIComponent(emailBody)}`;
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
      <EmailButton onClick={handleEmail}>Email Assigned Maintenance</EmailButton>
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