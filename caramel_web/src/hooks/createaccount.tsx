import { useState } from "react";
import { ec as EC } from "elliptic";


export function useCreateAccount() {
    const [status, setStatus] = useState<boolean>(false);




    const createAccount = async () => {
        // ... Function implementation
        let account;
        const p256 = new EC("p256");
        const key = p256.genKeyPair();
        const publicKey = key.getPublic("hex").slice(2);
        const privateKey = key.getPrivate("hex");
        console.log("public key generated; ", publicKey)
        const data = {
            publicKey: publicKey,
            signatureAlgorithm: "ECDSA_P256",
            hashAlgorithm: "SHA3_256",
        };
        
        const url =
            "https://hardware-wallet-api-testnet.staging.onflow.org/accounts";

        try {
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            account = await response.json();
            console.log("testnet account created; ", account)
            const object = {
                account: account.address,
                creationTxId: account.creationTxId,
                publicKey: publicKey,
                privateKey: privateKey,
                signatureAlgorithm: "ECDSA_P256",
                hashAlgorithm: "SHA3_256"
            }
            localStorage.setItem("caramel-keys", JSON.stringify(object))
            setStatus(false)
            return object;
        } catch (error: any) {
            setStatus(false);
            throw error;

        }

    };

    return {
        status,
        createAccount,
    };
}
