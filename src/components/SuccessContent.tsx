"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const SuccessContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [secretKey, setSecretKey] = useState(""); // Add state for secret key
  const [customerId, setCustomerId] = useState(""); // Add state for customer ID

  useEffect(() => {
    const session_id = searchParams.get("session_id");

    if (session_id) {
      fetch(`/api/verify-payment?session_id=${session_id}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setMessage(
              "Your subscription was successful. Thank you for your purchase!"
            );
            setSecretKey(data.secretKey); // Set the secret key from the response
            setCustomerId(data.session.customer); // Set the customer ID from the session
          } else {
            setMessage("There was an issue with your subscription.");
            router.push("/get-started")
          }
          setLoading(false);
        })
        .catch(() => {
          setMessage("An error occurred while processing your subscription.");
          setLoading(false);
        });
    } else {
      setMessage("Session ID is missing.");
      router.push("/get-started")
      setLoading(false);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {loading ? (
        <div className="text-lg font-bold">Processing your payment...</div>
      ) : (
        <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Success</h1>
          <p className="mb-4">{message}</p>
          {secretKey && ( // Conditionally render the secret key
            <div className="bg-gray-100 p-4 rounded-md text-left mb-4">
              <h2 className="text-xl font-semibold">Your Secret Key:</h2>
              <p className="text-sm text-gray-700 break-all">{secretKey}</p>
              <p className="text-xs text-red-600 mt-2">
                Please save this key securely. You won't be able to see it
                again.
              </p>
            </div>
          )}
          <button
            className="bg-navy text-white py-2 px-4 rounded-md"
            onClick={() =>
              router.push(
                `/get-started/owner-profile?customer_id=${customerId}`
              )
            }
            disabled={!customerId} // Disable the button if customerId is not available
          >
            Continue to Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default SuccessContent;
