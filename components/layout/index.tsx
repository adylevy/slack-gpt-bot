import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import Github from "../github";
import Meta from "./meta";

export default function Layout({
  meta,
  children,
}: {
  meta?: {
    title?: string;
    description?: string;
    image?: string;
  };
  children: ReactNode;
}) {
  return (
    <>
      <Meta {...meta} />
      <div className="fixed top-0 w-full z-10 transition-all">
        <div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between xl:mx-auto">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logo.svg"
              alt="Precedent logo"
              width="25"
              height="25"
            />
            <p className="bg-white bg-clip-text text-2xl font-medium tracking-tight text-transparent">
              Slack GPT Bot
            </p>
          </Link>
          <a
                    className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5 animate-wobble"
                    href="https://github.com/adylevy/slack-gpt-bot"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Github/>
                    <p>Star on Github</p>
                </a>
        </div>
      </div>
      <main className="w-full min-h-screen flex flex-col items-center justify-center py-20 bg-gradient-radial from-[#0072c6] via-[#180c00] to-black">
        {children}
      </main>
      <div className="flex space-x-4 fixed bottom-2 right-4">
      </div>
    </>
  );
}
