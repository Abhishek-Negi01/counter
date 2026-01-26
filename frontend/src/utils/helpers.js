export const formatError = (error) => {
  if (error.response?.data?.message) {
    return error.response?.data?.message;
  }

  if (error.message) {
    return error.message;
  }

  return "An unexpected error occurred";
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.log(error);
    return true;
  }
};

export const capitalizeWord = (word) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};
