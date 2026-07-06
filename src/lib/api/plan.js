import { authClient } from "../auth-client";
import { getAuthedHeaders } from "./authed";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const checkProPlan = async () => {
    const { data: session } = authClient.useSession()
    if (session?.user?.plan == "pro") {
      return true;
    }
    return false;
  }

export const changePlan = async (plan) => {
  const headers = await getAuthedHeaders();
  const response = await fetch(`${BASE_URL}/api/plan/change-plan`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ plan }),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON body, fall through to generic error.
  }

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed (${response.status})`);
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data;
};
 
