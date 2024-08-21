"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation"; // Use this for dynamic routing params in Next.js 13+
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  updateDoc,
  deleteField,
  deleteDoc,
} from "firebase/firestore";
import app from "@/app/firebase"; // Ensure this path is correct
import { useAuth } from "@/app/context/AuthContext"; // Use the correct path to your AuthContext
import { Grid, Typography } from "@mui/material";
import Link from "next/link";

const FlashcardPage = () => {
  const Router = useRouter();
  const params = useParams();
  const id = params.id;
  const { user } = useAuth(); // Make sure user is defined in your context
  // Use this to get the dynamic `id`
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState("");

  useEffect(() => {
    const fetchFlashcards = async () => {
      // Get the ID from the URL params
      console.log("id:", id);

      if (!id || !user?.uid) return; // Ensure id and user.uid are available

      const db = getFirestore(app);
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const flashRef = userDoc.data().flashcardSets;

        // Ensure flashRef[id] exists before accessing properties
        if (flashRef && flashRef[id]) {
          setSetName(flashRef[id].name);

          const setRef = doc(
            collection(userDocRef, "flashcardSets"),
            flashRef[id].name
          );
          const setSnap = await getDoc(setRef);

          if (setSnap.exists()) {
            setFlashcards(setSnap.data().flashcards);
          } else {
            console.log("No flashcard set found!");
          }
        } else {
          console.log("Invalid flashcard set ID!");
        }
      } else {
        console.log("No user document found!");
      }
    };

    fetchFlashcards();
  }, [params.id, user?.uid]);

  const handleDelete = async () => {
    const db = getFirestore(app);
    const userDocRef = doc(db, "users", user.uid);

    // Fetch the document data
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // Check if the flashcard set exists before attempting to delete
      if (data && data.flashcardSets && data.flashcardSets[id]) {
        const setName = data.flashcardSets[id].name;
        const docRef = doc(db, "users", user.uid);
        const colRef = collection(db, "users", user.uid, "flashcardSets");
        // Reference to the specific flashcard set document within the user's document
        const setRef = doc(colRef, setName);

        // Delete the flashcards field from the flashcard set document
        await deleteDoc(setRef);
        await updateDoc(docRef, {
          flashcardSets: deleteField(),
        });

        // Clear the state after deletion
        setFlashcards([]);
        setSetName("");

        alert("Item successfully deleted!");
        Router.push("../flashcards");
      } else {
        alert("Item not found!");
      }
    } else {
      alert("User document does not exist!");
    }
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-around">
        <Link href="../flashcards">
          <button className="btn btn-accent max-w-36">
            Back to saved study sets
          </button>
        </Link>

        <h1 className="m-4 text-4xl">{setName}</h1>
        <button
          className="btn btn-circle btn-outline"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Are you sure you want to delete this study set?
            </h3>
            <p className="py-4">
              This study set will be permanantly deleted. This is an
              irriversible action. Are you sure you want to delete this study
              set?
            </p>
            <div className="modal-action flex flex-row justify-around">
              <button
                className="btn btn-outline btn-error"
                onClick={handleDelete}
              >
                delete
              </button>
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">cancel</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>

      <Grid container spacing={2}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <label className="swap swap-flip text-9xl ">
              <input type="checkbox" className="" />

              <div className="m-4 swap-on max-w-120 xs:min-w-120 md:min-w-120 text-xl text-center  p-8 bg-accent text-white rounded-lg h-52 flex justify-center items-center ">
                {flashcard.back}
              </div>

              <div className="m-4 swap-off max-w-120 sm:min-w-120  md:min-w-120 text-2xl p-8 text-center bg-primary text-white flex justify-center items-center rounded-lg">
                {flashcard.front}
              </div>
            </label>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default FlashcardPage;
