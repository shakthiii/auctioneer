import { createContext, useEffect, useState } from "react";
import { authApp, firestoreApp } from "../config/firebase";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalMsg, setGlobalMsg] = useState("");
    const [role, setRole] = useState("");

    const register = (email, password, role) => {
        const db = firestoreApp.collection("roles");
        db.add({ email, role });
        return authApp.createUserWithEmailAndPassword(email, password);
    };

    const login = (email, password) => {
        return authApp.signInWithEmailAndPassword(email, password);
    };

    const logout = () => {
        return authApp.signOut();
    };

    const bidAuction = (auctionId, price) => {
        if (!currentUser) {
            return setGlobalMsg("Please login first");
        }

        let newPrice = Math.floor((price / 100) * 110);
        const db = firestoreApp.collection("auctions");

        return db.doc(auctionId).update({
            prevPrice: price,
            curPrice: newPrice,
            curWinner: currentUser.email,
        });
    };

    const endAuction = (auctionId) => {
        const db = firestoreApp.collection("auctions");

        return db.doc(auctionId).delete();
    };

    const findRole = () => {
        const db = firestoreApp.collection("roles");
        db.where("email", "in", [currentUser.email]).onSnapshot((snap) => {
            let documents = [];
            snap.forEach((doc) => {
                documents.push({ ...doc.data(), id: doc.id });
            });
            setBids(documents);
            console.log(documents);
        });
    };

    useEffect(() => {
        const subscribe = authApp.onAuthStateChanged((user) => {
            setCurrentUser(user);

            setLoading(false);
        });

        return subscribe;
    }, []);

    useEffect(() => {
        const interval = setTimeout(() => setGlobalMsg(""), 5000);
        return () => clearTimeout(interval);
    }, [globalMsg]);

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                register,
                login,
                logout,
                bidAuction,
                endAuction,
                globalMsg,
                role,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};
