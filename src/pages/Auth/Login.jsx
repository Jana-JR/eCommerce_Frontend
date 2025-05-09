import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import axios from "../../Utils/axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({ type: "LOGIN_FAILURE", payload: null });
  }, [dispatch]);

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await axios.post("/auth/login", credentials, {
        withCredentials: true,
      });
      const user = res.data;

      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      toast.success("Login Success");

      if (user.isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      dispatch({ type: "LOGIN_FAILURE", payload: { message: errorMessage } });
      toast.error(errorMessage);
    }
  };
  return (
    <div className="bg-[#F5F5F5]">
      <div className="py-32 lg:py-32">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="relative mx-auto mt-[-5rem] max-w-[525px] overflow-hidden bg-transparent py-16 px-10 text-center sm:px-12 md:px-[60px]">
                <div className="mb-10 text-center md:mb-16">
                  <h2 className="text-5xl font-bold text-black">LOGIN</h2>
                </div>

                <form>
                  <div className="mb-6">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      onChange={handleChange}
                      className="bordder-[#E9EDF4] w-full rounded-3xl focus:ring border bg-[#FCFDFE] py-3 px-5 text-base text-body-color placeholder-[#ACB6BE] outline-none focus:border-[#41A4FF] focus-visible:shadow-none"
                    />
                  </div>
                  <div className="mb-9">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      onChange={handleChange}
                      className="bordder-[#E9EDF4] w-full rounded-3xl border focus:ring bg-[#FCFDFE] py-3 px-5 text-base text-body-color placeholder-[#ACB6BE] outline-none focus:border-[#41A4FF] focus-visible:shadow-none"
                    />
                  </div>
                  <div className="mb-10">
                    <button
                      disabled={loading}
                      onClick={handleClick}
                      className="w-full cursor-pointer rounded-3xl font-bold bg-black text-center hover:bg-gray-600 py-3 px-5 text-white transition hover:bg-opacity-90"
                    >
                      {loading ? "Signing In..." : "Sign In"}
                    </button>
                  </div>
                </form>

                <Link
                  to="/reset-password"
                  className="mb-2 inline-block text-base text-red-500 font-semibold cursor-pointer hover:text-primary hover:underline"
                >
                  Forget Password?
                </Link>
                <p className="text-base text-[#000000]">
                  Not a member yet?
                  <Link
                    to="/register"
                    className="cursor-pointer hover:underline ms-2 font-bold text-black"
                  >
                    Sign Up
                  </Link>
                </p>

                {error && (
                  <p className="mt-4 text-red-500 font-medium">
                    {error.message || "Login failed"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
