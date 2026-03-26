import { successNotify } from "../utils/ToastifyNotifications";
import copy from "copy-to-clipboard";

export const copyToClipboard = (copyRef) => {
    let copyText = copyRef.current.value;
    let isCopy = copy(copyText);
    if (isCopy) {
        successNotify("Copied successfully!");
    }
};