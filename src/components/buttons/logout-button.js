'use client'
import { SignOutAction } from "@/action";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function LogoutButton({className = ""}){
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const handleLogout = async() => {
      setIsLoggingOut(true);
      await SignOutAction();
      setIsLoggingOut(false);
      router.push("/authenticate/sign-in");
      };
  if(isLoggingOut){
    return <button className={"btn btn-danger "+className} disabled> Logging out...</button>
  }
  return (
    <button className={"btn btn-danger "+className} onClick={handleLogout}> Logout</button>
  );
}