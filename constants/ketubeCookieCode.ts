import { environment } from "~/services/environments";

export const prefixLocalStorage = {
  PREFIX: "KETUBE",
};

export const ketubeCookieCode = {
  COOKIES_STATUS:
    prefixLocalStorage.PREFIX + environment.prefixCookie + "_STATUS_COOKIES",
  AUTH_ACCESS_TOKEN:
    prefixLocalStorage.PREFIX + environment.prefixCookie + "_AUTH_ACCESS_TOKEN",
  AUTH_REFRESH_TOKEN:
    prefixLocalStorage.PREFIX +
    environment.prefixCookie +
    "_AUTH_REFRESH_TOKEN",
  COOKIES_FAVORITE_PLAYLIST:
    prefixLocalStorage.PREFIX +
    environment.prefixCookie +
    "_COOKIES_FAVORITE_PLAYLIST",
  COOKIES_VIDEO_PLAYLIST:
    prefixLocalStorage.PREFIX +
    environment.prefixCookie +
    "_COOKIES_VIDEO_PLAYLIST",
  ADMIN_ACCESS_TOKEN:
    prefixLocalStorage.PREFIX +
    environment.prefixCookie +
    "_ADMIN_ACCESS_TOKEN",
};
