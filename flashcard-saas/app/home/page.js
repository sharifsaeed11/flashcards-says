"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app from "../firebase";
import Link from "next/link";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize user as null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

const Page = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <span className="block text-4xl text-white w-full h-full flex items-center justify-center mt-20 p-10">
        Sign up to be able to save and view your study sets, it's free!
      </span>
    );
  }

  return (
    <>
      <span className="block text-4xl text-white w-full h-full flex items-center justify-center mt-20 p-10">
        Welcome, {user.email}! What do you want to do next?
      </span>
      <div className="flex flex-col justify-center items-center">
        <Link href="./generate">
          <button className="btn btn-success m-2">Generate flashcards</button>
        </Link>
        <Link href="./flashcards">
          <button className="btn btn-secondary">View your flashcards</button>
        </Link>
      </div>
    </>
  );
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <Page />
    </AuthProvider>
  );
}
