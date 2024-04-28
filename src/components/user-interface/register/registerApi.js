import { toast } from "react-toastify";

const registerApi = async (formData) => {
  try {
    const response = await fetch(
      "https://193.122.12.41/api/Authenticate/register",
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
    }
    if (!response.ok) {
      toast.error("Response is not OK");
      return { success: false };
    }
  } catch (error) {
    toast.error(error.message);
    return { success: false };
  }
};

export default registerApi;
