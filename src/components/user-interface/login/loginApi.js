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

    const data = await response.json();
    const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
    localStorage.setItem("token", testToken);
    //localStorage.setItem("token", data.token);
    return { success: true };
  } catch (error) {
    toast.error(error.message);
    return { success: false };
  }
};

export default loginApi;
