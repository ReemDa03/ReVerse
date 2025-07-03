import React from "react";
import {
  FaRocket,
  FaDollarSign,
  FaPalette,
  FaMobileAlt,
  FaHeadset,
  FaWhatsapp,
  FaInstagram,
  FaEnvelope,
} from "react-icons/fa";
import "./FooterSection.css";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const FooterSection = () => {
  const { t } = useTranslation();

  const footerFeatures = [
    {
      icon: <FaRocket />,
      title: t("footerMe.features.fast.title"),
      description: t("footerMe.features.fast.desc"),
    },
    {
      icon: <FaDollarSign />,
      title: t("footerMe.features.pricing.title"),
      description: t("footerMe.features.pricing.desc"),
    },
    {
      icon: <FaPalette />,
      title: t("footerMe.features.ui.title"),
      description: t("footerMe.features.ui.desc"),
    },
    {
      icon: <FaMobileAlt />,
      title: t("footerMe.features.responsive.title"),
      description: t("footerMe.features.responsive.desc"),
    },
    {
      icon: <FaHeadset />,
      title: t("footerMe.features.support.title"),
      description: t("footerMe.features.support.desc"),
    },
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.footer
      className="footer-section"
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="footer-title"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        {t("footerMe.title")}
      </motion.h2>

      <motion.p
        className="footer-subtext"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {t("footerMe.description")}
      </motion.p>

      <div className="footer-grid">
        {footerFeatures.map((feature, index) => (
          <motion.div
            key={index}
            className="footer-card"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
          >
            <div className="icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="footer-cta"
        id="get-started"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <h3>{t("footerMe.cta.title")}</h3>
        <p>{t("footerMe.cta.description")}</p>
        <a
          href="https://wa.me/201024208807?text=Hello%2C%20I'm%20interested%20in%20learning%20more%20about%20your%20services%20at%20ReVerse.%20Could%20you%20please%20provide%20more%20information%3F"
          className="footer-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("footerMe.cta.button")}
        </a>
      </motion.div>

      <motion.div
        className="footer-icons"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <a href="https://wa.me/201024208807" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp />
        </a>
        <a href="https://instagram.com/reverse.saas" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href="mailto:reemdarwish07@gmail.com">
          <FaEnvelope />
        </a>
      </motion.div>

      <motion.p
        className="footer-copy"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        &copy; {new Date().getFullYear()} ReVerse. {t("footerMe.copyright")}
      </motion.p>
    </motion.footer>
  );
};

export default FooterSection;
