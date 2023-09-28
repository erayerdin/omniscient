"use client";

import MainNav from "./components/MainNav";



export default function Home() {
  return (
    <div className="container flex h-screen">
      <div className="w-2/5 m-sm">
        <MainNav />
      </div>
      <div className="w-3/5 m-sm">
        <div>Content</div>
      </div>
    </div>
  )
}
