import styles from "@/UI/UI.module.scss";
import ChatbotModal from "../Chatbot";
import { useState } from "react";
import { useZustandStore } from "../stores/ZustandStores";
import { ShopifyProvider, CartProvider } from "@shopify/hydrogen-react";
import Modal from "../NewModal";
import Cart from "../Cart";
import Wishlist from "@/Wishlist";
import InfoModal from "@/InfoModal";


const shopifyConfig = {
  storeDomain: "gsv01y-gx.myshopify.com", // Replace with your Shopify store domain
  storefrontToken: "b148c0911287ca8a6f23a6d7bab23110",
  storefrontApiVersion: "2024-10",
};

const UI = () => {
  // Zustand store for handling different components
  const {
    crosshairVisible, hideCrosshair,
    isModalOpen,
    isCartOpen, openCart,
    isWishlistOpen, openWishlist,
    isInfoModalOpen, openInfoModal,
  } = useZustandStore();

  const [ChatbotOpen, setChatbotOpen] = useState(false);

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
      {crosshairVisible && !isMobile && <div className={styles.aim} />}

      <div className={styles.iconsContainer}>

        <img src="/icons/Cart.svg" alt="Cart" className={styles.icon} onClick={openCart} />
        <img src="/icons/Wishlist.svg" alt="Wishlist" className={styles.icon} onClick={openWishlist} />
        <img src="/icons/Info.svg" alt="Info" className={styles.icon} onClick={openInfoModal} />

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

      <ShopifyProvider
        countryIsoCode="ID"
        languageIsoCode="ID"
        {...shopifyConfig}
      >
        <CartProvider>
          {isModalOpen && (
            // <Modal
            //   isOpen={isModalOpen}
            //   onClose={closeModal}
            //   data={selectedProduct}
            // />
            <Modal/>
          )}
          {isCartOpen && (
            <Cart></Cart>
          )}
        </CartProvider>
      </ShopifyProvider>
      {isWishlistOpen && (
        <Wishlist></Wishlist>
      )}

      { isInfoModalOpen && (
        <InfoModal></InfoModal>
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
