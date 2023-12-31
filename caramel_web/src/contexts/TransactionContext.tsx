import React, { createContext, useContext, useEffect, useState } from "react";
import { getUser } from '@/db/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
//@ts-ignore
import cookies from 'js-cookie';
import { useRouter } from 'next/router.js';
import crypto from "crypto"
import { initFirebase } from "@/config";
import * as fcl from "@onflow/fcl";
import { config } from "@onflow/fcl";



export const TransactionContext = createContext({});

export const useTransaction = () => useContext<any>(TransactionContext);



initFirebase();
const configs: any = {
  flow_mainnet: {
    accessNode: "https://rest-mainnet.onflow.org",
    flowNetwork: "mainnet",
  },
  flow_testnet: {
    accessNode: "https://side-still-sanctuary.flow-testnet.quiknode.pro",
    flowNetwork: "testnet",
  },
};

const configureFcl = (network: any) => {
  const fclConfig = config();
  fclConfig.put("accessNode.api", configs[network].accessNode);
  // fclConfig.put("flow.network", configs[network].flowNetwork);
  fclConfig.put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn");
  fclConfig.put("discovery.authn.endpoint", "https://fcl-discovery.onflow.org/api/testnet/authn");
  fclConfig.put("discovery.authn.include", "0x33f75ff0b830dcec");
  fclConfig.put("app.detail.title", "Caramel");
  fclConfig.put("app.detail.icon", "https://placekitten.com/g/200/200");
};


export default function TransactionProvider({ children }: any) {
  const [publisher, setPublisher] = useState("");
  const [transactionInProgress, setTransactionInProgress] = useState(false);
  const [defaultAccount, setDefaultAccount] = useState<string | null>(null)
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [txId, setTxId] = useState("");
  const auth = getAuth();
  const [user, setUser] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [userObject, setUserObject] = useState({
    email: '',
    name: '',
    uid: '',
  });
  const router = useRouter();
  function initTransactionState() {
    setTransactionInProgress(true);
    setTransactionStatus(null);
  }


  function navigate(path: string) {
    router.push(path);
  }

  const getUserFromCookie = () => {
    const cookie = cookies.get('auth');
    if (!cookie) {
      return;
    }
    return cookie;
  };

  const setUserCookie = (user: {
    id: string;
    displayName: string;
    email: string;
    token: string;
  }) => {
    cookies.set('auth', user, {
      expires: 1 / 24,
    });
  };
  1;

  const removeUserCookie = () => cookies.remove('auth');

  const mapUserData = async (user: {
    getIdToken?: any;
    uid?: any;
    email?: any;
    displayName?: any;
  }) => {
    const { uid, displayName, email } = user;
    const token = await user.getIdToken(true);
    return {
      id: uid,
      displayName,
      email,
      token,
    };
  };




  const logout = async () => {
    return auth
      .signOut()
      .then(() => {
        localStorage.clear()
        router.push('/login');
      })
      .catch((e: any) => {
        console.error(e);
      });
  };




  //Unscribe from Authlistner
  useEffect(() => {
    const cancelAuthListener = auth.onIdTokenChanged(async (userToken: any) => {
      if (userToken) {
        const userData: any = await mapUserData(userToken);
        setUserCookie(userData);
        setUser(userData);
      } else {
        removeUserCookie();
        setUser(null);
      }
    });

    const userFromCookie: any = getUserFromCookie();

    if (!userFromCookie) {
      return;
    }
    setUser(userFromCookie);
    cancelAuthListener();
  }, []);



  useEffect(() => {
    const storage = localStorage.getItem("caramel-user");
    if (storage) {
      console.log(JSON.parse(storage))
      setDefaultAccount(JSON.parse(storage).account)
    }

  }, [])


  useEffect(() => {

    fcl.currentUser().subscribe(setPublisher)

  }, [])

  useEffect(() => {
    configureFcl("flow_testnet");
  }, [])


  const value = {
    transactionInProgress,
    transactionStatus,
    txId,
    initTransactionState,
    setTxId,
    setTransactionStatus,
    userObject,
    setUserObject,
    mapUserData,
    user,
    logout,
    setUserCookie,
    getUserFromCookie,
    // signIn,
    defaultAccount,
    setDefaultAccount,
    error,
    setError,
    submitting,
    setSubmitting,
    setPublisher,
    publisher
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}
