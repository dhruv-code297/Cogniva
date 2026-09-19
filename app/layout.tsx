import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import type { Metadata } from "next";
import {Figtree} from 'next/font/google'
import axios from 'axios'
import Provider from './provider';
import { Toaster } from '@/components/ui/toast';

export const metadata: Metadata = {
  title: "Cogniva - AI Agent Platform For Daily Tasks",
  description: "Cogniva is an AI agent platform that automates daily tasks and workflows, helping you get more done with less effort.",
  icons:{
    icon:'/logo.svg'
  }
};
const figTree = Figtree({subsets:['latin']})
 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <ClerkProvider>
      <html lang="en">
        <body style={{ margin: 0, padding: 0 }} className={figTree.className}>
          <Provider>
          {children}
          </Provider>
           <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
