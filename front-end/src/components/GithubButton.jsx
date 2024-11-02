import styled from "@emotion/styled";
import GithubIcon from "../assets/github.svg";
import PropTypes from "prop-types";

const Container = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background: #252525;
  padding: 14px 20px;
  gap: 0.5rem;
  border: 1px solid white;
  color: white;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    background: #333333;
    border: 1px solid white;
  }

  img {
    margin-right: 10px;
  }
`;

const GithubButton = (props) => {
  const { url, name } = props;
  return (
    <Container href={url} target="_blank">
      <img src={GithubIcon} alt="github" height="30px"></img>
      <span>{name}</span>
    </Container>
  );
};
GithubButton.propTypes = {
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default GithubButton;
