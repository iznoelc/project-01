import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where, doc, getDoc } from "firebase/firestore"
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
        const unsubscribe = onSnapshot(queryUserChats, async (snapshot) =>{
            // setChats(snapshot.docs.map(doc => (
            //     {
            //         id: doc.id, ...doc.data()
            //     }
            // )));

            const chatsWithDisplayNames = await Promise.all(
                snapshot.docs.map(async (chatDoc) => {
                    const chatData = chatDoc.data();

                    // get the other user, since we want the display name of the person the CURRENT user is talking to
                    const otherUserId = chatData.participants.find(
                        (uid) => uid !== user.uid
                    );

                    let displayName = "Unknown Chatter";

                    if (otherUserId){
                        const userRef = doc(db, "users_by_uid", otherUserId); // a reference to the other user's users_by_uid document
                        const otherUser = await getDoc(userRef); // get the other user's document

                        // if it exists, set the display name to their display name
                        if (otherUser.exists()) {
                            displayName = otherUser.data().displayName;
                        }
                    }

                    // return the current info of the chat and add the display name to it
                    return {
                        id: chatDoc.id,
                        ...chatData,
                        displayName,
                    };
                })
            );

            setChats(chatsWithDisplayNames);
        });

        return () => unsubscribe(); // clean up use effect
    }, [user])

    return (
        // provide the context value to the children components
        <ChatsContext.Provider value={{ chats, setChats }}>
            {children}
        </ChatsContext.Provider>
    );
}