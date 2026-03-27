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
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                <div className="hero bg-gradient-to-r from-base-100 to-base-300 min-h-screen">
                    <div className="hero-content flex-col lg:flex-row text-center gap-12 p-4">
                        <img
                        src={Lily}
                        className="max-w-lg rounded-lg"
                        />
                        <div className="p-4">
                        <div className="pb-16"><h1 className="text-6xl font-bold">Ready to manage your garden?</h1></div>
                        <h3 className="text-xl text-neutral font-bold italic">Your Garden lets you manage your tasks as mindlessly as flowers bloom.</h3>
                        <p className="py-6">
                            Capture, organize, and tackle your to-do list. Add and view weather from locations around the world. Message your close friends to help you stay on track.
                            <br /><br />It's all here in Your Garden! Are <i>you</i> ready to organize <i>your</i> life?
                            <br /><br /><br />
                            <b>Sign up now</b> to access all our features.
                            <br /><span className="text-2xl dr-sugiyama-regular">It's free!</span>
                        </p>
                        <div className="flex gap-2 justify-center">
                            <button class="btn btn-primary hover:scale-105" onClick={() => navigate("/signup")}>Sign Up</button>
                        </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>    
        )}
        {loggedIn &&
        (
        <>
        <div className="pt-4 p-4">
        <div className="hero bg-gradient-to-r from-base-100 to-base-300 min-h-96 p-4">
            <div className="hero-content text-center gap-5">
                <div className="max-w-md p-2">
                <img src={Peonies} alt="Peonies" className="object-contain mx-auto mb-4 max-w-64"></img>
                <h1 className="text-5xl font-bold">We're glad to see you back!</h1>
                <p className="py-2">
                    <span className="text-lg text-neutral text-bold italic">What's on the agenda today?</span>
                    <span className="opacity-70"><br />Need to send a message? Or update your to-do list? <br/>Click on any of the cards below to get started.</span>
                </p>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-5xl mx-auto p-8"> 
            {navigation.map((n, index) => (
                <div key={index} className="card w-full bg-base-100 card-xs shadow-sm
                hover:scale-110 hover:transition-transform hover:border-8 hover:border-solid hover:border-base-300 hover:cursor-pointer"
                onClick={() => navigate(n.link)}>
                    <div className="card-body">
                        {/* put the title and description of the movie in the cards */}
                        <h2 className="card-title fontdiner-swanky-regular text-2xl" key={index}>{n.name}</h2>
                        <p className="text-primary opacity-80 text-lg">{n.desc}</p>

                        {/* <div className="justify-end card-actions">
                        <button className="btn btn-outline btn-primary btn-circle" onClick={() => navigate(n.link)}>Go!</button>
                        </div> */}

                        </div>
                </div>
            ))}
            </div>
            </div>
        </>
        )}
        </>
    );
}