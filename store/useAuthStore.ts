import type { KetubeError } from "~/interfaces/KetubeError";
import { authService } from "~/services/authService";
import { ketubeCookieCode } from "~/constants/ketubeCookieCode";

interface State {
  error: KetubeError | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const useAuthStore = defineStore("useAuthStore", {
  state: (): State => {
    return {
      error: null,
      isLoading: false,
      isAuthenticated: !!useCookie(ketubeCookieCode.AUTH_ACCESS_TOKEN),
      isAdmin: !!useCookie(ketubeCookieCode.ADMIN_ACCESS_TOKEN).value,
    };
  },
  actions: {
    async loginByGoogle(token: string) {
      this.isLoading = true;
      await authService
        .loginByGoogle(token)
        .then((value) => {
          const accessTokenCookie = useCookie(
            ketubeCookieCode.AUTH_ACCESS_TOKEN,
          );
          accessTokenCookie.value = value.accessToken;
          this.isAuthenticated = true;
          this.error = null;
          navigateTo("/");
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async registerByGoogle(token: string) {
      this.isLoading = true;
      await authService
        .registerByGoogle(token)
        .then((value) => {
          const accessTokenCookie = useCookie(
            ketubeCookieCode.AUTH_ACCESS_TOKEN,
          );
          accessTokenCookie.value = value.accessToken;
          this.error = null;
          navigateTo("/sign-up/form-sign-up");
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    adminLogin() {
      const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
      const accessTokenCookie = useCookie(ketubeCookieCode.ADMIN_ACCESS_TOKEN, {
        expires: new Date(Date.now() + oneWeekInMilliseconds),
      });
      accessTokenCookie.value = "ture";
      this.isAdmin = true;
      navigateTo("/");
    },
    checkLogin() {
      const accessTokenCookie = useCookie(ketubeCookieCode.ADMIN_ACCESS_TOKEN);
      if (accessTokenCookie.value) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
        navigateTo("/verified");
      }
    },
  },
});
