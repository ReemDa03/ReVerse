import React from "react";
import "./HeroMe.css";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const HeroMe = () => {
  const { t } = useTranslation();

  return (
    <motion.section
      className="hero-me"
      initial={{ opacity: 0.6, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      >
        <h1>{t("heroMe.title")}</h1>
        <p>{t("heroMe.subtitle")}</p>
        <a href="#get-started" className="hero-button">
          {t("heroMe.button")}
        </a>
      </motion.div>
    </motion.section>
  );
};

export default HeroMe;
