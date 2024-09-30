"use client";
import SendIcon from '@mui/icons-material/Send';
import MenuIcon from '@mui/icons-material/Menu';


import { Box, Button, Stack, TextField, Typography, CircularProgress, Paper, IconButton, Divider } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { styled } from "@mui/system";


export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello, I am Rate My Professor Support Assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (message.trim() === "") return; // Prevent sending empty messages
    setLoading(true);
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let result = "";
      await reader.read().then(function processText({ done, value }) {
        if (done) return result;

        const text = decoder.decode(value || new Uint8Array(), {
          stream: true,
        });

        setMessages((messages) => {
          const updatedMessages = [...messages];
          const lastMessage = updatedMessages[updatedMessages.length - 1];
          lastMessage.content += text;
          return updatedMessages;
        });

        return reader.read().then(processText);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box display="flex" height="100vh" width="100vw" overflow="hidden" bgcolor="#f0f2f5">
      {/* Sidebar */}
      <Box
        width="20vw"
        bgcolor="#3f51b5"
        color="white"
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={2}
        boxShadow="2px 0px 5px rgba(0, 0, 0, 0.1)"
      >
        <IconButton color="inherit" sx={{ alignSelf: 'flex-start' }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Rate My Professor
        </Typography>
        <Divider light sx={{ width: '100%', mb: 2 }} />
        <Button variant="contained" color="secondary" href="/Data-Set">
          Check Data Set
        </Button>
      </Box>

      {/* Main Chat Area */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        width="80vw"
        p={3}
      >
        {/* Header */}
        <Box
          bgcolor="#fff"
          p={2}
          mb={2}
          boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
          borderRadius="8px"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" color="textPrimary">
            Search For Professor of Your Type
          </Typography>
        </Box>

        {/* Chat Messages */}
        <Paper
          elevation={3}
          sx={{
            flexGrow: 1,
            p: 2,
            overflowY: "auto",
            borderRadius: "8px",
            bgcolor: "#ffffff",
          }}
        >
          <Stack direction="column" spacing={2}>
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={message.role === "assistant" ? "flex-start" : "flex-end"}
              >
                <Box
                  sx={{
                    maxWidth: "70%",
                    p: 2,
                    borderRadius: "12px",
                    bgcolor: message.role === "assistant" ? "#f1f1f1" : "#3f51b5",
                    color: message.role === "assistant" ? "black" : "white",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
        </Paper>

        {/* Message Input */}
        <Stack direction="row" spacing={2} mt={2}>
          <TextField
            label="Type a message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            sx={{ bgcolor: "white", borderRadius: "8px" }}
          />
          <IconButton
            color="primary"
            onClick={sendMessage}
            disabled={loading}
            sx={{
              bgcolor: loading ? "grey" : "#3f51b5",
              color: "white",
              borderRadius: "50%",
              "&:hover": {
                bgcolor: loading ? "grey" : "#303f9f",
              },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : <SendIcon />}
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}
