// app/success/page.js

import Link from 'next/link';
import { Stripe } from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function SuccessPage({ searchParams }) {
  // In Next.js App Router, searchParams is a Promise that must be awaited
  const { session_id } = await searchParams;

  if (!session_id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-xl font-bold text-red-600">Missing Session ID</h1>
        <Link href="/" className="mt-4 text-blue-500 underline">Return Home</Link>
      </div>
    );
  }

  try {
    // Fetch the session details securely on the server side
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const customerEmail = session.customer_details?.email;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md text-center">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Thank you for your purchase!</h1>
          <p className="text-gray-600 mb-6">
            A receipt has been sent to <span className="font-medium text-gray-900">{customerEmail}</span>.
          </p>
          <Link 
            href="/" 
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            Go back to Dashboard
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error retrieving Stripe session:", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-xl font-bold text-red-600">Something went wrong</h1>
        <p className="text-gray-500">Could not verify your checkout session.</p>
      </div>
    );
  }
}