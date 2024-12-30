"use client";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
// import { Environment, OrbitControls } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import DOMPurify from "dompurify";
import { Suspense, useEffect, useState } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useCart } from "@shopify/hydrogen-react";

const CanvasContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        position: "relative",
        // width: { xs: "100%", sm: "45%", md: "50%", lg: "50%", xl: "50%" }, // Adjust width for responsiveness manually in your layout
        borderRadius: "10px",
        overflow: "hidden",
        objectFit: "cover",
        padding: "2px",
        height: "100%",
      }}
    >
      {children}
    </Box>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: any;
  data: any;
}

const ModelColumn = ({ modelUrl }: { modelUrl: string }) => {
  const gltf = useLoader(GLTFLoader, modelUrl, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/"); // Path to Draco decoder
    loader.setDRACOLoader(dracoLoader);
  });

  return (
    <group position={[0, -5, 0]} scale={5}>
      <primitive object={gltf.scene} />
    </group>
  );
};

const QuantityCounter = () => {
  const [quantity, setQuantity] = useState(1);

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
          backgroundColor: "#ffffff33",
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
          backgroundColor: "#ffffff33",
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

const RightColumn = ({ props, sizes }: { props: any; sizes: string[] }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const sanitizedHtml = DOMPurify.sanitize(props.data["body_html"]);
  const handleSizeClick = (size: string) => {
    setSelectedSize(size);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: 0,
      }}
    >
      <CardContent sx={{ zIndex: 1000 }}>
        <Typography
          sx={{
            fontSize: {
              sm: "1rem",
              md: "1.5rem",
              lg: "1.5rem",
              xl: "1.5rem",
            }, // Adjust the size as needed
            color: "white", // Set the color to white
            fontFamily: "'Poppins', sans-serif",
            // paddingBottom: 1,
            fontWeight: "bold",
          }}
        >
          {props.data.title}
        </Typography>

        <Typography
          sx={{
            fontSize: { md: "1rem", lg: "1.5rem" },
            color: "white",
            fontFamily: "'Poppins', sans-serif",
            // paddingTop: 1,
          }}
        >
          ₹ {props.data.variants[0].price}
        </Typography>

        {/* Quantity Picker */}

        <QuantityCounter />

        {/* Sizes Selector */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            paddingTop: 1,
            paddingBottom: 1,
          }}
        >
          <Box sx={{ display: "flex", gap: 1, flexWrap: { xs: "wrap" } }}>
            {sizes.map((size) => (
              <Button
                key={size}
                variant="outlined"
                size="small"
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  backgroundColor:
                    selectedSize === size
                      ? "black"
                      : "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "0px",
                }}
                onClick={() => handleSizeClick(size)}
              >
                {size}
              </Button>
            ))}
          </Box>
        </Box>
        {/* <Typography
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
        </Typography> */}
        <Box
          sx={{
            // backgroundColor: "rgba(0 0 0 / 10%)",
            borderRadius: 1,
            padding: 1,
            marginTop: 1,
            backdropFilter: "blur(10px)",
            maxHeight: {
              xs: "225px",
              sm: "210px",
              md: "225px",
              lg: "250px",
              xl: "180px",
            },
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
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
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        </Box>
      </CardContent>
    </Box>
  );
};

