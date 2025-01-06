"use client";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@mui/material";
import DOMPurify from "dompurify";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@shopify/hydrogen-react";
import { ModelViewer } from "@shopify/hydrogen-react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Swal from "sweetalert2";
import styles from "./UI/UI.module.scss";
import useWishlist from "./WishlistHook";

const QuantityCounter = ({
  quantity,
  setQuantity,
}: {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "left",
        gap: "10px",
        padding: "5px 0px",
      }}
    >
      {/* Decrease Button */}
      <IconButton
        size="small"
        onClick={handleDecrease}
        sx={{
          backgroundColor: "#424147",
          color: "white",
          width: "1.5rem",
          height: "1.5rem",
          "&:hover": { backgroundColor: "#eeeeee", color: "black" },
        }}
      >
        <RemoveIcon
          sx={{
            width: "1rem",
          }}
        />
      </IconButton>

      {/* Quantity Display */}
      <Typography
        sx={{
          fontSize: "1.5rem",
          color: "white",
          fontFamily: "'Poppins', sans-serif",
          minWidth: "30px",
          textAlign: "center",
        }}
      >
        {quantity}
      </Typography>

      {/* Increase Button */}
      <IconButton
        size="small"
        onClick={handleIncrease}
        sx={{
          backgroundColor: "#424147",
          color: "white",
          width: "1.5rem",
          height: "1.5rem",
          "&:hover": { backgroundColor: "#eeeeee", color: "black" },
        }}
      >
        <AddIcon
          sx={{
            width: "1rem",
          }}
        />
      </IconButton>
    </Box>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  data: any;
}

