export const bodyToUser = (body) => {
  const user = {
    email: body.email || null, // 이메일 값이 없으면 null
    name: body.name || null, // 이름 값이 없으면 null
    gender: body.gender || null, // 성별 값이 없으면 null
    age: parseInt(body.age, 10) || null, // age는 숫자로 변환, 없으면 null
    address: body.address || null, // 주소 값이 없으면 null
    spec_address: body.spec_address || null, // 상세 주소 값이 없으면 null
    status: body.status || "inactive", // status 기본값 "inactive"
    inactive_date: body.inactive_date || null, // inactive_date가 없으면 null
    social_type: body.social_type || null, // social_type이 없으면 null
    point: parseInt(body.point, 10) || 0, // point는 숫자로 변환, 없으면 0
    preferences: body.preferences || [], // preferences 배열이 없으면 빈 배열
  };

  console.log("파싱된 user 데이터:", user); // 디버깅용 로그 추가

  return user;
};


export const responseFromUser = ({ user, preferences }) => {
  const userInfo = user[0];

  return {
    id: userInfo.id,
    email: userInfo.email,
    name: userInfo.name,
    gender: userInfo.gender,
    birth: userInfo.birth,
    address: userInfo.address,
    detailAddress: userInfo.detail_address,
    phoneNumber: userInfo.phone_number,
    preferences: preferences.map((pref) => ({
      id: pref.id,
      foodCategoryId: pref.food_category_id,
      categoryName: pref.name,
    })),
  };
};
