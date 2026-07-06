"use server"

import { headers } from "next/headers";

export async function getJWTTokenServer() {
    const headerStore = await headers();

    const cookie = headerStore.get("cookie") || "";

    const authBaseUrl =
        process.env.BETTER_AUTH_URL ||
        process.env.NEXT_PUBLIC_CLIENT_URL;

    if (!authBaseUrl) {
        return null;
    }

    const tokenEndpoints = [
        `${authBaseUrl}/api/auth/token`,
        `${authBaseUrl}/api/auth/jwt/token`,
    ];

    for (const url of tokenEndpoints) {
        try {
            const response = await fetch(url, {
                method: "GET",
                cache: "no-store",
                headers: {
                    ...(cookie ? { Cookie: cookie } : {}),
                },
            });

            if (!response.ok) {
                continue;
            }

            const data = await response.json();
            const token = data?.token;

            if (typeof token === "string" && token.split(".").length === 3) {
                console.log("token ", token);
                return token;
            }
        } catch {
            // Try the next possible endpoint.
        }
    }

    return null;
}