import { useEffect, useState } from "react";
import { useTransaction } from "@/contexts/TransactionContext";
import { useRouter } from "next/router";
import { MyUserCredential, prependUserDomainTag, toHex } from "@/components/controllers/helpers";
import { checkUserExists } from "@/components/controllers/authz";
import { useToast } from "@chakra-ui/react";
import { EmailAuthProvider, getAuth, signInWithCredential } from "firebase/auth";
import { AES } from "crypto-js";
import { createUser } from "@/db/firestore";
import { useCreateAccount } from "./createaccount";



export function useSignInReciever() {
    const toast = useToast()
    const [loading, setLoading] = useState(false)
    const { setDefaultAccount, mapUserData, setUserCookie, setUserObject } = useTransaction();
    const { createAccount } = useCreateAccount()
    const router = useRouter();

    const signWithCredential = async (_user: any, password: string) => {
        setLoading(true)
        //signing in with user credental
        const auth = getAuth();
        // Extract the necessary properties from the string
        const regex = /(\w+):\s?([^),]+)/g;
        let match;
        const userData: any = {};
        while ((match = regex.exec(_user))) {
            const key = match[1];
            const value = match[2];

            userData[key] = value;
        }
        const userJSON = JSON.stringify(userData);
        const myUserCredential: any = MyUserCredential.fromJSON(JSON.parse(userJSON));
        const Authcredential = EmailAuthProvider.credential(
            myUserCredential.user.email,
            password
        )
        const credential: any = await signInWithCredential(auth, Authcredential);
        console.log("user from credentials;", credential);

        if (credential) {
            const accessToken = credential.user.accessToken;
            const idToken = credential.user.idToken;
            const user = credential.user;
            const userData = await mapUserData(user);
            setUserCookie(userData);

            const { keyExists, snapshot } = await checkUserExists(user.email!);

            if (keyExists) {
                localStorage.setItem("caramel-user", JSON.stringify(snapshot));
                setUserObject(snapshot);
                router.push("home");
            } else {
                const {
                    account,
                    creationTxId,
                    publicKey,
                    privateKey,
                    signatureAlgorithm,
                    hashAlgorithm,
                } = await createAccount();
                // Encrypt the private key using the password and private nonce
                const encryptedPrivateKey = AES.encrypt(privateKey, password).toString();
                if (account) {
                    setDefaultAccount(account);
                    const dbObj = {
                        email: user.email,
                        default: 0,
                        account,
                        creationTxId,
                        keys: [
                            {
                                pubKey: publicKey,
                                privkey: encryptedPrivateKey,
                                signatureAlgorithm,
                                hashAlgorithm,
                            },
                        ],
                    };
                    await createUser(user.uid!, dbObj); //save on firebase
                    localStorage.setItem("caramel-user", JSON.stringify(dbObj));
                    setUserObject(dbObj);
                }
                const signInObj: any = {
                    accessToken,
                    idToken,
                    account,
                    creationTxId,
                    publicKey,
                    encryptedPrivateKey,
                    signatureAlgorithm,
                    hashAlgorithm,
                };

                const queryString = new URLSearchParams(signInObj).toString();
                const routeUrl = `/login-success?${queryString}`;
                router.push(routeUrl);
            }
        }
    };





    return {
        loading,
        signWithCredential
    };
}

