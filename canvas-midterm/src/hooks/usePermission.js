import { useAuth } from "./useAuth";

export const usePermission = () => {
  const { user } = useAuth();

  const isLoggedIn = () => !!user;

  const hasRole = (roles) => {
    if (!user || !roles) return false;
    return roles.includes(user.userType);
  };

  return {
    isLoggedIn,
    hasRole,
  };
};
