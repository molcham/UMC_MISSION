import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  /*
  #swagger.summary = '회원 가입 API';
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: { type: "string", example: "fil@example.com" },
            name: { type: "string", example: "졸리다" },
            gender: { type: "string", example: "female" },
            age: { type: "integer", example: 22 },
            address: { type: "string", example: "123 Main Street" },
            spec_address: { type: "string", example: "122동1105호" },
            status: { type: "string", example: "active" },
            inactive_date: { type: "string", format: "date-time", example: "2024-12-31T23:59:59.000Z" },
            social_type: { type: "string", example: "google" },
            point: { type: "integer", example: 100 },
            preferences: { 
              type: "array", 
              items: { type: "integer", example: 3 } 
            }
          },
          required: ["email", "name", "gender", "age", "address", "status"]
        }
      }
    }
  };
  #swagger.responses[200] = {
    description: "회원 가입 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "SUCCESS" },
            error: { type: "object", nullable: true, example: null },
            success: {
              type: "object",
              properties: {
                email: { type: "string", example: "fil@example.com" },
                name: { type: "string", example: "졸리다" },
                preferCategory: { 
                  type: "array", 
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", example: "1" },
                      foodCategoryId: { type: "string", example: "10" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "회원 가입 실패 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            resultType: { type: "string", example: "FAIL" },
            error: {
              type: "object",
              properties: {
                errorCode: { type: "string", example: "U001" },
                reason: { type: "string", example: "Invalid input data" },
                data: { type: "object", example: { field: "email", message: "Invalid email format" } }
              }
            },
            success: { type: "object", nullable: true, example: null }
          }
        }
      }
    }
  };
*/
  
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
