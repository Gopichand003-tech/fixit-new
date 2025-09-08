import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";
import { toast, Toaster } from "sonner";
import { useAuth } from "../context/AuthContext";

export default function LoginRegister() {
  const [isSignup, setIsSignup] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  // Forgot/reset states
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [loadingForgot, setLoadingForgot] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // manual Signup/Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isSignup ? "/signup" : "/login";
      const payload = isSignup
        ? { name: formData.name, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

      const response = await axios.post(
        `http://localhost:5000/api/auth${endpoint}`,
        payload
      );

      if (response.data.token) {
        loginUser(response.data.user, response.data.token);

        toast.success(`${isSignup ? "Signup" : "Login"} Successful ✅`, {
          description: `Welcome, ${response.data.user?.name || "User"}!`,
          duration: 1700,
        });

        navigate("/dashboard");
      } else {
        toast.info(response.data.message || "Success");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    }
  };

  // Google login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credentialResponse.credential,
      });

      if (!res.data?.token) throw new Error("No token received from server");

      loginUser(res.data.user, res.data.token);
      toast.success("Google Login Successful ✅", {
        description: `Welcome, ${res.data.user?.name || "User"}!`,
        duration: 1700,
      });

      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Google login failed");
    }
  };

  // Forgot Password (Step 1 → Send OTP)
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email");
      return;
    }
    setLoadingForgot(true);
    try {
     await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email: forgotEmail });

      toast.success("OTP sent to your email");
      setForgotModalOpen(false);
      setResetModalOpen(true); // open OTP modal
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoadingForgot(false);
    }
  };

  // Reset Password (Step 2 → Verify OTP + new password)
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      toast.error("Enter OTP and new password");
      return;
    }
    setLoadingReset(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/new-password`, {
        email: forgotEmail,
        otp,
        newPassword,
      });
      toast.success("Password reset successful, please login");
      setResetModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center relative">
      <Toaster position="top-center" richColors />

      {/* Background animations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>

      {/* Main Container */}
      <div className="w-full max-w-8xl bg-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.3)] flex flex-col md:flex-row border border-white/20">
        {/* Left */}
        <div className="hidden md:flex flex-col justify-start items-center w-1/2 relative h-[600px] overflow-hidden">
          <img src="/type2.jpeg" alt="Workers" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute top-45 left-1/2 -translate-x-1/2 text-center z-10 px-4">
            <h1 className="text-4xl font-bold text-white">{isSignup ? "Join Us" : "Welcome Back"}</h1>
            <p className="mt-2 text-gray-200">
              {isSignup ? "Sign up to unlock premium features." : "Log in to access your dashboard."}
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 p-8 sm:p-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            {isSignup ? "Create Account" : "Sign In"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-100/60 dark:bg-gray-800/60 text-gray-900 dark:text-white border border-gray-300/40 focus:ring-4 focus:ring-purple-500 outline-none"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-100/60 dark:bg-gray-800/60 text-gray-900 dark:text-white border border-gray-300/40 focus:ring-4 focus:ring-purple-500 outline-none"
            />

            <div className="flex items-center gap-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-white shadow-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:ring-4 focus:ring-purple-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-800"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 hover:opacity-90 text-white font-semibold rounded-lg transition-transform transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              {isSignup ? "Sign Up" : "Login"}
            </button>

            {!isSignup && (
              <p
                onClick={() => setForgotModalOpen(true)}
                className="text-sm text-purple-500 hover:underline cursor-pointer text-center"
              >
                Forgot Password?
              </p>
            )}

            <div className="flex justify-center mt-4">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error("Google login failed")}
              />
            </div>
          </form>

          <p className="text-center text-blue-800 dark:text-gray-300 mt-6 text-sm">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              onClick={() => setIsSignup(!isSignup)}
              className="text-purple-900 hover:underline cursor-pointer font-medium"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </span>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal (Step 1) */}
      {forgotModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Forgot Password</h3>
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-100/60 dark:bg-gray-800/60 border"
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingForgot}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 text-white rounded-lg hover:opacity-90"
                >
                  {loadingForgot ? "Sending..." : "Send OTP"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal (Step 2) */}
      {resetModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Enter OTP & New Password
            </h3>
            <form onSubmit={handleResetSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-100/60 dark:bg-gray-800/60 border"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-100/60 dark:bg-gray-800/60 border"
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setResetModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingReset}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 text-white rounded-lg hover:opacity-90"
                >
                  {loadingReset ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);} }
        .animate-pulse-slow { animation: pulseSlow 6s ease-in-out infinite; }
        @keyframes pulseSlow { 0%,100%{transform:scale(1);opacity:0.6;}50%{transform:scale(1.1);opacity:0.8;} }
      `}</style>
    </div>
  );
}
