import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import Input from "@mui/joy/Input";
import CloseIcon from "@mui/icons-material/Close";
import ReactMarkdown from "react-markdown";
import { useProductStore } from "../store/productStore";

interface ChatbotProps {
  isChatbotModalOpen: boolean;
  onChatbotModalClose: () => void;
}

const ChatBotModal: React.FC<ChatbotProps> = (props) => {
  const [messages, setMessages] = useState<
    { type: "user" | "bot"; text: string }[]
  >([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const { showCrosshair } = useProductStore();
  // Ref to track the chat container
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    // Add the user's message to the messages list
    setMessages((prev) => [...prev, { type: "user", text: currentMessage }]);

    // Send the message to the chatbot API
    try {
      const response = await fetch(
        "https://strategy-fox-go-bked.com/api/chatbot/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userInput: currentMessage }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const botMessage =
          data.response || "I'm sorry, I couldn't process that.";

        // Add the bot's response to the messages list
        setMessages((prev) => [...prev, { type: "bot", text: botMessage }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: "Failed to communicate with the chatbot." },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "An error occurred while communicating with the chatbot.",
        },
      ]);
    }

    // Clear the input field
    setCurrentMessage("");
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // Focus the input programmatically
    }
  };

  // Scroll to the bottom whenever a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!props.isChatbotModalOpen) return null;

  return (
    <Card
      sx={{
        position: "fixed",
        bottom: "1.5%",
        right: "1.5%",
        width: { xs: "90vw", sm: "40vw", lg: "25vw", md: "30vw" },
        height: "60vh",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(10px)",
        borderRadius: "10px",
        boxShadow: 4,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "3px solid rgba(0, 0, 0, 0.1)",
          padding: "16px",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <img
            src="/fox-logo.jpg" // Replace with your logo path
            alt="Logo"
            style={{ width: "30px", height: "30px" }}
          />
          <Typography sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
            CHAT WITH FOX
          </Typography>
        </Box>
        <IconButton
          onClick={() => {
            props.onChatbotModalClose();
            showCrosshair();
          }}
          onTouchStart={() => {
            props.onChatbotModalClose();
            showCrosshair();
          }}
          sx={{ marginLeft: "auto" }}
        >
          <CloseIcon />
        </IconButton>
      </CardContent>

      {/* Chat Area */}
      <CardContent
        ref={chatContainerRef} // Attach the ref to the chat container
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          "&::-webkit-scrollbar": { display: "none" }, // Hide scrollbar for Webkit browsers
          scrollbarWidth: "none", // Hide scrollbar for Firefox
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent:
                message.type === "user" ? "flex-end" : "flex-start",
              marginBottom: 1,
            }}
          >
            <Box
              sx={{
                maxWidth: "70%",
                padding: 1,
                borderRadius: "10px",
                backgroundColor:
                  message.type === "user" ? "#e2441e" : "rgba(0, 0, 0, 0.1)",
                color: message.type === "user" ? "white" : "black",
                wordWrap: "break-word",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontFamily: "SF Pro Display",
                }}
              >
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </Typography>
            </Box>
          </Box>
        ))}
      </CardContent>

      {/* Footer */}
      <CardActions
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "8px",
          borderTop: "3px solid rgba(0, 0, 0, 0.1)",
          gap: 1,
        }}
      >
        <Input
          placeholder="Enter your message"
          value={currentMessage}
          ref={inputRef}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          onTouchStart={(e) => {
            console.log("Input field touched");
            focusInput();
            console.log(inputRef);
            e.stopPropagation(); // Prevent touch event interference
          }}
          sx={{
            flex: 1,
            border: "2px solid grey",
            padding: 1.5,
            "&:focus-within": {
              border: "3px solid white",
            },
          }}
        />
        <Button
          sx={{
            color: "white",
            backgroundColor: "#e2441e",
            borderRadius: "10px",
            padding: 1.5,
            fontFamily: "SF Pro Display",
          }}
          onClick={handleSendMessage}
          onTouchStart={handleSendMessage}
        >
          Send
        </Button>
      </CardActions>
    </Card>
  );
};

export default ChatBotModal;
