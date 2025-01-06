import { ketubeCookieCode } from "~/constants/ketubeCookieCode";

export default defineNuxtRouteMiddleware(() => {
  const token = useCookie(ketubeCookieCode.AUTH_ACCESS_TOKEN);

  if (!token.value) {
    return navigateTo("/login");
  }
});
