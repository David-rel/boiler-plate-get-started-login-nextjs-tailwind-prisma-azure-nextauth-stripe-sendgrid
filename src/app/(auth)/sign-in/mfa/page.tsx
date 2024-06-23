// app/(auth)/sign-in/mfa.tsx
"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { isMobile, browserName, osName, deviceType } from "react-device-detect";

const MFAPage = () => {
  const router = useRouter();
  const [mfaCode, setMfaCode] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/mfa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mfaCode, deviceInfo }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Retrieve stored credentials
        const usernameOrEmail = localStorage.getItem("usernameOrEmail") || "";
        const password = localStorage.getItem("password") || "";

        // Authenticate the user with stored credentials
        const signInResult = await signIn("credentials", {
          redirect: false,
          usernameOrEmail,
          password,
          deviceInfo,
        });

        if (!signInResult?.error) {
          // Clear temporary credentials
          localStorage.removeItem("usernameOrEmail");
          localStorage.removeItem("password");
          localStorage.removeItem("deviceInfo");

          // Redirect to the dashboard upon successful MFA
          router.push("/dashboard");
        } else {
          setError("Failed to authenticate after MFA verification");
        }
      } else {
        setError("Invalid MFA code");
      }
    } catch (err) {
      setError("Failed to verify MFA code");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full bg-white p-6 rounded-md shadow-md text-center"
      >
        <h1 className="text-2xl font-bold mb-4">MFA Verification</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">MFA Code</label>
          <input
            type="text"
            name="mfaCode"
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value)}
            required
            className="mt-1 block w-full border rounded p-2"
            placeholder="Enter MFA Code"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default MFAPage;
