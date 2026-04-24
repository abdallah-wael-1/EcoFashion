import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const MOCK_ACCOUNTS = {
  "admin@ecofashion.com": {
    role: "admin", name: "Admin", ecoCredits: 999, trustScore: 5.0,
    roles: ["buyer", "seller", "creator"],
    canBuy: true, canSell: true, canCreate: true,
  },
  "seller@test.com": {
    role: "member", name: "Seller Test", ecoCredits: 340, trustScore: 4.7,
    roles: ["buyer", "seller"],
    canBuy: true, canSell: true, canCreate: false,
  },
  "buyer@test.com": {
    role: "member", name: "Buyer Test", ecoCredits: 80, trustScore: 4.2,
    roles: ["buyer"],
    canBuy: true, canSell: false, canCreate: false,
  },
};

const Login = () => {
  const { user, setUser, setEcoCredits, setTrustScore } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const successMsg = location.state?.message;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginErr, setLoginErr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { if (user) navigate("/dashboard", { replace: true }); }, [user, navigate]);

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!password.trim()) e.password = "Password is required";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setLoginErr("");
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setIsSubmitting(true);

    setTimeout(() => {
      const key = email.toLowerCase();
      const savedAccounts = JSON.parse(localStorage.getItem("eco_accounts") || "{}");
      const savedAccount = savedAccounts[key];
      const mockAccount = MOCK_ACCOUNTS[key];

      if (savedAccount) {
        const loggedUser = { ...savedAccount };
        delete loggedUser.password;
        setUser(loggedUser);
        setEcoCredits(loggedUser.ecoCredits);
        setTrustScore(loggedUser.trustScore);
        navigate("/dashboard", { replace: true });
      } else if (mockAccount) {
        const loggedUser = {
          name: mockAccount.name,
          email: key,
          role: mockAccount.role,
          roles: mockAccount.roles,
          canBuy: mockAccount.canBuy,
          canSell: mockAccount.canSell,
          canCreate: mockAccount.canCreate,
          ecoCredits: mockAccount.ecoCredits,
          trustScore: mockAccount.trustScore,
          avatar: null,
        };
        setUser(loggedUser);
        setEcoCredits(loggedUser.ecoCredits);
        setTrustScore(loggedUser.trustScore);
        navigate("/dashboard", { replace: true });
      } else {
        setLoginErr("No account found with this email. Please register first.");
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }, 600);
  };

  const clearError = (f) => { setErrors(p => { const n = { ...p }; delete n[f]; return n; }); setLoginErr(""); };
  const inputCls = (f) => `w-full px-4 py-2.5 rounded-xl border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-900
    transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500
    ${errors[f] ? "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white text-lg"></span>
            EcoFashion
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Welcome back</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Sign in to your EcoFashion account</p>
          </div>

          {successMsg && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-400 transition-colors">
              <span className="text-base"></span>
              {successMsg}
            </div>
          )}

          {loginErr && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400 transition-colors">
              <span className="text-base"></span>
              {loginErr}
              <Link to="/register" className="ml-auto font-semibold underline hover:text-red-700 dark:hover:text-red-300">Register</Link>
            </div>
          )}

          <div className="mb-5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3 transition-colors">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2"> Test accounts (any password):</p>
            <div className="space-y-1.5">
              {Object.entries(MOCK_ACCOUNTS).map(([mail, data]) => (
                <button key={mail} type="button" onClick={() => { setEmail(mail); clearError("email"); }}
                  className="flex w-full items-center gap-2 text-left text-xs text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer">
                  <span className="font-mono flex-1 truncate">{mail}</span>
                  <span className="shrink-0 text-gray-500 dark:text-gray-500">
                    {data.role === "admin" ? " Admin" : ` ${data.roles.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join("+")}`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">Email address</label>
              <input type="email" value={email}
                onChange={e => { setEmail(e.target.value); clearError("email"); }}
                placeholder="you@example.com" className={inputCls("email")} />
              {errors.email && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">Password</label>
              <input type="password" value={password}
                onChange={e => { setPassword(e.target.value); clearError("password"); }}
                placeholder="" className={inputCls("password")} />
              {errors.password && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.password}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600 disabled:bg-green-400 dark:disabled:bg-green-800
                text-white font-semibold py-3 rounded-xl transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed">
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Don''t have an account?{" "}
            <Link to="/register" className="font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
