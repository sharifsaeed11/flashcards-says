"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import app from "../firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const signUp = () => {
    const auth = getAuth(app);
    createUserWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        router.push("../generate");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        // ..
      });
  };

  const logIn = () => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        router.push("../generate");
        // ...
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
            alert("Invalid email format. Please enter a valid email.");
            break;
          case "auth/user-disabled":
            alert("This account has been disabled. Please contact support.");
            break;
          case "auth/user-not-found":
            alert("No user found with this email. Please sign up.");
            break;
          case "auth/wrong-password":
            alert("Incorrect password. Please try again.");
            break;
          case "auth/too-many-requests":
            alert("Too many failed attempts. Please try again later.");
            break;
          case "auth/network-request-failed":
            alert("Network error. Please check your connection and try again.");
            break;
          case "auth/internal-error":
            alert("An internal error occurred. Please try again later.");
            break;
          case "auth/operation-not-allowed":
            alert(
              "Email/password sign-in is disabled. Contact the administrator."
            );
            break;
          default:
            alert("An unknown error occurred. Please try again.");
            break;
        }
      });
  };
  return (
    <main className="w-full h-full">
      <strong className="text-center text-2xl p-10 block">Sign in</strong>

      <div className="flex flex-col items-center">
        <label className="input input-bordered flex items-center gap-2 max-w-80 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w- opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Username"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            className="grow"
            onChange={(e) => setPass(e.target.value)}
          />
        </label>
        <div className="flex flex-row">
          <button className="btn btn-primary m-2 w-24" onClick={logIn}>
            Log in
          </button>
          <button className="btn btn-secondary m-2 w-24" onClick={signUp}>
            Sign up
          </button>
        </div>
      </div>
    </main>
  );
};

export default page;
