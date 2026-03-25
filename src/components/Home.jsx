import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Lily from "../assets/flowers/lillies_transparent_1.png";
import Peonies from "../assets/flowers/peonies_transparent_1.png";

export default function Home(){
    const navigate = useNavigate();
    const { loggedIn } = useAuth(); // sign up with email and password or with google uses functions from the useAuth custom hook 

    const navigation = [
        {name: "Messages", link: "/messages",
         desc: "Send and receive messages from other site users",
        },
        {name: "Weather", link: "/weather",
         desc: "Get a summary for the weather in multiple locations",
        },
        {name: "To-do", link: "/todo",
         desc: "View and modify your daily or weekly tasks",
        },
    ]

    return (
        <>
        {!loggedIn && (
        <div className="min-h-screen flex flex-col">
            <div className="flex-1 overflow-y-auto p-2 pt-16 space-y-2">
                <div className="hero bg-base-200 min-h-80vh">
                    <div className="hero-content flex-col lg:flex-row text-center gap-12 p-4">
                        <img
                        src={Lily}
                        className="max-w-lg rounded-lg"
                        />
                        <div className="p-4">
                        <h1 className="text-6xl font-bold">Clever catchphrase here.</h1>
                        <h3 className="text-xl text-neutral font-bold italic">Manage your tasks as mindlessly as flowers bloom.</h3>
                        <p className="py-6">
                            Intro i will write an intro here later <br/> im too lazy to come up with something clever right now jajjaajajaja
                            < br/>< br/>
                            It looks like you're logged out! <b>Sign up now</b> to access all our features.
                            <br /><span className="text-2xl dr-sugiyama-regular">It's free!</span>
                        </p>
                        <div className="flex gap-2 justify-center">
                            <button class="btn btn-primary hover:scale-105" onClick={() => navigate("/signup")}>Sign Up</button>
                        </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-12 p-16">
                <h1 className="text-3xl text-center">For testing. will be removed later.
                </h1>
                {navigation.map((n, index) => (
                    <button key={index} class="btn btn-outline btn-primary" onClick={() => navigate(n.link)}>{n.name}</button>
                ))}
            </div>
            </div>
        </div>    
        )}
        {loggedIn &&
        (
            <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="flex-1 flex items-center justify-center w-full p-4 pt-16 overflow-y-auto">
                <div className="hero w-[40%] max-w-[1200px] bg-base-200 min-h-80vh rounded-3xl shadow-sm shadow-pink-200">
                    <div className="hero-content flex-col lg:flex-row text-center p-4">
                        <img
                        src={Peonies}
                        className="max-w-64 rounded-lg"
                        />
                        <div className="">
                        <h1 className="text-6xl font-bold">Welcome back!</h1>
                        <h3 className="text-xl text-neutral font-bold italic">What's on the agenda today?</h3>
                        <p className="pt-6">
                            Click on any of the cards below to get started!
                        </p>
                        </div>
                    </div>
                </div>
            </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-8xl mx-auto p-8 justify-center items-center">
                    <div className="card w-96 bg-base-100 card-md shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title">Medium Card</h2>
                            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                            <div className="justify-end card-actions">
                            <button className="btn btn-primary">Buy Now</button>
                            </div>
                        </div>
                    </div>

                    <div className="card w-96 bg-base-100 card-md shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title">Medium Card</h2>
                            <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                            <div className="justify-end card-actions">
                            <button className="btn btn-primary">Buy Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}