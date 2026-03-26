import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import useUserByUID from "../hooks/useUserByUID";
import useSavedLinks from "../hooks/useSavedLinks";


export default function SavedLinks() {
    const { userDoc } = useUserByUID();
    const { userLinks, addLink, deleteLink } = useSavedLinks();

    const [formData, setFormData] = useState({
        link_name: "",
        link_url: ""
    });

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevState) =>({
            ...prevState,
            [name]: value
        }));

        
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // prevents page reload
        console.log("Form Submitted:", formData); // logs the data entered into the form
        await addLink(formData.link_name, formData.link_url);

        setFormData({
            link_name: "",
            link_url: ""
        });
    }

    return (
        <>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
        
        <dialog id="links_modal" className="modal">
            <div className="modal-box">
                <h2 className="fontdiner-swanky-regular text-3xl">Your Saved Links</h2>
                <div className="flex flex-col gap-4">
                {userLinks.map((link,index) => (
                    <div key={index} className="flex">
                        <a href={link.link_url}> {link.link_name} </a>
                        <p onClick={() => deleteLink(link.id)}>DELETE</p>
                    </div>
                ))}
                </div>
                <h3 className="font-bold text-lg">Add new link:</h3>
                <div>
                    <form className="flex gap-2">
                        <input
                            type="text"
                            id="link_name"
                            name="link_name"
                            placeholder="Enter Name..."
                            value={formData.link_name}
                            onChange={handleChange}
                            className="input"
                        />
                        <input
                            type="text"
                            id="link_url"
                            name="link_url"
                            placeholder="Enter Link..."
                            value={formData.link_url}
                            onChange={handleChange}
                            className="input"
                        />
                        <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Add</button>
                    </form>
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