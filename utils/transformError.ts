import { ketubeExceptionCode } from "../constants/ketubeExceptionCode";

export const transformError = (exceptionCode: string) => {
  switch (exceptionCode) {
    case ketubeExceptionCode.PLEASE_GO_TO_SIGN_UP_WITH_GOOGLE_ACCOUNT: {
      exceptionCode = "ไม่พบบัญชี google ของคุณ";
      break;
    }
    case ketubeExceptionCode.USER_ALREADY_EXISTS: {
      exceptionCode = "บัญชีนี้มีผู้ใช้งานแล้ว";
      break;
    }
    case ketubeExceptionCode.FAVORITE_ARTIST_IS_ALREADY: {
      exceptionCode = "คุณได้กดติดตามศิลปินนี้แล้ว";
      break;
    }
    case ketubeExceptionCode.VIDEO_NOT_FOUND: {
      exceptionCode = "Video not found";
      break;
    }
    case ketubeExceptionCode.VIDEO_NAME_IS_UNIQUE: {
      exceptionCode = "Video name is unique";
      break;
    }
    case ketubeExceptionCode.VIDEO_NAME_AND_ALBUM_AND_ARTIST_IS_UNIQUE: {
      exceptionCode = "Video name and album and artist is unique";
      break;
    }
    case ketubeExceptionCode.VIDEO_SLUG_IS_UNIQUE: {
      exceptionCode = "Video slug is unique";
      break;
    }
    case ketubeExceptionCode.VIDEO_SLUG_AND_ALBUM_AND_ARTIST_IS_UNIQUE: {
      exceptionCode = "Video slug and album and artist is unique";
      break;
    }
    case ketubeExceptionCode.VIDEO_FILE_TYPE_IS_NOT_SUPPORT: {
      exceptionCode = "Video file type is not support";
      break;
    }
    case ketubeExceptionCode.VIDEO_FILE_IS_TO_LARGE: {
      exceptionCode = "Video file is to large";
      break;
    }
    case ketubeExceptionCode.RELEASE_DATE_IS_THAN_PUBLISHED_DATE: {
      exceptionCode = "Release date is than published date";
      break;
    }
    case ketubeExceptionCode.ALBUM_NAME_IS_UNIQUE: {
      exceptionCode = "ชื่ออัลบั้มนี้มีในระบบแล้ว";
      break;
    }
    case ketubeExceptionCode.ALBUM_SLUG_IS_UNIQUE: {
      exceptionCode = "ชื่อ Slug นี้มีในระบบแล้ว";
      break;
    }
    case ketubeExceptionCode.PLAYLIST_NAME_IS_UNIQUE: {
      exceptionCode = "ชื่อเพลย์ลิสต์นี้มีในระบบแล้ว";
      break;
    }
    case ketubeExceptionCode.PLAYLIST_SLUG_IS_UNIQUE: {
      exceptionCode = "ชื่อ Slug นี้มีในระบบแล้ว";
      break;
    }
    default: {
      exceptionCode = "ระบบมีปัญหาโปรดติดต่อเจ้าหน้าที่";
      break;
    }
  }
  return exceptionCode;
};
