const express = require("express");
var cors = require("cors");
const app = express();
const axios = require("axios");
const pdfParse = require("pdf-parse");
const openAiApi = require("openai");
const openAiKey = require("./secret.json");
const port = 3000; // 서버가 실행될 포트 번호

app.use(cors());

// OpenAI API 키를 설정
const openai = new openAiApi({
  apiKey: openAiKey.apiKey
});

// 기본 라우트 설정
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// ChatGPT에게 PDF 내용 전송하고 답변 받기
const askChatGPT = async (pdfText) => {};

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
    // 여기까지 정상

    try {
      // ChatGPT API에 텍스트를 전송하여 질문
      const chatGptResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // 사용할 모델
        messages: [
          {
            role: "system",
            content:
              "너는 공공기관 채용 공고를 분석하여 지원자에게 지원 전략을 세워주는 전략가 역할이야. 대답은 공식적이고 전문적으로 해줘.",
          },
          {
            role: "user",
            content: `이것은 공공기관의 채용 공고야:\n\n${extractedText}\n\n이것을 바탕으로 기관의 기대에 부합하는 역량을 강조하는 방법, 어필할 경험, 추가 준비사항에 대한 추천 사항과 예상 면접 질문, 핵심 역량, 직무에 대한 적합성을 효과적으로 표현할 수 있는 전략을 포함한 면접 준비 요령 등을 조언해줘.`,
          },
        ],
      });
      console.log("답변 >>", chatGptResponse.choices[0].message.content);

      res.set("Content-Type", "text/plain");
      res.send(chatGptResponse.choices[0].message.content);
    } catch (error) {
      console.error("Error asking ChatGPT:", error);
    }
  } catch (error) {
    console.error("Error downloading file:", error.response?.data);
    res.status(500).send("Failed to download file");
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
