'use client'
import { Provider } from "react-redux";
import { store } from "@/store";
import Navbar from "@/components/navbar";
export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
        <Navbar/>
        <main className="pt-[60px]">
        {children}
        </main>
    </Provider>
  )
}