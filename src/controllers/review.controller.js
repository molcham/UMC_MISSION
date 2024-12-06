import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { addReview } from "../services/review.service.js";

export const handleAddReview = async (req, res, next) => {


  /*
  #swagger.summary = '리뷰 작성 API';
  #swagger.description = '사용자가 특정 가게에 대한 리뷰를 작성합니다.';
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            member_id: { type: "integer", example: 3, description: "리뷰 작성자의 회원 ID" },
            store_id: { type: "integer", example: 1, description: "리뷰 대상 가게의 ID" },
            body: { type: "string", example: "닭반마리 존맛", description: "리뷰 내용" },
            score: { type: "number", format: "float", example: 8, description: "리뷰 점수 (1~10 사이)" }
          },
          required: ["member_id", "store_id", "body", "score"]
        }
      }
    }
  };
  #swagger.responses[201] = {
    description: "리뷰 작성 성공 응답",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            result: {
              type: "object",
              properties: {
                id: { type: "integer", example: 42, description: "생성된 리뷰의 고유 ID" },
                member_id: { type: "integer", example: 3 },
                store_id: { type: "integer", example: 1 },
                body: { type: "string", example: "닭반마리 존맛" },
                score: { type: "number", format: "float", example: 8 }
              }
            }
          }
        }
      }
    }
  };
  #swagger.responses[400] = {
    description: "리뷰 작성 실패 응답 (잘못된 요청 데이터)",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error: { type: "string", example: "Invalid input data" }
          }
        }
      }
    }
  };
  #swagger.responses[500] = {
    description: "리뷰 작성 실패 응답 (서버 오류)",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error: { type: "string", example: "리뷰 작성 중 오류가 발생했습니다." }
          }
        }
      }
    }
  };
*/

  console.log("리뷰 작성 요청이 들어왔습니다!");
  console.log("body:", req.body);

  try {
    const review = await addReview(bodyToReview(req.body, req.params.mission_id));
    res.status(StatusCodes.CREATED).json({ result: review });
  } catch (error) {
    console.error("리뷰 작성 중 오류:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "리뷰 작성 중 오류가 발생했습니다." });
  }
};
