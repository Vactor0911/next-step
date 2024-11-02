import styled from "@emotion/styled";
import Logo from "/vite.svg";
import { NavLink } from "react-router-dom";

const Style = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100px;
  padding: 0 40px;
  background-color: #eee;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #541a8b;
    text-decoration: none;
    transition: all 0.6s;
  }
  .logo:hover {
    color: #fcca03;
  }

  .nav-section h2 {
    color: #666;
  }
`;

const Header = () => {
  return (
    <Style>
      <NavLink to="/" className="logo">
        <img src={Logo} alt="logo" />
        <h1>NextStep</h1>
      </NavLink>
      <div className="nav-section">
        <h2>대학생을 위한 채용 공고와 공고문을 손쉽게 받아보세요!</h2>
      </div>
    </Style>
  );
};

export default Header;
