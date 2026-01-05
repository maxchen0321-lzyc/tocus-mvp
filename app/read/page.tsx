import { Suspense } from "react";
import ReadClient from "./ReadClient";

export default function ReadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReadClient />
    </Suspense>
  );
}
