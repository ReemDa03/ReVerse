import React from "react";
import { useTranslation } from "react-i18next";
import {
  FaUtensils,
  FaShoppingCart,
  FaCalendarAlt,
  FaTags,
  FaLock,
  FaGlobe,
  FaCloud,
  FaBolt
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "./FeaturesSection.css";

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <FaUtensils />,
      title: t("features.cards.0.title"),
      description: t("features.cards.0.description")
    },
    {
      icon: <FaShoppingCart />,
      title: t("features.cards.1.title"),
      description: t("features.cards.1.description")
    },
    {
      icon: <FaCalendarAlt />,
      title: t("features.cards.2.title"),
      description: t("features.cards.2.description")
    },
    {
      icon: <FaTags />,
      title: t("features.cards.3.title"),
      description: t("features.cards.3.description")
    },
    {
      icon: <FaLock />,
      title: t("features.cards.4.title"),
      description: t("features.cards.4.description")
    },
    {
      icon: <FaGlobe />,
      title: t("features.cards.5.title"),
      description: t("features.cards.5.description")
    },
    {
      icon: <FaCloud />,
      title: t("features.cards.6.title"),
      description: t("features.cards.6.description")
    },
    {
      icon: <FaBolt />,
      title: t("features.cards.7.title"),
      description: t("features.cards.7.description")
    }
  ];

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  return (
    <section className="features-section" id="features" ref={ref}>
      <motion.div
        className="features-header"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <h2>{t("features.title1")}</h2>
        <p>{t("features.description")}</p>
        <h2>{t("features.title2")}</h2>
      </motion.div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
