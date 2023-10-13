import styled from 'styled-components';
import Image from 'next/image';

const CardContainer = styled.div`
  display: flex;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 10px 0px;
`;

const ImageContainer = styled.div`
  flex: 1;
  display: flex;
`
const CardContent = styled.div`
  padding: 16px;
  flex: 2;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: #555;
`;

const Card = ({ image, title, description, alt }) => (
  <CardContainer>
    <ImageContainer>
      <Image
          src={image}
          alt={alt}
          width= "100%"
          height="100%"
        />
    </ImageContainer>
    <CardContent>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardContent>
  </CardContainer>
);

export default Card;