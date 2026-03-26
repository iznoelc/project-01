import useUserByUID from "../hooks/useUserByUID";
import useAuth from "../hooks/useAuth";
import { useState, useEffect } from "react"; 
import { addDoc, doc, collection, serverTimestamp, query, orderBy, onSnapshot, deleteDoc } from "firebase/firestore"
import { db } from "../firebase/firebase.config";
import { successNotify } from "../utils/ToastifyNotifications";

import { SavedLinksContext } from "./SavedLinksContext";


export default function SavedLinksProvider ({children}) {
    const [userLinks, setUserLinks] = useState([]);
    const { userDoc } = useUserByUID();
    const { user } = useAuth();

    // updating links
    useEffect(() =>{
        if (!user){
            setUserLinks([]); // no user, no links
            return;
        }
        // grab links from a certain user 
        const linksRef = collection(db, "users_by_uid", user.uid, "saved_links");
        const queryLinks = query(linksRef,
            orderBy("createdAt", "desc") // sort links by newest -> oldest
        ); 

        // callback function that runs any time there are changes to the query
        // snapshot is the data relating to the query
        const unsubscribe = onSnapshot(queryLinks, (snapshot) => {
            const links = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setUserLinks(links);
        });

        return () => unsubscribe(); // clean up the useEffect
    }, [userDoc, user]);

    // adding links
    const addLink = async (name, url) => {
        console.log("Adding link, ", user.uid);
        if (!user || !url || !name){
            return; // no user to add a link to, or url or name are null.
        }
        if (name === "" || url === "") return; // dont' allow empty name or link

        console.log("user uid ", user.uid);
        const linksRef = collection(db, "users_by_uid", user.uid, "saved_links");

        await addDoc(linksRef, {
            link_name: name,
            link_url: url,
            createdAt: serverTimestamp(),
        });
        successNotify("Successfully added a saved link to " + name);
    }

    const deleteLink = async (linkId) => {
        const linkRef = doc(db, "users_by_uid", user.uid, "saved_links", linkId);
        
        await deleteDoc(linkRef);
        successNotify("Successfully deleted link");
    }

    return (
        // provide the context value to the children components
        <SavedLinksContext.Provider value={{ userLinks, setUserLinks, addLink, deleteLink }}>
            {children}
        </SavedLinksContext.Provider>
    );
}