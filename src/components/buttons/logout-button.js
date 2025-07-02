'use client'
import { SignOutAction } from "@/action";

export default function LogoutButton(){
    const handleLogout = async() => {
        await SignOutAction();
      };
    
  return (
    <button className="btn btn-danger" onClick={handleLogout}> Logout</button>
  );
}