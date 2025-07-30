import { pool } from "../db.config.js";

export const saveReview = async (review) => {
  const conn = await pool.getConnection();

  try {
    const [result] = await conn.query(
      `INSERT INTO review (member_id, store_id, body, score) 
       VALUES (?, ?, ?, ?);`,
      [review.memberId, review.storeId, review.body, review.score]
    );

    return result.insertId; // 생성된 리뷰의 ID 반환
  } catch (err) {
    console.error("리뷰 저장 중 오류:", err);
    throw new Error("리뷰를 저장하는 중 오류가 발생했습니다.");
  } finally {
    conn.release();
  }
};
