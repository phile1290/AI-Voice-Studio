
import { Language, AgeGroup, VoiceGender, VoiceProfile, RegionalAccent } from "./types";

export const GEMINI_TTS_MODEL = 'gemini-3.1-flash-tts-preview';

// Mapping vùng miền sang Prompt chỉ dẫn cụ thể
// CẬP NHẬT QUAN TRỌNG: Thêm "Native Vietnamese" để tránh bị lơ lớ
export const ACCENT_PROMPTS: Record<Language, Record<RegionalAccent, string>> = {
  [Language.VI]: {
    [RegionalAccent.NORTH]: "Speak fluent, native Vietnamese with a standard Northern accent (Hanoi style). Pronounce tones precisely and clearly. DO NOT speak English.",
    [RegionalAccent.CENTRAL]: "Speak fluent, native Vietnamese with a distinctive Central accent (Hue/Danang style). Maintain clear articulation. DO NOT speak English.",
    [RegionalAccent.SOUTH]: "Speak fluent, native Vietnamese with a Southern accent (Saigon style). Sound soft, natural, and smooth. DO NOT speak English."
  },
  [Language.EN]: {
    [RegionalAccent.NORTH]: "Speak fluent, native English with a standard US accent. Pronounce precisely. DO NOT speak Vietnamese.",
    [RegionalAccent.CENTRAL]: "Speak fluent, native English with a standard UK accent. Pronounce precisely. DO NOT speak Vietnamese.",
    [RegionalAccent.SOUTH]: "Speak fluent, native English with an Australian accent. Pronounce precisely. DO NOT speak Vietnamese."
  }
};

