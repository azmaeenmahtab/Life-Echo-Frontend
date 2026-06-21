import {authClient} from "./auth-client";

export const getUserSession = async () => {

const { data: session } = await authClient.getSession()
    return session;

}