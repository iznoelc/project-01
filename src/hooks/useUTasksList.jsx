
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import useAuth from "./useAuth";

export default function useUTasksList() {
  const { user } = useAuth();
  const [uTasksList, setUTasksList] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "tasksLists"),
      where("participants", "array-contains", user.uid)
    );

    const unsub = onSnapshot(q, snapshot => {
      setUTasksList(
        snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsub();
  }, [user]);

  return { uTasksList };
}
