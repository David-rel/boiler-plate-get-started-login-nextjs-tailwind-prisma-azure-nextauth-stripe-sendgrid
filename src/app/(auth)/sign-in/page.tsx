// pages/auth/sign-in.tsx
"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { isMobile, browserName, osName, deviceType } from "react-device-detect";

const SignInPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [deviceInfo, setDeviceInfo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const deviceData = {
      browser: browserName,
      os: osName,
      deviceType,
      isMobile,
    };
    setDeviceInfo(JSON.stringify(deviceData));
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      usernameOrEmail,
      password,
      deviceInfo,
    });

    if (result?.error) {
      try {
        const errorData = JSON.parse(result.error);
        if (errorData.mfaRequired) {
          // Store credentials temporarily
          localStorage.setItem("usernameOrEmail", usernameOrEmail);
          localStorage.setItem("password", password);
          localStorage.setItem("deviceInfo", deviceInfo);
          // Redirect to the MFA page
          router.push("/sign-in/mfa");
          return;
        }
      } catch {
        // Error parsing JSON, handle normally
      }
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-6 rounded-md shadow-md text-center"
      >
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Username or Email</label>
          <input
            type="text"
            name="usernameOrEmail"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
            className="mt-1 block w-full border rounded p-2"
            placeholder="Username or Email"
          />
        </div>
        <div className="mb-4 relative">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full border rounded p-2"
            placeholder="Password"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignInPage;
