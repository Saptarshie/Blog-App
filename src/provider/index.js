'use client'
import { Provider } from "react-redux";
import React from 'react';
import { store } from "@/store";
import Navbar from "@/components/navbar";
export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
        <Navbar/>
        <div className="h-14"/>
        <main>
        {children}
        </main>
    </Provider>
  )
}