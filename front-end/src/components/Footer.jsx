import styled from "@emotion/styled";
import GithubButton from "./GithubButton";

const Style = styled.footer`
  display: flex;
  height: 150px;
  background-color: #eee;
  justify-content: center;
  padding: 20px 0;
  box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.2);

  .container {
    width: 80vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .container .left {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .container .left hr {
    height: 30px;
  }

  .container .left a {
    color: #2196f3;
    text-decoration: none;
  }

  .container .right {
    display: flex;
    font-size: 1.2em;
    gap: 20px;
  }
`;

const Footer = () => {
  return (
    <Style>
      <div className="container">
        <div className="left">
          <h2>Team NextStep</h2>
          <hr />
          <p>
            데이터 제공 :{" "}
            <a href="https://www.data.go.kr/index.do" target="_blank">
              공공데이터포털
            </a>
          </p>
        </div>
        <div className="right">
          <GithubButton url="https://github.com/Vactor0911" name="박준영" />
          <GithubButton url="https://github.com/kjusun" name="김주선" />
          <GithubButton url="https://github.com/Leehyunku" name="이현구" />
        </div>
      </div>
    </Style>
  );
};

export default Footer;
