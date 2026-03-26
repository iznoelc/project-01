import { IoMdClose } from "react-icons/io";

export default function SavedLinks() {
    return (
        <>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        
        <dialog id="links_modal" className="modal">
        <div className="modal-box">
            <h2 className="fontdiner-swanky-regular text-3xl">Your Saved Links</h2>
            <p>link here</p>
            <h3 className="font-bold text-lg">Add new link:</h3>
            <div className="flex gap-2">
                <input type="text" placeholder="Enter Name..." class="input" />
                <input type="text" placeholder="Enter Link..." class="input" />
                <button className="btn btn-primary">Add</button>
            </div>
            <div className="modal-action">
            <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-ghost">Exit <IoMdClose /></button>
            </form>
            </div>
        </div>
        </dialog>
        </>
    )
}