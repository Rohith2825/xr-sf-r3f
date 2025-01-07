import React, { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import styles from "@/UI/UI.module.scss";
import ChatbotModal from "../Chatbot";
import { useState } from "react";
import { useProductStore } from "../../store/productStore";
import { ShopifyProvider, CartProvider } from "@shopify/hydrogen-react";
import Modal from "../Modal";
import Cart from "../Cart";
import Wishlist from "@/Wishlist";
import InfoModal, { useInfoModalStore } from "../InfoModal";

const customDriverStyles = `
  .driver-popover {
    font-family: 'Poppins', sans-serif !important;
  }
  
  .driver-popover * {
    font-family: 'Poppins', sans-serif !important;
  }
  
  .driver-popover-title {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 600 !important;
    font-size: 18px !important;
  }
  
  .driver-popover-description {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 400 !important;
    font-size: 14px !important;
  }
  
  .driver-popover-progress-text {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 400 !important;
  }
  
  .driver-popover-footer button {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 500 !important;
  }
`;

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
    showCrosshair,
    crosshairVisible,
    driverActive,
    activateDriver,
    deactivateDriver,
  } = useProductStore();

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = customDriverStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

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

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const handleCartOpen = () => {
    setIsCartOpen(true);
    hideCrosshair();
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
    showCrosshair();
  };

  const handleWishlistOpen = () => {
    setIsWishlistOpen(true);
    hideCrosshair();
  };

  const handleWishlistClose = () => {
    setIsWishlistOpen(false);
    showCrosshair();
  };

  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: ".iconsContainer",
        popover: {
          title: "Navigation & Controls",
          description: isMobile
            ? "Use the virtual joystick to move around and interact with products"
            : "Use WASD keys to navigate: W (up), A (left), S (down), D (right)",
          side: "left",
          align: "start",
        },
      },
      {
        element: '[alt="Cart"]',
        popover: {
          title: "Shopping Cart",
          description: "View and manage items in your shopping cart",
          side: "bottom",
        },
      },
      {
        element: '[alt="Wishlist"]',
        popover: {
          title: "Wishlist",
          description: "Save items for later in your wishlist",
          side: "bottom",
        },
      },
      {
        element: '[alt="Info"]',
        popover: {
          title: "Information",
          description: "Get more details about our products and services",
          side: "bottom",
        },
      },
      {
        element: '[alt="Chatbot"]',
        popover: {
          title: "Chat Assistant",
          description: "Need help? Chat with our virtual assistant",
          side: "left",
        },
      },
    ],
  });

  const startTour = () => {
    // Close any open modals before starting the tour
    if (isModalOpen) closeModal();
    if (isCartOpen) handleCartClose();
    if (isWishlistOpen) handleWishlistClose();
    if (isInfoModalOpen) closeInfoModal();
    if (ChatbotOpen) closeChatbotModal();

    // Start the tour
    driverObj.drive();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Check if the driver is active
      if (driverObj.isActive() && !useProductStore.getState().driverActive) {
        activateDriver();
      } else if (!driverObj.isActive() && useProductStore.getState().driverActive) {
        deactivateDriver();
      }
    }, 100); // Check every 100ms

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [activateDriver, deactivateDriver, driverObj]);

  return (
    <div className="ui-root">
      {!crosshairVisible && !isMobile && !isModalOpen && (
        <div className={styles.aim} />
      )}

      <div className={styles.helpIconContainer}>
        <img
          src="/icons/Help.svg"
          alt="Help"
          className={styles.icon}
          onClick={startTour}
        />
      </div>

      <div className={styles.iconsContainer}>
        <img
          src="/icons/Cart.svg"
          alt="Cart"
          className={styles.icon}
          onClick={handleCartOpen}
        />
        <img
          src="/icons/Wishlist.svg"
          alt="Wishlist"
          className={styles.icon}
          onClick={handleWishlistOpen}
        />
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
          src="/logo.avif"
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
            <Modal
              isOpen={isModalOpen}
              onClose={closeModal}
              data={selectedProduct}
            />
          )}
          {isCartOpen && <Cart onClose={handleCartClose}></Cart>}
        </CartProvider>
      </ShopifyProvider>
      {isWishlistOpen && <Wishlist onClose={handleWishlistClose}></Wishlist>}

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
