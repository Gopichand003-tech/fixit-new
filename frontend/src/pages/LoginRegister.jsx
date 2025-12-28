import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";
import { toast, Toaster } from "sonner";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";

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
  const [loadingAuth, setLoadingAuth] = useState(false);
const [resendTimer, setResendTimer] = useState(0);
const [canResend, setCanResend] = useState(true);

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ================= MANUAL LOGIN ================= */
 const handleSubmit = async (e) => {
  e.preventDefault();
  if (loadingAuth) return;

  // 🔐 Password validation
  if (formData.password.length < 8) {
    toast.error("Password must be at least 8 characters");
    return;
  }

  setLoadingAuth(true);

  try {
    const endpoint = isSignup ? "/signup" : "/signin";
    const payload = isSignup
      ? formData
      : { email: formData.email, password: formData.password };

    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth${endpoint}`,
      payload,
      { withCredentials: true, timeout: 6000 }
    );

    if (!data?.token) throw new Error("Token missing");

    Cookies.set("token", data.token, { expires: 7 });
    loginUser(data.user, data.token);

    toast.success(`${isSignup ? "Signup" : "Login"} Successful ✅`, {
      duration: 800,
    });

    setTimeout(() => navigate("/dashboard"), 200);
  } catch (err) {
    toast.error(err.response?.data?.message || "Authentication failed");
  } finally {
    setLoadingAuth(false);
  }
};

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/google-login`,
        { token: credentialResponse.credential },
        { timeout: 15000, withCredentials: true }
      );

      loginUser(res.data.user, res.data.token);
      Cookies.set("token", res.data.token, { expires: 7 });

      toast.success("Google Login Successful ✅", { duration: 800 });
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Google login failed");
    }
  };

  /* ================= FORGOT PASSWORD ================= */
 const handleForgotSubmit = async (e) => {
  e.preventDefault();
  if (!forgotEmail) return toast.error("Enter email");

  setLoadingForgot(true);

  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/reset-password-request`,
      { email: forgotEmail }
    );

    toast.success("OTP sent to email");

    // reset fields
    setOtp("");
    setNewPassword("");

    // start resend timer
    setCanResend(false);
    setResendTimer(60);

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setForgotModalOpen(false);
    setResetModalOpen(true);
  } catch (err) {
    toast.error(err.response?.data?.message || "Error sending OTP");
  } finally {
    setLoadingForgot(false);
  }
};

/* ================= RESET PASSWORD ================= */
const handleResetSubmit = async (e) => {
  e.preventDefault();

  if (!otp || !newPassword) {
    toast.error("Please fill all fields");
    return;
  }

  if (newPassword.length < 8) {
    toast.error("Password must be at least 8 characters");
    return;
  }

  setLoadingReset(true);

  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
      {
        email: forgotEmail,
        otp,
        newPassword,
      }
    );

    toast.success("Password reset successful ✅");

    // cleanup + close modal
    setOtp("");
    setNewPassword("");
    setForgotEmail("");
    setResetModalOpen(false);
  } catch (err) {
    toast.error(err.response?.data?.message || "Reset failed");
  } finally {
    setLoadingReset(false);
  }
};

  return (
<div className="min-h-screen w-full flex sm:items-center justify-center px-4 py-6 overflow-y-auto bg-gray-100">
  
  {loadingAuth && (
  <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
    <div className="bg-white px-6 py-4 rounded-xl shadow-lg font-semibold">
      Please wait…
    </div>
  </div>
)}

      <Toaster position="top-center" richColors />

      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Main Card */}
      <div className="w-full max-w-6xl bg-gray-500/10 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-white/20">

        {/* Left Video (Desktop only) */}
        <div className="hidden lg:flex w-1/2 relative overflow-hidden">
          <video
            src="/bgvideo2.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 m-auto text-center text-white px-6">
            <h1 className="text-5xl font-bold">
              {isSignup ? "Join Us" : "Welcome Back"}
            </h1>
            <p className="mt-4 text-lg">
              {isSignup ? "Create an account to continue" : "Login to your dashboard"}
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 flex items-center justify-center px-2 py-6">
          <div className="w-full max-w-md bg-white/90 dark:bg-gray-900/90 rounded-2xl px-5 py-6 sm:px-8 sm:py-8 shadow-lg">

            {/* Logo */}
            <div className="flex justify-center items-center gap-3 mb-3 justify-start px-4 sm:px-16 py-6 ">
<div className="w-10 h-10 sm:w-20 sm:h-20 rounded-full p-[3px]
  bg-gradient-to-br from-black via-yellow-400 to-black
  shadow-[0_0_20px_rgba(255,215,0,0.5)]
">
  <video
    src="/mainpage.mp4"
    autoPlay
    loop
    muted
    playsInline
    className="w-full h-full rounded-full object-cover bg-white"
  />
</div>
             <span className="text-2xl sm:text-5xl font-black tracking-wider">
  <span className="text-black drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)]">
    FIX
  </span>
  <span className="text-yellow-400 
    drop-shadow-[0_0_8px_rgba(250,204,21,0.9)] 
    drop-shadow-[0_0_16px_rgba(250,204,21,0.7)]
    drop-shadow-[0_0_28px_rgba(250,204,21,0.5)]
  ">
    IT
  </span>
</span>

            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
              {isSignup ? "Create Account" : "Sign In"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
className="
  w-full
  px-4 sm:px-5
  py-3.5
  text-[15px] sm:text-base
  rounded-xl
  bg-gray-100
  border border-gray-200
  focus:border-purple-500
  focus:ring-2 focus:ring-purple-500/40
  outline-none
  transition-all
"
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm sm:text-base rounded-lg bg-gray-100 focus:ring-4 focus:ring-purple-500 outline-none"
              />

              <div className="space-y-1">
  {/* Input row */}
<div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      placeholder="Password (min 8 characters)"
      value={formData.password}
      onChange={handleChange}
      minLength={8}
      required
     className="
  w-full
  px-4 sm:px-5
  py-3.5
  pr-12
  text-[15px] sm:text-base
  rounded-xl
  bg-gray-100
  border border-gray-200
  focus:border-purple-500
  focus:ring-2 focus:ring-purple-500/40
  outline-none
"

    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
    >
      {showPassword ? <FiEyeOff /> : <FiEye />}
    </button>
  </div>

  {/* Error message */}
  {formData.password && formData.password.length < 8 && (
    <p className="text-xs text-red-500 ml-1">
      Password must be at least 8 characters
    </p>
  )}
</div>

              <button
                type="submit"
                disabled={loadingAuth}
className="
  w-full
  py-3.5
  rounded-xl
  text-white
  font-semibold
  tracking-wide
  bg-gradient-to-r from-gray-700  to-yellow-500
  shadow-lg shadow-purple-500/30
  hover:shadow-xl hover:scale-[1.02]
  active:scale-[0.98]
  transition-all duration-200
  disabled:opacity-60
"
              >
                {loadingAuth ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
              </button>

              {!isSignup && (
                <button
  type="button"
  onClick={() => setForgotModalOpen(true)}
  className="block mx-auto text-sm text-purple-500 hover:underline"
>
  Forgot Password?
</button>

              )}

              <div className="flex justify-center mt-4 scale-95 sm:scale-100 ">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => toast.error("Google login failed")}
                />
              </div>
            </form>

            <p className="text-center mt-6 text-sm">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <span
                onClick={() => setIsSignup(!isSignup)}
                className="text-purple-600 font-medium cursor-pointer hover:underline"
              >
                {isSignup ? "Sign In" : "Sign Up"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ===== Modals ===== */}
      {(forgotModalOpen || resetModalOpen) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3 overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 p-5 rounded-xl shadow-lg">
            {forgotModalOpen ? (
              <>
                <h3 className="text-xl font-semibold mb-4">Forgot Password</h3>
                <form
  onSubmit={(e) => {
    e.preventDefault();
    handleForgotSubmit(e);
  }}
  className="space-y-4"
>
  <input
    type="email"
    placeholder="Enter email"
    value={forgotEmail}
    onChange={(e) => setForgotEmail(e.target.value)}
    className="w-full px-4 py-3 rounded-lg bg-gray-100"
  />

  <button
    type="submit"
    disabled={loadingForgot}
    className="w-full py-2 bg-purple-600 text-white rounded-lg disabled:opacity-60"
  >
    {loadingForgot ? "Sending..." : "Send OTP"}
  </button>
</form>

              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-4">Reset Password</h3>
                <form
  onSubmit={(e) => {
    e.preventDefault();
    handleResetSubmit(e);
  }}
  className="space-y-4"
>
  <input
    placeholder="Enter OTP"
    value={otp}
    onChange={(e) => setOtp(e.target.value)}
    className="w-full px-4 py-3 rounded-lg bg-gray-100"
  />

  <input
    type="password"
    placeholder="New Password (min 8 chars)"
    value={newPassword}
    onChange={(e) => setNewPassword(e.target.value)}
    className="w-full px-4 py-3 rounded-lg bg-gray-100"
  />

  <button
    type="submit"
    disabled={loadingReset}
    className="w-full py-2 bg-purple-600 text-white rounded-lg disabled:opacity-60"
  >
    {loadingReset ? "Resetting..." : "Reset Password"}
  </button>

  {/* Resend OTP */}
  <button
    type="button"
    disabled={!canResend}
    onClick={handleForgotSubmit}
    className="w-full text-sm text-purple-600 mt-2 disabled:opacity-50"
  >
    {canResend ? "Resend OTP" : `Resend OTP in ${resendTimer}s`}
  </button>
</form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
