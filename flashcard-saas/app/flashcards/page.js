"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app from "../firebase";
import Link from "next/link";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

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

const Page = () => {
  const db = getFirestore(app);
  const { user } = useAuth();

  const userId = user.uid;
  const [sets, setSets] = useState([]);
  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const flashcardSets = userData.flashcardSets || [];

        const setsWithFlashcards = await Promise.all(
          flashcardSets.map(async (set) => {
            const setDocRef = doc(
              collection(userDocRef, "flashcardSets"),
              set.name
            );
            const setDocSnap = await getDoc(setDocRef);
            const setData = setDocSnap.exists()
              ? setDocSnap.data()
              : { flashcards: [] };
            return { name: set.name, flashcards: setData.flashcards || [] };
          })
        );

        setSets(setsWithFlashcards);
        sets.forEach((item) => {
          console.log(item);
        });
      } else {
        console.log("No user document found!");
      }
    }

    fetchData();
  }, [user]);

  return (
    <main className="w-full h-full">
      {user ? (
        <>
          <span className="block text-3xl text-white w-full h-full flex items-center justify-center mt-20 mx-2">
            {sets.length == 0
              ? "You have no sets. create your first one right now!"
              : "Your study sets"}
          </span>
          <div className="flex flex-col items-center">
            {sets.length == 0 && (
              <Link href="./generate">
                <button className="btn btn-success m-8">
                  Generate flashcards
                </button>
              </Link>
            )}
          </div>
          <div className="flex flex-row flex-wrap justify-around pt-4 items-center">
            {sets.map((set) => {
              return (
                <button className="w-1/3 m-2 btn btn-outline btn-primary">
                  {set.name}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <span className="block text-4xl text-white w-full h-full flex items-center justify-center mt-20 p-10">
            Sign up to be able to save and view your study sets, it's free!
          </span>
          <div className="flex flex-col justify-center items-center">
            <Link href="./signin">
              <button className="btn btn-success m-2">Sign up</button>
            </Link>
            <Link href="./generate">
              <button className="btn btn-secondary">Generate flashcards</button>
            </Link>
          </div>
        </>
      )}
    </main>
  );
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <Page />
    </AuthProvider>
  );
}
