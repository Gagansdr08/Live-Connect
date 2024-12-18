import React, { useState, useEffect } from "react";
import { ChatState } from "../context/chatProvider";
import { Box, Button, Input, Spinner, Text } from "@chakra-ui/react";
import { toaster } from "../components/ui/toaster";
import { getSender } from "../Authentication/Chatlogics";
import axios from "axios";
import "/Users/gagan_sadhrush/randompyprograms/Chatapp_MERN/frontend/src/Authentication/styles.css";
import ScrollableChat from "./ScrollableChat";
const SingleChat = () => {
  const { selectedChat, setSelectedChat, user } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  // const [socketConnected, setSocketConnected] = useState(false);
  // const [typing, setTyping] = useState(false);
  // const [istyping, setIsTyping] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/app/message/${selectedChat._id}`,
        config
      );

      console.log(data);

      setMessages(data);
      setLoading(false);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]); // this is whenever user changes the chat , then also we are calling fetchMessages

  const sendmessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/app/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );

        setMessages([...messages, data]);
      } catch (error) {
        toaster.create({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    //typing indicatar logic
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            {getSender(user, selectedChat.users)}
            <Button
              onClick={() => setSelectedChat("")}
              variant="outline"
              color="black"
              _hover={{
                color: "white", // Text color on hover
                bg: "#38B2AC",
              }}
            >
              Back
            </Button>
          </Text>

          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
                color="red"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <Input
              onKeyDown={sendmessage}
              mt={3}
              variant="filled"
              bg="#E0E0E0"
              placeholder="Enter a message.."
              value={newMessage}
              onChange={typingHandler}
            ></Input>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Text fontSize="3xl" fontFamily="Work Sans" pb={3}>
            Click on the user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
