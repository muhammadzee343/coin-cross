"use client";

import React from "react";
// import Login from "@/components/ui/Login/login";
import dynamic from 'next/dynamic';

const Login = dynamic(() => import('../../components/ui/Login/login'), {ssr: false, loading: () => <>Loading...</>})
export default function LoginScreen() {
    
  return (
    <Login />
  );
}
