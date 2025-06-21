import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useNavigate, useParams } from "react-router-dom"; // ✅ استدعاء useParams
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [slug, setSlug] = useState("");
  const [agree, setAgree] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminName, setAdminName] = useState("");

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navigate = useNavigate();
  const { slug: routeSlug } = useParams(); // ✅ استخراج slug من الرابط

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setAgree(false);
  };

  useEffect(() => {
    if (routeSlug) {
      setSlug(routeSlug); // ✅ تعيين slug تلقائيًا
    }
  }, [routeSlug]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const storedSlug = localStorage.getItem("slug");
        if (storedSlug) {
          try {
            const docRef = doc(db, "ReVerse", storedSlug);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              setAdminName(data.adminName || "Admin");
              setSlug(storedSlug);
              setIsLoggedIn(true);
            } else {
              toast.error("Stored project not found");
              handleLogout();
            }
          } catch (err) {
            toast.error("Error while checking saved session");
            handleLogout();
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!agree) {
      toast.error("Please agree to the privacy policy!");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const docRef = doc(db, "ReVerse", slug);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        if (data.adminEmail === email) {
          toast.success("Login successful!");
          clearForm();

          setAdminName(data.adminName || "Admin");
          setIsLoggedIn(true);

          localStorage.setItem("slug", slug);
        } else {
          toast.error("You do not have permission to access this project!");
          clearForm();
          await signOut(auth);
        }
      } else {
        toast.error("This project does not exist!");
        clearForm();
        await signOut(auth);
      }
    } catch (error) {
      toast.error("Login failed!");
      clearForm();
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setIsLoggedIn(false);
    setAdminName("");
    clearForm();
    localStorage.removeItem("slug");
    toast.success("You have been logged out.");
  };

  if (isLoggedIn) {
    return (
      <div>
        <button onClick={() => setShowLogoutConfirm(true)}>X</button>

        <h2>Hello {adminName} 👋</h2>
        <p>Now You Can</p>
        <div>
          {slug && (
            <button onClick={() => navigate(`/reverse/${slug}/adminClientH`)}>
              Go to Admin Panel :
            </button>
          )}
          <p>or</p>
          <button onClick={() => setShowLogoutConfirm(true)}>Logout</button>
        </div>

        {showLogoutConfirm && (
          <div>
            <p>Are you sure you want to log out?</p>
            <button onClick={handleLogout}>Yes</button>
            <button onClick={() => setShowLogoutConfirm(false)}>No</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <p>Hi Admin!</p>
      <p>Please enter your information to log in.</p>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* ✅ عرض اسم المشروع من الرابط بدون إمكانية التعديل */}
        <p>
          You will logging into <strong>{slug}</strong> project
        </p>

        <label>
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          I agree to the Privacy Policy
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
