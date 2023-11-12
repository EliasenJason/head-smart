import styled from "styled-components"
import Title from "../../components/title"
import { useState } from "react"
import Link from "next/link"

const PumpNumberInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`
const LeftInput = styled.div`
  display: flex;
  margin: .5em;
`
const RightInput = styled.div`
  display: flex;
  margin: .5em;
`
const Header = styled.h2`
  width: 100%;
  text-align: center;
`
const CreateJobButton = styled.button`
  font-size: 2rem;
  font-weight: bold;
`


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
  //1. need to add units that aren't already in the database
  //2. create the job with the references to the units
  }

  return (
    <>
    <Title backButtonHref="/maintenance" Text="Create Job" />
      
        {isDataSubmitted ? (
          <>
            <p>Job has been created!</p>
            <Link href="/maintenance"><button>Click here to return to the job lists</button></Link>
          </>
          
        ) : (
          <>
            <label>Job Number</label><input type="text" onChange={handleJobNumberChange}/>
            <Header>Blender</Header>
            <PumpNumberInputContainer>
              <LeftInput>
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
                
              </LeftInput>
              <RightInput>
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
              </RightInput>
              
            </PumpNumberInputContainer>
            <Header>Wellhead</Header>

            <Header>
              <CreateJobButton onClick={createJob}>Create Job</CreateJobButton>
            </Header>
          </>
        )}
        
      
    </>
  )
}