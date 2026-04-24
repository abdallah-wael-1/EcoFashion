import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const Register = () => {
  const navigate = useNavigate();
  const { user, setUser, setEcoCredits, setTrustScore } = useAppContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState(["buyer"]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { if (user) navigate("/dashboard", { replace: true }); }, [user, navigate]);

  const roles = [
    { id: "buyer", label: " Buyer", desc: "Purchase sustainable fashion" },
    { id: "seller", label: " Seller", desc: "Sell your preloved items" },
    { id: "creator", label: " Creator", desc: "Upcycle & create new designs" },
  ];

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email";
    if (!password.trim()) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    if (!selectedRoles.length) e.roles = "Select at least one role";
    return e;
  };

  const handleRoleToggle = (roleId) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setIsSubmitting(true);

    setTimeout(() => {
      const key = email.toLowerCase();
      const savedAccounts = JSON.parse(localStorage.getItem("eco_accounts") || "{}");

      if (savedAccounts[key]) {
        setErrors({ email: "This account already exists" });
        setIsSubmitting(false);
        return;
      }

      const newUser = {
        name,
        email: key,
        password,
        roles: selectedRoles,
        canBuy: selectedRoles.includes("buyer"),
        canSell: selectedRoles.includes("seller"),
        canCreate: selectedRoles.includes("creator"),
        ecoCredits: 50,
        trustScore: 4.0,
        avatar: null,
      };

      savedAccounts[key] = newUser;
      localStorage.setItem("eco_accounts", JSON.stringify(savedAccounts));

      const loggedUser = { ...newUser };
      delete loggedUser.password;
      setUser(null);
      setEcoCredits(0);
      setTrustScore(0);

      navigate("/login", {
        replace: true,
        state: {
          message: "Account created successfully 🎉 Please log in.",
          email: key, 
        },
      });
          }, 1000);
        };  

  const inputCls = (f) => `w-full px-4 py-2.5 rounded-xl border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-900
    transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500
    ${errors[f] ? "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 transition-colors duration-300">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100 cursor-pointer">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white text-base"></span>
            EcoFashion
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Join the sustainable fashion revolution</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">Full Name</label>
              <input type="text" value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name" className={inputCls("name")} />
              {errors.name && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">Email Address</label>
              <input type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" className={inputCls("email")} />
              {errors.email && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5">Password</label>
              <input type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="" className={inputCls("password")} />
              {errors.password && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">What would you like to do?</label>
              <div className="space-y-2">
                {roles.map((role) => (
                  <div key={role.id} onClick={() => handleRoleToggle(role.id)}
                    className={`border-2 rounded-xl p-3 cursor-pointer transition-all ${
                      selectedRoles.includes(role.id)
                        ? "border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{role.label}</span>
                      {selectedRoles.includes(role.id) && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-white text-[9px] font-bold"></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{role.desc}</p>
                  </div>
                ))}
              </div>
              {errors.roles && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.roles}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600 disabled:bg-green-400 dark:disabled:bg-green-800
                text-white font-semibold py-3 rounded-xl transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed">
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
