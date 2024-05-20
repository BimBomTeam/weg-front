import { toast } from "react-toastify";

const registerApi = async (formData) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_URL}/Authenticate/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok) {
      return { success: true };
    } else {
      const errorMessage = await response.text();
      if (errorMessage.includes("Email")) {
        toast.error("The Email field is not a valid e-mail address.");
      } else {
        toast.error(errorMessage);
      }
      return { success: false };
    }
  } catch (error) {
    toast.error(error.message);
    return { success: false };
  }
};

export default registerApi;