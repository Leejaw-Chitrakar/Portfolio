import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  auth, 
  isFirebaseConfigured, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail 
} from "../firebase/config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    setAuthError("");
    if (!auth || !isFirebaseConfigured) {
      throw new Error("Authentication service is currently unavailable.");
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      let friendlyMessage = "Failed to sign in. Please check your credentials.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        friendlyMessage = "Invalid email or password. Please verify and try again.";
      } else if (err.code === "auth/too-many-requests") {
        friendlyMessage = "Access to this account has been temporarily disabled due to many failed attempts. Try again later or reset password.";
      } else if (err.code === "auth/invalid-email") {
        friendlyMessage = "The email address format is invalid.";
      } else if (err.message) {
        friendlyMessage = err.message;
      }
      setAuthError(friendlyMessage);
      throw new Error(friendlyMessage);
    }
  };

  const logout = async () => {
    setAuthError("");
    if (!auth) return;
    await signOut(auth);
  };

  const resetPassword = async (email) => {
    setAuthError("");
    if (!auth || !isFirebaseConfigured) {
      throw new Error("Authentication service is currently unavailable.");
    }
    if (!email) {
      throw new Error("Please provide your admin email address to receive password reset instructions.");
    }
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    currentUser,
    loading,
    isConfigured: isFirebaseConfigured,
    authError,
    setAuthError,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
