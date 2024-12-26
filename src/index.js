import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import bodyParser from 'body-parser';
import { handleUserSignUp } from "./controllers/user.controller.js";
import { handleAddReview } from "./controllers/review.controller.js";                   
import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import session from "express-session";
import passport from "passport";
import { googleStrategy } from "./auth.config.js";
import { prisma } from "./db.config.js";
//import { PrismaClient } from '@prisma/client';


dotenv.config();

// BigInt 처리 함수
function handleBigInt(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}


passport.use(googleStrategy);
//내가 정의한 로그인 방식을 등록하는 코드
passport.serializeUser((member, done) =>{ 
  const safeMember = handleBigInt(member);
  done(null, safeMember)
});

passport.deserializeUser((member, done) =>{ 
  const safeMember = handleBigInt(member);
  done(null, safeMember)
});
const app = express();


app.use(cors()); // cors 방식 허용
app.use(express.static("public")); // 정적 파일 접근
app.use(express.json()); // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(bodyParser.json());



const port = process.env.PORT;

app.use(
  "/docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup({}, {
    swaggerOptions: {
      url: "/openapi.json",
    },
  })
);




app.use((req,res,next) => {
  res.success = (success) => {
    return res.json({ resultType: "SUCCESS", error:null, success});
  };

  res.error =({ errorCode = "unknown", reason =null, data =null}) => {
  return res.json({
    resultType: "FAIL",
    error: { errorCode, reason, data },
    success: null,
  });
};

next();
});




app.get("/openapi.json", async (req, res, next) => {
  // #swagger.ignore = true
  const options = {
    openapi: "3.0.0",
    disableLogs: true,
    writeOutputFile: false,
  };
  const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
  const routes = ["./src/index.js"];
  const doc = {
    info: {
      title: "UMC 7th",
      description: "UMC 7th Node.js 테스트 프로젝트입니다.",
    },
    host: "localhost:3000",
  };

  const result = await swaggerAutogen(options)(outputFile, routes, doc);
  res.json(result ? result.data : null);
});


/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }


  res.status(err.statusCode || 500).error({
    errorCode: err.errorCode || "unknown",
    reason: err.reason || err.message || null,
    data: err.data || null,
  });
});


app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // ms
      serializer: {
        stringify:(obj)=> JSON.stringify(obj,(key,value)=>
         typeof value === "bigint" ? value.toString() : value 
      ), 
      parse: (str) => JSON.parse(str, (key,value) =>
        /^\d+n$/.test(value) ? BigInt(value) : value
      ),
      },
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.authenticate("google", (err, user, info) => {
  if (err) return next(err);
  if (!user) return res.redirect("/login");
  req.logIn(user, (err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

app.get("/oauth2/login/google", passport.authenticate("google"));
app.get(
  "/oauth2/callback/google",
  passport.authenticate("google", {
    failureRedirect: "/oauth2/login/google",
    failureMessage: true,
  }),
  (req, res) => {

    const sessionData = handleBigint({
      userId: req.user.id,
      email: req.user.email,
    });


    console.log("Session data size:", JSON.stringify(sessionData).length);


    
    res.redirect("/");
  }
);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/*app.get("/", (req, res) => {
  // #swagger.ignore = true
  console.log(req.user);
  res.send("Hello World!");
}); */

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    const safeUser = handleBigInt(req.user);
    res.json(safeUser);
  } else {
    res.redirect("/oauth2/login/google");
  }
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
