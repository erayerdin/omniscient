"use client";

import MainNav from "./components/MainNav";



export default function Home() {
  return (
    <div className="container flex h-screen">
      <div className="w-2/5 lg:w-1/4 m-sm">
        <MainNav />
      </div>
      <div className="w-3/5 lg:w-3/4 m-sm">
        <div>Content</div>
      </div>
    </div>
  )
}
