import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TokenDecoding() {
  //вероятно вызвать при PreBuildChecker.js
  const token = localStorage.getItem("access_token");

  if (!token) {
    toast.error("Token not found in localStorage");
    return null;
  }

  const tokenParts = token.split(".");

  if (tokenParts.length !== 3) {
    //---Right now it's not working !!!

    // toast.error(`Invalid token format`);
    return null;
  }

  const payloadBase64 = tokenParts[1];
  const decodedPayload = atob(payloadBase64);
  const userData = JSON.parse(decodedPayload);

  return userData;
}
