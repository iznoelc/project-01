/** SignupPage.jsx
 *  this is the page where the users can sign up by entering a username (sets the user's display name when they make an account w email and password)
 *  email, and password or sign up with google, using firebase authentication 
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import {
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import useAuth from "../hooks/useAuth";
import FallbackElement from "./FallbackElement";
import { errorNotify } from "../utils/ToastifyNotifications";

import { createUserInFirestore } from "../utils/FirestoreUserHelper";

function SignUpPage(){    
    const navigate = useNavigate(); // this is used to navigate the user to a new page after successful sign up
    const { signInWithGoogle, createUser, loggedIn } = useAuth(); // sign up with email and password or with google uses functions from the useAuth custom hook 
    const [signUpLoading, setSignUpLoading] = useState(false); // determine if sign up process is loading, separate from loading in useAuth
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [msg, setMsg] = useState("Error signing up. Please try again.");
    
    console.log("logged in: " + loggedIn); 

    // this is the form data that is updated when the user enters information into one of the text fields
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    // this is the method called when the user types into one of the text fields
    const handleChange = (event) => {
        // here, name is the name of the field (i.e. email)
        // value is what is being typed into the field (i.e. gleebus@gleepglorp.net)
        const {name, value} = event.target;
        setFormData((prevState) =>({
            ...prevState,
            [name]: value
        }));
    };

    // called when user hits the sign up button
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevents page reload
        console.log("Form Submitted:", formData);
        setSignUpLoading(true);
        
        try {
            const userCredential = await createUser(formData.email, formData.password);
            // successful sign up
            const user = userCredential.user;
            console.log(user);
            console.log("loggedIn: " + loggedIn);

            await updateProfile(user, {
                displayName: formData.username
            });
            
            createUserInFirestore(user.uid, user.displayName);

            setSignUpLoading(false);
            navigate("/", { replace: true });
        } catch (error) {
            // give the user an alert if sign up was unsuccessful and log errors for debugging
            setMsg("Error signing up. Please try again!");
            errorNotify(msg);
            setSignUpLoading(false);
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("error code: ", errorCode);
            console.log("error message: ", errorMessage);
            
        };
    };

    // this is called when the user signs up with google
    const handleGoogleSignUp = () => {
        setSignUpLoading(true);

        signInWithGoogle()
        .then((result) => {
            console.log(result.user);
            const newUser = {
                name: result.user.displayName,
                email: result.user.email,
                image: result.user.photoURL,
            };
            console.log(newUser);
            createUserInFirestore(newUser.uid, newUser.displayName);
            
            //navigate("/", { replace: true });
            //console.log(token);
            // IdP data available using getAdditionalUserInfo(result)
            setSignUpLoading(false);

            navigate("/", { replace: true });
            // ...
        })
        .catch((error) => {
            setMsg("Error signing up with Google. Please try again!");
            errorNotify(msg);
            setSignUpLoading(false);
            // unsuccessful sign up
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            
            // log errors for debugging
            console.log("error code: ", errorCode);
            console.log("error message: ", errorMessage);
            console.log("email: ", email);
            console.log("credential: ", credential);
      });
    }

    return(
        <>
        {signUpLoading && (<FallbackElement />)}
        {!signUpLoading && (
            <div className="flex flex-col items-center justify-center gap-5 p-10">
            <h1 className="primary-font text-primary text-2xl">Get Started</h1>
            <form onSubmit={handleSubmit}>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xl border p-4">
                <legend className="fieldset-legend">Sign Up</legend>

                {/* username input */}
                <label className="label">Enter Username</label>
                <label className="input validator w-xl">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                        >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                        </g>
                    </svg>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Username"
                        pattern="[A-Za-z][A-Za-z0-9\-]*"
                        minLength="3"
                        maxLength="30"
                        title="Only letters, numbers or dash"
                    />
                </label>
                <p className="validator-hint hidden">
                    Must be 3 to 30 characters
                    <br />containing only letters, numbers or dash
                </p>

                {/* email address input */}
                <label className="label">Enter Email Address</label>
                <label className="input validator w-xl">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                        >
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </g>
                    </svg>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="gleebus@glorpmail.com"
                    />
                </label>
                <div className="validator-hint hidden">Enter valid email address</div>

                { /* password input */}
                <label className="label">Enter Password</label>
                <label className="input validator w-xl">
                    <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                        >
                        <path
                            d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                        ></path>
                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                        </g>
                    </svg>
                    <input
                        type={passwordVisibility ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        required
                        placeholder="Password"
                        minLength="8"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                        onChange={handleChange}
                    />
                    <i className="hover: cursor-pointer" onClick={() => setPasswordVisibility(!passwordVisibility)}>
                        {passwordVisibility ? <FaEye /> : <FaEyeSlash />}
                    </i>
                </label>
                <p className="validator-hint hidden">
                    Must be more than 8 characters, including
                    <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
                </p>
                {/* buttons to sign up with email and password or google */}
                <button type="submit" className="btn btn-primary mt-4">Create Account and Login</button>
                <p className="secondary-font mt-4 text-center"><i>OR</i></p>
                <button type="button" className="btn bg-base-100x mt-4" onClick={handleGoogleSignUp}><FcGoogle /> Sign up with Google</button>
            </fieldset>
        </form>
        {/* redirect to sign in if the user already has an account */}
        <div className="flex items-center justify-center gap-5">
            <p className="secondary-font">Already joined? <a href="/login" className="hover:text-primary text-center">Login Here</a></p>
        </div>
        </div>
        )};
        </>
    );
}

export default SignUpPage;