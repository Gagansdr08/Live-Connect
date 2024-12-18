import { Box, Button, Text } from "@chakra-ui/react";
import { Tooltip } from "/Users/gagan_sadhrush/randompyprograms/Chatapp_MERN/frontend/src/components/ui/tooltip.jsx";
import { ChatState } from "../../context/chatProvider";
import { Avatar } from "/Users/gagan_sadhrush/randompyprograms/Chatapp_MERN/frontend/src/components/ui/avatar";
import { useHistory } from "react-router";
import { Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { Spinner } from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "/Users/gagan_sadhrush/randompyprograms/Chatapp_MERN/frontend/src/components/ui/menu";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
} from "/Users/gagan_sadhrush/randompyprograms/Chatapp_MERN/frontend/src/components/ui/drawer.jsx";
import axios from "axios";
import { toaster } from "/Users/gagan_sadhrush/randompyprograms/Chatapp_MERN/frontend/src/components/ui/toaster.jsx";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, chats, setSelectedChat, setChats } = ChatState();

  const [open, setOpen] = useState(false);

  const history = useHistory();

  const handleSearchClick = () => {
    setOpen(true); // Open the drawer when the button is clicked
  };

  const handleSearch = async () => {
    if (!search) {
      toaster.create({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/app/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toaster.create({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const config = {
        "Content-type": "application/json",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/app/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setLoading(false);
      setSelectedChat(data);
      setOpen(false);
    } catch (error) {
      toaster.create({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip showArrow content="Search Users to chat">
          <Button
            variant="outline"
            color="black"
            _hover={{
              color: "white", // Text color on hover
            }}
          >
            <Text
              d={{ base: "none", md: "flex" }}
              px={4}
              onClick={handleSearchClick}
            >
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          Live Connect
        </Text>
        <div>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                color="black"
                _hover={{
                  color: "white", // Text color on hover
                }}
              >
                Notification
              </Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem value="new-txt">New Text File</MenuItem>
              <MenuItem value="new-file">New File...</MenuItem>
              <MenuItem value="new-win">New Window</MenuItem>
              <MenuItem value="open-file">Open File...</MenuItem>
              <MenuItem value="export">Export</MenuItem>
            </MenuContent>
          </MenuRoot>
          <MenuRoot>
            <MenuTrigger asChild>
              <Button size="sm">
                <Avatar name={user.name} />
              </Button>
            </MenuTrigger>
            <MenuContent>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuContent>
          </MenuRoot>
        </div>
      </Box>

      <DrawerRoot
        placement="start"
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
      >
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Search Users</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner size="sm" color="white" />}
          </DrawerBody>
          <DrawerFooter>
            <DrawerActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerActionTrigger>
            <Button>Save</Button>
          </DrawerFooter>
          <DrawerCloseTrigger />
        </DrawerContent>
      </DrawerRoot>
    </>
  );
};

export { SideDrawer };
