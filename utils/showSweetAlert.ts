import Swal from "sweetalert2";
import type { SweetAlertPosition } from "sweetalert2";
import iconSuccess from "assets/images/icons/success.svg";
import iconError from "assets/images/icons/error.svg";

export const showSweetAlert = (
  title: string = "โปรดติดต่อเจ้าหน้าที่",
  type: string,
  timer: number = 5000,
  closeButton: boolean,
  position: SweetAlertPosition = "top-end",
) => {
  const html =
    type === "success"
      ? `<img src="${iconSuccess}" alt="Icon Success" />`
      : type === "error"
        ? `<img src="${iconError}" alt="Icon Error" />`
        : "";

  Swal.fire({
    title,
    html,
    toast: true,
    timer,
    position,
    showCloseButton: closeButton,
    showConfirmButton: false,
    customClass: `swal-${type}`,
  });
};
