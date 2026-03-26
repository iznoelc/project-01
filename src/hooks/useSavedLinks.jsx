

import { useContext } from "react";
import { SavedLinksContext } from "../contexts/SavedLinksContext";

const useSavedLinks = () => {
  const savedLinksInfo = useContext(SavedLinksContext);
  return savedLinksInfo;
};

export default useSavedLinks;