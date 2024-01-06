import { useCallback } from "react";
import SignInMain from "./SignInMain";
import "./SignInBody.css";

const SignInBody = () => {
  return (
    <div className="signIn">
      <div className="titleSignIn">
        <h1 className="welcomeBack1">Welcome back</h1>
        <div className="welcomeBackPlease1">
          Welcome back! Please enter your details
        </div>
      </div>
      <SignInMain />
    </div>
  );
};

export default SignInBody;
