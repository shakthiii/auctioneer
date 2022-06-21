import React from "react";
import { AuctionBody } from "./components/auctions/Body";
import { NavComp } from "./components/authentication/NavComp";
import { MyBids } from "./components/auctions/MyBids";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div id="routing-container">
                    <Routes>
                        <Route
                            path="/"
                            exact={true}
                            element={<AuctionBody />}
                        />
                        <Route
                            path="/mybids"
                            exact={true}
                            element={<MyBids />}
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};
