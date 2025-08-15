import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
  const signup = async (username) => {
    try {
      const response = await fetch(`${API}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });
      if (!response.ok) {
        throw new Error(`Signup failed: ${response.status}`);
      }

      const result = await response.json();
      setToken(result.token);
      setLocation("TABLET"); // move user to tablet after signup
    } catch (err) {
      console.error("Error during signup:", err);
    }
  };

  // TODO: authenticate
  const authenticate = async () => {
    try {
      const response = await fetch(`${API}/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token from state
        },
      });
      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("Authentication result:", result);
    } catch (err) {
      console.error("Error during authentication:", err);
    }
    setLocation("TUNNEL");
  };

  const value = { location, token, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
