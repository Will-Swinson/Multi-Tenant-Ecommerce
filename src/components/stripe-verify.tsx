import Link from "next/link";
import { Button } from "./ui/button";

export default function StripeVerify() {
  return (
    <Link href="/stripe-verify">
      <Button>Stripe Verify</Button>
    </Link>
  );
}
