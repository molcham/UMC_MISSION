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
  const preferFoods = preferences.map((pref) => ({
    id: pref.id,
    foodCategoryId: pref.foodCategoryId,
    categoryName: pref.categoryName,
  }));

  return {
    email: user.email,
    name: user.name,
    gender: user.gender,
    age:user.age,
    address: user.address,
    spec_adress:user.spec_address,
    status:user.status,
    inactive_date:user.inactive_date,
    point:user.point,
    preferCategory: preferFoods,
  };
};

