const TOKEN_KEY = 'user_token';

export const getToken = (): string | null => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    
    // 确保 token 格式正确
    const trimmedToken = token.trim();
    if (!trimmedToken) return null;
    
    return trimmedToken.startsWith('Bearer ') ? trimmedToken : `Bearer ${trimmedToken}`;
  } catch (error) {
    console.error('获取 token 失败:', error);
    return null;
  }
};

export const setToken = (token: string): void => {
  try {
    if (!token) {
      removeToken();
      return;
    }
    
    // 确保 token 格式正确
    const trimmedToken = token.trim();
    if (!trimmedToken) {
      removeToken();
      return;
    }
    
    const formattedToken = trimmedToken.startsWith('Bearer ') ? trimmedToken : `Bearer ${trimmedToken}`;
    localStorage.setItem(TOKEN_KEY, formattedToken);
  } catch (error) {
    console.error('设置 token 失败:', error);
    removeToken();
  }
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('移除 token 失败:', error);
  }
};

export const isAuthenticated = (): boolean => {
  try {
    const token = getToken();
    if (!token) return false;
    
    // 简单验证 token 格式
    const parts = token.split(' ');
    return parts.length === 2 && parts[0] === 'Bearer' && parts[1].length > 0;
  } catch (error) {
    console.error('验证认证状态失败:', error);
    return false;
  }
};
