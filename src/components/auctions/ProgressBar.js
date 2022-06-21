import React, { useEffect } from "react";
import { motion } from "framer-motion";
import useStorage from "../../hooks/useStorage";

export const ProgressBar = ({ auction, setAuction }) => {
  const { progress, isCompleted } = useStorage(auction);

  useEffect(() => {
    if (isCompleted) {
      setAuction(null);
    }
  }, [isCompleted, setAuction]);

  return (
    <motion.div
      style={{ height: "10px", background: "#00ff26" }}
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
    />
  );
};
