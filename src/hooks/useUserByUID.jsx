

import { useContext } from "react";
import { UserByUIDContext } from "../contexts/UserByUIDContext";

const useUserByUID = () => {
  const userUIDInfo = useContext(UserByUIDContext);
  return userUIDInfo;
};

export default useUserByUID;