import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Header from "@/app/components/Header";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI flashcards",
  description:
    "Our interactive, AI generated flashcards can help you study advanced topics in minutes! Copy paste your notes and your AI flashcards will be generated in seconds. Not sure if its for you? Just give it a try, it's free!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>AI flashcards</title>
      </head>
      <body className={inter.className + " w-full h-full"}>
        <Header></Header>
        <AuthProvider className="w-full h-full">{children}</AuthProvider>
      </body>
    </html>
  );
}
