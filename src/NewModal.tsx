import { Box, Button, Card, Typography, ButtonBase } from "@mui/material";
import { useCart, ModelViewer } from "@shopify/hydrogen-react";
import { useEffect, useRef, useState } from "react";
import { useZustandStore } from "./stores/ZustandStore";
import Variant from "./Types/Variant";
import DOMPurify from 'dompurify';
import useWishlist from "./WishlistHook";
import Swal from "sweetalert2";
import styles from "@/UI/UI.module.scss";

const Modal = () => {
  const { lines, checkoutUrl, linesAdd } = useCart();
  const { closeModal, selectedProduct } = useZustandStore();

  // Wishlist Hooks
  const { wishlist, addItemsToWishlist, removeItemsFromWishlist } = useWishlist();

  // Set the initial variant
  const [selectedVariant, setSelectedVariant] = useState<Variant>();
  useEffect(() => {
    selectedProduct && setSelectedVariant(selectedProduct.variants[0]);
  }, [selectedProduct]);

  // Quantity
  const [quantity, setQuantity] = useState(1);

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

  const MediaViewer = () => {
    const PHOTOS = "Photos";
    const MODEL = "3D Model";
    const [mediaType, setMediaType] = useState(PHOTOS);

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
              fontSize: 16, fontFamily: "'Poppins', sans-serif",
              textTransform: "none",
              "&:hover": (mediaType !== PHOTOS && {
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }) || {}
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
              fontSize: 16, fontFamily: "'Poppins', sans-serif",
              textTransform: "none",
              "&:hover": (mediaType !== MODEL && {
                backgroundColor: "rgba(255, 255, 255, 0.1)"
              }) || {}
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
            gap: "3%"
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
              width: "60%", height: "100%",
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
        <ModelViewer
          style={{
            height: "100%",
            width: "100%",
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
          onArStatus={(event: unknown) => console.log("AR Status:", event)} // Optional: Log AR status
          onLoad={() => console.log("Model loaded")} // Optional: Log modelloading
        />
      );
    };

    return (
      <Box
        sx={{
          width: { xs: "100%", md: "50%" }, height: { md: "100%" },
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          gap: "5%",
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
            width: "30%",
            backgroundColor: "#424147",
            borderRadius: "100px",
            color: "white", fontWeight: "bold",
            fontSize: 16, fontFamily: "'Poppins', sans-serif",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)"
            }
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
              fontSize: "20px", fontFamily: "'Poppins', sans-serif",
              color: "rgb(194, 194, 194)"
            }}
            className="ProductPrice"
          >
            &#8377; {selectedVariant && selectedVariant.price}
          </Typography>
          {selectedVariant && selectedVariant.compareAtPrice &&
            <Typography
              sx={{
                fontSize: "14px", fontFamily: "'Poppins', sans-serif",
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
              return variant.selectedOptions[num].value === optionValue;
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
            return variant.selectedOptions[num].value === optionValue;
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
            width: "40%", height: "30px",
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
            Quantity:
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
          width: { xs: "100%", md: "50%" }, height: { md: "70%" },
          display: "flex", flexDirection: "column", justifyContent: "start", alignItems: "left",
          gap: "2%", marginTop: "5%",
          overflowY: "scroll", scrollbarWidth: "0", "&::-webkit-scrollbar": { display: "none" }
        }}
        className="Contentviewer"
      >
        <Typography
          sx={{
            fontSize: "24px", fontFamily: "'Poppins', sans-serif", fontWeight: 600,
            color: "rgb(255, 255, 255)"
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
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          style={{ width: "80%", fontSize: "18px", fontFamily: "'Poppins', sans-serif", fontWeight: 400, color: "rgb(255, 255, 255)", marginBottom: "50px" }}
        >
        </div>
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
          width: { xs: "95vw", md: "70vw" }, height: { xs: "85vh", md: "75vh" }, // Size
          backgroundColor: "rgba(0, 0, 0, 0.8)", backdropFilter: "blur(10px)", boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", // Background Effects
          borderRadius: { xs: "10px", md: "25px" }, border: "1px solid rgba(255, 255, 255, 0.2)", // Border
          overflow: "none"
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
            width: "100%", height: "95%",
            display: "flex", flexDirection: { xs: "column-reverse", md: "row" }, justifyContent: "space-evenly", alignItems: "start",
            marginTop: "2%", gap: "2%",
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
          className="MediaAndDetails"
        >
          <MediaViewer />
          <ContentViewer />
        </Box>
        <Box
          sx={{
            width: "50%", right: "0%", top: "84%", position: "fixed",
            display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
            gap: "20px"
          }}
          className="ShopifyButtonsContainer"
        >
          <Button
            sx={{
              width: "30%",
              backgroundColor: "#424147",
              borderRadius: "100px",
              color: "white", fontWeight: "bold",
              fontSize: 16, fontFamily: "'Poppins', sans-serif",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)"
              }
            }}
            className="AddToCartButton"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          <Button
            sx={{
              width: "30%",
              backgroundColor: "#424147",
              borderRadius: "100px",
              color: "white", fontWeight: "bold",
              fontSize: 16, fontFamily: "'Poppins', sans-serif",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)"
              }
            }}
            className="CheckoutButton"
            onClick={handleCheckout}
          >
            Checkout
          </Button>
          <Button
            sx={{
              minWidth: "35px", width: "35px", height: "35px",
              padding: "5px",
              backgroundColor: "#424147",
              borderRadius: "50%",
              color: "white", fontWeight: "bold",
              fontSize: 18, fontFamily: "'Poppins', sans-serif",
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