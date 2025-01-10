import React, { useRef, useEffect } from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // Ensure you import the CloseIcon
import Swal from "sweetalert2";
import styles from "./UI/UI.module.scss";

interface DiscountModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  discountCode: string;
}

const DiscountModal: React.FC<DiscountModalProps> = (props) => {
  const containerRef = useRef(null); // Reference to the wrapper
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    const joystickZone = document.getElementById("joystickZone");
    if (joystickZone) {
      joystickZone.style.display = "block";
    }
    props.onClose();
  };


  const handleCopy = (couponCode: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(couponCode)
        .then(() => {
          Swal.fire({
            title: "Copied!",
            text: "Coupon code copied to clipboard",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            customClass: {
              title: styles.swalTitle,
              popup: styles.swalPopup,
            },
          });
        })
        .catch((err) => {
          console.error("Clipboard API failed, falling back to execCommand: ", err);
          fallbackCopyText(couponCode);
        });
    } else {
      // Fallback for unsupported browsers
      fallbackCopyText(couponCode);
    }
  };
  
  const fallbackCopyText = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px"; // Make it invisible
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      Swal.fire({
        title: "Copied!",
        text: "Coupon code copied to clipboard",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        customClass: {
          title: styles.swalTitle,
          popup: styles.swalPopup,
        },
      });
    } catch (err) {
      console.error("Fallback: Failed to copy text: ", err);
    } finally {
      document.body.removeChild(textarea);
    }
  };
  

  useEffect(() => {
    if (props.isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      const joystickZone = document.getElementById("joystickZone");

      // Handle joystick visibility
      if (joystickZone) {
        joystickZone.style.display = "none";
      }

      // Add styles to prevent scrolling
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      return () => {
        // Show joystick
        if (joystickZone) {
          joystickZone.style.display = "block";
        }

        // Remove styles and restore scroll position
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [props.isOpen]);

  return (
    <div
      style={{
        display: props.isOpen ? "block" : "none",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        pointerEvents: props.isOpen ? "auto" : "none",
      }}
    >
      <Box
        ref={containerRef} // Attach ref to the container
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0)",
          pointerEvents: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          ref={modalRef}
          sx={{
            position: "relative", // Needed for positioning the CloseIcon
            gap: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.75)", // Semi-transparent white
            backdropFilter: "blur(5px)", // Blur effect for glass morphism
            borderRadius: { xs: "10px", md: "25px" },
            padding: 2,
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", // Subtle shadow
            border: "1px solid rgba(255, 255, 255, 0.2)", // Optional border
            zIndex: 999,
          }}
        >
          <CloseIcon
            sx={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "#424147",
              borderRadius: "50%",
              fontSize: "18px",
              padding: 0.2,
              cursor: "pointer",
              color: "white",
            }}
            onClick={handleClose}
          />
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: {
                xs: "300px",
                sm: "400px",
                md: "400px",
                lg: "400px",
                xl: "400px",
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Poppins', sans-serif",
                color: "white",
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}
            >
              Coupon Code
            </Typography>
            <br />
            <Typography
              sx={{
                fontFamily: "'Poppins', sans-serif",
                color: "white",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              Hurray! You have unlocked the Coupon Code! Click to copy the code
              and add it in the Checkout!
            </Typography>
            <br />
            <Box
              onPointerDown={() => handleCopy(props.discountCode)}
              sx={{
                padding: 1,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                width: "fit-content",
                cursor: "pointer",
                pointerEvents: "auto",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  color: "white",
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                }}
              >
                {props.discountCode}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default DiscountModal;
