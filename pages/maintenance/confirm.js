import styled from "styled-components"

const PopUp = styled.div`
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const PopUpContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  text-align: center;
`

const ButtonsContainer = styled.div`
  margin-top: 20px;
`;

export default function Confirm({action, popUpToggle}) {

  return (
    <PopUp>
      <PopUpContent>
      <ButtonsContainer>
        <h2>Delete Confirmation</h2>
        <p>Are you sure you want to delete this Job?</p>
        <button onClick={() => action()}>Yes</button>
        <button onClick={() => popUpToggle()}>No</button>
      </ButtonsContainer>
      </PopUpContent>
      
    </PopUp>
  )
}