const Modal: React.FC<ModalProps> = (props) => {
  const containerRef = useRef(null); // Reference to the wrapper
  const modelViewerElement = useRef(null); // Reference to the <model-viewer> element
  const [arSupported, setArSupported] = useState(false); // Ref for the native <model-viewer> element

  useEffect(() => {
    const observeModelViewer = () => {
      const observer = new MutationObserver(() => {
        const element = containerRef.current?.querySelector("model-viewer");
        if (element) {
          modelViewerElement.current = element; // Store reference
          console.log("Found <model-viewer> element:", element);

          if (element.activateAR) {
            setArSupported(true); // AR is supported
          }
          observer.disconnect(); // Stop observing once found
        }
      });

      if (containerRef.current) {
        observer.observe(containerRef.current, { childList: true, subtree: true });
      }

      return () => observer.disconnect();
    };

    observeModelViewer();
  }, []);

  const [isIosChrome, setIsIosChrome] = useState(false);

useEffect(() => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  const isChrome = /CriOS/.test(userAgent); // Chrome on iOS

  if (isIOS && isChrome) {
    setIsIosChrome(true);
  }
}, []);

  const handleViewInAR = () => {
    if (modelViewerElement.current?.activateAR) {
      modelViewerElement.current.activateAR(); // Trigger AR viewer
      console.log("AR support exsit");
    } else {
      console.error("AR is not supported or activateAR is undefined");
    }
  };

  const sizes: string[] = [];
  const images: string[] = [];
  let modelData: unknown = {};
  let iosSrc: string = "";

  modelData = {
    id: "gid://shopify/Model3d/40614140838181",
    sources: [
      {
        url: "https://cdn.shopify.com/3d/models/o/bdbf80f479b9210c/selveless_tshirt.glb",
        mimeType: "model/gltf-binary",
      },
    ],
    alt: "A cloth",
  };

  const [view, setView] = useState<"photos" | "3d">("3d");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [isMobile, setIsMobile] = useState(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|Kindle|Silk|Mobile|Tablet|Touch/i.test(
      navigator.userAgent
    )
  );
  const sanitizedHtml = DOMPurify.sanitize(props.data["node"]["bodyHtml"]);

  const { linesAdd, checkoutUrl, lines } = useCart();

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

  const handleClose = () => {
    const joystickZone = document.getElementById("joystickZone");
    if (joystickZone) {
      joystickZone.style.display = "block";
    }
    props.onClose();
  };

  useEffect(() => {
    //console.log("Cart Lines:", linesAdd); // Updated cart lines
    //console.log("Checkout URL:", checkoutUrl); // Updated checkout URL
  }, [linesAdd, checkoutUrl]);

  props.data["node"]["options"].forEach((option: any) => {
    if (option.name.toLowerCase() === "size") {
      sizes.push(...option.values.map((value: string) => value.toUpperCase()));
    }
  });

  props.data["node"]["media"]["edges"].forEach((edge: any) => {
    if (edge.node.mediaContentType === "IMAGE") {
      images.push(edge.node.image.url);
    }
  });

  props.data["node"]["media"]["edges"].forEach((edge: any) => {
    if (edge.node.mediaContentType === "MODEL_3D") {
      modelData = {
        id: edge.node.id,
        sources: [
          {
            url: edge.node.sources[0].url,
            mimeType: "model/gltf-binary",
          },
        ],
        alt: edge.node.alt,
      };
      iosSrc = edge.node.sources[1].url;
    }
  });

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      Swal.fire({
        title: "Size Not Selected",
        text: "Please select a size before adding to the cart.",
        icon: "warning",
        confirmButtonText: "Okay",
        customClass: {
          title: styles.swalTitle,
          popup: styles.swalPopup,
        },
      });
      return;
    }

    const selectedVariant = props.data["node"]["variants"]["edges"].find(
      (variant: any) => {
        return variant.node.selectedOptions.find((option: any) => {
          return (
            option.name === "Size" &&
            option.value.toUpperCase() === selectedSize
          );
        });
      }
    );

    if (!selectedVariant) {
      Swal.fire({
        title: "Variant Not Found",
        text: "The selected variant does not exist!",
        icon: "error",
        confirmButtonText: "Okay",
        customClass: {
          title: styles.swalTitle,
          popup: styles.swalPopup,
        },
      });
      return;
    }

    try {
      const result = await linesAdd([
        {
          merchandiseId: selectedVariant["node"]["id"],
          quantity: quantity,
        },
      ]);

      Swal.fire({
        title: "Success",
        text: "Product added to cart!",
        icon: "success",
        confirmButtonText: "Okay",
        customClass: {
          title: styles.swalTitle,
          popup: styles.swalPopup,
        },
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Cannot add product to cart!",
        icon: "error",
        confirmButtonText: "Okay",
        customClass: {
          title: styles.swalTitle,
          popup: styles.swalPopup,
        },
      });
      console.error(error);
      return;
    }
  };

  const handleCheckout = () => {
    if (!lines || lines.length === 0) {
      Swal.fire({
        title: "Cart is Empty!",
        text: "Please add some products to your cart before proceeding to checkout.",
        icon: "warning",
        confirmButtonText: "Okay",
        customClass: {
          title: styles.swalTitle,
          popup: styles.swalPopup,
        },
      });
      return;
    }

    if (checkoutUrl) {
      window.open(checkoutUrl, "_blank", "noopener,noreferrer");
    } else {
      Swal.fire({
        title: "Error",
        text: "Checkout session not initialized. Please try again.",
        icon: "error",
        confirmButtonText: "Okay",
        customClass: {
          title: styles.swalTitle,
          popup: styles.swalPopup,
        },
      });
    }
  };
  const { addItemsToWishlist } = useWishlist();
  const handleAddToWishlist = () => {
    const productIdString = props.data.node.id.split("/").pop(); // Extract the numeric ID as a string
    const productId = Number(productIdString); // Convert the string to a number

    if (isNaN(productId)) {
      console.error("Invalid product ID:", props.data.node.id);
      return;
    }

    console.log(productId); // Debug

    addItemsToWishlist([productId]); // Pass the numeric ID as an array

    Swal.fire({
      title: "Added to Wishlist!",
      text: `${props.data.node.title} has been added to your wishlist.`,
      icon: "success",
      confirmButtonText: "Okay",
      customClass: {
        title: styles.swalTitle,
        popup: styles.swalPopup,
      },
    });
  };

  // Handle Click outside the modal
  const modalRef = useRef<HTMLDivElement>(null);
  const onClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    const modal = modalRef.current;
    if (modal && !modal.contains(event.target as Node)) handleClose();
  };

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
          display: {
            xs: "flex",
            sm: "flex",
            md: "flex",
            lg: "flex",
            xl: "flex",
          },
          justifyContent: {
            xs: "center",
            sm: "center",
            md: "center",
            lg: "center",
            xl: "center",
          },
          alignItems: {
            xs: "start",
            sm: "center",
            md: "center",
            lg: "center",
            xl: "center",
          },
        }}
        onClick={onClickOutside}
      >
        <Card
          ref={modalRef}
          sx={{
            flexDirection: "column",
            maxWidth: { xs: "80vw", md: "70vw", lg: "70vw", xl: "85vw" },
            gap: "10px",
            marginTop: { xs: "10px" },
            backgroundColor: "rgba(0, 0, 0, 0.75)", // Semi-transparent white
            backdropFilter: "blur(5px)", // Blur effect for glass morphism
            borderRadius: "10px",
            padding: 2,
            boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", // Subtle shadow
            border: "1px solid rgba(255, 255, 255, 0.2)", // Optional border
            maxHeight: { xs: "85vh", md: "none", lg: "85vh", xl: "85vh" },
            zIndex: 999,
          }}
        >
          {isMobile ? (
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "5px",
                    marginLeft: "auto",
                    backgroundColor: "#424242",
                    borderRadius: "50px",
                    padding: "5px",
                  }}
                >
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setView("photos")}
                    sx={{
                      height: "25px",
                      backgroundColor: view === "photos" ? "#8D8B96" : null,
                      color: "white",
                      padding: "6px 16px",
                      borderRadius: "50px",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: "bold",
                      textTransform: "none",
                    }}
                  >
                    Photos
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setView("3d")}
                    sx={{
                      height: "25px",
                      backgroundColor: view === "3d" ? "#8D8B96" : null,
                      color: "white",
                      padding: "6px 16px",
                      borderRadius: "50px",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: "bold",
                      textTransform: "none",
                    }}
                  >
                    3D Model
                  </Button>
                </Box>

                <IconButton
                  size="small"
                  sx={{
                    marginLeft: "auto",
                    zIndex: 1001,
                    borderRadius: "50%", // Circular button
                    backgroundColor: "#ffffff33",
                    color: "white",
                    width: "1.5rem",
                    height: "1.5rem",
                    "&:hover": { backgroundColor: "#eeeeee", color: "black" },
                  }}
                >
                  <CloseIcon
                    sx={{
                      height: "1rem",
                    }}
                    onClick={handleClose}
                  />
                </IconButton>
              </Box>
            </CardContent>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "end" }}>
              <IconButton
                size="small"
                sx={{
                  marginLeft: "auto",
                  zIndex: 1001,
                  borderRadius: "50%", // Circular button
                  backgroundColor: "#ffffff33",
                  color: "white",
                  width: "1.5rem",
                  height: "1.5rem",
                  "&:hover": { backgroundColor: "#eeeeee", color: "black" },
                }}
              >
                <CloseIcon
                  sx={{
                    height: "1rem",
                  }}
                  onClick={handleClose}
                />
              </IconButton>
            </Box>
          )}
          <CardContent
            sx={{
              overflowY: { xs: "auto" },
              scrollbarWidth: {
                xs: "none",
                sm: "none",
                md: "none",
                lg: "none",
                xl: "none",
              },
              maxHeight: { xs: "60vh", md: "none", lg: "85vh", xl: "85vh" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                margin: { lg: "auto" },
                flexDirection: {
                  xs: "column",
                  sm: "row",
                  md: "row",
                  lg: "row",
                  xl: "row",
                },
              }}
            >
              {/* Left Side: Photos or 3D Model */}
              <Box
                sx={{
                  width: { lg: "50%" },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "16px",
                }}
              >
                {!isMobile ? (
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      backgroundColor: "#424242",
                      borderRadius: "50px",
                      padding: "5px",
                      width: "fit-content",
                    }}
                  >
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => setView("photos")}
                      sx={{
                        height: "25px",
                        backgroundColor: view === "photos" ? "#8D8B96" : null,
                        color: "white",
                        padding: "6px 16px",
                        borderRadius: "50px",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                    >
                      Photos
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => setView("3d")}
                      sx={{
                        height: "25px",
                        backgroundColor: view === "3d" ? "#8D8B96" : null,
                        color: "white",
                        padding: "6px 16px",
                        borderRadius: "50px",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: "bold",
                        textTransform: "none",
                      }}
                    >
                      3D Model
                    </Button>
                  </Box>
                ) : (
                  <Box></Box>
                )}
                {view === "photos" ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      borderRadius: "10px",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                  >
                    <img
                      src={images[currentIndex]}
                      alt={`Carousel ${currentIndex}`}
                      style={{
                        borderRadius: "10px",
                        height: "300px",
                        width: "300px",
                      }}
                    />
                    {/* Carousel Navigation */}
                    <IconButton
                      onClick={prevImage}
                      sx={{
                        position: "absolute",
                        left: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 1002,
                        color: "white",
                      }}
                    >
                      {"<"}
                    </IconButton>
                    <IconButton
                      onClick={nextImage}
                      sx={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 1002,
                        color: "white",
                      }}
                    >
                      {">"}
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                      borderRadius: "10px",
                      marginBottom: "20px",
                      marginTop: "20px",
                    }}
                  >
                    <ModelViewer
                      style={{
                        height: "300px",
                        width: "300px",
                      }}
                      data={modelData}
                      ar={true} // Enable AR
                      arModes="scene-viewer webxr quick-look" // AR modes for Android and iOS
                      arScale="auto" // Automatically scale the model in AR
                      iosSrc={iosSrc} // Link to the .usdz file for iOS
                      cameraControls={true} // Enable camera controls
                      environmentImage="neutral" // Optional: Environment image for lighting
                      poster="https://example.com/poster.png" // Optional: Poster image for loading
                      alt="A 3D model of a product" // Accessibility text
                      onArStatus={(event) => console.log("AR Status:", event)} // Optional: Log AR status
                      onLoad={() => console.log("Model loaded")} // Optional: Log modelloading
                    />
                  </Box>
                )}
                <Button
                  variant="contained"
                  size="small"
                  disabled={!isMobile || isIosChrome}
                  onClick={handleViewInAR} // View in AR button
                  sx={{
                    marginTop: "auto",
                    marginBottom: "10px",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    borderRadius: "50px 50px 50px 50px", // Rounded right side
                    padding: "6px 16px",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.45)",
                      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                    },
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                >
                  View in AR
                </Button>
              </Box>

              {/* Right Side: Description */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  width: { sm: "600px", md: "600px", lg: "600px", xl: "600px" },
                }}
              >
                <CardContent sx={{ zIndex: 1000 }}>
                  <Typography
                    sx={{
                      fontSize: { md: "1rem", lg: "1.5rem", xl: "1.5rem" }, // Adjust the size as needed
                      color: "white", // Set the color to white
                      fontFamily: "'Poppins', sans-serif",
                      paddingBottom: 1,
                    }}
                  >
                    {props.data["node"]["title"]}
                  </Typography>
                  {/* Quantity Picker */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "10px",
                      paddingBottom: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: { md: "1rem", lg: "1.5rem" },
                        color: "white",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      ₹{" "}
                      {
                        props.data["node"]["variants"]["edges"][0]["node"][
                          "price"
                        ]
                      }
                    </Typography>
                    <Box
                      sx={{
                        position: "relative",
                        display: "inline-block",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { md: "0.5rem", lg: "0.75rem" },
                          color: "#00BF63",
                        }}
                      >
                        ₹{" "}
                        {props.data["node"]["variants"]["edges"][0]["node"][
                          "compareAtPrice"
                        ] || 1000}
                      </Typography>
                      {/* Strikeout line */}
                      {(props.data["node"]["variants"]["edges"][0]["node"][
                        "compareAtPrice"
                      ] ||
                        5000) && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: 0,
                            width: 0, // Start with no width
                            height: "2px",
                            backgroundColor: "red",
                            animation: "strikeout 1s forwards",
                          }}
                        ></Box>
                      )}
                      {/* Keyframes for the animation */}
                      <style>
                        {`
            @keyframes strikeout {
              0% {
                width: 0;
              }
              100% {
                width: 100%;
              }
            }
          `}
                      </style>
                    </Box>
                  </Box>

                  {/* Sizes Selector */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      paddingBottom: 1,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", gap: 1, flexWrap: { xs: "wrap" } }}
                    >
                      {sizes.map((size) => (
                        <Button
                          key={size}
                          variant="outlined"
                          size="small"
                          sx={{
                            fontFamily: "'Poppins', sans-serif",
                            backgroundColor:
                              selectedSize === size ? "black" : "#424147",
                            color: "white",
                            fontWeight: "bold",
                            borderColor: "#424147",
                          }}
                          onClick={() => handleSizeClick(size)}
                        >
                          {size}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                  <QuantityCounter
                    quantity={quantity}
                    setQuantity={setQuantity}
                  />
                  <Typography
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      color: "white",
                      fontSize: {
                        xs: "1.5rem",
                        sm: "1.5rem",
                        md: "1rem",
                        lg: "1.5rem",
                        xl: "1.5rem",
                      },
                    }}
                  >
                    Description
                  </Typography>
                  <Box
                    sx={{
                      borderRadius: 1,
                      marginTop: 1,
                      maxHeight: {
                        xs: "225px",
                        sm: "210px",
                        md: "225px",
                        lg: "200px",
                        xl: "225px",
                      },
                      overflowY: "auto", // Enable vertical scrolling
                      scrollbarWidth: "none", // Firefox - hide scrollbar
                      "&::-webkit-scrollbar": {
                        display: "none", // Chrome, Safari, Edge - hide scrollbar
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        color: "white",
                      }}
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                      />
                    </Typography>
                  </Box>
                  {!isMobile && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "start",
                        gap: "25px",
                        paddingTop: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          color: "white",
                          borderRadius: "50px 50px 50px 50px", // Rounded right side
                          padding: {
                            xs: "3px 8px",
                            sm: "3px 8px",
                            md: "6px 16px",
                            lg: "6px 16px",
                            xl: "6px 16px",
                          },
                          "&:hover": {
                            backgroundColor: "#ffffff09",
                            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                          },
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: "bold",
                          textTransform: "none",
                        }}
                        onClick={handleAddToCart}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          color: "white",
                          borderRadius: "50px 50px 50px 50px", // Rounded right side
                          padding: {
                            xs: "3px 8px",
                            sm: "6px 16px",
                            md: "6px 16px",
                            lg: "6px 16px",
                            xl: "6px 16px",
                          },
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.45)",
                            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                          },
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: "bold",
                          textTransform: "none",
                        }}
                        onClick={handleCheckout}
                      >
                        Checkout
                      </Button>
                      <IconButton
                        onClick={handleAddToWishlist}
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          borderRadius: { sx: "50%", lg: "50%" }, // Circular button
                        }}
                      >
                        <FavoriteIcon sx={{ color: "white" }} />
                      </IconButton>
                    </Box>
                  )}
                </CardContent>
              </Box>
            </Box>
          </CardContent>
          {isMobile && (
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "25px",
                  paddingTop: 2,
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    borderRadius: "50px 50px 50px 50px", // Rounded right side
                    padding: {
                      xs: "3px 8px",
                      sm: "6px 16px",
                      md: "6px 16px",
                      lg: "6px 16px",
                      xl: "6px 16px",
                    },
                    "&:hover": {
                      backgroundColor: "#ffffff09",
                      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                    },
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    borderRadius: "50px 50px 50px 50px", // Rounded right side
                    padding: {
                      xs: "3px 8px",
                      sm: "6px 16px",
                      md: "6px 16px",
                      lg: "6px 16px",
                      xl: "6px 16px",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.45)",
                      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                    },
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
                <IconButton
                  onClick={handleAddToWishlist}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: { sx: "50%", lg: "50%" }, // Circular button
                  }}
                >
                  <FavoriteIcon sx={{ color: "white" }} />
                </IconButton>
              </Box>
            </CardContent>
          )}
        </Card>
      </Box>
    </div>
  );
};

export default Modal;
