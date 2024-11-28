import { pool } from "../db.config.js";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // 로그 옵션
});

// User 데이터 삽입

export const addUser = async (data) => {
  try {
    // 이메일 중복 확인
    const user = await prisma.member.findFirst({ where: { email: data.email } });
    if (user) {
      return null; // 이미 존재하는 이메일일 경우 null 반환
    }

    console.log("데이터 확인:", data);
    const kstDate = new Date(new Date().getTime() + (9 * 60 * 60 * 1000)); // KST로 변환
    // Prisma를 이용해 새 사용자 생성

    const created = await prisma.member.create({
      data: {
        name: data.name,
        gender: data.gender,
        age: data.age,
        address: data.address,
        spec_address: data.spec_address,
        status: data.status || 'inactive', // 기본값 설정
        inactive_date: data.inactive_date || null, // null 처리
        social_type: data.social_type,
        created_at: kstDate,
        updated_at: kstDate,
        email: data.email,
        point: data.point,
      },
    });

    return Number(created.id); // 삽입된 사용자 ID 반환
  } catch (err) {
    throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`);
  }
};

// 사용자 정보 얻기
// 사용자 정보 얻기
export const getUser = async (userId) => {
  try {
    // Prisma를 이용해 사용자 정보 조회
    const user = await prisma.member.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return null; // 사용자가 존재하지 않으면 null 반환
    }

    return user;
  } catch (err) {
    throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`);
  }
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
  try {
    // Prisma를 이용해 사용자 선호 카테고리 생성
    await prisma.member_prefer.create({
      data: {
        category_id: foodCategoryId,
        member_id: userId,
        created_at:new Date(),
        updated_at:new Date(),
      },
    });

    return;
  } catch (err) {
    throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`);
  }
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  try {
    // Prisma를 이용해 사용자 선호 카테고리 조회
    const preferences = await prisma.member_prefer.findMany({
      where: { member_id: userId },
      include: {
        food_category: {
          select: { name: true }, // foodCategory 테이블의 name 필드만 조회
        },
      },
      orderBy: {
        category_id: 'asc', // category_id 기준으로 오름차순 정렬
      },
    });

    
    return preferences.map((pref) => ({
      id: pref.id,
      foodCategoryId: pref.category_id,
      categoryName: pref.food_category.name, // food_category 테이블에서 name을 가져옵니다
    }));
  } catch (err) {
    throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err.message})`);
  }
};
