import styles from "@/UI/UI.module.scss";

const UI = () => {
  const isAiming = false;

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
        />
      </div>
    </div>
  );
};

export default UI;
