import { saveReview } from "../repositories/review.repository.js";

export const addReview = async (review) => {
  if (!review.missionId || !review.memberId || !review.storeId || !review.body || !review.score) {
    throw new Error("필수 리뷰 데이터를 모두 입력해야 합니다.");
  }

  const reviewId = await saveReview(review); // 리뷰 저장
  return { id: reviewId, ...review }; // 생성된 리뷰 데이터 반환
};

