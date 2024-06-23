"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SetupSuccess = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Processing...");

  useEffect(() => {
    if (!userId) {
      console.log("No user_id found, redirecting...");
      router.push("/get-started");
      return;
    }

    // Verify user ID and email verification status
    fetch(`/api/verify-user?user_id=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data.valid || !data.emailVerify) {
          console.log("User not verified or not found, redirecting...");
          router.push("/get-started");
        } else {
          console.log("User verified");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error verifying user:", error);
        router.push("/get-started");
      });
  }, [userId, router]);

  if (loading) {
    return <div className="text-lg font-bold">{message}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Setup Complete</h1>
        <p className="mb-4">You are now fully set up!</p>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
          onClick={() => router.push("/sign-in")}
        >
          Sign In to Account
        </button>
      </div>
    </div>
  );
};

export default SetupSuccess;
