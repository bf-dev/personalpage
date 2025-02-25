"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, useMemo } from "react";

export type MessagePosition = "first" | "middle" | "last" | "single";
export type MessageSide = "left" | "right" | "timestamp";

export interface ChatMessageData {
  content: string;
  side: MessageSide;
  position?: MessagePosition;
  buttons?: string[]; // Optional array of button texts
}

interface ChatMessageProps {
  content: string;
  side: MessageSide;
  position: MessagePosition;
  className?: string;
  buttons?: string[];
  onButtonClick?: (buttonText: string) => void;
}

export function ChatMessage({
  content,
  side,
  position,
  className,
  buttons,
  onButtonClick,
}: ChatMessageProps) {
  // If this is a timestamp message, render it as a DateMessage
  if (side === "timestamp") {
    return (
      <motion.div
        className="text-center text-xs text-zinc-500 my-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 5 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.3,
              type: "spring",
              stiffness: 100,
              damping: 15,
            },
          },
        }}
      >
        {content}
      </motion.div>
    );
  }

  // For regular messages
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      x: side === "left" ? -20 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 120,
        damping: 12,
      },
    },
  };

  // Get border radius based on position and side
  const getBorderRadius = () => {
    if (side === "left") {
      switch (position) {
        case "first":
          return "rounded-2xl rounded-bl-md";
        case "middle":
          return "rounded-2xl rounded-bl-md rounded-tl-md";
        case "last":
          return "rounded-2xl rounded-tl-md";
        case "single":
          return "rounded-2xl rounded-bl-md";
        default:
          return "rounded-2xl";
      }
    } else {
      switch (position) {
        case "first":
          return "rounded-2xl rounded-br-md";
        case "middle":
          return "rounded-2xl rounded-br-md rounded-tr-md";
        case "last":
          return "rounded-2xl rounded-tr-md";
        case "single":
          return "rounded-2xl rounded-br-md";
        default:
          return "rounded-2xl";
      }
    }
  };

  return (
    <>
      <motion.div
        className={cn(
          "px-4 py-2 text-sm max-w-[80%] flex flex-col",
          side === "left" ? "bg-zinc-800 self-start" : "bg-[#0095F6] self-end",
          getBorderRadius(),
          className
        )}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="items-center">{content}</div>
      </motion.div>
      {buttons && buttons.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          {buttons.map((button, index) => (
            <motion.button
              key={index}
              onClick={() => onButtonClick && onButtonClick(button)}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-2xl text-sm text-zinc-200 text-left transition-colors self-start inline-block w-auto"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  delay: 0.2, // Small delay after message appears
                  duration: 0.3,
                  type: "spring",
                  stiffness: 120,
                  damping: 12
                }
              }}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgb(63 63 70)",
                transition: { duration: 0.2 } 
              }}
              whileTap={{ scale: 0.95 }}
            >
              {button}
            </motion.button>
          ))}
        </div>
      )}
    </>
  );
}

export function ChatContainer({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col w-full gap-1">{children}</div>;
}

interface ChatMessageProviderProps {
  messages: ChatMessageData[];
  delay?: number; // Default delay in ms between messages
  typeDelays?: {
    [key in MessageSide]?: number; // Custom delays for specific message types
  };
  animated?: boolean; // Option to disable animations completely
  onButtonClick?: (buttonText: string) => void; // Function to handle button clicks
}

export function ChatMessageProvider({
  messages,
  delay = 500, // Default delay of 500ms between messages
  typeDelays = {}, // Custom delays per message type
  animated = true, // Animation enabled by default
  onButtonClick,
}: ChatMessageProviderProps) {
  // State to track how many messages are currently visible
  const [visibleCount, setVisibleCount] = useState(
    animated ? 0 : messages.length
  );
  
  // Track the previous message count to detect new messages
  const [prevMessageCount, setPrevMessageCount] = useState(0);

  // Add stable IDs to messages for React keys
  const messagesWithIds = useMemo(
    () => messages.map((msg, index) => ({ ...msg, id: `msg-${index}` })),
    [messages]
  );

  // Effect to animate messages appearing
  useEffect(() => {
    // If animations are disabled, show all messages immediately
    if (!animated) {
      setVisibleCount(messagesWithIds.length);
      return;
    }
    
    // Determine if we're adding new messages or loading initial messages
    const messageCount = messagesWithIds.length;
    const isInitialLoad = prevMessageCount === 0;
    const isRemovingMessages = messageCount < prevMessageCount;
    
    // Update previous message count for next comparison
    setPrevMessageCount(messageCount);
    
    // Reset if messages were removed
    if (isRemovingMessages) {
      setVisibleCount(0);
      return;
    }
    
    // Setup timers to gradually increase visible count
    const timers: NodeJS.Timeout[] = [];
    let cumulativeDelay = 0;
    
    // Only animate new messages
    const startIndex = isInitialLoad ? 0 : visibleCount;
    
    for (let i = startIndex; i < messageCount; i++) {
      // Use custom delay for this message type if provided, otherwise use default
      const messageType = messagesWithIds[i].side;
      const messageDelay = typeDelays[messageType] !== undefined 
        ? typeDelays[messageType] 
        : delay;

      const timer = setTimeout(() => {
        setVisibleCount(i + 1);
      }, cumulativeDelay);

      cumulativeDelay += messageDelay || 0;
      timers.push(timer);
    }

    // Cleanup timers on unmount or when messages change
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [messagesWithIds, delay, typeDelays, animated, prevMessageCount, visibleCount]);

  // Get only the visible messages
  const visibleMessages = messagesWithIds.slice(0, visibleCount);

  // Process visible messages to calculate positions
  const processedMessages = visibleMessages.map((message, index, array) => {
    // Skip position processing for timestamp messages
    if (message.side === "timestamp") {
      return { ...message, position: "single" as MessagePosition };
    }

    // Find adjacent chat messages (excluding timestamps)
    let prevIndex = index - 1;
    while (prevIndex >= 0 && array[prevIndex].side === "timestamp") {
      prevIndex--;
    }
    const prevMessage = prevIndex >= 0 ? array[prevIndex] : null;

    let nextIndex = index + 1;
    while (nextIndex < array.length && array[nextIndex].side === "timestamp") {
      nextIndex++;
    }
    const nextMessage = nextIndex < array.length ? array[nextIndex] : null;

    const isPrevSameSide = prevMessage && prevMessage.side === message.side;
    const isNextSameSide = nextMessage && nextMessage.side === message.side;

    // Determine position in the sequence
    let position: MessagePosition = "single";
    if (!isPrevSameSide && !isNextSameSide) {
      position = "single";
    } else if (!isPrevSameSide) {
      position = "first";
    } else if (!isNextSameSide) {
      position = "last";
    } else {
      position = "middle";
    }

    return { ...message, position };
  });

  return (
    <ChatContainer>
      {processedMessages.map((message) => (
        <ChatMessage
          key={message.id}
          content={message.content}
          side={message.side}
          position={message.position || "single"}
          buttons={message.buttons}
          onButtonClick={onButtonClick}
        />
      ))}
    </ChatContainer>
  );
}
