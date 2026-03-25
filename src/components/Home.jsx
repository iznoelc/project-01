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
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <div className="hero bg-base-200 min-h-80vh">
                    <div className="hero-content flex-col lg:flex-row text-center gap-12 p-4">
                        <img
                        src={Lily}
                        className="max-w-lg rounded-lg"
                        />
                        <div className="p-4">
                        <h1 className="text-5xl font-bold">Clever catchphrase here.</h1>
                        <h3 className="text-2xl text-neutral font-bold italic">Manage your tasks as mindlessly as flowers bloom.</h3>
                        <p className="py-6">
                            Intro i will write an intro here later <br/> im too lazy to come up with something clever right now jajjaajajaja
                            < br/>< br/>
                            It looks like you're logged out! <b>Login or Sign up now</b> to access all our features. It's free!
                        </p>
                        <div className="flex gap-2 justify-center">
                            <button class="btn btn-primary hover:scale-105" onClick={() => navigate("/login")}>Login</button>
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
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mx-auto p-8 justify-center"> 
            {navigation.map((n, index) => (
            <a href={n.link} className="hover-3d my-12 mx-2 cursor-pointer">
            
            {/* content */}
            <div key={index} className="card w-96 bg-pink-400 text-white bg-[radial-gradient(circle_at_bottom_left,#ffffff04_35%,transparent_36%),radial-gradient(circle_at_top_right,#ffffff04_35%,transparent_36%)] bg-size-[4.95em_4.95em]">
                <div className="card-body">
                <div className="flex justify-between mb-10">
                    <div className="font-bold uppercase text-2xl">{n.name}</div>
                    <div className="text-5xl opacity-10">❁</div>
                </div>
                <div className="text-lg mb-4 opacity-90">{n.desc}</div>
                <div className="flex justify-between">
                    <div>
                    <div className="text-xs opacity-20">CARD HOLDER</div>
                    <div>VICTOR VON D.</div>
                    </div>
                    <div>
                    <div><img src={Peonies} className="w-24"></img></div>
                    </div>
                </div>
                </div>
            </div>
            
            {/* 8 empty divs needed for the 3D effect */}
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            </a>
            ))}
            </div>
        )}
        </>
    );
}