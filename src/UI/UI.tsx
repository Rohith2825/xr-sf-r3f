import styles from "@/UI/UI.module.scss";
import ChatbotModal from "../Chatbot";
import { useState } from "react";
import { useProductStore } from "../../store/productStore";
import { ShopifyProvider, CartProvider } from "@shopify/hydrogen-react";
import Modal from "../Modal";
import InfoModal, { useInfoModalStore } from "../InfoModal";

const shopifyConfig = {
  storeDomain: "gsv01y-gx.myshopify.com" || "", // Replace with your Shopify store domain
  storefrontToken: "b148c0911287ca8a6f23a6d7bab23110" || "",
  storefrontApiVersion: "2024-10",
};

const UI = () => {
  const {
    isModalOpen,
    selectedProduct,
    closeModal,
    hideCrosshair,
    crosshairVisible,
  } = useProductStore();

  const [ChatbotOpen, setChatbotOpen] = useState(false);
  const { isInfoModalOpen, openInfoModal, closeInfoModal } =
    useInfoModalStore();

  const [isMobile, setIsMobile] = useState(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|Kindle|Silk|Mobile|Tablet|Touch/i.test(
      navigator.userAgent
    )
  );

  const openChatbotModal = () => {
    setChatbotOpen(true);
  };

  const closeChatbotModal = () => {
    setChatbotOpen(false);
  };

  return (
    <div className="ui-root">
      {!crosshairVisible && !isMobile && <div className={styles.aim} />}

      <div className={styles.iconsContainer}>
        <img src="/icons/Cart.svg" alt="Cart" className={styles.icon} />
        <img src="/icons/Wishlist.svg" alt="Wishlist" className={styles.icon} />
        <img
          src="/icons/Info.svg"
          alt="Info"
          className={styles.icon}
          onClick={openInfoModal}
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

      {/* Chat logo on bottom-right */}
      <div className={styles.chatLogoContainer}>
        <img
          src="/icons/Chatbot.svg"
          alt="Chatbot"
          className={styles.chatLogo}
          onPointerDown={(e) => {
            openChatbotModal();
            hideCrosshair();
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

      <InfoModal isOpen={isInfoModalOpen} onClose={closeInfoModal} />

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
