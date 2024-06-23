// RegisterUserForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";
import { isMobile, browserName, osName, deviceType } from "react-device-detect";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
  confirmPassword?: string;
  profileImage: string;
  display: string;
  role: string;
  deviceInfo: string; // Already included
}

const RegisterUserForm = ({
  companyId,
  email,
}: {
  companyId: string;
  email: string;
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email,
    phoneNumber: "",
    username: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
    display: "dark",
    role: "owner",
    deviceInfo: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const deviceInfo = {
      browser: browserName,
      os: osName,
      deviceType,
      isMobile,
    };
    setFormData((prevData) => ({
      ...prevData,
      deviceInfo: JSON.stringify(deviceInfo),
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{9,})/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError(
        "Password must be at least 9 characters long and include at least one number and one symbol."
      );
      setLoading(false);
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      const userPayload = { ...formData, password: hashedPassword, companyId };
      delete userPayload.confirmPassword;

      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });

      if (response.ok) {
        router.push(
          `/get-started/owner-profile/email-verification?email=${encodeURIComponent(
            email
          )}`
        );
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to register user");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white shadow-md rounded"
    >
      <h1 className="text-xl font-bold mb-4">Register User</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-gray-700">First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled
          className="mt-1 block w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Phone Number</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="mt-1 block w-full border rounded p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Username</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded p-2"
        />
      </div>
      <div className="mb-4 relative">
        <label className="block text-gray-700">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded p-2"
        />
        <button
          type="button"
          className="absolute right-2 top-2 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      <div className="mb-4 relative">
        <label className="block text-gray-700">Confirm Password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="mt-1 block w-full border rounded p-2"
        />
        <button
          type="button"
          className="absolute right-2 top-2 text-gray-500"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded"
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default RegisterUserForm;
