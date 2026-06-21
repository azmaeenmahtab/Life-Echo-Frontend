"use server"
import { auth } from "@/lib/auth"; // Your server auth instance
import { headers } from "next/headers"; // If using Next.js

export const getUserSessionServer = async () => {

const session = await auth.api.getSession({
    headers: await headers() 
});

if (!session) {
return null; 
}

return session;
}
