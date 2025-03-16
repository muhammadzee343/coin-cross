"use client";

import { IoChevronForwardSharp } from "react-icons/io5";
import { useAuth } from "@/lib/customHooks/useAuth";

export const Settings = () => {
  const { logout, isLoading } = useAuth();
 
  return (
    <div className="p-4 relative h-full">
      <h2 className="text-3xl font-bold mb-8 text-primary-white pt-6">Settings</h2>
      <ul className="space-y-5">
        <li>
          <a
            href="mailto:support@coin-crush.com?subject=Support Request"
            className="flex items-center justify-between p-2 bg-background-dark px-4 py-3 border-white border-[1px] rounded-full text-white"
          >
            Support
            <IoChevronForwardSharp className="text-gray-400" />
          </a>
        </li>
        <li>
          <a
            href="#rate"
            className="flex items-center justify-between p-2 bg-background-dark px-4 py-3 border-white border-[1px] rounded-full text-white"
          >
            Rate us on App Store
            <IoChevronForwardSharp className="text-gray-400" />
          </a>
        </li>
        <li>
          <a
            href={`https://www.coin-crush.com/terms-of-service`}
              target="_blank"
            className="flex items-center justify-between p-2 bg-background-dark px-4 py-3 border-white border-[1px] rounded-full text-white"
          >
            Terms of service
            <IoChevronForwardSharp className="text-gray-400" />
          </a>
        </li>
        <li>
          <a
            href={`https://www.coin-crush.com/privacy-policy`}
              target="_blank"
            className="flex items-center justify-between p-2 bg-background-dark px-4 py-3 border-white border-[1px] rounded-full text-white"
          >
            Privacy policy
            <IoChevronForwardSharp className="text-gray-400" />
          </a>
        </li>
      </ul>
      <button
        className="mt-4 text-red-500 absolute bottom-0 left-0 right-0"
        onClick={logout}
        disabled={isLoading}
      >
        {isLoading ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );
};
