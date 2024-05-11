import { toast } from "react-toastify";

const difficultyApi = async (selectedLevel) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_URL}/LevelChange`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newLevel: selectedLevel }),
      }
    );

    if (response.ok) {
      toast.success(`Difficulty level ${selectedLevel} sent successfully!`);
      return { success: true };
    } else {
      const errorMessage = await response.text();
      toast.error(errorMessage);
      return { success: false };
    }
  } catch (error) {
    toast.error(error.message);
    return { success: false };
  }
};

export default difficultyApi;
