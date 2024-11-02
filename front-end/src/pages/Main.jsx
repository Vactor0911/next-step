import styled from "@emotion/styled";
import {
  Autocomplete,
  Card,
  CardContent,
  IconButton,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import { employmentTypes, workRegions, recruitmentFields } from "../util";
import {
  employmentTypeValuesAtom,
  recruitmentFieldValuesAtom,
  searchResultAtom,
  workRegionValuesAtom,
  searchTitleAtom,
} from "../state";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ApiKey from "../assets/secret.json";

const Style = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 10vw;

  .filter,
  .filter .top,
  .filter .bottom {
    display: flex;
    gap: 20px;
  }
  .filter {
    flex-direction: column;
    padding: 20px 0;
  }
  .filter .top,
  .filter .bottom {
    justify-content: center;
  }
  .filter .bottom {
    position: relative;
  }

  .filter Button {
    font-weight: bold;
  }
  .filter .button-wrapper {
    position: absolute;
    right: 0;
  }

  .search-job {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    height: auto;
    margin-top: 30px;
    margin-bottom: 30px;
  }

  .job-card {
    width: 300px;
    cursor: pointer;
    transition: transform 0.3s;
    margin: 30px 10px;
  }
  .job-card:hover {
    transform: translate(-3px, -3px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }

  .job-card #card-banner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    background-color: #aaa;
    margin-bottom: 20px;
    border-radius: 10px;
    position: relative;
    padding: 20px;
  }
  .job-card #card-banner #expireDate {
    position: absolute;
    left: 10px;
    top: 10px;
    background-color: rgba(255, 255, 255, 0.5);
    color: black;
    padding: 5px 10px;
    border-radius: 10px;
  }

  .job-card-content Typography span {
    font-weight: bold;
  }

  #truncate1,
  #truncate2 {
    display: -webkit-box;
    -webkit-line-clamp: 1; /* 줄 수 설정 */
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  #truncate2 {
    -webkit-line-clamp: 2;
  }
