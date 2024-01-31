import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
          }),
        }
      );

      const data = await res.json();
      const { token, ...rest } = data;
      localStorage.setItem("access_token", token);
      dispatch(signInSuccess(rest));
      navigate("/");
    } catch (error) {
      console.log("Could not sign in with google", error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="submit"
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:oppacity-95"
    >
      Continue with google
    </button>
  );
};

export default OAuth;