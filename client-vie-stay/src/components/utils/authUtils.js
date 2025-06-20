export const getOwnerId = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    return decoded.userId || decoded.id; // Giả sử userId hoặc id là owner ID
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
