import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./db.config.js";

dotenv.config();

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/oauth2/callback/google",
    scope: ["email", "profile"],
    state: true,
  },
  (accessToken, refreshToken, profile, cb) => {
    return googleVerify(profile)
      .then((member) => cb(null, member))
      .catch((err) => cb(err));
  }
);
const googleVerify = async (profile) => {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new Error(`profile.email was not found: ${JSON.stringify(profile)}`);
    }
  
    const member = await prisma.member.findFirst({ where: { email } });
    if (member !== null) {
      return { id: member.id, email: member.email, name: member.name };
    }
    const kstDate = new Date(new Date().getTime() + (9 * 60 * 60 * 1000)); // KST로 변환
  
    const created = await prisma.member.create({
      data: {
        name: profile.displayName || "Unknown",
        gender: null,
        age: null,
        address: null,
        spec_address: null,
        status: "inactive", // 기본값 설정
        inactive_date: null, // null 처리
        social_type:"google",
        created_at: kstDate,
        updated_at: kstDate,
        email:email,
        point: 0,
      },
    });
  
    return { id: created.id, email: created.email, name: created.name };
  };