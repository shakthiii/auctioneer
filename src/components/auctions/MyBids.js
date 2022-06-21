import React, { useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { authApp, firestoreApp } from "../../config/firebase";
import { NavComp } from "../authentication/NavComp";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure();

const db = firestoreApp.collection("auctions");

export const MyBids = () => {
  const { currentUser } = useContext(AuthContext);

  const [bids, setBids] = useState([]);
  // const [product, setProduct] = useState();

  const handleToken = async (token, title, price) => {
    //   console.log({ token, addresses });
    let product = { name: title, price: price };

    const response = await axios.post(
      "https://vu8r5i.sse.codesandbox.io/checkout",
      {
        token,
        product,
      }
    );

    console.log(response);
    const { status } = response.data;
    console.log({ status });
    if (status === "success") {
      toast("Success! Check email for details", {
        type: "success",
      });
      // <div className="btn btn-outline-secondary mx-2">Paid</div>;
    } else {
      toast("Something went wrong", {
        type: "error",
      });
    }
  };

  useEffect(async () => {
    console.log(currentUser.email);
    db.where("curWinner", "in", [currentUser.email]).onSnapshot((snap) => {
      let documents = [];
      snap.forEach((doc) => {
        documents.push({ ...doc.data(), id: doc.id });
      });
      setBids(documents);

      console.log(documents);
    });
  }, []);

  return (
    <div>
      <NavComp />
      <ToastContainer />

      <div className="container py-5">
        <h1 className="text-center">My bids</h1>
        {bids.length > 0 ? (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {bids.map((doc) => (
              <>
                <div className="col">
                  <div className="card shadow-sm">
                    <div
                      style={{
                        height: "320px",
                        backgroundImage: `url(${doc.imgUrl})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                      className="w-100"
                    />

                    <div className="card-body">
                      <p className="lead display-6">{doc.title}</p>
                      <p className="card-text">{doc.desc}</p>
                      <div className="d-flex justify-content-between align-item-center">
                        <p className="display-6">₹{doc.curPrice}</p>
                        <StripeCheckout
                          stripeKey="pk_test_51KrioOSCOCMzXhCwzVU3uHDf2OLdtzq4uyCbit904o1R6jUOdt76w7CGZmuI32wg4rkhQ4iwB0Kxb9GFnwoNyufM008GIoGoqb"
                          token={(token) =>
                            handleToken(token, doc.title, doc.curPrice)
                          }
                          billingAddress
                          shippingAddress
                          amount={doc.curPrice * 100}
                          name={doc.title}
                          currency="INR"
                        >
                          <div className="btn btn-outline-secondary mx-2">
                            Pay Now
                          </div>
                        </StripeCheckout>

                        {/* <button
                          type="button"
                          className="btn btn-primary mx-3"
                          onClick={(e) => submitOrder(e, "razorPay")}
                        >
                          Pay
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
        ) : (
          <h4>No Bids won. Please participate in auction.</h4>
        )}
      </div>
    </div>
  );
};
