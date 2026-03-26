import useAuth from "../hooks/useAuth";
import { useState, useEffect } from "react"; 
import { getDoc, doc } from "firebase/firestore"
import { db } from "../firebase/firebase.config";

import { UserByUIDContext } from "./UserByUIDContext";


export default function UserByUIDProvider({children}) {
    const { user } = useAuth(); // the current user
    const [userDoc, setUserDoc] = useState(null); // current user's doc

    // need to update doc when the user changes
    useEffect(() => {
        setUserDoc(null);
    }, [user?.uid])

    // const grab user doc
    useEffect(() =>{
        if (!user){
            setUserDoc(null); // clear
            return;
        }

        const currentUserByUID = async () => {
                const userRef = doc(db, "users_by_uid", user.uid); // a reference to the user's users_by_uid document
                const userDoc = await getDoc(userRef); // get the other user's document

                // if it exists, set the display name to their display name
                if (userDoc.exists()) {
                    setUserDoc(userDoc.data());
                } else { 
                    setUserDoc(null);
                }
        };

        currentUserByUID();
        
    }, [user]);

    return (
        // provide the context value to the children components
        <UserByUIDContext.Provider value={{ userDoc, setUserDoc }}>
            {children}
        </UserByUIDContext.Provider>
    );
}