import React, { useEffect, useRef, useState } from "react";
import { useComponentStore } from "./stores/ZustandStores";
import { Card, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { styled } from "@mui/material/styles";
import Switch, { SwitchProps } from "@mui/material/Switch";

const SettingsModal = () => {
  // Handle click outside the modal
  const modalRef = useRef<HTMLDivElement>(null);
  const { closeSettingsModal, isAudioPlaying, setAudioPlaying } =
    useComponentStore();

  const onClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    const modal = modalRef.current;
    if (modal && !modal.contains(event.target as Node)) closeSettingsModal();
  };

  const handleSwitchToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAudioPlaying(event.target.checked);
    // if (event.target.checked) {
    //   audioPlayerRef.current.audioEl.current.play();
    // } else {
    //   audioPlayerRef.current.audioEl.current.pause();
    // }
  };

  const IOSSwitch = styled((props: SwitchProps) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "1000ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#65C466",
          opacity: 1,
          border: 0,
          ...theme.applyStyles("dark", {
            backgroundColor: "#2ECA45",
          }),
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.grey[100],
        ...theme.applyStyles("dark", {
          color: theme.palette.grey[600],
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.7,
        ...theme.applyStyles("dark", {
          opacity: 0.3,
        }),
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: "#E9E9EA",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
      ...theme.applyStyles("dark", {
        backgroundColor: "#39393D",
      }),
    },
  }));

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

  return (
    <div
      style={{
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
      onClick={onClickOutside}
    >
      <Card
        ref={modalRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          width: {
            xs: "300px",
            sm: "400px",
            md: "400px",
            lg: "400px",
            xl: "400px",
          },
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 0 15px rgba(0, 0, 0, 0.2)", // Background Effects
          borderRadius: { xs: "10px", md: "25px" },
          border: "1px solid rgba(255, 255, 255, 0.2)", // Border
          padding: 2,
        }}
      >
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", color: "white" }}
        >
          <CloseIcon
            sx={{
              backgroundColor: "#424147",
              borderRadius: "50%",
              fontSize: "18px",
              padding: 0.2,
            }}
            onClick={closeSettingsModal}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "bold",
              color: "white",
            }}
          >
            Settings
          </Typography>
        </Box>
        <br />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: 2,
            backgroundColor: "#424147",
            color: "white",
            borderRadius: "10px",
          }}
        >
          <Typography
            sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: "bold" }}
          >
            Privacy Policy
          </Typography>
          <ChevronRightIcon />
        </Box>
        <br />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: 2,
            backgroundColor: "#424147",
            color: "white",
            borderRadius: "10px",
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "bold",
              backgroundColor: "#424147",
            }}
          >
            Terms & Conditions
          </Typography>
          <ChevronRightIcon />
        </Box>
        <br />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: 2,
            backgroundColor: "#424147",
            color: "white",
            borderRadius: "10px",
          }}
        >
          <Typography
            sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: "bold" }}
          >
            Contact us
          </Typography>
          <ChevronRightIcon />
        </Box>
        <br />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: 2,
            backgroundColor: "#424147",
            color: "white",
            borderRadius: "10px",
          }}
        >
          <Typography
            sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: "bold" }}
          >
            Music
          </Typography>
          <IOSSwitch checked={isAudioPlaying} onChange={handleSwitchToggle} />
        </Box>
      </Card>
    </div>
  );
};

export default SettingsModal;