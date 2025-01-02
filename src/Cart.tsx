import { FC } from "react";
import { Box, Button, Card, Typography } from "@mui/material";
import { useCart } from "@shopify/hydrogen-react";

interface CartProps {
  isOpen: boolean,
  onClose: () => void
}

const Cart: FC<CartProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { lines, linesUpdate, checkoutUrl } = useCart();

  const handleCheckout = () => {
    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank", "noopener,noreferrer");
    } else {
      alert("Checkout session not initialized. Please try again.");
    }
  };

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
    >
      <Card
        sx={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", // Center the Cart
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", // Flex display
          width: { xs: "80vw", md: "60vw", lg: "50vw", xl: "50vw" }, height: { xs: "90vh", lg: "90vh", xl: "90vh" }, // Size
          backgroundColor: "rgba(255, 255, 255, 0.33)", backdropFilter: "blur(10px)", boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", // Background Effects
          borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.2)", // Border
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
        >
          Your Cart
        </Typography>

        <Box
          sx={{
            width: { xs: "90%", sm: "90%", md: "85%", lg: "85%", xl: "80%" }, height: "70%",
            padding: "2.5%", gap: "2.5%",
            display: "flex", flexDirection: "column", alignItems: "center",
            borderRadius: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.08)", boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
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
            return (
              <Box
                sx={{
                  width: "95%", height: "25%",
                  padding: {xs: "5%", sm: "2%", md: "2%"}, gap: {xs: "5%", sm: "2%"},
                  display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center",
                  borderRadius: "10px",
                  backgroundColor: "rgba(0, 0, 0, 0.26)", boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)",
                }}
                className="CartItem"
              >
                <img
                  src={line?.merchandise?.image?.url}
                  style={{
                    height: "80%", aspectRatio: "1 / 1",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%"
                  }}
                  className="CartItemImage"
                />

                <Box
                  sx={{
                    display: "flex", flexDirection: {xs: "column", sm: "column", md: "row"},
                    justifyContent: {md: "space-evenly"}, alignItems: {md: "center"},
                    flexGrow: {md: 0.6}
                  }}
                >
                  <Box
                    sx={{
                      height: "100%", width: {xs: "100%", sm:"100%", md: "30%"}, flexGrow: {xs: 1, sm: 1, md: 0},
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        width: "100%", maxHeight: {xs: "16px", sm: "24px", md: "60%"},
                        fontSize: {xs: "12px", sm: "16px"}, 
                        fontFamily: "'Poppins', sans-serif", fontWeight: "normal",
                        color: "rgba(255, 255, 255, 0.83)",
                        overflowY: {xs: "hidden", sm: "hidden", md: "scroll"},
                        scrollbarWidth: 0,
                        "&::-webkit-scrollbar": {
                          display: "none"
                        },
                        textAlign: "left"
                      }}
                    >
                      {line?.merchandise?.product?.title}
                    </Typography>
                    <Typography
                      sx={{
                        width: "100%",
                        fontSize: {xs: "10px", sm: "14px"},
                        fontFamily: "'Poppins', sans-serif", fontWeight: "normal",
                        color: "rgba(202, 202, 202, 0.78)",
                        overflow: "hidden",
                        textAlign: "left"
                      }}
                    >
                      {line?.merchandise?.price?.currencyCode} {line?.merchandise?.price?.amount}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      width: "10%",
                      fontSize: {xs: "14px", sm: "14px", md: "16px"}, fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
                      color: "rgba(255, 255, 255, 0.83)",
                      display: "flex", alignItems: "center", justifyContent: {xs: "left", sm: "left", md: "center"},
                      overflow: "hidden",
                    }}
                  >
                    {
                      (line?.merchandise?.selectedOptions as { name: string, value: string }[]).find((option) => {
                        return option.name.toLowerCase() === "size";
                      })?.value.toUpperCase()
                    }
                  </Typography>
                  <Box
                    sx={{
                      minWidth: "70px", width: "15%", height: "24px",
                      display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"
                    }}
                  >
                    <Button
                      sx={{
                        minWidth: {xs: "16px", sm: "20px", md: "20px"}, 
                        width: {xs: "16px", sm: "20px", md: "20px"}, 
                        height: {xs: "16px", sm: "20px", md: "20px"},
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
                        minWidth: {xs: "16px", sm: "20px"}, 
                        width: {xs: "16px", sm: "20px"}, 
                        height: {xs: "16px", sm: "20px"},
                        padding: 1,
                        fontSize: {xs: "12px", sm: "16px"}, fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
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
                  </Box>
                </Box>
              </Box>
            )
          })}
        </Box>
        <Box
          sx={{
            width: "90%", height: "15%",
            display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
            gap: {xs: "5%", sm: "5%"}
          }}
        >
          <Button
            sx={{
              minWidth: {xs: "47.5%", sm: "40%", md: "30%", lg: "30%", xl: "30%"} , height: "40%",
              padding: "10px",
              fontSize: {xs:16, sm:20, md: 24, lg: 24, xl: 24}, fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
              color: "rgb(255, 255, 255)", backgroundColor: "rgba(0, 0, 0, 0.20)",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.35)",
                transitionDuration: "0.15s"
              }
            }}
            onClick={() => onClose()}
          >
            Close Cart
          </Button>
          <Button
            sx={{
              minWidth: {xs: "47.5%", sm: "40%", md: "30%", lg: "30%", xl: "30%"} , height: "40%",
              padding: "10px",
              fontSize: {xs:16, sm:20, md: 24, lg: 24, xl: 24}, fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
              color: "rgba(255, 255, 255, 1)", backgroundColor: "rgba(255, 255, 255, 0.15)",
              textTransform: "none",
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