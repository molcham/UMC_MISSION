import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  console.log("회원가입을 요청했습니다!");
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

  try {
    // bodyToUser를 통해 요청 body를 user 객체로 변환
    const user = await userSignUp(bodyToUser(req.body));
    console.log("userSignUp 반환 데이터:", user); // userSignUp 결과
    console.log("회원가입이 완료되었습니다!");

    // user가 BigInt를 포함할 경우, Number로 변환하여 응답
    const responseUser = {
      ...user,
      age:user.age.toString(),
      point:user.point.toString(),
      preferCategory:user.preferCategory.map((pref) => ({
        ...pref,
        id:pref.id.toString(),
        foodCategoryId:pref.foodCategoryId.toString(),
      })),     
    };

    res.status(StatusCodes.OK).success(responseUser);
  } catch (err) {
    console.error("회원가입 실패:", err);
    next(err); // 오류가 발생하면 에러 핸들러로 넘기기
  }
};
