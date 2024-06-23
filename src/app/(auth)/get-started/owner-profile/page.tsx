// src/app/get-started/owner-profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import RegisterUserForm from "@/components/RegisterUserForm";

const OwnerProfilePage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [companyData, setCompanyData] = useState<{
    id: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const customerId = searchParams.get("customer_id");
    console.log(customerId);
    if (!customerId) {
      setError("Customer ID is missing.");
      router.push("/get-started");
      return;
    }

    fetch(`/api/business/${customerId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          router.push("/get-started");
        } else {
          setCompanyData(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch company data.");
        router.push("/get-started");
        setLoading(false);
      });
  }, [searchParams, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {companyData ? (
        <RegisterUserForm
          companyId={companyData.id}
          email={companyData.email}
        />
      ) : (
        <div>No company data available.</div>
      )}
    </div>
  );
};

export default OwnerProfilePage;
