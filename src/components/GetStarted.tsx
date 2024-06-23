// components/GetStarted.tsx
"use client";
import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import { ADDONS } from "@/lib/constants"; // Import add-ons
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";

const GetStarted = () => {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [subscription, setSubscription] = useState("STARTER");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Define subscription prices
  const subscriptionPrices: { [key: string]: number } = {
    STARTER: 50,
    BUSINESS: 150,
    ENTREPRENEURIAL: 200,
  };

  // Define add-on restrictions for each subscription type
  const addonRestrictions: { [key: string]: string[] } = {
    BUSINESS: [
      "example1"
    ],
    ENTREPRENEURIAL: ADDONS.map((addon) => addon.name), // All add-ons
  };

  const handleAddonChange = (addonName: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonName)
        ? prev.filter((name) => name !== addonName)
        : [...prev, addonName]
    );
  };

  const handleSubscriptionChange = (value: string) => {
    setSubscription(value);

    // Clear incompatible add-ons when subscription changes
    if (addonRestrictions[value]) {
      setSelectedAddons((prev) =>
        prev.filter((addon) => !addonRestrictions[value].includes(addon))
      );
    }
  };

  const calculateTotalPrice = () => {
    const basePrice = subscriptionPrices[subscription];
    const addonsPrice = selectedAddons.reduce((total, addonName) => {
      const addon = ADDONS.find((a) => a.name === addonName);
      return addon ? total + addon.price : total;
    }, 0);
    return basePrice + addonsPrice;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/create-company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          description,
          subscription,
          email,
          selectedAddons: selectedAddons.map((addonName) => ({
            name: addonName,
            price: ADDONS.find((a) => a.name === addonName)?.price ?? 0,
          })),
          totalPrice: calculateTotalPrice(), // Send total price
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        router.push(url);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to create company");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Filter add-ons based on selected subscription
  const availableAddons = ADDONS.filter(
    (addon) => !addonRestrictions[subscription]?.includes(addon.name)
  );

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gray-100 p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-xl w-full bg-white p-8 rounded-md shadow-md"
      >
        <h1 className="text-3xl font-bold mb-6">Get Started</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-6">
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700"
          >
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Short Description
          </label>
          <textarea
            id="description"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="subscription"
            className="block text-sm font-medium text-gray-700"
          >
            Subscription
          </label>
          <Listbox value={subscription} onChange={handleSubscriptionChange}>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-md cursor-default focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <span className="block truncate">{subscription}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronUpDownIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {Object.keys(subscriptionPrices).map((subscription) => (
                    <Listbox.Option
                      key={subscription}
                      className={({ active }) =>
                        `${
                          active ? "text-white bg-blue-600" : "text-gray-900"
                        } cursor-default select-none relative py-2 pl-10 pr-4`
                      }
                      value={subscription}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`${
                              selected ? "font-medium" : "font-normal"
                            } block truncate`}
                          >
                            {subscription} - ${subscriptionPrices[subscription]}
                          </span>
                          {selected ? (
                            <span
                              className={`${
                                active ? "text-white" : "text-blue-600"
                              } absolute inset-y-0 left-0 flex items-center pl-3`}
                            >
                              <CheckIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Select Add-ons
          </label>
          <div className="space-y-2">
            {availableAddons.map((addon) => (
              <motion.div
                key={addon.name}
                className="flex items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <input
                  type="checkbox"
                  id={addon.name}
                  className="mr-2 h-4 w-4 border-gray-300 rounded focus:ring-blue-500 text-blue-600"
                  checked={selectedAddons.includes(addon.name)}
                  onChange={() => handleAddonChange(addon.name)}
                />
                <label htmlFor={addon.name} className="text-sm">
                  {addon.name} - ${addon.price}
                </label>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <p className="text-lg font-bold">
            Total Price: ${calculateTotalPrice()}
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          disabled={loading}
        >
          {loading ? "Processing..." : "Get Started"}
        </button>
      </form>
    </motion.div>
  );
};

export default GetStarted;
