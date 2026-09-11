import { permanentRedirect } from "next/navigation";

/** Legacy portfolio route — canonical path is /ventures. */
export default function PortfolioRedirectPage() {
  permanentRedirect("/ventures");
}
