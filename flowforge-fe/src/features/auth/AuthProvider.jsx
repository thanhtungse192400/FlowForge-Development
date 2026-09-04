import { createContext, useContext, useState, useEffect } from "react";
import { getCookie, setCookie, eraseCookie } from "../../utils/cookies";
import profileService from "../Profile/services/profileService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // Hàm load user profile sau khi đã có token
  const loadUserProfile = async () => {
    try {
      const profile = await profileService.getProfile();
      // Giả sử profile trả về object user, ta cập nhật lại state
      setUser(profile);
      // Cập nhật lại cookie với thông tin mới nhất nếu cần
      setCookie('auth_user', JSON.stringify(profile), 7);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      logout();
    } finally {
      setIsLoadingSession(false);
    }
  };

  useEffect(() => {
    const refreshToken = getCookie('refreshToken');
    if (refreshToken) {
      // Nếu có refresh token, tiến hành load profile
      // Axios interceptor của bạn đã lo việc auto-refresh rồi
      loadUserProfile();
    } else {
      setIsLoadingSession(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    setCookie('auth_user', JSON.stringify(userData), 7);
    if (userData.accessToken) setCookie('accessToken', userData.accessToken, 7);
    if (userData.refreshToken) setCookie('refreshToken', userData.refreshToken, 7);
  };

  const logout = () => {
    setUser(null);
    eraseCookie('auth_user');
    eraseCookie('accessToken');
    eraseCookie('refreshToken');
    window.location.href = '/'; // Chắc chắn chuyển hướng khi logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoadingSession }}>
      {/* Nếu đang loading, có thể render một component loading nhỏ 
        để không bị trắng trang hoàn toàn 
      */}
      {isLoadingSession ? <div className="app-loader">Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);