import { permanentRedirect } from "next/navigation";

/** Legacy services route — canonical path is /capabilities. */
export default function ServicesRedirectPage() {
  permanentRedirect("/capabilities");
}
