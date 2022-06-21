import React, { useContext, useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { AddAuction } from "./AddAuction";
import { AuctionCard } from "./AuctionCard";
import { ProgressBar } from "./ProgressBar";
import { NavComp } from "../authentication/NavComp";
import { authApp, firestoreApp } from "../../config/firebase";

export const AuctionBody = () => {
    const [auction, setAuction] = useState(null);
    const [role, setRole] = useState(null);

    const { currentUser, globalMsg } = useContext(AuthContext);
    const { docs } = useFirestore("auctions");

    useEffect(() => {
        const db = firestoreApp.collection("roles");
        if (currentUser) {
            db.where("email", "in", [currentUser.email]).onSnapshot((snap) => {
                let documents = [];
                snap.forEach((doc) => {
                    documents.push({ ...doc.data(), id: doc.id });
                });
                setRole(documents[0].role);
            });
        }
    }, []);

    return (
        <div>
            <NavComp />

            <div className="container">
                {auction && (
                    <ProgressBar auction={auction} setAuction={setAuction} />
                )}

                {globalMsg && <Alert variant="info">{globalMsg}</Alert>}

                {currentUser && role == "auctioner" && (
                    <AddAuction setAuction={setAuction} />
                )}

                {docs.length != 0 ? (
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                        {docs.map((doc) => {
                            return <AuctionCard item={doc} key={doc.id} />;
                        })}
                    </div>
                ) : (
                    <h2 className="text-center">No auction</h2>
                )}
            </div>
        </div>
    );
};
