import { Box, Button, Card, Typography, ButtonBase } from "@mui/material";
import { useCart, ModelViewer } from "@shopify/hydrogen-react";
import { useEffect, useRef, useState } from "react";
import { useComponentStore } from "./stores/ZustandStores";
import Variant from "./Types/Variant";
import DOMPurify from 'dompurify';
import useWishlist from "./WishlistHook";
import Swal from "sweetalert2";
import styles from "@/UI/UI.module.scss";
import Client from "shopify-buy";

const client = Client.buildClient({
  domain: "gsv01y-gx.myshopify.com",
  storefrontAccessToken: "88cb90ff39b35d1a63ba94e866dba36a",
  apiVersion: "2023-10"
});

const Modal = () => {
  const { lines, checkoutUrl, linesAdd } = useCart();
  const { closeModal, selectedProduct } = useComponentStore();

  // Wishlist Hooks
  const { wishlist, addItemsToWishlist, removeItemsFromWishlist } = useWishlist();

  // Set the initial variant
  const [selectedVariant, setSelectedVariant] = useState<Variant>();
  useEffect(() => {
    selectedProduct && setSelectedVariant(selectedProduct.variants.find((variant) => variant.availableForSale));
  }, [selectedProduct]);

  // Quantity
  const [quantity, setQuantity] = useState<number>(1);
  useEffect(() => {//Whenever variant changes
    setQuantity(1);
  }, [selectedVariant, setQuantity]);

  // Media type photo or model
  const PHOTOS = "Photos";
  const MODEL = "3D Model";
  const [mediaType, setMediaType] = useState(PHOTOS);

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

  // Handle click outside the modal
  const modalRef = useRef<HTMLDivElement>(null);
  const onClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    const modal = modalRef.current;
    if (modal && !modal.contains(event.target as Node))
      closeModal();
  };

  const handleAddToCart = async () => {
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
      await linesAdd([
        {
          merchandiseId: `gid://shopify/ProductVariant/${selectedVariant.id}`,
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

  const handleBuyNow = async () => {
    try {
      const checkout = await client.checkout.create();
      const updatedCheckout = await client.checkout.addLineItems(
        checkout.id,
        [{
          variantId: `gid://shopify/ProductVariant/${selectedVariant?.id}`,
          quantity: quantity
        }]
      );

      Swal.fire({
        title: "Checkout Success",
        text: "You will be redirected shortly.",
        icon: "success",
        timer: 5000,
        customClass: {
          title: styles.swalTitle,
          popup: styles.swalPopup,
        },
      });

      const checkoutUrl = updatedCheckout.webUrl;
      window.open(checkoutUrl, "_blank", "noopener,noreferrer");
    }
    catch(e){
      console.error(e);
      Swal.fire({
        title: "Failed",
        text: "Failed to redirect to checkout. Please try again.",
        icon: "error",
        timer: 3000,
        confirmButtonText: "Okay",
        customClass: {
          title: styles.swalTitle,
          popup: styles.swalPopup,
        },
      });
    }

  };

  const MediaViewer = () => {


    const MediaButtons = () => {
      return (
        <Box
          sx={{
            width: "50%",
            display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center",
            backgroundColor: "#424147",
            borderRadius: "100px",
            padding: "5px", gap: "2%",
          }}
          className="MediaButtons"
          id="MediaButtons"
        >
          <Button
            sx={{
              width: "50%",
              backgroundColor: (mediaType === PHOTOS && "#8D8B96") || "rgba(0, 0, 0, 0)",
              borderRadius: "100px",
              color: "white",
              fontSize: { xs: "12px", md: "16px" }, fontFamily: "'Poppins', sans-serif",
              textTransform: "none",
              "&:hover": (mediaType !== PHOTOS && {
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }) || {},
              whiteSpace: "nowrap",
              overflow: "hidden"
            }}
            onClick={() => setMediaType(PHOTOS)}
            className="MediaViewerPhotosButton"
          >
            Pictures
          </Button>
          <Button
            sx={{
              width: "50%",
              backgroundColor: (mediaType === MODEL && "#8D8B96") || "rgba(0, 0, 0, 0)",
              borderRadius: "100px",
              color: "white",
              fontSize: { xs: "12px", md: "16px" }, fontFamily: "'Poppins', sans-serif",
              textTransform: "none",
              "&:hover": (mediaType !== MODEL && {
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }) || {},
              whiteSpace: "nowrap",
              overflow: "hidden"
            }}
            onClick={() => setMediaType(MODEL)}
            className="MediaViewerModelButton"
          >
            3D View
          </Button>
        </Box>
      )
    };

    const PhotosCarousel = () => {
      const photosCount: number = selectedProduct?.images.length || 0;
      const [currentPhoto, setCurrentPhoto] = useState(0);

      const nextPhoto = () => {
        if (currentPhoto < photosCount - 1) {
          setCurrentPhoto(currentPhoto + 1);
        }
      };

      const prevPhoto = () => {
        if (currentPhoto > 0) {
          setCurrentPhoto(currentPhoto - 1);
        }
      };

      return (
        <Box
          sx={{
            width: "100%", height: "100%",
            display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
            gap: "2%"
          }}
          className="PhotosCarousel"
        >
          <ButtonBase
            sx={{
              width: "32px",
              borderRadius: "50%",
              transform: "rotate(180deg)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)"
              }
            }}
            onClick={prevPhoto}
            className="PrevPhotoButton"
          >
            <img src="icons/Arrow.svg" style={{ width: "100%", height: "auto" }}></img>
          </ButtonBase>
          <Box
            sx={{
              width: "70%", height: "100%",
              display: "block",
              overflow: "hidden"
            }}
            className="PhotosContainer"
          >
            <Box
              sx={{
                left: 0,
                width: String(photosCount * 100) + "%", height: "100%",
                display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                transition: "transform 0.5s ease-in-out",
                transform: `translateX(-${(currentPhoto / photosCount) * 100}%)`,
              }}
              className="PhotoScroller"
            >
              {selectedProduct && (
                selectedProduct.images.map((image) => {
                  return (
                    <Box
                      sx={{
                        width: String(1 / photosCount * 100) + "%",
                      }}
                      component="img"
                      src={image.src}
                      key={image.src}
                    />
                  );
                })
              )}
            </Box>
          </Box>
          <ButtonBase
            sx={{
              width: "32px",
              borderRadius: "50%",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)"
              }
            }}
            onClick={nextPhoto}
            className="NextPhotoButton"
          >
            <img src="icons/Arrow.svg" style={{ width: "100%", height: "auto" }}></img>
          </ButtonBase>
        </Box>
      );
    };

    const ModelViewerComponent = () => {
      const model = selectedProduct?.models[0];
      if (!model) return (
        <Typography
          sx={{
            fontSize: "24px", fontFamily: "'Poppins', sans-serif",
            color: "rgba(114, 114, 114, 0.75)"
          }}
        >
          3D Model not available
        </Typography>
      );

      const modelData = {
        id: model.id,
        sources: [model.sources && model.sources[0]],
        alt: "3D Model"
      };
      const iosSrc = model.sources && model.sources[1].url;

      return (
        <Box
          sx={{
            width: "100%", height: "100%", minHeight: "300px"
          }}
        >
          <ModelViewer
            style={{
              height: "100%",
              width: "100%"
            }}
            data={modelData}
            ar={true} // Enable AR
            arModes="scene-viewer webxr quick-look" // AR modes for Android and iOS
            arScale="auto" // Automatically scale the model in AR
            iosSrc={iosSrc} // Link to the .usdz file for iOS
            cameraControls={true} // Enable camera controls
            environmentImage="neutral" // Optional: Environment image for lighting
            poster="" // Optional: Poster image for loading
            alt="A 3D model of a product" // Accessibility text
            onArStatus={(event: unknown) => console.log("AR Status:", event)} // Optional: Log AR status
            onLoad={() => console.log("Model loaded")} // Optional: Log modelloading
          />
        </Box>
      );
    };

    return (
      <Box
        sx={{
          width: { xs: "100%", md: "50%" }, height: { md: "100%" },
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          gap: { xs: "30px", md: "5%" }, marginTop: { xs: "10px" }
        }}
        className="MediaViewer"
      >
        <MediaButtons />
        <Box
          sx={{
            width: "100%", height: "60%",
            display: "flex", justifyContent: "center", alignItems: "center"
          }}
          className="MediaContainer"
        >
          {mediaType === PHOTOS &&
            <PhotosCarousel />
          }
          {mediaType === MODEL &&
            <ModelViewerComponent />
          }
        </Box>
        <Button
          sx={{
            minWidth: { xs: "20%", md: "30%" },
            backgroundColor: "#424147",
            borderRadius: "100px",
            color: "white", fontWeight: "bold",
            fontSize: { xs: "12px", md: "16px" }, fontFamily: "'Poppins', sans-serif",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)"
            },
            padding: "auto 25px auto 25px", boxSizing: "border-box",
            whiteSpace: "nowrap",
            overflow: "hidden"
          }}
          className="ARViewButton"
        >
          View in AR
        </Button>

      </Box>
    );
  }

  const ContentViewer = () => {
    const PriceContainer = () => {
      return (
        <Box
          sx={{
            width: "100%", height: "auto",
            display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center",
            gap: "10px"
          }}
          className="PriceContainer"
        >
          <Typography
            sx={{
              color: "rgba(255, 255, 255)",
              fontFamily: "'Poppins', sans-seriff", fontSize: "20px", fontWeight: 500,
              display: { xs: "block", md: "none" }
            }}
          >
            Price :
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "18px", md: "20px" }, fontFamily: "'Poppins', sans-serif",
              color: "rgb(194, 194, 194)"
            }}
            className="ProductPrice"
          >
            &#8377; {selectedVariant && selectedVariant.price}
          </Typography>
          {selectedVariant && selectedVariant.compareAtPrice &&
            <Typography
              sx={{
                fontSize: { md: "14px" }, fontFamily: "'Poppins', sans-serif",
                color: "rgb(255, 0, 0)",
                textDecoration: "line-through"
              }}
              className="Price"
            >
              {selectedVariant.compareAtPrice}
            </Typography>
          }
        </Box>
      );
    };

    const VariantSelector = () => {
      const handleVariantSelection = (optionName: string, optionValue: string) => {
        // Find the position of selected option in options
        const num = selectedProduct?.options.map((option) => option.name).indexOf(optionName) || 0;
        if (selectedVariant && selectedProduct) {
          setSelectedVariant(
            selectedProduct.variants.find((variant) => {
              for (let i = 0; i < num; i++) {
                if (variant.selectedOptions[i].value !== selectedVariant.selectedOptions[i].value) return false;
              }
              return variant.selectedOptions[num].value === optionValue && variant.availableForSale;
            })
          );
        }
      }

      const findIfVariantExists = (optionName: string, optionValue: string) => {
        // Find the position of option in options
        const num = selectedProduct?.options.map((option) => option.name).indexOf(optionName) || 0;

        // Check if all the previous option combination exists with the current option
        if (selectedVariant && selectedProduct) {
          return selectedProduct.variants.find((variant) => {
            for (let i = 0; i < num; i++) {
              if (variant.selectedOptions[i].value !== selectedVariant.selectedOptions[i].value) return false;
            }
            return variant.selectedOptions[num].value === optionValue && variant.availableForSale;
          });
        }
        else {
          return false;
        }
      }

      return (
        <Box
          sx={{
            width: "100%",
            display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "center",
            gap: "25px", marginTop: "20px",
          }}
          className="VariantSelector"
        >
          {selectedProduct &&
            selectedProduct.options.map((option) => {
              return (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "flex-start",
                    gap: "10px",
                  }}
                  className="VariantOption"
                  key={option.name}
                >
                  <Typography
                    sx={{
                      maxWidth: "30%", width: "30%",
                      overflowWrap: "break-word",
                      fontSize: "20px", fontFamily: "'Poppins', sans-serif",
                      color: "rgb(255, 255, 255)",
                    }}
                  >
                    {option.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex", flexDirection: "row", justifyContent: "start", alignItems: 'center',
                      flexWrap: "wrap", gap: "10px"
                    }}
                    className="ListofValues"
                  >
                    {option.values.map((value) => {
                      return (
                        <Button
                          id={option.id + value}
                          sx={{
                            padding: "5px",
                            fontSize: "16px", fontFamily: "'Poppins', sans-serif",
                            backgroundColor: selectedVariant?.selectedOptions.find((op) => op.name === option.name)?.value === value ? "rgb(20, 20, 20)" : "#424147",
                            border: selectedVariant?.selectedOptions.find((op) => op.name === option.name)?.value === value ? "1px solid white" : "none",
                            color: "rgb(215, 215, 215)",
                            textTransform: "none"
                          }}
                          disabled={findIfVariantExists(option.name, value) ? false : true}
                          onClick={() => { handleVariantSelection(option.name, value) }}
                          key={option.name + value}
                        >
                          {value}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              );
            })
          }
        </Box>
      );
    };

    const QuantitySelector = () => {
      const decrement = () => {
        if (quantity > 1) {
          setQuantity(quantity - 1);
        }
      };
      const increment = () => {
        if (quantity < 5) {
          setQuantity(quantity + 1);
        }
      };

      return (
        <Box
          sx={{
            width: { xs: "80%", md: "65%" }, height: "30px",
            display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between",
            marginTop: "25px"
          }}
          className="QuantitySelector"
        >
          <Typography
            sx={{
              color: "rgba(255, 255, 255)",
              fontFamily: "'Poppins', sans-seriff", fontSize: "20px", fontWeight: 500,
            }}
          >
            Quantity :
          </Typography>
          <Button
            sx={{
              minWidth: "24px",
              width: "24px",
              height: "24px",
              padding: 1,
              fontSize: "20px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
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
              color: "rgb(194, 194, 194)",
              fontFamily: "'Poppins', sans-seriff", fontSize: "20px"
            }}
          >
            {quantity}
          </Typography>
          <Button
            sx={{
              minWidth: "24px",
              width: "24px",
              height: "24px",
              padding: 1,
              fontSize: { xs: "20px", sm: "16px" }, fontFamily: "'Poppins', sans-serif", fontWeight: "bold",
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
      );
    };

    // Description
    const sanitizedHtml = DOMPurify.sanitize(selectedProduct?.description || "")

    return (
      <Box
        sx={{
          width: { xs: "100%", md: "50%" }, height: { xs: "auto", md: "70%" },
          display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "left",
          gap: "2%", marginTop: { md: "5%" },
          overflowY: { md: "scroll" }, scrollbarWidth: "0", "&::-webkit-scrollbar": { display: "none" },
          padding: { xs: "7%", md: "0" }, boxSizing: "border-box"
        }}
        className="Contentviewer"
      >
        <Typography
          sx={{
            fontSize: "24px", fontFamily: "'Poppins', sans-serif", fontWeight: 600,
            color: "rgb(255, 255, 255)",
            display: { xs: "none", md: "block" }
          }}
          className="ProductTitle"
        >
          {selectedProduct && selectedProduct.title}
        </Typography>
        <PriceContainer />
        <VariantSelector />
        <QuantitySelector />
        <Typography
          sx={{
            fontSize: "24px", fontFamily: "'Poppins', sans-serif", fontWeight: 600,
            color: "rgb(255, 255, 255)",
            marginTop: "20px"
          }}
          className="DescriptionTitle"
        >
          Description
        </Typography>
        <Box
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          sx={{
            width: { xs: "100%", md: "85%" },
            fontSize: { xs: "16px", md: "18px" }, fontFamily: "'Poppins', sans-serif", fontWeight: { xs: "300", md: "400" },
            color: "rgb(255, 255, 255)",
            textAlign: "justify"
          }}
        >
        </Box>
      </Box>
    );
  }

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
        ref={modalRef}
        sx={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", // Center the Cart
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", // Flex display
          width: { xs: "90vw", md: "70vw" }, height: { xs: "75vh", sm: "80vh", md: "75vh" }, // Size
          backgroundColor: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(10px)", boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", // Background Effects
          borderRadius: { xs: "10px", md: "25px" }, border: "1px solid rgba(255, 255, 255, 0.2)", // Border
          overflow: "none",

        }}
        className="Modal"
      >
        <Typography
          sx={{
            position: "fixed",
            top: "3%", right: "3%",
            width: "30px", height: "30px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.05)", color: "rgba(255, 255, 255, .7)",
            alignItems: "center", justifyContent: "center", display: "flex",
            fontSize: "26px", fontWeight: "normal", fontFamily: "'Poppins', sans-serif",
            "&:hover": {
              cursor: "pointer"
            }
          }}
          className="ModalCloseButton"
          onClick={closeModal}
        >
          &times;
        </Typography>
        <Box
          sx={{
            width: "100%", height: { xs: "85%", md: "95%" },
            display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-evenly", alignItems: { xs: "center", md: "start" },
            marginTop: "2%", gap: "2%",
            backgroundColor: "rgba(0, 0, 0, 0)",
            overflowY: { xs: "scroll", md: "hidden" }, scrollbarWidth: 0, "&::-webkit-scrollbar": { display: "none" }
          }}
          className="MediaAndDetails"
        >
          <Typography
            sx={{
              fontSize: "24px", fontFamily: "'Poppins', sans-serif", fontWeight: 600,
              color: "rgb(255, 255, 255)",
              display: { xs: "block", md: "none" }, marginTop: { xs: "20px" }
            }}
            className="ProductTitle"
          >
            {selectedProduct && selectedProduct.title}
          </Typography>
          <MediaViewer />
          <ContentViewer />
        </Box>
        <Box
          sx={{
            width: { xs: "100%", md: "50%" }, right: "0%", top: { xs: "90%", md: "84%" }, position: "fixed",
            display: "flex", flexDirection: "row", justifyContent: { xs: "center", md: "start" }, alignItems: "center",
            gap: { xs: "10px", md: "20px" }
          }}
          className="ShopifyButtonsContainer"
        >
          <Button
            sx={{
              minWidth: "30%",
              backgroundColor: "#424147",
              borderRadius: "100px",
              color: "white", fontWeight: { xs: "normal", md: "bold" },
              fontSize: { xs: "12px", md: "16px" }, fontFamily: "'Poppins', sans-serif",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)"
              },
              padding: "auto 25px auto 25px", boxSizing: "border-box",
              whiteSpace: "nowrap",
              overflow: "hidden"
            }}
            className="AddToCartButton"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          <Button
            sx={{
              minWidth: "30%",
              backgroundColor: "#424147",
              borderRadius: "100px",
              color: "white", fontWeight: { xs: "normal", md: "bold" },
              fontSize: { xs: "12px", md: "16px" }, fontFamily: "'Poppins', sans-serif",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)"
              },
              padding: "auto 25px auto 25px", boxSizing: "border-box",
              whiteSpace: "nowrap",
              overflow: "hidden"
            }}
            className="BuyNowButton"
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
          <Button
            sx={{
              minWidth: "35px", width: "35px", height: "35px",
              padding: "5px",
              backgroundColor: "#424147",
              borderRadius: "50%",
              color: "white", fontWeight: "bold",
              fontSize: { xs: "16px", md: "18px" }, fontFamily: "'Poppins', sans-serif",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)"
              }
            }}
            className="WishlistButton"
            onClick={() => {
              if (selectedProduct && wishlist.find((productId: number) => productId === selectedProduct.id)) {
                removeItemsFromWishlist([selectedProduct.id]);
              }
              else if (selectedProduct) {
                addItemsToWishlist([selectedProduct.id]);
              }
            }}
          >
            {!wishlist.find((productId: number) => productId === selectedProduct?.id) && <i className="far fa-heart"></i>}
            {wishlist.find((productId: number) => productId === selectedProduct?.id) && <i className="fas fa-heart"></i>}
          </Button>
        </Box>
      </Card>
    </div>
  );
}

export default Modal;