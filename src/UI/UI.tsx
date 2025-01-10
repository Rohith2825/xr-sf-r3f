import { useEffect, useRef, useState } from "react";
import { driver, Driver } from "driver.js";
import "driver.js/dist/driver.css";
import styles from "@/UI/UI.module.scss";
import ChatbotModal from "../Chatbot";
import { useComponentStore, useDriverStore, useTourStore } from "../stores/ZustandStores";
import { ShopifyProvider, CartProvider } from "@shopify/hydrogen-react";
import Modal from "@/NewModal";
import Cart from "@/Cart";
import Wishlist from "@/Wishlist";
import InfoModal from "@/InfoModal";
import DiscountModal from "@/DiscountModal";
import SettingsModal from "@/SettingsModal";
import TermsConditionsModal from "@/TermsModal";
import ContactUsModal from "@/ContactUsModal";
import ReactAudioPlayer from "react-audio-player";
import ModalWrapper from "@/ModalWrapper";

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
  storeDomain: "gsv01y-gx.myshopify.com", // Replace with your Shopify store domain
  storefrontToken: "b148c0911287ca8a6f23a6d7bab23110",
  storefrontApiVersion: "2024-10",
};

const UI = () => {
  // Zustand store for handling different components
  const {
    crosshairVisible, hideCrosshair,
    isModalOpen, closeModal,
    isCartOpen, openCart, closeCart,
    isWishlistOpen, openWishlist, closeWishlist,
    isInfoModalOpen, openInfoModal, closeInfoModal,
    discountCode, isDiscountModalOpen, closeDiscountModal,
    isSettingsModalOpen , openSettingsModal, closeSettingsModal,
    isAudioPlaying,
    isTermsModalOpen,isContactModalOpen
  } = useComponentStore();
  const { activateDriver, deactivateDriver} = useDriverStore();
  const { setTourComplete } = useTourStore();

  const driverRef = useRef<Driver>(undefined);
  const audioPlayerRef = useRef<any>(null);
  const shouldMoveCamera = useRef(false);
  
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

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = customDriverStyles;
    document.head.appendChild(styleSheet);

    //Initialize the driver instance and assign to ref
    driverRef.current = driver({
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
          popover: {
            title: "Find products across the experience",
            description: "Walk to these products to essentially buy or add them to cart, I'll drop you off for now!",
          },
          onHighlightStarted: () => {
            // Custom logic to handle the camera movement
            shouldMoveCamera.current = true; // Trigger camera movement
            setTourComplete(true);
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
          element: '[alt="Settings"]',
          popover: {
            title: "Settings",
            description: "Manage your preferences, explore app features, and customize your experience.",
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

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [isMobile]);

  useEffect(() => {
    if(isAudioPlaying)
    {
      audioPlayerRef.current.audioEl.current.play();
    }
    else {
      audioPlayerRef.current.audioEl.current.pause();
    }
  },[isAudioPlaying])


  const startTour = () => {
    // Close any open modals before starting the tour
    if (isModalOpen) closeModal();
    if (isCartOpen) closeCart();
    if (isWishlistOpen) closeWishlist();
    if (isInfoModalOpen) closeInfoModal();
    if (ChatbotOpen) closeChatbotModal();
    if (isDiscountModalOpen) closeDiscountModal();
    if (isSettingsModalOpen) closeSettingsModal();

    // Start the tour and update the Zustand state
    if (driverRef.current) {
      driverRef.current.drive();
      activateDriver(); // Set Zustand state to active
    }
  };

  useEffect(() => {
    // Listen for driver active state changes and update Zustand
    let lastState = driverRef.current?.isActive();
    const checkDriverState = () => {
      const currentState = driverRef.current?.isActive();
      if(currentState !== lastState){
        lastState = currentState;
        if (currentState) {
          activateDriver();
        } else {
          deactivateDriver();
        }
      }
    };

    // Poll the state of the driver
    const interval = setInterval(checkDriverState, 100);

    return () => clearInterval(interval);
  }, [activateDriver, deactivateDriver]);

  return (
    <div className="ui-root">
      {crosshairVisible && !isMobile && <div className={styles.aim} />}

      <div className={styles.iconsContainer}>
        <img src="/icons/Cart.svg" alt="Cart" className={styles.icon} onClick={openCart} />
        <img src="/icons/Wishlist.svg" alt="Wishlist" className={styles.icon} onClick={openWishlist} />
        <img src="/icons/Settings.svg"  alt="Settings" className={styles.icon} onClick={openSettingsModal} />
        {/* <img src="/icons/Info.svg" alt="Info" className={styles.icon} onClick={openInfoModal} /> */}
        <img src="/icons/Help.svg" alt="Help" className={styles.icon} onClick={startTour}/>
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
            <Modal />
          )}
          {isCartOpen && (
            <Cart></Cart>
          )}
        </CartProvider>
      </ShopifyProvider>
      {isWishlistOpen && (
        <Wishlist></Wishlist>
      )}
      {isInfoModalOpen && (
        <InfoModal></InfoModal>
      )}
      {isTermsModalOpen && (
        <TermsConditionsModal />
      )}
      {isContactModalOpen && (
        <ContactUsModal />
      )}
      <DiscountModal
        isOpen={isDiscountModalOpen}
        onClose={closeDiscountModal}
        discountCode={discountCode}
      />
      {isSettingsModalOpen && <ModalWrapper><SettingsModal /></ModalWrapper>}
      <div>
        <ChatbotModal
          isChatbotModalOpen={ChatbotOpen}
          onChatbotModalClose={() => {
            closeChatbotModal();
          }}
        />
      </div>
      <ReactAudioPlayer
          ref={audioPlayerRef}
          src="/media/Soundtrack.mp3" // Replace with your audio file URL
          autoPlay={false}
          loop
      />
    </div>
  );
};

export default UI;
