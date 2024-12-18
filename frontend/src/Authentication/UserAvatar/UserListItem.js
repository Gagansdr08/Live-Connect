import { Avatar } from "/Users/gagan_sadhrush/randompyprograms/Chatapp_MERN/frontend/src/components/ui/avatar";
import { Box, Text } from "@chakra-ui/react";
// import { ChatState } from "/Users/gagan_sadhrush/randompyprograms/Chatapp_MERN/frontend/src/context/chatProvider.js";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar mr={2} size="sm" cursor="pointer" name={user.name} />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
