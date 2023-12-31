import { useEffect, useState } from "react";
import { ec as EC } from "elliptic";
import { config } from "@onflow/fcl";
import * as fcl from "@onflow/fcl";
import { useTransaction } from "@/contexts/TransactionContext";
import { useRouter } from "next/router";
import { prependUserDomainTag, toHex } from "@/components/controllers/helpers";
import { sign } from "@/components/controllers/signatures";
import { checkUserExists } from "@/components/controllers/authz";
import { StoreCollection } from "@/components/mint_new";
import { useToast } from "@chakra-ui/react";



export function useCreateAccount() {
    const [status, setStatus] = useState<boolean>(false);
    const { setPublisher, publisher } = useTransaction()
    const toast = useToast()
    const [isLoading, setIsLoading] = useState(false);




    const router = useRouter();

    const login = async () => {
        fcl.discovery.authn.snapshot()
        await fcl.authenticate({
            "f_type": "Service",
            "f_vsn": "1.0.0",
            "type": "authn",
            "method": "EXT/RPC",
            "uid": "flipper-developer#authn",
            "endpoint": "chrome-extension://nkjhfapihbllbhhneonipcinhdlcmfgn/index.html",
            "provider": {
                "address": "0xbc18ed89bd780d7f",
                "name": "Flipper Developer",
                "icon": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMC45MDkxIDBDNC44ODQxNyAwIDAgNC44ODQxNyAwIDEwLjkwOTFWMzcuMDkwOUMwIDQzLjExNTggNC44ODQxNyA0OCAxMC45MDkxIDQ4SDM3LjA5MDlDNDMuMTE1OCA0OCA0OCA0My4xMTU4IDQ4IDM3LjA5MDlWMTAuOTA5MUM0OCA0Ljg4NDE3IDQzLjExNTggMCAzNy4wOTA5IDBIMTAuOTA5MVpNMjQuMDIzNiAyOS4zNjhIMzQuNjgzMkwyMy45OTkxIDE4LjY4MzZIMTMuMzM5OEwyMy45NzAyIDI5LjMxNDZIMjMuOTk5MVYyOS4zNDM1TDI0LjAyMzYgMjkuMzY4Wk0xMy4zMTI1IDI5LjM2OTFIMjMuOTk2OVY0MC4wMDAySDEzLjMxMjVWMjkuMzY5MVpNMzQuNjg0NCA4SDI0VjE4LjY4NDRIMzQuNjg0NFY4WiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTEzLjMxMjUgMjkuMzY5MUgyMy45OTY5VjQwLjAwMDJIMTMuMzEyNVYyOS4zNjkxWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTI0LjAyMzYgMjkuMzY4SDM0LjY4MzJMMjQgMTguNjg0NEwyMy45OTkxIDE4LjY4MzZIMTMuMzM5OEwyMy45NzAyIDI5LjMxNDZIMjMuOTk5MVYyOS4zNDM1TDI0LjAyMzYgMjkuMzY4WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTM0LjY4NDQgOEgyNFYxOC42ODQ0SDM0LjY4NDRWOFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=",
                "description": "A wallet for your favorite blockchain apps and games",
                "color": "#000000",
                "supportEmail": "developer@flipper.org",
                "website": "https://flipper.org"
            }
        },)
    }

    const createPublisher = async () => {
        setIsLoading(true)
        try {
            await login();
            fcl.currentUser().subscribe(setPublisher);
            const txn = await StoreCollection()
            setIsLoading(false)
            //sign user from extension
            if (txn) {
                router.push("/home")
            }
        } catch (e) {
            setIsLoading(false)
            toast({
                title: "User collection failed to create",
                status: "error",
                duration: 3000,
                position: "top"
            })
        }


    }

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

        const url = "https://hardware-wallet-api-testnet.staging.onflow.org/accounts";

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
            //get new accoutn info
            const accountInfo = await fcl
                //@ts-ignore
                .send([fcl.getAccount(account.address)])
                .then(fcl.decode);

            //get signature
            const msg = toHex(`${accountInfo.address}`);
            const sig = sign(
                privateKey,
                prependUserDomainTag(msg)
            );

            const compSig = new fcl.WalletUtils.CompositeSignature(
                accountInfo.address,
                0,
                await sig
            );
            console.log("compSig", compSig);

            const verification = fcl.AppUtils.verifyUserSignatures(msg, [compSig]);

            if (!verification) {
                throw new Error("Private key not valid for this account");
            }
            console.log(verification);
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
        createPublisher,
        isLoading
    };
}

