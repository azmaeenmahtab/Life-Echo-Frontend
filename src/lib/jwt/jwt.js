import {authClient} from '@/lib/auth-client'

export const getJWTClient = async () => {

    const res = await authClient.jwt.getToken(); // Calls /api/auth/jwt/token
    if (res.data?.token) {
        console.log("Your JWT String:", res.data.token);
    }

    return res.data?.token;
}

