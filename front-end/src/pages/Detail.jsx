import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import { useNavigate } from "react-router-dom";
import ApiKey from "../assets/secret.json";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

const Style = styled.div`
  display: flex;
  padding: 20px 20vw;
  margin-top: 100px;
  padding-bottom: 60px;
  padding-top: 0;
  position: relative;
  justify-content: space-between;

  .container {
    display: flex;
    flex-direction: column;
  }

  .container.left {
    width: 60%;
    gap: 50px;
  }
  .container.right {
    width: 300px;
  }

  .basic-info {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: repeat(5, 1fr);
    padding: 0 50px;
    height: 230px;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
  }

  .content-wrapper h2 {
    margin-bottom: 15px;
  }

  .company-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 30px;
    width: 300px;
    border: 1px solid #e4e4e4;
    border-radius: 10px;
    position: sticky;
    top: 50px;
    right: 10vw;
  }

  .error {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 10px;
    text-align: center;
    margin-bottom: 60px;
  }

  .error svg {
    width: 400px;
    height: 400px;
    color: #999;
  }

  .error h1 {
    font-size: 4em;
  }

  .error p {
    font-size: 2em;
  }

  .error Button {
    font-size: 1.5em;
    margin-top: 20px;
  }
`;

const Detail = () => {
  const navigate = useNavigate();
  // API 통신
  const [data, setData] = useState(null); // API 데이터

  // 파일 추출하여 fileData에 저장
  const downloadFile = async (fileName, downLoadUrl) => {
    // 새로운 a 태그 생성
    const link = document.createElement("a");
    link.href = downLoadUrl;

    // 다운로드할 파일 이름 지정
    link.download = fileName;

    // a 태그를 클릭하여 다운로드 트리거
    document.body.appendChild(link);
    link.click();

    // 다운로드가 완료되면 a 태그 제거
    document.body.removeChild(link);
  };

  const fetchData = async () => {
    // URLSearchParams를 이용하여 쿼리 파라미터에서 id 값 읽기
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("id");
    console.log("fetchData", id);
    try {
      await axios
        .get(
          "https://apis.data.go.kr/1051000/recruitment/detail", // 예시 URL, 실제 API 문서에 따라 조정
          {
            params: {
              serviceKey: ApiKey.apiKey, // 공공데이터포털 API 키
              resultType: "json",
              sn: parseInt(id, 10),
            },
          }
        )
        .then((response) => {
          console.log(response);
          setData(response.data.result);
          console.log(response.data.result);
        });
      // ChatGpt에게 pdf 문서 전달
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Style>
      {data ? (
        <>
          <div className="container left">
            <div>
              <h1>{data?.recrutPbancTtl}</h1>
              <Button
                variant="text"
                size="large"
                onClick={() => {
                  navigate("/");
                }}
                style={{
                  marginTop: "10px",
                  alignSelf: "flex-start",
                }}
                startIcon={<KeyboardArrowLeftRoundedIcon />}
              >
                돌아가기
              </Button>
            </div>
            <hr />
            <div className="basic-info">
              <h3>고용유형</h3>
              <p>{data?.hireTypeNmLst}</p>
              <h3>근무지</h3>
              <p>{data?.workRgnNmLst}</p>
              <h3>경력</h3>
              <p>{data?.recrutSeNm}</p>
              <h3>학력</h3>
              <p>{data?.acbgCondNmLst}</p>
              <h3>채용인원</h3>
              <p>{data?.recrutNope}명</p>
              <h3>마감일</h3>
              <p>{data?.pbancEndYmd}</p>
            </div>
            <hr />

            <div className="content-wrapper">
              <h2>자격조건</h2>
              <div>
                {data?.aplyQlfcCn.split("\r\n").map((line, index) => {
                  return (
                    <>
                      <p key={index}>{line}</p>
                      <br />
                    </>
                  );
                })}
              </div>
            </div>

            <div className="content-wrapper">
              <h2>채용 전형 단계 목록</h2>
              <div>
                {data?.scrnprcdrMthdExpln.split("\r\n").map((line, index) => {
                  return (
                    <>
                      <p key={index}>{line}</p>
                      <br />
                    </>
                  );
                })}
              </div>
            </div>

            <div className="content-wrapper">
              <h2>우대사항</h2>
              <div>
                {data?.prefCn.split("\r\n").map((line, index) => {
                  return (
                    <>
                      <p key={index}>{line}</p>
                      <br />
                    </>
                  );
                })}
              </div>
            </div>

            <div className="content-wrapper">
              <h2>결격사유</h2>
              <div>
                {data?.disqlfcRsn.split("\r\n").map((line, index) => {
                  return (
                    <>
                      <p key={index}>{line}</p>
                      <br />
                    </>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="container right">
            <div className="company-content">
              <h2>{data?.instNm}</h2>
              <Button
                variant="text"
                size="large"
                disabled={!data?.srcUrl}
                endIcon={<KeyboardArrowRightRoundedIcon />}
                style={{
                  alignSelf: "flex-start",
                }}
                onClick={() => {
                  const url = data?.srcUrl;
                  if (url) {
                    const parsedUrl = data?.srcUrl.split("/");
                    const companyUrl = parsedUrl[0] + "//" + parsedUrl[2];
                    window.open(companyUrl, "_blank");
                  }
                }}
              >
                기관정보 보기
              </Button>
              <Button
                variant="contained"
                size="large"
                disabled={!data?.srcUrl}
                style={{
                  marginTop: "30px",
                }}
                onClick={() => {
                  const url = data?.srcUrl;
                  if (url) {
                    window.open(url, "_blank");
                    return;
                  }
                  alert("URL이 올바르지 않습니다.");
                }}
              >
                지원하러 가기
              </Button>
              <Button
                variant="outlined"
                size="large"
                disabled={!data?.files?.url}
                onClick={() => {
                  const file = data?.files?.[0];
                  const splittedFileName = file.atchFileNm.split(".");
                  const fileExtension =
                    splittedFileName[splittedFileName.length - 1];
                  if (fileExtension === "pdf") {
                    downloadFile(file?.atchFileNm, file?.url);
                  }
                }}
              >
                지원 공고 다운로드
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="error">
          <WarningAmberRoundedIcon />
          <h1>이런!</h1>
          <p>공고 정보를 불러오는 중에 문제가 발생했습니다.</p>
          <Button variant="contained" onClick={() => navigate("/")}>돌아가기</Button>
        </div>
      )}
    </Style>
  );
};

export default Detail;