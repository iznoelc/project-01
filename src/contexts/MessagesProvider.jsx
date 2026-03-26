import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "../firebase/firebase.config";
import { MessagesContext } from "./MessagesContext";
import useAuth from "../hooks/useAuth";

export default function MessagesProvider({ children }){
    const [msgs, setMsgs] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null); // the current chat
    const { user } = useAuth();

    // clear messages when user changes
    useEffect(() => {
        setMsgs([]);
        setCurrentChatId(null);
    }, [user?.uid])

    // updating messages
    useEffect(() =>{
        if (!currentChatId){
            setMsgs([]); // clear
            return;
        }
        // grab messages from chatsRef when a certain condition is met
        // for now, it grabs all messages ever
        const msgsRef = collection(db, "chats", currentChatId, "messages");
        const queryMsgs = query(msgsRef,
            orderBy("createdAt", "asc") // sort msgs by oldest -> newest
        ); 

        // callback function that runs any time there are changes to the query
        // snapshot is the data relating to the query
        const unsubscribe = onSnapshot(queryMsgs, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setMsgs(messages);
        });

        return () => unsubscribe(); // clean up the useEffect
    }, [currentChatId]);

    const sendMessage = async (text, user) => {
        console.log("sending message");
        console.log("Current chat ID:", currentChatId);
        if (!currentChatId){
            return; // no chat to send to
        }
        if (text === "") return; // dont' allow empty message

        const messagesRef = collection(db, "chats", currentChatId, "messages");

        await addDoc(messagesRef, {
            text,
            createdAt: serverTimestamp(),
            displayName: user.displayName,
            uid: user.uid, 
        });
    }

    return (
        // provide the context value to the children components
        <MessagesContext.Provider value={{ msgs, sendMessage, currentChatId, setCurrentChatId }}>
            {children}
        </MessagesContext.Provider>
    );
}