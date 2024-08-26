"use client";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Img from '../public/OIP.jpeg'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello, I am Rate My Professor Support Assistant. How can I help you today?",
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
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        backgroundImage: "url('/pic.jpg')",
    backgroundSize: "cover", 
    backgroundPosition: "center",
      }}
    >
      <Button variant='contained' sx={{position:'absolute', top:'10px', left:'10px'}} href='/Data-Set'>Check Data Set</Button>
      <Typography variant="h4"  >Search For Professor of Your Type</Typography>

      <Stack
        direction="column"
        width="70vw"
        height="700px"
        border="2px solid lightblue"
        p='15px 20px'
        spacing={3}
        sx={{
          mx: "auto",
          borderRadius: "16px",
           backgroundImage: "url('/pic.jpg')",
           backgroundSize: "cover", 
           backgroundPosition: "center",
           boxShadow: " 2px -6px 20px #b9faff;",
           marginTop:'20px'
        }}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={
                  message.role === "assistant"
                    ? "white"
                    : "#bde58e"
                }
                color="black"
                borderRadius='25px'
                p={3}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            sx={{ border:'2px solid white',
               
             }} 
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={loading}
            aria-label="Send message"
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
