// allows for useAuth to be used in other files

import { useContext } from "react";
import { MessagesContext } from "../contexts/MessagesContext";

const useMessages = () => {
  const msgsInfo = useContext(MessagesContext);
  return msgsInfo;
};

export default useMessages;