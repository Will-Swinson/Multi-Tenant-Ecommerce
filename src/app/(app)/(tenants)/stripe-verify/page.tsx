"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { LoaderIcon } from "lucide-react";
import { useEffect } from "react";

export default function StripeVerifyPage() {
  const trpc = useTRPC();
  const { mutate: verify } = useMutation(
    trpc.checkout.verify.mutationOptions({
      onSuccess: (data) => {
        console.log(data);
        window.location.href = data.url;
      },
      onError: (error) => {
        console.log(error);
        // window.location.href = "/";
      },
    }),
  );

  useEffect(() => {
    verify();
  }, [verify]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoaderIcon className="animate-spin text-muted-foreground" />
      {/* <button type="button" onClick={() => verify()}>
        CLICK ME
      </button> */}
    </div>
  );
}
