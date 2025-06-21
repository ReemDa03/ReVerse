// ✅ src/Components/SideMenu/SideMenu.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const SideMenu = ({ onClose, onOpenContact, onOpenAdmin, slug }) => {
  const navigate = useNavigate();

  const goTo = (path) => {
    navigate(`/reverse/${slug}${path}`);
    onClose();
  };

  // ✅ إذا العنصر ظاهر حاليًا، منعمله scroll فوري، غير هيك منروح عالهوم مع scrollTo
  const goToHomeAndScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      onClose();
    } else {
      navigate(`/reverse/${slug}?scrollTo=${id}`);
      onClose();
    }
  };

  console.log("✅ SideMenu mounted with slug:", slug);

  return (
    <div>
      <button onClick={onClose}>X</button>

      <ul>
        <li>
          <button onClick={() => goTo("")}>Home</button>
        </li>
        <li>
          <button onClick={() => goTo("/cart")}>Cart</button>
        </li>
        <li>
          <button onClick={() => goToHomeAndScroll("menu")}>Products</button>
        </li>
        <li>
          <button onClick={() => goToHomeAndScroll("book")}>Book a Table</button>
        </li>
        <li>
          <button onClick={() => goToHomeAndScroll("footer")}>About Us</button>
        </li>
        <li>
          <button onClick={onOpenAdmin}>Admin</button>
        </li>
        <li>
          <button onClick={() => {
            console.log(" Let’s Contact clicked");
            onOpenContact();
          }}>
            Let’s Contact
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SideMenu;
