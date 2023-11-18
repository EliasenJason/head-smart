import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Spinner = styled.div`
  animation: ${spin} .8s linear infinite;
  border: 12px solid #055877;
  border-right-color: transparent;
  border-radius: 50%;
  display: inline-block;
  height: 100px;
  width: 100px;  
`

const LoadingSpinner = ({ isLoading }) => {
  return (
    isLoading && (
      <Overlay>
        <Spinner/>
      </Overlay>
    )
  );
};

export default LoadingSpinner;
