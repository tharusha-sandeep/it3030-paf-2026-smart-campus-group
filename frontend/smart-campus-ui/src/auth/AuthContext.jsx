import { createContext, useContext, useReducer, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      const token = action.payload;
      try {
        const decoded = jwtDecode(token);
        const user = {
          id: decoded.sub,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
        };
        localStorage.setItem("sc_token", token);
        return {
          ...state,
          user,
          token,
          isAuthenticated: true,
        };
      } catch (error) {
        console.error("Invalid token", error);
        return initialState;
      }
    }
    case "LOGOUT":
      localStorage.removeItem("sc_token");
      return initialState;
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("sc_token");
    if (token) {
      dispatch({ type: "LOGIN", payload: token });
    }
  }, []);

  const login = (token) => dispatch({ type: "LOGIN", payload: token });
  const logout = () => dispatch({ type: "LOGOUT" });

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
