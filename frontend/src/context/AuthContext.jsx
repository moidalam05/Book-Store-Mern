import { createContext, useContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase.config";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Restore user on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchMe = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          throw new Error("Unauthorized");
        }

        const data = await res.json();

        setCurrentUser({
          ...data.user,
          token,
        });
      } catch (err) {
        localStorage.removeItem("token");
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

  // 🔐 Google Login
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/v1/auth/google`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: result.user.email,
          name: result.user.displayName,
          avatar: result.user.photoURL,
        }),
      },
    );

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.message || "Google login failed");
    }

    localStorage.setItem("token", data.token);

    setCurrentUser({
      ...data.user,
      token: data.token,
    });

    return data;
  };

  // 🚪 Logout
  const logout = async () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        signInWithGoogle,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
