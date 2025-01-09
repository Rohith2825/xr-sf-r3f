import { useRef, useEffect } from "react";
import { Box, Button, Card, Typography } from "@mui/material";
import { useCart } from "@shopify/hydrogen-react";
import Swal from "sweetalert2";
import styles from './UI/UI.module.scss';
import { useComponentStore } from "./stores/ZustandStores"

const Cart = () => {
  const { lines, linesUpdate, checkoutUrl, linesRemove } = useCart();
  const { closeCart } = useComponentStore();

  useEffect(() => {
    const scrollY = window.scrollY;
    const joystickZone = document.getElementById("joystickZone");

    if (joystickZone) {
      joystickZone.style.display = "none";
    }

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      if (joystickZone) {
        joystickZone.style.display = "block";
      }

      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleCheckout = () => {
    if ((lines?.length || 0) <= 0) {// Cart empty
      Swal.fire({
        title: "Cart is Empty!",
        text: "Add products to cart before proceeding to the checkout",
        icon: "warning",
        customClass: {
          title: styles.swalTitle,
          popup: styles.swalPopup
        }
      });
    }
    else if (checkoutUrl) {
      window.open(checkoutUrl, "_blank", "noopener,noreferrer");
    } else {
      Swal.fire({
        title: "Checkout Session Not Initialized",
        text: "Unforeseen error. Try again later",
        timer: 3000,
        timerProgressBar: true,
        icon: "error",
        customClass: {
          popup: styles.swalPopup,
          title: styles.swalTitle,
        }
      })
    }
  };

  const emptyCart = () => {
    if ((lines?.length || 0) > 0) { // Cart not empty
      Swal.fire({
        title: `Empty the Cart?`,
        text: "This action is permanent. You cannot recover the cart items once deleted.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Empty Cart",
        cancelButtonText: "Cancel",
        confirmButtonColor: "rgb(234, 34, 34)",
        cancelButtonColor: "rgb(57, 177, 57)",
        customClass: {
          popup: styles.swalPopup,
          title: styles.swalTitle,
          confirmButton: styles.swalButton,
          cancelButton: styles.swalButton,
          actions: styles.swalActions
        }
      }).then((result) => {
        if (result.isConfirmed) {
          if (lines) {
            const lineIds = lines.map((item) => item?.id || "");
            linesRemove(lineIds);
          }
        }
      });
    }
    else { // Cart empty
      Swal.fire({
        title: `Cart is Empty`,
        icon: "warning",
        timer: 3000,
        customClass: {
          popup: styles.swalPopup,
          title: styles.swalTitle
        }
      });
    }
  }

  // Handle Click outside the cart
  const cartRef = useRef<HTMLDivElement>(null);
  const onClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    const cart = cartRef.current;
    if (cart && !cart.contains(event.target as Node))
      closeCart();
  };

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0)",
        pointerEvents: "auto",
      }}
      onClick={onClickOutside}
    >
      <Card
        ref={cartRef}
        sx={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", // Center the Cart
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", // Flex display
          width: { xs: "95vw", md: "70vw" },height: { xs: "75vh", sm: "80vh", md: "75vh" },// Size
          backgroundColor: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(10px)", boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", // Background Effects
          borderRadius: { xs: "10px", md: "25px" }, border: "1px solid rgba(255, 255, 255, 0.2)", // Border
          overflow: "none"
        }}
        className="Cart"
      >
        <Typography
          sx={{
            minHeight: "15%",
            fontSize: 36, fontFamily: "'Poppins', sans-serif", fontWeight: "bolder",
            color: "rgba(255, 255, 255, 1)",
            display: "flex", alignItems: "center"
          }}
          className="CartTitle"
        >
          Your Cart
        </Typography>
        <Typography
          sx={{
            position: "fixed",
            top: "5%", right: "5%",
            width: "30px", height: "30px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.05)", color: "rgba(255, 255, 255, .7)",
            alignItems: "center", justifyContent: "center", display: "flex",
            fontSize: "26px", fontWeight: "normal", fontFamily: "'Poppins', sans-serif",
            "&:hover": {
              cursor: "pointer"
            }
          }}
          className="CartCloseButton"
          onClick={closeCart}
        >
          &times;
        </Typography>
        <Box
          sx={{
            width: { xs: "90%", sm: "90%", md: "85%", lg: "85%", xl: "80%" }, height: "70%",
            padding: "2.5%", gap: "5%",
            display: "flex", flexDirection: "column", alignItems: "center",
            borderRadius: "10px",
            backgroundColor: "rgba(255, 255, 255, 0)",
            overflowY: "scroll", scrollbarWidth: 0, "&::-webkit-scrollbar": { display: "none" }
          }}
          className="CartItems"
        >
          {lines && lines.map((line) => {
            const decrement = () => {
              if (line?.quantity as number > 0) {
                linesUpdate([
                  {
                    id: line?.id || "",
                    quantity: (line?.quantity || 0) - 1
                  }
                ]);
              }
            };
            const increment = () => {
              if (line?.quantity as number < 5) {
                linesUpdate([
                  {
                    id: line?.id || "",
                    quantity: (line?.quantity || 0) + 1
                  }
                ]);
              }
            };
            const deleteItem = () => {
              linesUpdate([
                {
                  id: line?.id || "",
                  quantity: 0
                }
              ]);
            };

            return (
              <Box
                sx={{
                  width: "95%", height: { xs: "35%", sm: "35%", md: "30%" },
                  padding: { xs: "2%", sm: "2%", md: "2%" }, gap: { xs: "5%", sm: "2%" },
                  display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center",
                  borderRadius: "20px",
                  backgroundColor: "#424147", boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
                  boxSizing: "border-box"
                }}
                className="CartItem"
                key={line?.id}
              >
                <Box
                  component="img"
                  src={line?.merchandise?.image?.url}
                  sx={{
                    height: { xs: "90%", md: "95%" }, aspectRatio: "1 / 1",
                    backgroundColor: "rgb(255, 255, 255)",
                    marginLeft: { xs: "3%", sm: "2%" },
                    borderRadius: { xs: "10px", md: "50%" }
                  }}
                  className="CartItemImage"
                />

                <Box
                  sx={{
                    display: "flex", flexDirection: { xs: "column", sm: "column", md: "row" },
                    justifyContent: { xs: "space-evenly", sm: "space-evenly", md: "space-evenly" }, alignItems: { md: "center" },
                    width: {xs: "", md: "80%"}, height: "100%", flexGrow: {xs: 1, md: 0},
                    marginLeft: { xs: "0", sm: "5%", md: "0" }
                  }}
                  className="CartItemDetails"
                >
                  <Box
                    sx={{
                      maxHeight: { xs: "40%", md: "100%" }, width: { xs: "100%", sm: "100%", md: "30%" }, flexGrow: { xs: 1, sm: 1, md: 0 },
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: { xs: "space-evenly", md: "center" },
                    }}
                  >
                    <Typography
                      sx={{
                        width: "100%", maxHeight: { xs: "24px", sm: "30px" },
                        fontSize: { xs: "16px", sm: "20px" },
                        fontFamily: "'Poppins', sans-serif", fontWeight: "normal",
                        color: "rgba(255, 255, 255, 0.83)",
                        overflowY: { xs: "hidden", sm: "hidden", md: "hidden" },
                        scrollbarWidth: 0,
                        "&::-webkit-scrollbar": {
                          display: "none"
                        },
                        textAlign: "left",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                      className="CartItemTitle"
                    >
                      {line?.merchandise?.product?.title}
                    </Typography>
                    <Typography
                      sx={{
                        width: "100%",
                        fontSize: { xs: "12px", sm: "16px" },
                        fontFamily: "'Poppins', sans-serif", fontWeight: "normal",
                        color: "rgba(202, 202, 202, 0.78)",
                        overflow: "hidden",
                        textAlign: "left"
                      }}
                      className="cartItemPrice"
                    >
                      {line?.merchandise?.price?.currencyCode} {line?.merchandise?.price?.amount}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      width: { xs: "20%", md: "10%" }, height: "30px",
                      fontSize: { xs: "14px", sm: "14px", md: "16px" }, fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
                      color: "rgba(255, 255, 255, 0.83)",
                      backgroundColor: { xs: "rgba(0, 0, 0, 0)", md: "rgba(0, 0, 0, 0.9)" },
                      display: "flex", alignItems: "center", justifyContent: { xs: "left", sm: "left", md: "center" },
                      overflow: "hidden",
                    }}
                    className="CartItemVariant"
                  >
                    {
                      (line?.merchandise?.selectedOptions as { name: string, value: string }[]).find((option) => {
                        return option.name.toLowerCase() === "size";
                      })?.value.toUpperCase()
                    }
                  </Typography>
                  <Box
                    sx={{
                      minWidth: "70px", width: { xs: "90%", sm: "40%", md: "35%", lg: "30%" }, height: "24px",
                      display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"
                    }}
                    className="CartItemQuantityModifier"
                  >
                    <Button
                      sx={{
                        minWidth: { xs: "16px", sm: "20px", md: "20px" },
                        width: { xs: "16px", sm: "20px", md: "20px" },
                        height: { xs: "16px", sm: "20px", md: "20px" },
                        padding: 1,
                        fontSize: "16px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
                        color: "rgba(255, 255, 255, 0.74)", backgroundColor: "rgba(149, 149, 149, 0.21)",
                        borderRadius: "50%",
                        "&:hover": {
                          backgroundColor: "rgba(149, 149, 149, 0.53)",
                          transitionDuration: "0s"
                        }
                      }}
                      onClick={decrement}
                    >
                      -
                    </Button>
                    <Typography
                      sx={{
                        color: "rgba(255, 255, 255, 0.83)"
                      }}
                    >
                      {line?.quantity}
                    </Typography>
                    <Button
                      sx={{
                        minWidth: { xs: "16px", sm: "20px" },
                        width: { xs: "16px", sm: "20px" },
                        height: { xs: "16px", sm: "20px" },
                        padding: 1,
                        fontSize: { xs: "12px", sm: "16px" }, fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
                        color: "rgba(255, 255, 255, 0.74)", backgroundColor: "rgba(149, 149, 149, 0.21)",
                        borderRadius: "50%",
                        "&:hover": {
                          backgroundColor: "rgba(149, 149, 149, 0.53)",
                          transitionDuration: "0s"
                        }
                      }}
                      onClick={increment}
                    >
                      +
                    </Button>
                    <Box
                      component="img"
                      src="icons/dustbin.svg"
                      sx={{
                        height: { xs: "18px", md: "25px" },
                        borderRadius: "3px",
                        "&:hover": {
                          cursor: "pointer",
                          background: "rgba(255, 255, 255, 0.1)"
                        }
                      }}
                      className="CartItemDustbinIcon"
                      onClick={deleteItem}
                    ></Box>
                  </Box>
                </Box>
              </Box>
            )
          })}
        </Box>
        <Box
          sx={{
            width: "90%", height: { xs: "15%", sm: "15%", md: "20%" },
            display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
            gap: { xs: "2%", md: "5%" }
          }}
          className="CartButtons"
        >
          <Button
            sx={{
              minWidth: { xs: "47.5%", sm: "40%", md: "25%", lg: "25%", xl: "25%" }, height: "50%",
              padding: "20px",
              fontSize: { xs: 16, sm: 20, md: 24, lg: 24, xl: 24 }, fontFamily: "'Poppins', sans-serif",
              color: "rgb(255, 255, 255)", backgroundColor: "rgba(255, 255, 255, 0.15)",
              textTransform: "none",
              borderRadius: { xs: "10px", md: "100px" },
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                transitionDuration: "0.15s"
              }
            }}
            onClick={emptyCart}
          >
            Empty Cart
          </Button>
          <Button
            sx={{
              minWidth: { xs: "47.5%", sm: "40%", md: "25%", lg: "25%", xl: "25%" }, height: "50%",
              padding: "20px",
              fontSize: { xs: 16, sm: 20, md: 24, lg: 24, xl: 24 }, fontFamily: "'Poppins', sans-serif",
              color: "rgba(255, 255, 255, 1)", backgroundColor: "rgba(255, 255, 255, 0.15)",
              textTransform: "none",
              borderRadius: { xs: "10px", md: "100px" },
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                transitionDuration: "0.15s"
              }
            }}
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </Box>
      </Card>
    </div >
  );
};

export default Cart;