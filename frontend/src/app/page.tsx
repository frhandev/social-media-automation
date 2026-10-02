import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col text-center items-center justify-center align-middle">
      <h1>Social Media Automation</h1>
      <h2>Frontend Foundation is Ready</h2>
      <Link href="/dashboard" className="flex p-2 bg-black text-white rounded-xl">Get Started</Link>
    </div>
  );
}
