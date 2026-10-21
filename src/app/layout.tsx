import React from 'react';

export const metadata = {
  title: 'QUBOT - Automation Assistant for Everything',
  description: 'A local-first, multi-agent automation assistant where each contact is an AI bot equipped with its own memory, tools, computer environments, and human-in-the-loop approvals.'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 text-zinc-900 flex flex-col antialiased selection:bg-sky-200 selection:text-black font-sans">
      {children}
    </div>
  );
}
