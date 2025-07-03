'use client'
import { isValidWalletAddress } from "@/utils/functions/isValidWallet";
import { useSelector, useDispatch } from "react-redux"
import { updateUser } from "@/store/slices/user-slice"
import { useState, useEffect } from "react";
import {RegisterCreatorAction} from "@/action";
import { useRouter } from "next/navigation";
export default function BecomeCreator() {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state) => state.userslice);
    const [walletAddress, setWalletAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isValidWallet, setIsValidWallet] = useState(true);
    async function handleOnSubmit(e) {
        e.preventDefault();
        if(!isValidWalletAddress(walletAddress)) {
            console.log("Invalid wallet address");
            setIsValidWallet(false);
            return;
        }
        setIsValidWallet(true);
        setIsLoading(true);
        try {
            // Update user's wallet address in Redux store
            dispatch(updateUser({ walletAddress , subscriberCount: 0}));
            const res = await RegisterCreatorAction(walletAddress);
            console.log("res (Bacome Creator) is: ", res);
            setIsLoading(false);
            router.push("/creator-dashboard");
        } catch (error) {
            console.error("Error registering as creator:", error);
            setIsLoading(false);
        }
    }
    
    return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
            <div className="p-8 w-full">
                <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">Join Our Creator Community</div>
                <h1 className="block mt-1 text-2xl leading-tight font-bold text-gray-900 mb-6">Become a Creator</h1>
                
                <form onSubmit={handleOnSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="wallet" className="block text-sm font-medium text-gray-700 mb-2">
                            Your Wallet Address
                        </label>
                        <input
                            type="text"
                            id="wallet"
                            value={walletAddress}
                            onChange={(e) => {setWalletAddress(e.target.value);setIsValidWallet(!!isValidWalletAddress(e.target.value))}}
                            placeholder="Enter your blockchain wallet address"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                        {!!isValidWallet ? <p className="mt-2 text-xs text-gray-500">
                            We need your wallet address to process payments for your content.
                        </p> :
                        <p className="mt-2 text-xs text-red-500">
                            Please enter a valid wallet address.
                        </p>}
                    </div>
                    
                    <div className="flex items-center">
                        <button
                            type="submit"
                            disabled={isLoading || !isValidWallet}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                            ${isLoading || !walletAddress ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : "Register as Creator"}
                        </button>
                    </div>
                </form>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        <h3 className="font-medium text-gray-900 mb-2">Benefits of becoming a creator:</h3>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Share your content with our community</li>
                            <li>Earn from subscriptions and donations</li>
                            <li>Build your personal brand and following</li>
                            <li>Access to creator analytics and insights</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    );
}
