import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Popconfirm } from 'antd';

import useSavedLinks from "../hooks/useSavedLinks";


export default function SavedLinks() {
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
            <div className="modal-box max-w-xl">
                <h2 className="fontdiner-swanky-regular text-3xl">Your Saved Links</h2>
                <div className="grid grid-cols-3 gap-4 p-4">
                {userLinks.length === 0 && <p className="text-pink-400">No saved links!</p>}
                {userLinks.map((link,index) => (
                    <div key={index} className="flex gap-2">
                        <li><a href={link.link_url} className="underline"> {link.link_name} </a></li>
                        {/* <p onClick={}>DELETE</p> */}
                        <Popconfirm
                            title="Delete Saved Link"
                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            description="Are you sure you want to delete this saved link?"
                            onConfirm={() => deleteLink(link.id)}
                            okText="Yes"
                            okType="danger"
                            cancelText="No"
                            className="z-100 max-w-sm"
                            >
                            <button className="btn btn-primary btn-xs" danger>Delete</button>
                        </Popconfirm>
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