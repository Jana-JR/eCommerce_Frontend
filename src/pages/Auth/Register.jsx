import axios from "../../Utils/axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      await axios.post("auth/signup", {
        name,
        email,
        password,
        role: "user",
      });
      toast.success("Registration Success.");

  
      navigate("/login");

    } catch (err) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="bg-[#F5F5F5]">
      <div className="py-10 lg:py-20 px-16 lg:px-96 md:px-64 flex flex-col text-center">
        <div className="mb-8 text-center">
          <h2 className="text-5xl font-bold text-[#008080]">SIGN UP</h2>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                placeholder="Name"
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-[#E9EDF4] w-full rounded-3xl border bg-[#FCFDFE] py-3 px-5 text-base text-body-color placeholder-[#ACB6BE] outline-none focus:ring focus:border-[#41A4FF] focus-visible:shadow-none"
              />
            </div>
            <div className="mb-6">
              <input
                placeholder="Email"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-[#E9EDF4] w-full rounded-3xl border bg-[#FCFDFE] py-3 px-5 text-base text-body-color placeholder-[#ACB6BE] outline-none focus:ring focus:border-[#41A4FF] focus-visible:shadow-none"
              />
            </div>
            <div className="mb-6">
              <input
                placeholder="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[#E9EDF4] w-full rounded-3xl border bg-[#FCFDFE] py-3 px-5 text-base text-body-color placeholder-[#ACB6BE] outline-none focus:ring focus:border-[#41A4FF] focus-visible:shadow-none"
              />
            </div>
            <div className="mb-9">
              <input
                placeholder="Repeat Password"
                type="password"
                id="repeatPassword"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="border-[#E9EDF4] w-full text-base rounded-3xl border bg-[#FCFDFE] py-3 px-5 text-body-color focus:ring placeholder-[#ACB6BE] outline-none focus:border-[#41A4FF] focus-visible:shadow-none"
              />
            </div>
            <div className="mb-10">
              <button
                type="submit"
                className="w-full font-bold text-center hover:bg-gray-600 cursor-pointer rounded-3xl bg-[#008080] py-3 px-5 text-white transition hover:bg-opacity-90"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col justify-center text-center pb-20">
          <p className="text-base text-[#000000]">
            Already a member yet?
            <Link
              to="/login"
              className="text-[#008080] hover:underline ms-2 font-bold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
