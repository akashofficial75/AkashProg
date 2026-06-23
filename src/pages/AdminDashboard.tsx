import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import { AdminProjects } from "../components/admin/AdminProjects";
import { AdminSkills } from "../components/admin/AdminSkills";
import { AdminSocials } from "../components/admin/AdminSocials";
import { AdminContact } from "../components/admin/AdminContact";
import { AdminSecurity } from "../components/admin/AdminSecurity";
import { LayoutDashboard, LogOut, Lock, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "react-router-dom";

export function AdminDashboard() {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<React.ReactNode>("");
  const [success, setSuccess] = useState<string>("");
  const [activeTab, setActiveTab] = useState('projects');
  const [resetting, setResetting] = useState(false);

  const ADMIN_EMAILS = ["expertoption55555@gmail.com", "akashabdullahalmahmud335500@gmail.com", "admin@akashprog.com"];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u && u.email) {
        if (!ADMIN_EMAILS.includes(u.email.toLowerCase())) {
          await signOut(auth);
          setUser(null);
          setLoading(false);
          return;
        }
      }
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!ADMIN_EMAILS.includes(email.toLowerCase().trim())) {
      setError("Unauthorized access. You do not have admin privileges.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
        // Automatically try to create the account if it's the admin email and it doesn't exist
        try {
          await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
        } catch (createErr: any) {
           if (createErr.code === "auth/invalid-credential" || createErr.code === "auth/email-already-in-use") {
             setError("Invalid credentials. If you already have an account, your password is incorrect.");
           } else if (createErr.code === "auth/weak-password") {
             setError("Password should be at least 6 characters.");
           } else {
             setError(createErr.message || "An error occurred during authentication.");
           }
        }
      } else if (err.code === "auth/operation-not-allowed") {
        setError(
          <>
            Email/Password auth is disabled.{" "}
            <a 
              href="https://console.firebase.google.com/project/gen-lang-client-0310581423/authentication/providers" 
              target="_blank" 
              rel="noreferrer"
              className="underline text-blue-400 hover:text-blue-300 font-medium"
            >
              Click here to enable it in the Firebase Console
            </a>
            .
          </>
        );
      } else {
        setError(err.message || "An error occurred during authentication.");
      }
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");
    
    if (!email) {
      setError("Please enter your admin email address first.");
      return;
    }

    if (!ADMIN_EMAILS.includes(email.toLowerCase().trim())) {
      setError("Unauthorized access. Only the admin email can request a password reset.");
      return;
    }

    setResetting(true);
    try {
      // To ensure the user exists before sending a reset email (since Firebase won't send one if they don't, 
      // but won't throw an error due to enumeration protection), we can attempt to create the user.
      // If the user already exists, this throws 'auth/email-already-in-use', which means we can proceed.
      // If it succeeds, the user was just created, and we can immediately send a reset email.
      let userExists = false;
      try {
        await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), Math.random().toString(36).slice(-10) + "A1!");
        // User was freshly created with a random password!
        userExists = true;
      } catch (createErr: any) {
        if (createErr.code === "auth/email-already-in-use") {
          userExists = true;
        } else if (createErr.code === "auth/operation-not-allowed") {
          setError(
            <>
              Email/Password auth is disabled.{" "}
              <a 
                href="https://console.firebase.google.com/project/gen-lang-client-0310581423/authentication/providers" 
                target="_blank" 
                rel="noreferrer"
                className="underline text-blue-400 hover:text-blue-300 font-medium"
              >
                Click here to enable it in the Firebase Console
              </a>
              .
            </>
          );
          setResetting(false);
          return;
        } else {
           // Some other error, but let's try to send the reset email anyway
           userExists = true;
        }
      }

      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Please check your inbox and your spam/junk folder.");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/operation-not-allowed") {
        setError(
          <>
            Email/Password auth is disabled.{" "}
            <a 
              href="https://console.firebase.google.com/project/gen-lang-client-0310581423/authentication/providers" 
              target="_blank" 
              rel="noreferrer"
              className="underline text-blue-400 hover:text-blue-300 font-medium"
            >
              Click here to enable it in the Firebase Console
            </a>
            .
          </>
        );
      } else {
        setError(err.message || "Failed to send password reset email.");
      }
    } finally {
      setResetting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-card glass-card-glow rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
            <div className="flex flex-col items-center mb-6 sm:mb-8 gap-3 sm:gap-4 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-blue-400">
                <Lock className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold">Admin Portal</h2>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">Authenticate to access the dashboard</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 bg-green-500/20 border border-green-500/50 text-green-200 text-sm p-3 rounded-lg text-center">
                {success}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin Email"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none transition-colors input-glow"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none transition-colors input-glow"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                 <button 
                   type="button" 
                   onClick={handleForgotPassword} 
                   disabled={resetting}
                   className="text-sm text-gray-400 hover:text-white transition-colors"
                 >
                   {resetting ? "Sending..." : "Forgot Password?"}
                 </button>
              </div>

              <button
                type="submit"
                className="w-full relative group overflow-hidden bg-white text-black font-semibold rounded-xl px-4 py-3 transition-transform active:scale-[0.98] btn-glow"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
                <span className="relative z-10 group-hover:text-white transition-colors flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Sign In
                </span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12">
      <div className="container mx-auto max-w-6xl">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8 glass-card glass-card-glow p-4 sm:p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8 shrink-0" />
            <div className="overflow-hidden">
              <h1 className="text-lg sm:text-xl font-display font-bold truncate">AkashProg HQ</h1>
              <p className="text-xs sm:text-sm text-gray-400 truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full sm:w-auto justify-center px-4 py-2.5 sm:py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-colors flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </header>

        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
          <button onClick={() => setActiveTab('projects')} className={`shrink-0 snap-start px-4 py-2 rounded-lg text-sm sm:text-base font-medium whitespace-nowrap transition-colors ${activeTab === 'projects' ? 'bg-blue-600 text-white btn-glow' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>Projects</button>
          <button onClick={() => setActiveTab('skills')} className={`shrink-0 snap-start px-4 py-2 rounded-lg text-sm sm:text-base font-medium whitespace-nowrap transition-colors ${activeTab === 'skills' ? 'bg-blue-600 text-white btn-glow' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>Skills</button>
          <button onClick={() => setActiveTab('socials')} className={`shrink-0 snap-start px-4 py-2 rounded-lg text-sm sm:text-base font-medium whitespace-nowrap transition-colors ${activeTab === 'socials' ? 'bg-blue-600 text-white btn-glow' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>Socials</button>
          <button onClick={() => setActiveTab('contact')} className={`shrink-0 snap-start px-4 py-2 rounded-lg text-sm sm:text-base font-medium whitespace-nowrap transition-colors ${activeTab === 'contact' ? 'bg-blue-600 text-white btn-glow' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>Contact Info</button>
          <button onClick={() => setActiveTab('security')} className={`shrink-0 snap-start px-4 py-2 rounded-lg text-sm sm:text-base font-medium whitespace-nowrap transition-colors ${activeTab === 'security' ? 'bg-blue-600 text-white btn-glow' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>Security</button>
        </div>

        <main>
          {activeTab === 'projects' && <AdminProjects />}
          {activeTab === 'skills' && <AdminSkills />}
          {activeTab === 'socials' && <AdminSocials />}
          {activeTab === 'contact' && <AdminContact />}
          {activeTab === 'security' && <AdminSecurity />}
        </main>
      </div>
    </div>
  );
}
