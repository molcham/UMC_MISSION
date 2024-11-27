import { responseFromUser } from "../dtos/user.dto.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";

//5주차 실습 코드 

export const userSignUp = async (data) => {
  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    gender: data.gender,
    age:data.age,
    address: data.address,
    spec_address: data.spec_address,
    status: data.status,
    inactive_date: data.inactive_date,
    social_type: data.social_type,
    point:data.point
  });

  if (joinUserId === null) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  if(Array.isArray(data.preferences)){
    for(const preference of data.preferences){
      //각 선호 카테고리를 'member_prefer'에 저장
       await setPreference(joinUserId,preference);
    }
  }else{
    throw new Error("선호 카테고리 데이터 형식이 올바르지 않습니다.")
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};