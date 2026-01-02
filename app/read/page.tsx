// app/read/page.tsx
import { Suspense } from "react";
import ReadClient from "@/app/read/ReadClient";

export default function ReadPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center p-6 text-sm text-white/60">
          Loading…
        </div>
      }
    >
      <ReadClient />
    </Suspense>
  );
}
