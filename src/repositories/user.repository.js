import { pool } from "../db.config.js";

// User 데이터 삽입
// User 데이터 삽입
export const addUser = async (data) => {  
  
  const conn = await pool.getConnection();

  try {
    // 이메일 중복 확인
    const [confirm] = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM member WHERE email = ?) as isExistEmail;`,
      data.email
    );

    if (confirm[0].isExistEmail) {
      return null;
    }

    console.log("데이터 확인:",data);
    console.log(
      `INSERT INTO member ... VALUES (${data.status}, ${data.spec_address}, ${data.age},${data.point},${data.social_type}${data.inactive_date} ...`
  );
  


    // 회원가입 시 필요한 데이터 삽입
    const [result] = await pool.query(
      `INSERT INTO member (name, gender, age, address, spec_address, status, inactive_date, social_type, created_at, updated_at, email, point) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?, ?);`,
      [
        data.name,
        data.gender,
        //parseInt(data.age, 10) || null,
        data.age,
        data.address,
        data.spec_address,
        data.status || 'inactive',
        data.inactive_date || null,  // inactive_date는 없을 경우 null 처리
        data.social_type,
        data.email,
        //parseInt(data.point,10) || 0
        data.point
      ]
    );

    return result.insertId;  // 삽입된 사용자 ID 반환, sql내장 기능
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [user] = await pool.query(`SELECT * FROM member WHERE id = ?;`, userId);

    console.log(user);

    if (user.length == 0) {
      return null;
    }

    return user;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
  const conn = await pool.getConnection();

  try {
    await pool.query(
      `INSERT INTO member_prefer (category_id, member_id, created_at, updated_at) VALUES (?, ?, NOW(), NOW());`,
      [foodCategoryId, userId]
    );

    return;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [preferences] = await pool.query(
      `SELECT
        mp.id AS preference_id,
        mp.member_id AS user_id,
        mp.category_id AS food_category_id,
        fc.name AS category_name
       FROM
         member_prefer mp
       JOIN
         food_category fc
       ON
        mp.category_id =fc.id
       WHERE
         mp.member_id = ?
       ORDER BY
         mp.category_id ASC;`,
      [userId]
    );

    return preferences;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};
