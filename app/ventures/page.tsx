import { redirect } from "next/navigation";

/** Legacy route — platforms live on About Us. */
export default function VenturesRedirect() {
  redirect("/about#platforms");
}
