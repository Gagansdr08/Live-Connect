import React from "react";
import { SkeletonText } from "/Users/gagan_sadhrush/randompyprograms/Chatapp_MERN/frontend/src/components/ui/skeleton.jsx";

const ChatLoading = () => {
  return <SkeletonText noOfLines={3} gap="4" />;
};

export default ChatLoading;
