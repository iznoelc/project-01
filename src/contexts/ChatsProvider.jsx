import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { ChatsContext } from "./ChatsContext";
import useAuth from "../hooks/useAuth";
import { db } from "../firebase/firebase.config";

export default function ChatsProvider({children}){
    const [chats, setChats] = useState([]); // all chats the current user is part of
    const { user } = useAuth(); // the current user

    // GET THE CHATS THE CURRENT USER IS PART OF 
    useEffect(() => {
        if (!user) return;

        const queryUserChats = query(
            collection(db, "chats"),
            where("participants", "array-contains", user.uid),
        ); 
        const unsubscribe = onSnapshot(queryUserChats, (snapshot) =>{
            setChats(snapshot.docs.map(doc => (
                {
                    id: doc.id, ...doc.data()
                }
            )));
        });

        return () => unsubscribe; // clean up use effect
    }, [])

    return (
        // provide the context value to the children components
        <ChatsContext.Provider value={{ chats, setChats }}>
            {children}
        </ChatsContext.Provider>
    );
}