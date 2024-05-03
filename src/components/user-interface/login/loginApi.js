import { toast } from "react-toastify";

const loginApi = async (formData) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_URL}/Authenticate/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("refresh_token", data.refreshToken);
      return { success: true };
    }
    if (!response.ok) {
      return { success: false };
    }
  } catch (error) {
    toast.error(error.message);
    return { success: false };
  }
};

export default loginApi;
