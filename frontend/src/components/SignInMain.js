import { useState } from "react";
import "./SignInMain.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginUser } from "../api/stocks";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const SignInMain = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useCookies(["token"]);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log(data);
      if (data.non_field_errors) {
        console.log(data.non_field_errors[0]);
        setErrorMessage(data.non_field_errors[0]);
      } else {
        setToken("token", data.token);
        navigate("/");
      }
    },
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    const body = {
      username,
      password,
    };
    console.log(body);
    loginMutation.mutate(body);
  };
  return (
    <div className="signInMain">
      {errorMessage !== "" ? (
        <div className="errorMessage">Invalid Credentials</div>
      ) : null}
      <div className="inputsform1">
        <div className="input">
          <div className="emailWrapper">
            <div className="email">Username</div>
          </div>
          <input
            className="inputChild"
            placeholder="Enter your username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="input1">
          <div className="emailWrapper">
            <div className="email">Password</div>
          </div>
          <div className="wrapperFrame129">
            <input
              className="wrapperFrame129Child"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
        </div>
      </div>
      <br />
      <br />
      <div className="bottom">
        <div className="signinbuttons">
          <div className="button1" onClick={handleSubmit}>
            <div className="signIn1">Sign in</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInMain;
