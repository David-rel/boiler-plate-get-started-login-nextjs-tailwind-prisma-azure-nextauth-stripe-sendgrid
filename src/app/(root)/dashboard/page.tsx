"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || !session.user) {
    return <div>No session found</div>;
  }

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/sign-in" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white p-6 rounded-md shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="mb-4">
          Welcome, {session.user.name || session.user.email}!
        </p>
        <p className="mb-4">Your role: {session.user.role}</p>
        <p className="mb-4">Your id: {session.user.id}</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
