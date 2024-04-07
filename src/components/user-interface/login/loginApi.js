import { toast } from "react-toastify";

const loginApi = async (formData) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      return { success: false };
    }

    // const data = await response.json();
    const refreshToken = "CI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaW"
    const token = "G4gRIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36Ok6yJV_adQssw5c"
    localStorage.setItem("access_token", token);
    localStorage.setItem("refresh_token", refreshToken)
    //localStorage.setItem("token", data.token);
    return { success: true };
  } catch (error) {
    toast.error(error.message);
    return { success: false };
  }
};

export default loginApi;
