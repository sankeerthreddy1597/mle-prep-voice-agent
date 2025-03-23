"use client";
import { useUser } from "@clerk/nextjs"

import { NavBar } from "@/components/NavBar";
import { InterviewCard } from "@/components/InterviewCard";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5">
      <NavBar user={user}/>
      <InterviewCard />
    </div>
  );
}
