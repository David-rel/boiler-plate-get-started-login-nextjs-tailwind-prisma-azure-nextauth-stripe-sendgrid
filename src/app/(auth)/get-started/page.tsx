"use client"

import { useRouter } from "next/navigation";
import Head from "next/head";
import GetStarted from "../../../components/GetStarted";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const GetStartedPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession(); // Use session hook

  useEffect(() => {
    if (status === "authenticated") {
      // Redirect authenticated users to the dashboard
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    // Show a loading state while checking the session
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // Render "Get Started" content for unauthenticated users
  return (
    <>
      <Head>
        <title>Get Started - Your Company</title>
        <meta
          name="description"
          content="Get started with setting up your company profile."
        />
      </Head>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <GetStarted />
      </div>
    </>
  );
};

export default GetStartedPage;
