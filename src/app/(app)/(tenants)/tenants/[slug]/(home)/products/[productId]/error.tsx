"use client";

import { TriangleAlertIcon } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="px-4 lg:px-12 py-10">
      <div className="border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <TriangleAlertIcon />
        <p className="text-lg font-medium">Something went wrong</p>
      </div>
    </div>
  );
}
