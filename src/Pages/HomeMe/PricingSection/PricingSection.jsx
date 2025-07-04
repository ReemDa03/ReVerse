import React, { useState } from 'react';
import './PricingSection.css';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const PricingSection = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { t, i18n } = useTranslation();

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
  };

  const getWhatsAppLink = (planKey) => {
    const message =
      i18n.language === "ar"
        ? `مرحبًا، أنا مهتم بباقه ${t(`pricing.plans.${planKey}.title`)}. هل يمكنك تزويدي بمزيد من التفاصيل؟`
        : `Hello, I'm interested in the ${t(`pricing.plans.${planKey}.title`)} plan. Could you please share more details?`;

    return `https://wa.me/201024208807?text=${encodeURIComponent(message)}`;
  };

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.section
      className="pricing-section"
      id="pricing"
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="section-title"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        <h2>{t("pricing.title")}</h2>
      </motion.div>

      <div className="pricing-grid">
        {["basic", "pro", "vip"].map((planKey, index) => (
          <motion.div
            key={planKey}
            className={`pricing-card ${selectedPlan === planKey ? 'active' : ''}`}
            onClick={() => handlePlanClick(planKey)}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.2 }}
          >
            <h3>{t(`pricing.plans.${planKey}.title`)}</h3>
            <p className="price">
              {t(`pricing.plans.${planKey}.price`)}
              {planKey !== "vip" && <span> /{t("pricing.month")}</span>}
            </p>
            <a
              href={getWhatsAppLink(planKey)}
              target="_blank"
              rel="noopener noreferrer"
              className="start-now-btn"
              onClick={(e) => e.stopPropagation()}
            >
              {t("pricing.startNow")}
            </a>
            <ul className="features-list">
              {t(`pricing.plans.${planKey}.features`, { returnObjects: true }).map(
                (feature, index) => (
                  <li key={index}>{feature}</li>
                )
              )}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="cta-text"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 1 }}
      >
        {t("pricing.cta")}
      </motion.p>
    </motion.section>
  );
};

export default PricingSection;
