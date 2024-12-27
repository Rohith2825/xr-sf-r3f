import styles from "@/UI/UI.module.scss";
import ChatbotModal from "../Chatbot";
import { useState } from "react";

const UI = () => {
  const isAiming = false;
  const [ChatbotOpen, setChatbotOpen] = useState(false);

  const openChatbotModal = () => {
    setChatbotOpen(true);
  };

  const closeChatbotModal = () => {
    setChatbotOpen(false);
  };

  return (
    <div className="ui-root">
      {!isAiming && <div className={styles.aim} />}

      <div className={styles.iconsContainer}>
        <img src="/icons/Cart.svg" alt="Cart" className={styles.icon} />
        <img src="/icons/Wishlist.svg" alt="Wishlist" className={styles.icon} />
        <img src="/icons/Info.svg" alt="Info" className={styles.icon} />
        <img
          src="/icons/Chatbot.svg"
          alt="Chatbot"
          className={styles.icon}
          onClick={openChatbotModal}
        />
      </div>

      {/* Brand logo on bottom-left */}
      <div className={styles.brandLogoContainer}>
        <img
          src="/icons/Brand Logo.svg"
          alt="Brand Logo"
          className={styles.brandLogo}
        />
      </div>
      <div>
        <ChatbotModal
          isChatbotModalOpen={ChatbotOpen}
          onChatbotModalClose={() => {
            closeChatbotModal();
          }}
        />
      </div>
    </div>
  );
};

export default UI;
