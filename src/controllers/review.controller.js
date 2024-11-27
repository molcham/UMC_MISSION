import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { addReview } from "../services/review.service.js";

export const handleAddReview = async (req, res, next) => {
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