// 24 NHÂN VẬT (PERSONAS) - MỖI NHÓM 4 TÊN GỌI CỤ THỂ
// CẬP NHẬT: Thêm "Pronounce"
export const VOICE_PROFILES: VoiceProfile[] = [
  // ==============================
  // 1. BÉ TRAI (4 NHÂN VẬT)
  // ==============================
  {
    id: 'boy-bo',
    name: 'Puck',
    displayName: 'Bé Bo',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.CHILD,
    language: Language.VI,
    description: 'Giọng sáng, thông minh, lớp trưởng gương mẫu.',
    tone: 'Thông minh & Rõ ràng',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '+40%',
    edgeRate: '+10%'
  },
  {
    id: 'boy-bin',
    name: 'Puck',
    displayName: 'Bé Bin',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.CHILD,
    language: Language.VI,
    description: 'Giọng nghịch ngợm, to mồm, hay cười đùa.',
    tone: 'Nghịch ngợm & Ồn ào',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '+40%',
    edgeRate: '+10%'
  },
  {
    id: 'boy-ti',
    name: 'Puck',
    displayName: 'Bé Tí',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.CHILD,
    language: Language.VI,
    description: 'Giọng nhỏ nhẹ, hơi nhút nhát, đáng yêu.',
    tone: 'Nhỏ nhẹ & Nhút nhát',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '+40%',
    edgeRate: '+10%'
  },
  {
    id: 'boy-teo',
    name: 'Puck',
    displayName: 'Bé Tèo',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.CHILD,
    language: Language.VI,
    description: 'Giọng diễn cảm, nhấn nhá, thích kể chuyện.',
    tone: 'Kể chuyện & Diễn cảm',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '+40%',
    edgeRate: '+10%'
  },

  // ==============================
  // 2. BÉ GÁI (4 NHÂN VẬT)
  // ==============================
  {
    id: 'girl-bong',
    name: 'Kore',
    displayName: 'Bé Bống',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.CHILD,
    language: Language.VI,
    description: 'Giọng điệu đà, công chúa, nũng nịu.',
    tone: 'Điệu đà & Nũng nịu',
    edgeVoice: 'vi-VN-HoaiMyNeural',
    edgePitch: '+30%',
    edgeRate: '+10%'
  },
  {
    id: 'girl-na',
    name: 'Kore',
    displayName: 'Bé Na',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.CHILD,
    language: Language.VI,
    description: 'Giọng ngoan ngoãn, vâng lời, ngọt ngào.',
    tone: 'Ngoan & Ngọt ngào',
    edgeVoice: 'vi-VN-HoaiMyNeural',
    edgePitch: '+30%',
    edgeRate: '+10%'
  },
  {
    id: 'girl-soc',
    name: 'Kore',
    displayName: 'Bé Sóc',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.CHILD,
    language: Language.VI,
    description: 'Giọng lanh lợi, nói nhanh, hoạt bát.',
    tone: 'Lanh lợi & Hoạt bát',
    edgeVoice: 'vi-VN-HoaiMyNeural',
    edgePitch: '+30%',
    edgeRate: '+10%'
  },
  {
    id: 'girl-mit',
    name: 'Kore',
    displayName: 'Bé Mít',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.CHILD,
    language: Language.VI,
    description: 'Giọng hơi buồn, mếu máo, cần dỗ dành.',
    tone: 'Mè nheo & Cảm xúc',
    edgeVoice: 'vi-VN-HoaiMyNeural',
    edgePitch: '+30%',
    edgeRate: '+10%'
  },

  // ==============================
  // 3. NỮ TRUNG NIÊN (4 NHÂN VẬT)
  // ==============================
  {
    id: 'woman-mai',
    name: 'Zephyr',
    displayName: 'Cô Mai',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.ADULT,
    language: Language.VI,
    description: 'Giọng MC Thời sự, chuẩn mực, tin cậy.',
    tone: 'Chuyên nghiệp & Tin cậy',
    edgeVoice: 'vi-VN-HoaiMyNeural',
    edgePitch: '+5%',
    edgeRate: '+10%'
  },
  {
    id: 'woman-lan',
    name: 'Zephyr',
    displayName: 'Cô Lan',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.ADULT,
    language: Language.VI,
    description: 'Giọng tâm tình, nhẹ nhàng, thủ thỉ.',
    tone: 'Dịu dàng & Thủ thỉ',
    edgeVoice: 'vi-VN-HoaiMyNeural',
    edgePitch: '+5%',
    edgeRate: '+10%'
  },
  {
    id: 'woman-truc',
    name: 'Zephyr',
    displayName: 'Cô Trúc',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.ADULT,
    language: Language.VI,
    description: 'Giọng bán hàng, sôi nổi, năng lượng cao.',
    tone: 'Sôi nổi & Tự tin',
    edgeVoice: 'vi-VN-HoaiMyNeural',
    edgePitch: '+5%',
    edgeRate: '+10%'
  },
  {
    id: 'woman-my',
    name: 'Zephyr',
    displayName: 'Cô My',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.ADULT,
    language: Language.VI,
    description: 'Giọng đọc truyện, giàu cảm xúc, nghệ sĩ.',
    tone: 'Cảm xúc & Nghệ sĩ',
    edgeVoice: 'vi-VN-HoaiMyNeural',
    edgePitch: '+5%',
    edgeRate: '+10%'
  },

  // ==============================
  // 4. NAM TRUNG NIÊN (4 NHÂN VẬT)
  // ==============================
  {
    id: 'man-tuan',
    name: 'Charon',
    displayName: 'Chú Tuấn',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.ADULT,
    language: Language.VI,
    description: 'Giọng chính luận, trầm ổn, nghiêm túc.',
    tone: 'Nghiêm túc & Trầm ổn',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },
  {
    id: 'man-hung',
    name: 'Fenrir',
    displayName: 'Chú Hùng',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.ADULT,
    language: Language.VI,
    description: 'Giọng uy quyền, mạnh mẽ, lãnh đạo.',
    tone: 'Uy quyền & Mạnh mẽ',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },
  {
    id: 'man-minh',
    name: 'Charon',
    displayName: 'Chú Minh',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.ADULT,
    language: Language.VI,
    description: 'Giọng vui vẻ, hài hước, thân thiện.',
    tone: 'Vui vẻ & Hài hước',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },
  {
    id: 'man-quang',
    name: 'Charon',
    displayName: 'Chú Quang',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.ADULT,
    language: Language.VI,
    description: 'Giọng ấm áp, sâu lắng, phát thanh viên đêm khuya.',
    tone: 'Ấm áp & Sâu lắng',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '-10%',
    edgeRate: '-5%'
  },

  // ==============================
  // 5. NAM CAO TUỔI (4 NHÂN VẬT)
  // ==============================
  {
    id: 'grandpa-ba',
    name: 'Fenrir',
    displayName: 'Ông Ba',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.SENIOR,
    language: Language.VI,
    description: 'Giọng hiền từ, chậm rãi, nhân hậu.',
    tone: 'Hiền từ & Chậm rãi',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },
  {
    id: 'grandpa-bay',
    name: 'Fenrir',
    displayName: 'Ông Bảy',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.SENIOR,
    language: Language.VI,
    description: 'Giọng nghiêm khắc, gia trưởng, cứng rắn.',
    tone: 'Nghiêm khắc & Cứng',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },
  {
    id: 'grandpa-chin',
    name: 'Fenrir',
    displayName: 'Ông Chín',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.SENIOR,
    language: Language.VI,
    description: 'Giọng yếu ớt, run rẩy, rất già.',
    tone: 'Yếu ớt & Run rẩy',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },
  {
    id: 'grandpa-muoi',
    name: 'Fenrir',
    displayName: 'Ông Mười',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.SENIOR,
    language: Language.VI,
    description: 'Giọng vang, hào sảng, kể chuyện xưa.',
    tone: 'Hào sảng & Vang',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },

  // ==============================
  // 6. NỮ CAO TUỔI (4 NHÂN VẬT)
  // ==============================
  {
    id: 'grandma-tu',
    name: 'Zephyr',
    displayName: 'Bà Tư',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.SENIOR,
    language: Language.VI,
    description: 'Giọng phúc hậu, ấm áp, cười hiền.',
    tone: 'Phúc hậu & Ấm áp',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },
  {
    id: 'grandma-sau',
    name: 'Zephyr',
    displayName: 'Bà Sáu',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.SENIOR,
    language: Language.VI,
    description: 'Giọng kể chuyện cổ tích, huyền bí.',
    tone: 'Huyền bí & Cổ tích',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },
  {
    id: 'grandma-tam',
    name: 'Zephyr',
    displayName: 'Bà Tám',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.SENIOR,
    language: Language.VI,
    description: 'Giọng sôi nổi, hay buôn chuyện, nhanh nhảu.',
    tone: 'Sôi nổi & Nhanh',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },
  {
    id: 'grandma-hai',
    name: 'Zephyr',
    displayName: 'Bà Hai',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.SENIOR,
    language: Language.VI,
    description: 'Giọng khó tính, xét nét, lạnh lùng.',
    tone: 'Khó tính & Lạnh',
    edgeVoice: 'vi-VN-NamMinhNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },
  // ==============================
  // ENGLISH CHARACTERS (24 PERSONAS)
  // ==============================
  {
    id: 'en-boy-leo',
    name: 'Puck',
    displayName: 'Bé Leo',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.CHILD,
    language: Language.EN,
    description: 'Giọng sáng, thông minh, phát âm tiếng Anh chuẩn xác.',
    tone: 'Thông minh & Rõ ràng',
    edgeVoice: 'en-US-AnaNeural',
    edgePitch: '+10%',
    edgeRate: '+10%'
  },
  {
    id: 'en-boy-sam',
    name: 'Puck',
    displayName: 'Bé Sam',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.CHILD,
    language: Language.EN,
    description: 'Giọng nghịch ngợm, to mồm, năng động.',
    tone: 'Nghịch ngợm & Ồn ào',
    edgeVoice: 'en-US-AnaNeural',
    edgePitch: '+10%',
    edgeRate: '+10%'
  },
  {
    id: 'en-boy-tom',
    name: 'Puck',
    displayName: 'Bé Tom',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.CHILD,
    language: Language.EN,
    description: 'Giọng nhỏ nhẹ, hơi nhút nhát.',
    tone: 'Nhỏ nhẹ & Nhút nhát',
    edgeVoice: 'en-US-AnaNeural',
    edgePitch: '+10%',
    edgeRate: '+10%'
  },
  {
    id: 'en-boy-ben',
    name: 'Puck',
    displayName: 'Bé Ben',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.CHILD,
    language: Language.EN,
    description: 'Giọng diễn cảm, thích kể chuyện bằng tiếng Anh.',
    tone: 'Kể chuyện & Diễn cảm',
    edgeVoice: 'en-US-AnaNeural',
    edgePitch: '+10%',
    edgeRate: '+10%'
  },
  {
    id: 'en-girl-lily',
    name: 'Kore',
    displayName: 'Bé Lily',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.CHILD,
    language: Language.EN,
    description: 'Giọng ngọt ngào, điệu đà, dễ thương.',
    tone: 'Ngọt ngào & Điệu đà',
    edgeVoice: 'en-US-AnaNeural',
    edgePitch: '+20%',
    edgeRate: '+5%'
  },
  {
    id: 'en-girl-mia',
    name: 'Kore',
    displayName: 'Bé Mia',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.CHILD,
    language: Language.EN,
    description: 'Giọng ngoan ngoãn, vâng lời.',
    tone: 'Ngoan ngoãn & Dịu dàng',
    edgeVoice: 'en-US-AnaNeural',
    edgePitch: '+20%',
    edgeRate: '+5%'
  },
  {
    id: 'en-girl-zoe',
    name: 'Kore',
    displayName: 'Bé Zoe',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.CHILD,
    language: Language.EN,
    description: 'Giọng lanh lợi, hoạt bát.',
    tone: 'Lanh lợi & Hoạt bát',
    edgeVoice: 'en-US-AnaNeural',
    edgePitch: '+20%',
    edgeRate: '+5%'
  },
  {
    id: 'en-girl-emma',
    name: 'Kore',
    displayName: 'Bé Emma',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.CHILD,
    language: Language.EN,
    description: 'Giọng cảm xúc, mếu máo, nhạy cảm.',
    tone: 'Mè nheo & Cảm xúc',
    edgeVoice: 'en-US-AnaNeural',
    edgePitch: '+20%',
    edgeRate: '+5%'
  },
  {
    id: 'en-man-james',
    name: 'Charon',
    displayName: 'Chú James',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.ADULT,
    language: Language.EN,
    description: 'Giọng chính luận, trầm ổn, chuyên nghiệp.',
    tone: 'Chuyên nghiệp & Trầm ổn',
    edgeVoice: 'en-US-GuyNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },
  {
    id: 'en-man-robert',
    name: 'Fenrir',
    displayName: 'Chú Robert',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.ADULT,
    language: Language.EN,
    description: 'Giọng uy quyền, mạnh mẽ, lãnh đạo.',
    tone: 'Uy quyền & Mạnh mẽ',
    edgeVoice: 'en-GB-RyanNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },
  {
    id: 'en-man-david',
    name: 'Charon',
    displayName: 'Chú David',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.ADULT,
    language: Language.EN,
    description: 'Giọng vui vẻ, thân thiện, hài hước.',
    tone: 'Vui vẻ & Hài hước',
    edgeVoice: 'en-US-ChristopherNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },
  {
    id: 'en-man-michael',
    name: 'Charon',
    displayName: 'Chú Michael',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.ADULT,
    language: Language.EN,
    description: 'Giọng ấm áp, sâu lắng, phát thanh viên.',
    tone: 'Ấm áp & Sâu lắng',
    edgeVoice: 'en-US-SteffanNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },
  {
    id: 'en-woman-sarah',
    name: 'Aoede',
    displayName: 'Cô Sarah',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.ADULT,
    language: Language.EN,
    description: 'Giọng MC Thời sự, chuẩn mực, tin cậy.',
    tone: 'Chuyên nghiệp & Tin cậy',
    edgeVoice: 'en-US-AriaNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },
  {
    id: 'en-woman-jessica',
    name: 'Zephyr',
    displayName: 'Cô Jessica',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.ADULT,
    language: Language.EN,
    description: 'Giọng tâm tình, dịu dàng, nhẹ nhàng.',
    tone: 'Dịu dàng & Tâm tình',
    edgeVoice: 'en-GB-SoniaNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },
  {
    id: 'en-woman-emily',
    name: 'Zephyr',
    displayName: 'Cô Emily',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.ADULT,
    language: Language.EN,
    description: 'Giọng bán hàng, sôi nổi, tự tin.',
    tone: 'Sôi nổi & Tự tin',
    edgeVoice: 'en-US-JennyNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },
  {
    id: 'en-woman-laura',
    name: 'Zephyr',
    displayName: 'Cô Laura',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.ADULT,
    language: Language.EN,
    description: 'Giọng kể chuyện, giàu cảm xúc, nghệ sĩ.',
    tone: 'Cảm xúc & Nghệ sĩ',
    edgeVoice: 'en-AU-NatashaNeural',
    edgePitch: '+0%',
    edgeRate: '+0%'
  },
  {
    id: 'en-grandpa-arthur',
    name: 'Fenrir',
    displayName: 'Ông Arthur',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.SENIOR,
    language: Language.EN,
    description: 'Giọng hiền từ, chậm rãi, khôn ngoan.',
    tone: 'Hiền từ & Chậm rãi',
    edgeVoice: 'en-US-RogerNeural',
    edgePitch: '-10%',
    edgeRate: '-10%'
  },
  {
    id: 'en-grandpa-richard',
    name: 'Fenrir',
    displayName: 'Ông Richard',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.SENIOR,
    language: Language.EN,
    description: 'Giọng nghiêm khắc, cứng rắn.',
    tone: 'Nghiêm khắc & Cứng rắn',
    edgeVoice: 'en-US-RogerNeural',
    edgePitch: '-10%',
    edgeRate: '-10%'
  },
  {
    id: 'en-grandpa-john',
    name: 'Fenrir',
    displayName: 'Ông John',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.SENIOR,
    language: Language.EN,
    description: 'Giọng yếu ớt, người rất già.',
    tone: 'Yếu ớt & Già cả',
    edgeVoice: 'en-US-RogerNeural',
    edgePitch: '-10%',
    edgeRate: '-10%'
  },
  {
    id: 'en-grandpa-henry',
    name: 'Fenrir',
    displayName: 'Ông Henry',
    gender: VoiceGender.MALE,
    ageGroup: AgeGroup.SENIOR,
    language: Language.EN,
    description: 'Giọng vang, hào sảng, người từng trải.',
    tone: 'Hào sảng & Vang',
    edgeVoice: 'en-US-RogerNeural',
    edgePitch: '-10%',
    edgeRate: '-10%'
  },
  {
    id: 'en-grandma-mary',
    name: 'Aoede',
    displayName: 'Bà Mary',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.SENIOR,
    language: Language.EN,
    description: 'Giọng phúc hậu, ấm áp.',
    tone: 'Phúc hậu & Ấm áp',
    edgeVoice: 'en-US-MichelleNeural',
    edgePitch: '-10%',
    edgeRate: '-10%'
  },
  {
    id: 'en-grandma-susan',
    name: 'Zephyr',
    displayName: 'Bà Susan',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.SENIOR,
    language: Language.EN,
    description: 'Giọng kể chuyện, giọng bà ngoại.',
    tone: 'Kể chuyện & Cổ tích',
    edgeVoice: 'en-US-MichelleNeural',
    edgePitch: '-10%',
    edgeRate: '-10%'
  },
  {
    id: 'en-grandma-patricia',
    name: 'Zephyr',
    displayName: 'Bà Patricia',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.SENIOR,
    language: Language.EN,
    description: 'Giọng sôi nổi, nhanh nhảu.',
    tone: 'Sôi nổi & Nhanh nhẹn',
    edgeVoice: 'en-US-MichelleNeural',
    edgePitch: '-10%',
    edgeRate: '-10%'
  },
  {
    id: 'en-grandma-margaret',
    name: 'Zephyr',
    displayName: 'Bà Margaret',
    gender: VoiceGender.FEMALE,
    ageGroup: AgeGroup.SENIOR,
    language: Language.EN,
    description: 'Giọng khó tính, lạnh lùng.',
    tone: 'Khó tính & Lạnh lùng',
    edgeVoice: 'en-US-MichelleNeural',
    edgePitch: '-10%',
    edgeRate: '-10%'
  }
];

export const MAX_CHUNK_LENGTH = 1500;
