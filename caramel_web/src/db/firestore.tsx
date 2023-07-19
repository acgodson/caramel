import { initFirebase } from "@/config";
import {
    getFirestore,
    onSnapshot,
    collection,
    getDoc,
    getDocs,
    updateDoc,
    doc,
    setDoc,
    deleteDoc,
    serverTimestamp,
    DocumentSnapshot,
    FieldValue,
    addDoc,
    query,
    where,
} from "firebase/firestore";


initFirebase();
const db = getFirestore();

export type shiftType = {
    start: string,
    end: string,
}

export const sumArray = (array: [any]) => {
    let sum = 0;
    array.forEach((item) => {
        sum += item;
    });
    return sum;
};

export type UserType = {
    email: string;
    name: string;
    uid: string;
};

export type addressType = {
    state: string | null,
    city: string | null,
    district: string | null,
    address: string
}

export const createUser = (userID: string, options: {}) => {
    const usersColRef = doc(db, "users", userID);
    return setDoc(usersColRef, options);
};

export const getUser = async (userId: string) => {
    const userDocRef = doc(db, "users", userId);
    const getRef = await getDoc(userDocRef);
    const data = getRef.data();
    if (data && data.email) {
        const dataObj = {
            account: data.account,
            keys: data.keys
        };
        return dataObj;
    } else {
        return false;
    }
};

export const streamUser = (userId: string) => {
    onSnapshot(doc(db, "users", userId), (doc) => {
        return doc.data();
    });
};

export const streamAllUsers = async () => {
    const ref = collection(db, "users");
    const snapshot = await getDocs(ref);
    const users: any[] = [];
    snapshot.docs.forEach((x: DocumentSnapshot) => {
        var id = x.id;
        users.push({ ...x.data(), id });
    });

    return users;
};


export const deleteUser = (userId: string) => {
    const userDocRef = doc(db, "users", userId);
    return deleteDoc(userDocRef);
};

export const updateUserData = (userId: string, data: any) => {
    const userDocRef = doc(db, "users", userId);
    return updateDoc(userDocRef, data);
};


export const postJob = (userId: string, title: string, description: string,
    address: addressType,
    shifts: shiftType[],
    jobType: string
) => {
    const docsColRef = collection(db, "jobs");
    return addDoc(docsColRef, {
        title,
        description,
        views: 0,
        applicants: 0,
        shifts,
        address,
        createdBy: userId,
        type: jobType,
        createdAt: serverTimestamp(),

    });
};


export const streamMyJobs = async (userId: string) => {
    const ref = query(collection(db, "jobs"), where("createdBy", "==", userId));
    const snapshot = await getDocs(ref);
    const jobs: any[] = [];
    snapshot.docs.forEach((x: DocumentSnapshot) => {
        var id = x.id;
        jobs.push({ ...x.data(), id });
    });
    return jobs;
};

export const deleteJob = (jobId: string) => {
    const jobDocRef = doc(db, "jobs", jobId);
    return deleteDoc(jobDocRef);
};


export const updatCode = (object: any, user: string) => {
    const usersColRef = doc(db, "users", user);
    return updateDoc(usersColRef, object);
};





export const fetchDeposit = async (userId: string) => {
    const userDocRef = doc(db, "users", userId);
    const getRef = await getDoc(userDocRef);
    const data = getRef.data();
    if (data && data.email) {
        const dataObj = data.deposits;
        return dataObj;
    } else {
        return false;
    }
};
export const fetchWithdrawal = async (userId: string) => {
    const userDocRef = doc(db, "users", userId);
    const getRef = await getDoc(userDocRef);
    const data = getRef.data();
    if (data && data.email) {
        const dataObj = data.withdraws;
        return dataObj;
    } else {
        return false;
    }
};

export const checkActive = async (userId: string) => {
    const userDocRef = doc(db, "users", userId);
    const getRef = await getDoc(userDocRef);
    const data = getRef.data();
    if (data && data.email) {
        const dataObj = data.active;
        return dataObj;
    } else {
        return false;
    }
};



export const fetchCommissions = async (userId: string) => {
    const userDocRef = doc(db, "users", userId);
    const getRef = await getDoc(userDocRef);
    const data = getRef.data();
    if (data && data.email) {
        const dataObj = data.commissions;
        return dataObj;
    } else {
        return false;
    }
};



export const getAllCodes = async (userId: string) => {
    const userDocRef = doc(db, "users", userId);
    const getRef = await getDoc(userDocRef);
    const data = getRef.data();
    if (data && data.email) {
        const dataObj = {
            miners: data.miners,
            activation: data.activation,
        };
        return dataObj;
    } else {
        return false;
    }
};
export const fetchWallets = async (userId: string) => {
    const userDocRef = doc(db, "users", userId);
    const getRef = await getDoc(userDocRef);
    const data = getRef.data();
    if (data && data.email) {
        const dataObj = {
            bitcoin: data.bitcoin,
            usdt: data.usdt,
            bank: data.bank
        };
        return dataObj;
    } else {
        return false;
    }
};


export const fetchAdmin = async () => {
    const userDocRef = doc(db, "admin", "ircw4QKhepbuSEuBZxua");
    const getRef = await getDoc(userDocRef);
    const data = getRef.data();
    if (data) {
        const dataObj = {
            whatsapp: data.whatsapp,
            viber: data.viber,
        };
        return data;
    } else {
        return false;
    }
};