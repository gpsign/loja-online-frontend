import { Any } from "@/types";

export function isMobile() {
  const ua = navigator.userAgent || "";
  const byUA = /Mobi|Android/i.test(ua);
  const byTouch =
    navigator.maxTouchPoints !== undefined
      ? navigator.maxTouchPoints > 0
      : false;
  const byMedia = window.matchMedia
    ? window.matchMedia("(max-width: 767px)").matches
    : false;
  const byHints = (navigator as Any).userAgentData?.mobile === true;
  return byUA || byTouch || byMedia || byHints;
}
