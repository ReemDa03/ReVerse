import React, { useState } from 'react';
import './ClientsSection.css';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const clients = [
  {
    name: "ReVerse Cafe",
    image: "https://res.cloudinary.com/dwupyymoc/image/upload/f_auto,q_auto,w_400,h_300,c_fill/v1751506509/Mehbud_Suspended_Ceilings_for_Your_Prestige_s7wqri.jpg",
    link: "https://rreverse.netlify.app/reverse/re-caffee"
  },
  {
    name: "ReVerse Rest",
    image: "https://res.cloudinary.com/dwupyymoc/image/upload/f_auto,q_auto,w_400,h_300,c_fill/v1751506509/Pub_Sustainable_Architecture_Design_Ideas_pvbwmn.jpg",
    link: "https://rreverse.netlify.app/reverse/re-rest"
  },
  {
    name: "Fake Sushi Corner",
    image: "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_400,h_300,c_fill/sample.jpg",
    link: "https://sushi-corner.reversesite.com"
  },
  {
    name: "Fake Coffee Spot",
    image: "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_400,h_300,c_fill/sample.jpg",
    link: "https://coffee-spot.reversesite.com"
  }
];

const ClientsSection = () => {
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();
  const visibleClients = showAll ? clients : clients.slice(0, 2);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  return (
    <motion.section
      className="clients-section"
      id="clients"
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="clients-title"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        {t("clients.title")}
      </motion.h2>

      <motion.p
        className="clients-subtext"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {t("clients.description")}
      </motion.p>

      <div className={`clients-scroll ${!showAll ? 'centered-scroll' : ''}`}>
        {visibleClients.map((client, index) => (
          <motion.a
            key={index}
            href={client.link}
            className="client-card"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <img src={client.image} alt={client.name} />
            <p>{client.name}</p>
          </motion.a>
        ))}
      </div>

      <motion.div
        className="clients-buttons"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <a href="#pricing" className="btn-orange">{t("clients.cta")}</a>
        <button className="btn-outline" onClick={() => setShowAll(!showAll)}>
          {showAll ? t("clients.hide") : t("clients.viewMore")}
        </button>
      </motion.div>
    </motion.section>
  );
};

export default ClientsSection;
