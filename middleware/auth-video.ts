import Swal from "sweetalert2";
import { ketubeCookieCode } from "~/constants/ketubeCookieCode";

export default function (from: any, to: any) {
  const token = useCookie(ketubeCookieCode.AUTH_ACCESS_TOKEN);
  if (!token.value && from) {
    Swal.fire({
      title: `สำหรับสมาชิกเท่านั้น`,
      toast: true,
      showConfirmButton: false,
      position: "top-end",
      timer: 5000,
      customClass: "swal-dark",
      showCloseButton: false,
    });
    return to.fullPath;
  }
}
