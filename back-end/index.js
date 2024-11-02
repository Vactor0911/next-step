const express = require("express");
var cors = require("cors");
const app = express();
const axios = require("axios");
const pdfParse = require("pdf-parse");
const openAiApi = require("openai");
const port = 3000; // 서버가 실행될 포트 번호

app.use(cors());

// OpenAI API 키를 설정\
const openai = new openAiApi({
  apiKey: "",
});

// 기본 라우트 설정
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// ChatGPT에게 PDF 내용 전송하고 답변 받기
const askChatGPT = async (pdfText) => {
  try {
    // ChatGPT API에 텍스트를 전송하여 질문
    const chatGptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // 사용할 모델
      messages: [
        {
          role: "system",
          content: "너는 공공기관 채용 공고를 분석하여 요약 정리하는 역할이야.",
        },
        {
          role: "user",
          content: `이것은 PDF 파일의 텍스트를 추출한 결과야:\n\n${pdfText}\n\n이것을 바탕으로 다음 내용들을 요약 정리해줘.\n\n1.주요 업무\n2. 자격요건\n3. 우대사항\n4. 모집분야 및 인원\n5. 전형절차 및 일정\n6. 근무조건\n\n단, 이 중에서 알 수 없는 내용은 "데이터를 분석하지 못했습니다." 라는 텍스트로 대체해줘.`,
        },
      ],
    });
    console.log("답변 >>", chatGptResponse.choices[0].message.content);
  } catch (error) {
    console.error("Error asking ChatGPT:", error);
  }
};

// PDF 다운로드 라우트 설정
app.get("/download", async (req, res) => {
  try {
    console.log("파일 다운로드 시작");

    // URLSearchParams 객체를 통해 쿼리 속성 분리
    const queryParams = new URLSearchParams(req.url);
    console.log(queryParams);
    const downloadUrl = queryParams.get("/download?url");
    console.log(`다운로드 URL: ${downloadUrl}`);

    // PDF 파일을 다운로드
    const response = await axios.get(downloadUrl, {
      responseType: "arraybuffer", // 파일을 바이너리 데이터로 받아옵니다.
    });

    // 다운로드한 PDF 데이터를 메모리에 저장
    const pdfData = response.data;

    // pdf-parse를 사용하여 텍스트 추출
    const pdfText = await pdfParse(pdfData);
    const extractedText = pdfText.text; // 추출된 텍스트
    //console.log(extractedText);
    // 여기까지 정상

    askChatGPT(extractedText); // ChatGPT에게 질문하기
  } catch (error) {
    console.error("Error downloading file:", error.response?.data);
    res.status(500).send("Failed to download file");
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
