import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../features/authSlice.js";
import { Button, Input, Logo } from "./index.js";
import { useDispatch } from "react-redux";
import authService from "../appWrite/auth.js";
import { useForm } from "react-hook-form";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);

  const login = async (data) => {
    setError("");
    {
      /* Reset error message before each login attempt */
    }
    try {
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center w-full mt-[84px]">
      <div
        className={`mx-auto w-full max-w-lg opacity-89cp-10 
          backdrop-blur-sm bg-white/60 border border-white/30 rounded-xl shadow-xl px-6 py-5`}
      >
        <div className="mb-2 flex justify-center jus">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have any account?&nbsp;{/*means space */}
          <Link
            to="/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        <form onSubmit={handleSubmit(login)} className="mt-8">
          <div className=" space-y-5">
            <Input
              required
              label="Email: "
              labelClassName="text-buttonsT"
              type="email"
              placeholder="Enter the email pls"
              {...register("email", {
                required: "Email is required",
                validate: {
                  matchPattern: (val) =>
                    /^\S+@\S+$/.test(val) || "Invalid email format",
                },
              })}
            />{" "}
            {/*this ...register("email is saying that--Track the input with the name email, and apply the following validation rules to it. ") */}
            <Input
              required
              label="Password: "
              type="password"
              labelClassName="text-buttonsT"
              placeholder="Enter password"
              {...register("password", {
                required: true,
              })}
              /*^\S+@\S+$ is a regex that checks for:
            At least one non-space character before and after @ No spaces.*/
            />
            <div className="flex justify-center">
              <Button className="transition-transform duration-300 hover:scale-105 bg-buttons text-buttonsT border-gray-950 border">
                Sign In
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
