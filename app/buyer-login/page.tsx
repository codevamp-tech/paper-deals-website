import BuyerSignin from "@/components/buyer-login/buyer-login";
import { Suspense } from "react";

export default function BuyerLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BuyerSignin />
    </Suspense>
  );
}
