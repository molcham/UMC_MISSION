import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import bodyParser from 'body-parser';
import { handleUserSignUp } from "./controllers/user.controller.js";
import { handleAddReview } from "./controllers/review.controller.js";                   

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/signup",(req,res)=>{
  res.send("회원가입 페이지");
});

app.get("/missions/:mission_id/review",(req,res)=>{
  const missionId = req.params.mission_id;
  res.send(`미션번호 ${missionId} 리뷰남기는 중`);
  //백틱으로 감싸는거 템플릿 리터럴 !문자열 삽입,줄바꿈 지원 ,표현식 사용
});



app.post("/signup", handleUserSignUp);
app.post('/missions/:mission_id/review',handleAddReview);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});