import { Box, Button, Card, Typography, ButtonBase } from "@mui/material";
import { useCart, ModelViewer } from "@shopify/hydrogen-react";
import { useEffect, useRef, useState } from "react";
import { useZustandStore } from "./stores/ZustandStores";

const Modal = () => {
  const { lines, linesUpdate, checkoutUrl, linesRemove } = useCart();
  const { closeModal, selectedProduct } = useZustandStore();

  // Handle click outside the modal
  const modalRef = useRef<HTMLDivElement>(null);
  const onClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    const modal = modalRef.current;
    if (modal && !modal.contains(event.target as Node))
      closeModal();
  };

  // Media Viewer
  const PHOTOS = "Photos";
  const MODEL = "3D Model";
  const [ mediaType, setMediaType ] = useState(PHOTOS);
  
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
            color: "white", fontWeight: "bold",
            fontSize: 16,
            textTransform: "none",
            "&:hover": (mediaType !== PHOTOS && {
              backgroundColor: "rgba(255, 255, 255, 0.1)"
            }) || {}
          }}
          onClick={() => setMediaType(PHOTOS)}
          className="MediaViewerPhotosButton"
        >
          Photos
        </Button>
        <Button
          sx={{
            width: "50%",
            backgroundColor: (mediaType === MODEL && "#8D8B96") || "rgba(0, 0, 0, 0)",
            borderRadius: "100px",
            color: "white", fontWeight: "bold",
            fontSize: 16,
            textTransform: "none",
            "&:hover": (mediaType !== MODEL && {
              backgroundColor: "rgba(255, 255, 255, 0.1)"
            }) || {}
          }}
          onClick={() => setMediaType(MODEL)}
          className="MediaViewerModelButton"
        >
          3D Model
        </Button>
      </Box>
    )
  };

  const PhotosCarousel = () => {
    const photosCount: number = selectedProduct?.images.length || 0;
    const [ currentPhoto, setCurrentPhoto ] = useState(0);
    
    const nextPhoto = () => {
      if(currentPhoto < photosCount - 1){
        setCurrentPhoto(currentPhoto + 1);
      }
    };
    
    const prevPhoto = () => {
      if(currentPhoto > 0){
        setCurrentPhoto(currentPhoto - 1);
      }
    };

    return (
      <Box
        sx={{
          width: "100%", height: "60%",
          display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
          gap: "3%"
        }}
        className = "PhotosCarousel"
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
          <img src="icons/Arrow.svg" style={{width: "100%", height: "auto"}}></img>
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
          <img src="icons/Arrow.svg" style={{width: "100%", height: "auto"}}></img>
        </ButtonBase>
      </Box>
    );
  };

  const ModelViewerComponent = () => {
    const model = selectedProduct?.models[0];
    console.log(selectedProduct);
    if(!model) return null;

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
          width: "60%",
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
        onArStatus={(event:unknown) => console.log("AR Status:", event)} // Optional: Log AR status
        onLoad={() => console.log("Model loaded")} // Optional: Log modelloading
      />
    );
  };

  const MediaViewer = () => {
    return (
      <Box
        sx={{
          width: {xs: "100%", md: "50%"}, height: {md: "100%"},
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          gap: "5%",
        }}
        className="MediaViewer"
      >
        <MediaButtons/>
        {mediaType === PHOTOS &&
          <PhotosCarousel/>
        }
        {mediaType === MODEL &&
          <ModelViewerComponent/>
        }
        <Button
          sx={{
            width: "30%",
            backgroundColor:  "#424147",
            borderRadius: "100px",
            color: "white", fontWeight: "bold",
            fontSize: 16,
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
            display: "flex", flexDirection: {xs: "column-reverse", md: "row"}, justifyContent: "space-evenly", alignItems: "center",
            marginTop: "5%",
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
          className="MediaAndDetails"
        >
          <MediaViewer/>
          <Box
            sx={{
              width: {xs: "100%", md: "50%"},
              display: "flex", flexDirection: "column", alignItems: "left",
            }}
            className="ContentViewer"
          >

          </Box>
        </Box>
      </Card>
    </div>
  );
}

export default Modal;