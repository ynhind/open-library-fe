// Role-based utility functions
export const getUserRole = () => {
  try {
    const userString = localStorage.getItem("user");
    if (userString && userString !== "undefined") {
      const user = JSON.parse(userString);
      return user.role;
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
  }
  return null;
};

export const isAdmin = () => {
  return getUserRole() === "ADMIN";
};

export const isMember = () => {
  const role = getUserRole();
  return role === "MEMBER" || role === "ADMIN";
};

export const getDefaultRoute = () => {
  const role = getUserRole();
  if (role === "ADMIN") {
    return "/admin";
  }
  return "/";
};

export const redirectBasedOnRole = (navigate) => {
  const defaultRoute = getDefaultRoute();
  navigate(defaultRoute);
};
