import styles from "@/UI/UI.module.scss";
import ChatbotModal from "../Chatbot";
import { useState } from "react";
import { useProductStore } from "../../store/productStore";
import { ShopifyProvider, CartProvider } from "@shopify/hydrogen-react";
import Modal from "../Modal";

const shopifyConfig = {
  storeDomain: "gsv01y-gx.myshopify.com" || "", // Replace with your Shopify store domain
  storefrontToken: "b148c0911287ca8a6f23a6d7bab23110" || "",
  storefrontApiVersion: "2024-10",
};

const UI = () => {
  const { isModalOpen, selectedProduct, closeModal } = useProductStore();

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
      </div>

      {/* Brand logo on bottom-left */}
      <div className={styles.brandLogoContainer}>
        <img
          src="/icons/Brand Logo.svg"
          alt="Brand Logo"
          className={styles.brandLogo}
        />
      </div>

      {/* Chat logo on bottom-right */}
      <div className={styles.chatLogoContainer}>
        <img
          src="/icons/Chatbot.svg"
          alt="Chatbot"
          className={styles.chatLogo}
          onTouchStart={(e) => {
            openChatbotModal();
          }}
          onClick={(e) => {
            openChatbotModal();
          }}
        />
      </div>

      {isModalOpen && (
        <ShopifyProvider
          countryIsoCode="ID"
          languageIsoCode="ID"
          {...shopifyConfig}
        >
          <CartProvider>
            <Modal
              isOpen={isModalOpen}
              onClose={closeModal}
              data={selectedProduct}
            />
          </CartProvider>
        </ShopifyProvider>
      )}

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
