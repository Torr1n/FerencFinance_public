import Logo from "./Logo";
import SignInBody from "./SignInBody";
import "./SignInForm.css";

const SignInForm = () => {
  return (
    <form className="signinform">
      <Logo />
      <SignInBody />
    </form>
  );
};

export default SignInForm;
