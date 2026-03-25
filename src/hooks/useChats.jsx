// allows for useChats to be used in other files

import { useContext } from "react";
import { ChatsContext } from "../contexts/ChatsContext";

const useChats = () => {
  const chatsInfo = useContext(ChatsContext);
  return chatsInfo;
};

export default useChats;