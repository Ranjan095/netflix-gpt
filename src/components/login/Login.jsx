import React, { useRef, useState } from "react";
import Header from "../header/Header";
import backgroundLoginImg from "../../utils/images/backgroundLoginImg.jpg";
import { validation } from "../../utils/validation/validation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../utils/firebase/firebase";
import { useNavigate } from "react-router-dom";
import { addUser } from "../../ReduxToolkit/users/userSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  let [isSignInForm, setIsSignInForm] = useState(true);
  let [validationErrorMessage, setValidationErrorMessage] = useState(null);
  let navigate = useNavigate();
  let dispatch = useDispatch();
  let email = useRef();
  let password = useRef();
  let name = useRef();

  let handleToggleForm = () => {
    setIsSignInForm(!isSignInForm);
  };

  let handleClick = () => {
    let [emailValue, passwordValue] = [
      email?.current?.value,
      password?.current?.value,
    ];
    let validationMessage = validation(emailValue, passwordValue);
    setValidationErrorMessage(validationMessage);

    // console.log(emailValue, passwordValue);
    if (validationErrorMessage) return;

    if (!isSignInForm) {
      //signUp

      createUserWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCredential) => {
          const user = userCredential.user;

          updateProfile(user, {
            displayName: name?.current?.value,
            photoURL: "https://avatars.githubusercontent.com/u/113471389?v=4",
          })
            .then(() => {
              // Profile updated!
              const { uid, email, displayName, photoURL } = auth.currentUser;
              dispatch(addUser({ uid, email, displayName, photoURL }));

              // navigate("/");
            })
            .catch((error) => {
              // An error occurred
              // ...x`
            });

          // console.log("=====>", user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setValidationErrorMessage(`${errorCode} - ${errorMessage}`);
        });
    } else {
      // signIn
      signInWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // console.log(user);
          // navigate("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setValidationErrorMessage(`${errorCode} - ${errorMessage}`);
        });
    }
  };

  let handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <div className="absolute ">
        <img src={backgroundLoginImg} alt="backgroundImage" />
      </div>
      <div className="absolute bg-black opacity-80 w-4/12 m-auto left-0 right-0 top-[100px] px-10 py-4 rounded-md">
        <h1 className="text-white font-bold text-3xl my-[20px]">
          {isSignInForm ? "Sign in" : "Sign up"}
        </h1>
        <form onSubmit={handleSubmit}>
          {!isSignInForm && (
            <input
              required
              ref={name}
              type="text"
              placeholder="Full Name"
              className="text-white bg-gray-800 my-2 w-full p-3 rounded-md"
            />
          )}
          <input
            required
            ref={email}
            type="text"
            placeholder="Email or mobile number"
            className="text-white bg-gray-800 my-2 w-full p-3 rounded-md"
          />
          <br />
          <input
            required
            ref={password}
            type="password"
            placeholder="password"
            className="text-white bg-gray-800 my-2 w-full p-3 rounded-md"
          />
          <br />
          <p className="text-[#E50914] font-bold py-2">
            {validationErrorMessage}
          </p>
          <button
            onClick={handleClick}
            type="submit"
            className="text-white font-semibold bg-[#E50914] hover:bg-[#E50914]/70 my-2 p-2 w-full rounded-md"
          >
            {isSignInForm ? "Sign in" : "Sign up"}
          </button>
          <p
            onClick={handleToggleForm}
            className="text-white cursor-pointer my-4"
          >
            {isSignInForm
              ? "New to Netflix! Signup now"
              : "Already registered sign in now"}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
