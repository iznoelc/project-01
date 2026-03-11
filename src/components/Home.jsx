import { useNavigate } from "react-router-dom";

export default function Home(){
    const navigate = useNavigate();

    return (
        <>
        <div className="flex flex-col items-center justify-center gap-12 p-16">
            <h1 className="text-3xl text-center">This is the home/landing page.
                <br />Buttons to navigate to other pages for testing.
                <br />I will make this look good later.</h1>
            <button class="btn btn-outline btn-primary" onClick={() => navigate("/signup")}>Sign up</button>
            <button class="btn btn-outline btn-primary" onClick={() => navigate("/login")}>Login</button>
            <button class="btn btn-outline btn-primary" onClick={() => navigate("/forgotpassword")}>Forgot Password</button>
            <button class="btn btn-outline btn-primary" onClick={() => navigate("/messages")}>Messages</button>
            <button class="btn btn-outline btn-primary" onClick={() => navigate("/weather")}>Weather</button>
            <button class="btn btn-outline btn-primary" onClick={() => navigate("/todo")}>To-Do</button>
        </div>
        </>
    );
}