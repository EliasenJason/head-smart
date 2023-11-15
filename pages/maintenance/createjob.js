import styled from "styled-components";
import Title from "../../components/title";
import { useState } from "react";
import Link from "next/link";
import createEmptyUnit from "../../lib/createEmptyUnit";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.h2`
  width: 100%;
  text-align: center;
`;

const PumpNumberInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Input = styled.div`
  display: flex;
  margin: .5em;
  flex: 1;
  justify-content: center;
  
  input {
    border: solid black 1px;
    margin-bottom: .5em;
  }
`;

const CreateJobButton = styled.button`
  background-color: #28a745;
  color: #000;
  font-size: 2rem;
  font-weight: bold;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #1f8333;
  }
`;


export default function CreateJob() {
  const [jobNumber, setJobNumber] = useState(null)
  const [leftInputValues, setLeftInputValues] = useState([''])
  const [rightInputValues, setRightInputValues] = useState([''])
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const handleJobNumberChange = (event) => {
    setJobNumber(event.target.value)
  }

  const handleLeftInputChange = (index, value) => {
    const newLeftInputValues = [...leftInputValues];
    newLeftInputValues[index] = value;
    setLeftInputValues(newLeftInputValues);
  }

  const handleRightInputChange = (index, value) => {
    const newRightInputValues = [...rightInputValues];
    newRightInputValues[index] = value;
    setRightInputValues(newRightInputValues);
  }

  const addLeftInput = () => {
    setLeftInputValues([...leftInputValues, '']);
  }

  const addRightInput = () => {
    setRightInputValues([...rightInputValues, '']);
  }

  const removeLeftLastInput = () => {
    if (leftInputValues.length > 1) {
      const newLeftInputValues = [...leftInputValues];
      newLeftInputValues.pop();
      setLeftInputValues(newLeftInputValues);
    }
  }

  const removeRightLastInput = () => {
    if (rightInputValues.length > 1) {
      const newRightInputValues = [...rightInputValues];
      newRightInputValues.pop();
      setRightInputValues(newRightInputValues);
    }
  }

  const createJob = async () => {
  //TODO setup checks to see if the same unit is used multiple times and display error

  //1. need to add units that aren't already in the database
  let units = [...new Set([...leftInputValues,...rightInputValues])]
  units.forEach((unitNumber, index) => units[index] = createEmptyUnit(unitNumber))
  console.log('creating any new units')
  try {
    const res = await fetch('/api/maintenance/createUnits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(units)
    })
    if (res.ok) {
      console.log('units created')
    } else {
      console.error('Error in creating Units:', res.statusText)
    }
  } catch (error) {
    console.error('Error creating units:', error)
  }
  //2. create the job with the references to the units
  console.log('creating job')
  let arrayOfLeftUnitObjects = leftInputValues.map((item) => {
    return {unit: item}
  })
  let arrayOfRightUnitObjects = rightInputValues.map((item) => {
    return {unit: item}
  })
  try {
    const res = await fetch('/api/maintenance/createJob', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobNumber: jobNumber,
        unitsOnLeft: arrayOfLeftUnitObjects,
        unitsOnRight: arrayOfRightUnitObjects
      })
    })
    if (res.ok) {
      console.log('job created')
    } else {
      console.error('Error in creating job:', res.statusText)
    }
  } catch (error) {
    console.error('Error creating job:', error)
  }
  }

  return (
    <Container>
      <Title backButtonHref="/maintenance" Text="Create Job" />

      {isDataSubmitted ? (
        <>
          <p>Job has been created!</p>
          <Link href="/maintenance">
            <CreateJobButton>Click here to return to the job lists</CreateJobButton>
          </Link>
        </>
      ) : (
        <>
          <label>Job Number</label>
          <input type="text" onChange={handleJobNumberChange} />
          <Header>Blender</Header>
          <PumpNumberInputContainer>
            <Input>
                <form>
                  {leftInputValues.map((value, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleLeftInputChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                <button type="button" onClick={addLeftInput}>
                  Add Input
                </button>
                <button type="button" onClick={removeLeftLastInput}>
                  Remove Input
                </button>
              </form>
                
              </Input>
              <Input>
              <form>
                  {rightInputValues.map((value, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleRightInputChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                <button type="button" onClick={addRightInput}>
                  Add Input
                </button>
                <button type="button" onClick={removeRightLastInput}>
                  Remove Input
                </button>
              </form>
              </Input>
          </PumpNumberInputContainer>
          <Header>Wellhead</Header>

          <Header>
            <CreateJobButton onClick={createJob}>Create Job</CreateJobButton>
          </Header>
        </>
      )}
    </Container>
  );
}