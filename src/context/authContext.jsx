import { createContext, useReducer, useEffect, useCallback, useState } from "react";
import axios from "../Utils/axios";
import { useNavigate, useLocation } from "react-router-dom";

const INITIAL_STATE = {
  user: null,
  loading: true,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return { user: action.payload, loading: false, error: null };
    case "LOGIN_FAILURE":
      return { user: null, loading: false, error: action.payload };
    case "LOGOUT":
      return { user: null, loading: false, error: null };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const navigate = useNavigate();
  const location = useLocation();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const normalizeUser = (data) => {
    if (data.user) return data.user;
    return {
      _id: data.userId,
      email: '',
      isAdmin: data.isAdmin
    };
  };

  const fetchUser = useCallback(async () => {
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await axios.get("/auth/check-auth", {
        withCredentials: true,
        timeout: 5000
      });

      const normalizedUser = normalizeUser(res.data);

      if (normalizedUser._id) {
        if (res.data.accessToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
        }

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: normalizedUser,
        });
      } else {
        throw new Error("User ID missing in response");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        dispatch({ type: "LOGOUT" });
      } else if (err.response?.status === 429) {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: {
            code: "RATE_LIMITED",
            message: "Too many requests. Please wait before trying again."
          }
        });
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: {
            code: "NETWORK_ERROR",
            message: "Cannot connect to authentication service"
          }
        });
      }
    } finally {
      setInitialCheckDone(true); // Important: indicate that we're done checking
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Delay navigation until auth status is confirmed
  useEffect(() => {
    if (!initialCheckDone) return;

    if (!state.user && location.pathname !== "/login") {
      const currentPath = location.pathname;
      sessionStorage.setItem("redirectAfterLogin", currentPath);
      navigate("/login", { replace: true });
    }

    if (state.user && location.pathname === "/login") {
      const redirectTo = sessionStorage.getItem("redirectAfterLogin") || "/";
      sessionStorage.removeItem("redirectAfterLogin");
      navigate(redirectTo, { replace: true });
    }
  }, [initialCheckDone, state.user, location, navigate]);

  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        dispatch({ type: "CLEAR_ERROR" });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [state.error]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
