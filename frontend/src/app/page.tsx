import Image from "next/image";
import Link from "next/link";
import logo from "../../public/branding/socialflow-full-logo.png";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col text-center items-center justify-center align-middle p-10 gap-10">
      <Link href="/dashboard" className="flex h-16 items-center px-5 w-xl">
        <Image src={logo} alt="SocialFlow AI" priority />
      </Link>
      <h2>Social Flow Landing Page</h2>
      <Link
        href="/dashboard"
      >
        <Button variant="brutal" className=" cursor-pointer">Get Started</Button>
      </Link>
    </div>
  );
}
