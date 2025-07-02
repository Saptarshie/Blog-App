import ReduxProvider from "@/provider";
export default function CommonLayout({children}) {
    return (
    <ReduxProvider>
      {children}
    </ReduxProvider>
  )
}