const Modal: React.FC<ModalProps> = (props) => {

  const sizes: string[] = [];
  const images: string[] = [];
  let modelUrl: string = "";

  const [view, setView] = useState<"photos" | "3d">("3d");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const sanitizedHtml = DOMPurify.sanitize(props.data["node"]["bodyHtml"]);

  const { linesAdd, checkoutUrl } = useCart();

  useEffect(() => {
    console.log("Cart Lines:", linesAdd); // Updated cart lines
    console.log("Checkout URL:", checkoutUrl); // Updated checkout URL
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
      modelUrl = edge.node.sources[0].url;
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
      alert("Please select a size before adding to cart!");
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
      alert("The selected variant does not exist!");
      return;
    }

    try {
      const result = await linesAdd([
        {
          merchandiseId: selectedVariant["node"]["id"],
          quantity: quantity,
        },
      ]);
      alert("Product added to cart!");
    } catch (error) {
      alert("Cannot add product to cart!");
      console.error(error);
      return;
    }
  };

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
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Card
        sx={{
          position: "fixed",
          top: { xs: "5%", sm: "5%", md: "5%" },
          left: { xs: "10%", sm: "10%", md: "10%", lg: "10%", xl: "10%" },
          flexDirection: "column",
          maxWidth: { xs: "80vw", md: "60vw", lg: "80vw", xl: "80vw" },
          gap: "10px",
          backgroundColor: "rgba(0, 0, 0, 0.75)", // Semi-transparent white
          backdropFilter: "blur(5px)", // Blur effect for glass morphism
          borderRadius: "10px",
          padding: 2,
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", // Subtle shadow
          border: "1px solid rgba(255, 255, 255, 0.2)", // Optional border
          zIndex: 999,
          overflowY: {
            xs: "auto",
            sm: "auto",
            md: "auto",
            lg: "hidden",
            xl: "hidden",
          }, // Enable vertical scrolling on small devices
          scrollbarWidth: {
            xs: "none",
            sm: "none",
            md: "none",
            lg: "auto",
            xl: "auto",
          }, // Hide scrollbar on small devices
          "&::-webkit-scrollbar": {
            display: {
              xs: "none",
              sm: "none",
              md: "none",
              lg: "block",
              xl: "block",
            }, // Hide scrollbar on small devices
          },
          maxHeight: { xs: "90vh", md: "none" },
        }}
      >
        {/* Header Buttons */}
        <Box
          sx={{
            position: "sticky",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
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
              onClick={props.onClose}
            />
          </IconButton>
        </Box>

        {/* Main Content */}
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "16px",
            }}
          >
            <div
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
                  backgroundColor:
                    view === "photos" ? "rgba(255, 255, 255, 0.2)" : null,
                  color: "white",
                  padding: "6px 16px",
                  borderRadius: "50px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "bold",
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
                  backgroundColor:
                    view === "3d" ? "rgba(255, 255, 255, 0.2)" : null,
                  color: "white",
                  padding: "6px 16px",
                  borderRadius: "50px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "bold",
                }}
              >
                3D Model
              </Button>
            </div>
            <CanvasContainer>
              {view === "photos" ? (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    borderRadius: "10px",
                    height: "100%",
                  }}
                >
                  <img
                    src={images[currentIndex]}
                    alt={`Carousel ${currentIndex}`}
                    style={{
                      borderRadius: "10px",
                      width: "350px",
                      height: "100%",
                      objectFit: "cover",
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
                    }}
                  >
                    {">"}
                  </IconButton>
                </Box>
              ) : (
                <Suspense
                  fallback={
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <div className="lds-ring">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                      <p style={{ marginTop: "1rem" }}>Loading...</p>
                    </div>
                  }
                >
                  {/* <Canvas camera={{ position: [0, 0, 10] }}>
                    <ambientLight intensity={0.5} />
                    <spotLight
                      position={[10, 10, 10]}
                      angle={0.15}
                      penumbra={1}
                    />
                    <ModelColumn modelUrl={modelUrl} />
                    <OrbitControls
                      autoRotate
                      autoRotateSpeed={0.5}
                      enableZoom={false}
                      enablePan={false}
                      minPolarAngle={Math.PI / 4}
                      maxPolarAngle={Math.PI / 1.5}
                    />
                    <Environment preset="warehouse" blur={2} />
                  </Canvas> */}
                </Suspense>
              )}
            </CanvasContainer>
          </div>

          {/* Right Side: Description */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
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

              <Typography
                sx={{
                  fontSize: "1rem",
                  color: "white",
                  fontFamily: "'Poppins',sans-serif",
                }}
              >
                Quantity:
              </Typography>

              <Select
                value={quantity}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "5px",
                  padding: { md: "0 4px ", lg: "0 8px" },
                  width: { xs: "100%", sm: "100%", md: "100%", lg: "100%" },
                  zIndex: "1000",
                }}
              >
                {[1, 2, 3, 4, 5].map((quantity) => (
                  <MenuItem key={quantity} value={quantity}>
                    {quantity}
                  </MenuItem>
                ))}
              </Select>
              <Typography
                sx={{
                  fontSize: { md: "1rem", lg: "1.5rem" },
                  color: "white",
                  fontFamily: "'Poppins', sans-serif",
                  paddingTop: 1,
                }}
              >
                ₹ {props.data["node"]["variants"]["edges"][0]["node"]["price"]}
              </Typography>

              {/* Sizes Selector */}
              <Box
                sx={{ display: "flex", alignItems: "center", paddingTop: 1 }}
              >
                <Box sx={{ display: "flex", gap: 1, flexWrap: { xs: "wrap" } }}>
                  {sizes.map((size) => (
                    <Button
                      key={size}
                      variant="outlined"
                      size="small"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        backgroundColor:
                          selectedSize === size
                            ? "black"
                            : "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        borderColor: "white",
                      }}
                      onClick={() => handleSizeClick(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </Box>
              </Box>
              <br />
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
                  backgroundColor: "rgba(0 0 0 / 15%)",
                  borderRadius: 1,
                  padding: 1,
                  marginTop: 1,
                  backdropFilter: "blur(10px)",
                  maxHeight: {
                    xs: "225px",
                    sm: "210px",
                    md: "225px",
                    lg: "250px",
                    xl: "225px",
                  },
                  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
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
                  <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
                </Typography>
              </Box>
            </CardContent>
          </Box>
        </Box>

        {/* Footer Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            position: "sticky",
          }}
        >
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white",
              borderRadius: "50px 50px 50px 50px", // Rounded right side
              padding: "6px 16px",
              "&:hover": {
                backgroundColor: "#ffffff09",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
              },
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "bold",
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
              padding: "6px 16px",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.45)",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
              },
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "bold",
            }}
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </Box>
      </Card>
    </div>
  );
};

export default Modal;