`;

const Main = () => {
  const [searchResult, setSearchResult] = useAtom(searchResultAtom);
  const navigate = useNavigate();

  // 콤보박스 값
  const [employmentTypeValues, setEmploymentTypeValues] = useAtom(
    employmentTypeValuesAtom
  );
  const [workRegionValues, setWorkRegionValues] = useAtom(workRegionValuesAtom);
  const [recruitmentFieldValues, setRecruitmentFieldValues] = useAtom(
    recruitmentFieldValuesAtom
  );

  // 기업명
  const [searchTitle, setSearchTitle] = useAtom(searchTitleAtom);

  // 페이지
  const [page, setPage] = useState(1);
  const [dataCount, setDataCount] = useState(0);

  const handlePageChange = (event, value) => {
    setPage(value);
    fetchData(
      employmentTypeValues,
      workRegionValues,
      recruitmentFieldValues,
      searchTitle,
      value
    );
  };

  // API 통신
  const fetchData = async (
    employmentTypes,
    workRegions,
    recruitmentFields,
    searchTitle,
    page
  ) => {
    try {
      await axios
        .get(
          "https://apis.data.go.kr/1051000/recruitment/list", // 예시 URL, 실제 API 문서에 따라 조정
          {
            params: {
              serviceKey: ApiKey.apiKey, // 공공데이터포털 API 키
              acbgCondLst: "R7040,R7050",
              recrutSe: "R2030",
              numOfRows: "20",
              pageNo: page ? page : 1,
              resultType: "json",
              hireTypeLst: employmentTypes
                ? employmentTypes.map((type) => type.value).join(",")
                : "",
              workRgnLst: workRegions
                ? workRegions.map((region) => region.value).join(",")
                : "",
              ncsCdLst: recruitmentFields
                ? recruitmentFields.map((field) => field.value).join(",")
                : "",
              recrutPbancTtl: searchTitle ? searchTitle : "",
            },
          }
        )
        .then((response) => {
          // JSON 파일 가공
          setDataCount(response.data.totalCount);

          const processedData = response.data.result.map((item) => {
            const r = Math.floor(Math.random() * 127 + 127); // 밝은 색상을 위해 127 이상 값 사용
            const g = Math.floor(Math.random() * 127 + 127);
            const b = Math.floor(Math.random() * 127 + 127);
            const rgb = `rgb(${r}, ${g}, ${b})`;

            return {
              id: item.recrutPblntSn,
              institution: item.instNm,
              title: item.recrutPbancTtl,
              field: item.ncsCdNmLst,
              region: item.workRgnNmLst,
              experience: item.acbgCondNmLst,
              expireDate: String(item.decimalDay).replace("-", ""),
              url: item.srcUrl,
              color: rgb,
            };
          });
          setSearchResult(processedData);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Style>
      {/* 필터 */}
      <h1>필터</h1>
      <div className="filter">
        <div className="top">
          {/* 고용 형태 */}
          <Autocomplete
            multiple
            options={employmentTypes}
            getOptionLabel={(option) => option.label}
            sx={{ width: 300 }}
            value={employmentTypeValues}
            onChange={(event, newValue) => setEmploymentTypeValues(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="고용 형태" placeholder="" />
            )}
          />

          {/* 근무지 */}
          <Autocomplete
            multiple
            options={workRegions}
            getOptionLabel={(option) => option.label}
            sx={{ width: 300 }}
            value={workRegionValues}
            onChange={(event, newValue) => setWorkRegionValues(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="근무지" placeholder="" />
            )}
          />
          {/* 채용 분야 */}
          <Autocomplete
            multiple
            options={recruitmentFields}
            getOptionLabel={(option) => option.label}
            sx={{ width: 300 }}
            value={recruitmentFieldValues}
            onChange={(event, newValue) => setRecruitmentFieldValues(newValue)}
            renderInput={(params) => (
              <TextField
                id="tf-searchTitle"
                {...params}
                label="채용 분야"
                placeholder=""
              />
            )}
          />
        </div>
        <div className="bottom">
          <TextField
            id="outlined-basic"
            label="공시 제목"
            variant="outlined"
            value={searchTitle}
            onChange={(event) => {
              setSearchTitle(event.target.value);
            }}
            sx={{ width: 500, alignSelf: "center" }}
          />

          <div className="button-wrapper">
            <IconButton
              color="primary"
              size="large"
              onClick={() => {
                document
                  .querySelectorAll(".MuiAutocomplete-clearIndicator")
                  .forEach((button) => button.click());
                setSearchTitle("");
              }}
            >
              <CloseIcon />
            </IconButton>
            <IconButton
              color="primary"
              size="large"
              onClick={() => {
                fetchData(
                  employmentTypeValues,
                  workRegionValues,
                  recruitmentFieldValues,
                  searchTitle
                );
              }}
            >
              <SearchIcon />
            </IconButton>
          </div>
        </div>
      </div>

      {/* 페이지 선택 */}
      <Pagination
        count={Math.ceil(dataCount / 20)}
        color="primary"
        style={{ alignSelf: "flex-end" }}
        onChange={handlePageChange}
        page={page}
      />

      {/* 검색 결과 */}
      {dataCount > 0 ? (
        <div className="search-job">
          {searchResult.map((result, index) => {
            return (
              <Card
                className="job-card"
                key={index}
                sx={{ maxWidth: 345 }}
                onClick={() => {
                  navigate(`/detail?id=${result.id}`, { state: { result } });
                }}
              >
                <CardContent className="job-card-content">
                  <div
                    id="card-banner"
                    style={{ backgroundColor: result.color }}
                  >
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ fontWeight: "bold" }}
                    >
                      {result.institution}
                    </Typography>
                    <Typography
                      id="expireDate"
                      gutterBottom
                      variant="h5"
                      component="div"
                    >
                      D-{result.expireDate}
                    </Typography>
                  </div>

                  <Typography
                    id="truncate2"
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    {result.title}
                  </Typography>
                  <Typography
                    id="truncate1"
                    variant="body2"
                    sx={{ color: "text.secondary", marginBottom: "3px" }}
                  >
                    <span>분야:</span> {result.field}
                  </Typography>
                  <Typography
                    id="truncate1"
                    variant="body2"
                    sx={{ color: "text.secondary", marginBottom: "3px" }}
                  >
                    <span>지역:</span> {result.region}
                  </Typography>
                  <Typography
                    id="truncate1"
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    <span>경력:</span> {result.experience}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <h1>검색 결과가 없습니다.</h1>
      )}

      {/* 페이지 선택 */}
      <Pagination
        count={Math.ceil(dataCount / 20)}
        color="primary"
        style={{ alignSelf: "flex-end", marginBottom: "60px" }}
        onChange={handlePageChange}
        page={page}
      />
    </Style>
  );
};

export default Main;
