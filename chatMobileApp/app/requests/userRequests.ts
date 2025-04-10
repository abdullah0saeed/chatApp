import consts from "../../consts";

const { BASE_URL } = consts;

export const signupUser = async (userData: any) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      return alert(data.message || "Failed to sign up");
    }
    return data.user;
  } catch (error) {
    console.error("Error signing up:", error);
    return null;
  }
};
////////////////////////////////////////////////////////////////////?
export const loginUser = async (userData: any) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) {
      return alert(data.message || "Failed to log in");
    }
    return data.user;
  } catch (error) {
    console.error("Error logging in:", error);
    return null;
  }
};
