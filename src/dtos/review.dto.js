export const bodyToReview = (body, missionId) => {
  const review = {
    missionId: parseInt(missionId, 10) || null,
    memberId: parseInt(body.member_id, 10) || null,
    storeId: parseInt(body.store_id, 10) || null,
    body: body.body || null,
    score: parseFloat(body.score) || null
  };

  console.log("파싱된 리뷰 데이터:", review);
  return review;
};
