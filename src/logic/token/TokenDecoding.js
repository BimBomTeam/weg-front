import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TokenDecoding() {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIn0.3T1PJUDBpncV7lPhtqZCKuxWpAb07zMMcQ6VsgEPOfw";

  if (!token) {
    toast.error("Token not found in localStorage");
    return null;
  }

  const tokenParts = token.split(".");

  if (tokenParts.length !== 3) {
    toast.error(`Invalid token format`);
    return null;
  }

  const payloadBase64 = tokenParts[1];
  const decodedPayload = atob(payloadBase64);
  const userData = JSON.parse(decodedPayload);

  console.log(userData);
}
