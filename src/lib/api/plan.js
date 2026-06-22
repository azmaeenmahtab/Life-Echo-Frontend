import { authClient } from "../auth-client";

export const checkProPlan = async () => {
    const { data: session } = authClient.useSession()
    if (session?.user?.plan == "pro") {
      return true;
    }
    return false;
  }
 
