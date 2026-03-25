import { serverTimestamp, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

export const findUser = async (uid) => {
    const usersRef = doc(db, "users_by_uid", uid);
    const user = await getDoc(usersRef);

    return user;
}

export const createUserInFirestore = async (uid, displayName) => {
    const user = await findUser(uid);

    if (user.exists()) return;

    // add user
    const userRef = doc(db, "users_by_uid", uid);
    await setDoc(userRef, {
                 displayName,
                 createdAt: serverTimestamp()
                });

    console.log("User created in Firestore with UID: ", uid);
}

export const fetchDisplayName = async (uid) => {
    if (!uid) return "Unknown Chatter";
    
    const usersRef = doc(db, "users_by_uid", uid);
    const snapshot = await getDoc(usersRef);

    if (snapshot.exists()){
        return snapshot.data().displayName || uid;
    }

    return "Unknown Chatter";
}