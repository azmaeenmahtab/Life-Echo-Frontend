import Link from "next/link";
import { headers } from "next/headers";
import { Stripe } from "stripe";
import { Card, Button } from "@heroui/react";
import { auth } from "../../lib/auth";
import { changePlanByUserId } from "../../lib/actions/plan";
import SuccessContent from "./SuccessContent";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function SuccessPage({ searchParams }) {
  // In Next.js App Router, searchParams is a Promise that must be awaited
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F2EB] p-4">
        <Card shadow="md" className="bg-[#FAF8F3] border border-[#EBE7D9] rounded-[32px] w-full max-w-[480px] p-8 text-center flex flex-col items-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Missing Session ID</h1>
          <Button as={Link} href="/" className="bg-[#467856] text-white font-semibold rounded-2xl px-6">
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  let customerEmail = null;
  let planUpgraded = false;
  let isAuthenticated = false;
  let hasError = false;

  try {
    // Fetch the session details securely on the server side
    const session = await stripe.checkout.sessions.retrieve(session_id);
    customerEmail = session.customer_details?.email;

    // Resolve the logged-in user so we can upgrade their plan server-side.
    const headersList = await headers();
    const authSession = await auth.api.getSession({ headers: headersList });
    isAuthenticated = Boolean(authSession?.user?.id);

    if (authSession?.user?.id) {
      try {
        await changePlanByUserId(authSession.user.id, "pro");
        planUpgraded = true;
      } catch (err) {
        console.error("Failed to upgrade plan after payment:", err);
      }
    }
  } catch (error) {
    console.error("Error retrieving Stripe session:", error);
    hasError = true;
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center p-4">
        <Card shadow="md" className="bg-[#FAF8F3] border border-[#EBE7D9] rounded-[32px] w-full max-w-[480px] p-8 text-center flex flex-col items-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h1>
          <p className="text-gray-500 mb-4">Could not verify your checkout session.</p>
          <Button as={Link} href="/" className="bg-[#467856] text-white font-semibold rounded-2xl px-6">
            Go back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <SuccessContent
      customerEmail={customerEmail}
      planUpgraded={planUpgraded}
      isAuthenticated={isAuthenticated}
      sessionId={session_id}
    />
  );
}