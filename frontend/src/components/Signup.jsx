import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Logo } from "./index";


function Signup() {

  return (
    <div className="flex items-center justify-center mt-[84px]">
      <div
        className={`mx-auto w-full max-w-lg p-10 
          backdrop-blur-sm bg-[#b8a595]/80 border border-white/30 rounded-xl shadow-xl px-6 py-5`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
            <Logo width="100%" />
          </span>
        </div>
        <h2
          className="text-center text-2xl 
        font-bold leading-tight text-buttonsT"
        >
          Create your account{" "}
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign In
          </Link>
        </p>
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

        <form onSubmit={handleSubmit(create)}>
          <div className="space-y-5 mt-2 flex flex-col items-center">
            <Input
              required
              labelClassName="text-buttonsT"
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              {...register("name", {
                required: true,
              })}
            />

            <Input
              required
              label="Email"
              labelClassName="text-buttonsT"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (val) =>
                    /^\S+@\S+$/.test(val) || "Invalid email format",
                },
              })}
            />

            <Input
              required
              labelClassName="text-buttonsT"
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />
            <div>
              <Button
                type="submit"
                className="w-full hover:scale-105 bg-buttons text-buttonsT border-gray-950 border"
              >
                Create Account
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
