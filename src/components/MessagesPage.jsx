import { useState, useEffect, useRef } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { errorNotify } from "../utils/ToastifyNotifications";
import { findUser } from "../utils/FirestoreUserHelper";


import { HiPaperAirplane } from "react-icons/hi2";

import useAuth from "../hooks/useAuth";
import useMessages from "../hooks/useMessages";
import useChats from "../hooks/useChats";

import { db } from "../firebase/firebase.config";

export default function MessagesPage(){
    const [friendUID, setFriendUID] = useState(""); // the friend the user is chatting with
    // const [friendName, setFriendName] = useState("");
    const { chats } = useChats(); // chats that the user is a part of

    // get relevant variables to update chat using the useMessages hook
    const { msgs, sendMessage, currentChatId, setCurrentChatId } = useMessages(); 

    const { user } = useAuth(); // the current user
    const [newMsg, setNewMsg] = useState(""); // represents what the user is typing in the messages input box

    const bottomRef = useRef(null); // reference to the bottom of the page for the messages section to scroll to

    // SCROLL TO THE BOTTOM OF MESSAGES WHENEVER A NEW MESSAGE IS ADDED
    useEffect(() => {
        // bottom ref -> reference to bottom of messages portion of the messages page
        // current -> DOM element, so the empty div at the bottom of the messages section
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [msgs])

    /**
     * Helper function to determine if a chat with a specific friend UID already exists.
     * It searches through the chats and assigns it to existingChat. If this is not null, it returns this id.
     * Otherwise, it must create a new chat, so it adds a doc to the chats collection in firestore, adding the
     * two users (friend and current user) as participants of the chat. Then, it returns the id of this new chat
     * @param {} friendUID 
     * @returns ID of existing chat or new chat
     */
    const createOrGetChat = async (friendUID) =>{
        // check if the chat already exists. if it does, return the id
        const existingChat = chats.find(chat => chat.participants.includes(friendUID));
        if (existingChat) return existingChat.id; 

        // otherwise, create a new chat and then return its id
        const newChatDoc = await addDoc(collection(db, "chats"),
            {
                participants: [user.uid, friendUID],
                createdAt: serverTimestamp(),
            });
        return newChatDoc.id;
    }

    /**
     * Handles adding a new chat when the user types a UID into the text field. 
     * It utilizes the helper function to create a new chat if the chat does not yet exist or retrieve the
     * existing chat if it already exists.
     * @returns
     */
    const handleAddChat = async () => {
        const friend = await findUser(friendUID);

        if(!friend.exists()) {
            errorNotify("That user does not exist! Please enter a valid User ID.");
            return;
        }

        if (friendUID === user.uid){
            errorNotify("That's you! Enter a User ID of your friend.");
            return;
        }

        const chatId = await createOrGetChat(friendUID);
        setCurrentChatId(chatId);
        setFriendUID("");
    }

    /**
     * Handles when a friend is clicked in the side bar by changing the current chat to the selected chat.
     * @param {} friendUid 
     */
    const handleClickFriend = (friendUid) => {
        const chat = chats.find(c => c.participants.includes(friendUid));
        if (chat) setCurrentChatId(chat.id);
    };
    
    /**
     * When a message is sent, add it to the collection of messages for the current chat in fire store.
     * Then, reset the messages field so the old message doesn't linger in the message text field.
     * @param {} e 
     * @returns 
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent the page from reloading when a message is sent
        if (newMsg === "" || !currentChatId) return; // don't send empty messages and make sure a chat is selected!

        await sendMessage(newMsg, user, currentChatId);

        setNewMsg(""); // reset msg after submit
    };

    return (
    <> 
    <div className="h-full flex">
    {/* side bar */}
    <div className="w-96 border-r bg-gray-50 flex flex-col p-4 gap-4">
        <legend className="fieldset-legend">Enter a UID to Start a New Chat</legend>
        <label className="input">
        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
            >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
            </g>
        </svg>
        <input
            type="search"
            className="grow"
            placeholder="UID"
            value={friendUID}
            onChange={(e) => setFriendUID(e.target.value)}
        />
        </label>
        <button className="btn" onClick={handleAddChat}>Add Chat</button>
        {chats.map(chat => {
            const friendUid = chat.participants.find(uid => uid !== user.uid);
            return (
                <button className="btn" key={chat.id} onClick={() => handleClickFriend(friendUid)}>
                {friendUid}
                </button>
            );
        })} 
    </div>

    <div className="flex-1 flex flex-col">
      {/* messages - flex-1 makes sure msgs take all remaining space */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {/* chat bubble on the left side if current user sent it, chat bubble on left side if non current user sent it */}
        {msgs.map((message,index) => (
            <div key={index} className={
                `chat ${
                message.uid === user.uid ? "chat-end" : "chat-start"}`
            }>
            <div className="chat-header">
                {message.displayName || "Unknown Chatter"}
                <time className="text-xs opacity-50">{message.createdAt?.toDate?.().toLocaleTimeString?.() || ""}</time>
            </div>
            <div className="chat-bubble text-lg">{message.text}</div>
            </div>
        ))}

        {/* reference to the bottom of the messages so messages can auto scroll to show newest */}
        <div ref={bottomRef} />
    </div>

      {/* message input */}
      <form className="p-4 bg-white border-t flex gap-2 shrink-0" onSubmit={handleSubmit}>
        <input
          className="flex-1 border px-3 py-2"
          placeholder="What's on your to-do list today...?"
          onChange = {(e) => setNewMsg(e.target.value)}
          value={newMsg}
        />
        {/* Button to submit messages */ }
        <button type="submit" className="bg-pink-400 text-white font-bold px-4 py-2 rounded">
          {<HiPaperAirplane />}
        </button>
      </form>
    </div>
    </div>
    </>
  );
}