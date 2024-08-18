// components/AuthTest.js
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app from "../firebase";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
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

const Header = () => {
  const auth = getAuth(app);
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const [toolBar, setToolBar] = useState(false);
  const { user } = useAuth();
  console.log("User in Header:", user);

  let buttonText = user ? "log out" : "log in";

  return (
    <div className="navbar bg-base-100 justify-between border-gray-500 border-b-2 border-solid">
      <a href=".." className="btn btn-ghost text-xl">
        AI flashcards
      </a>
      {user ? (
        <div className="avatar">
          <div className="mask mask-squircle w-12 mr-2">
            <button
              onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStCJpmc7wNF8Ti2Tuh_hcIRZUGOc23KBTx2A&s" />
            </button>
            <div>
              <dialog id="my_modal_3" className="modal">
                <div className="modal-box fixed right-2 top-16 w-80">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                      ✕
                    </button>
                  </form>
                  <h3 className="font-bold text-lg">Hello, {user.email}</h3>
                  <div className="flex flex-col items-center justify-around">
                    <button
                      className="btn btn-accent m-2"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </button>
                    <button className="btn btn-ghost m-2">Settings</button>
                  </div>
                </div>
              </dialog>
            </div>
          </div>
        </div>
      ) : (
        <a href="./signin" className="text-sm btn btn-ghost text-xl">
          sign in
        </a>
      )}
    </div>
  );
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <Header />
    </AuthProvider>
  );
}
