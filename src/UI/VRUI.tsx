import { useRef, useState, useEffect } from "react";
import { Fullscreen, Container, Image, Text } from "@react-three/uikit";
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
import ModalWrapper from "@/ModalWrapper";
import ProductSearcher from "@/ProductSearcher";
import { store } from "@/main";
import ReactAudioPlayer from "react-audio-player";

const shopifyConfig = {
  storeDomain: "htphzk-um.myshopify.com", 
  storefrontToken: "446cb8f8327b9074dcc7c158332ca146",
  storefrontApiVersion: "2024-10",
};

export default function VRUI() {
  const {
    crosshairVisible, hideCrosshair,
    isModalOpen, closeModal,
    isCartOpen, openCart, closeCart,
    isWishlistOpen, openWishlist, closeWishlist,
    isInfoModalOpen, openInfoModal, closeInfoModal,
    discountCode, isDiscountModalOpen, closeDiscountModal,
    isSettingsModalOpen , openSettingsModal, closeSettingsModal,
    isAudioPlaying,
    isTermsModalOpen, isContactModalOpen,
    isProductSearcherOpen, openProductSearcher, closeProductSearcher
  } = useComponentStore();

  const [ChatbotOpen, setChatbotOpen] = useState(false);
  const audioPlayerRef = useRef(null);

  // ... (effects and logic for audio, tour, etc. can be copied as-is)

  return (
    <Fullscreen flexDirection="column" alignItems="center" justifyContent="center" padding={0}>
      {/* Overlay grid for positioning */}
      <Container width={400} height={250} flexDirection="row" alignItems="center" justifyContent="center">
        {/* Left column: logo near bottom left */}
        <Container flexDirection="column" alignItems="flex-start" justifyContent="flex-end" width={100} height={250} padding={8}>
          <Container marginBottom={8}>
            <Image
              src="/logo.avif"
              width={48}
              height={48}
              onClick={() => store.enterVR()}
            />
          </Container>
        </Container>
        {/* Center column: empty for spacing */}
        <Container width={200} height={250} />
        {/* Right column: icons top right, chat bottom right */}
        <Container flexDirection="column" alignItems="flex-end" justifyContent="space-between" width={100} height={250} padding={8}>
          {/* Top right: vertical icons */}
          <Container flexDirection="column" alignItems="flex-end" gap={6} marginTop={6}>
            <Image src="/icons/Search.svg" width={28} height={28} onClick={openProductSearcher} />
            <Image src="/icons/Cart.svg" width={28} height={28} onClick={openCart} />
            <Image src="/icons/Wishlist.svg" width={28} height={28} onClick={openWishlist} />
            <Image src="/icons/Settings.svg" width={28} height={28} onClick={openSettingsModal} />
            <Image src="/icons/Help.svg" width={28} height={28} onClick={() => {/* startTour logic */}} />
          </Container>
          {/* Bottom right: chatbot icon */}
          <Container marginBottom={6}>
            <Image
              src="/icons/Chatbot.svg"
              width={40}
              height={40}
              onPointerDown={() => {
                setChatbotOpen(true);
                hideCrosshair();
              }}
            />
          </Container>
        </Container>
      </Container>

      {/* Modals and overlays */}
      {/* <ShopifyProvider countryIsoCode="ID" languageIsoCode="ID" {...shopifyConfig}>
        <CartProvider>
          {isModalOpen && <Modal />}
          {isCartOpen && <Cart />}
        </CartProvider>
      </ShopifyProvider>
      {isWishlistOpen && <Wishlist />}
      {isInfoModalOpen && <InfoModal />}
      {isTermsModalOpen && <TermsConditionsModal />}
      {isContactModalOpen && <ContactUsModal />}
      <DiscountModal isOpen={isDiscountModalOpen} onClose={closeDiscountModal} discountCode={discountCode} />
      {isSettingsModalOpen && <ModalWrapper><SettingsModal /></ModalWrapper>}
      {isProductSearcherOpen && <ProductSearcher />}
      <ChatbotModal isChatbotModalOpen={ChatbotOpen} onChatbotModalClose={() => setChatbotOpen(false)} /> */}

      {/* Audio */}
      {/* <ReactAudioPlayer
        ref={audioPlayerRef}
        src="/media/Soundtrack.mp3"
        autoPlay={false}
        loop
        onError={e => console.error('Audio player error:', e)}
        onCanPlay={() => {
          if (isAudioPlaying && audioPlayerRef.current?.audioEl?.current) {
            audioPlayerRef.current.audioEl.current.play();
          }
        }}
      /> */}
    </Fullscreen>
  );
} 