"use client";
import {
  ChatMessageData,
  ChatMessageProvider,
} from "@/components/ChatMessage";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

// Extended type to include button options
interface ChatMessageWithButtons extends ChatMessageData {
  buttons?: string[];
  onButtonClick?: (buttonText: string) => void;
}

export default function ChatInteraction() {
  const [messages, setMessages] = useState<ChatMessageWithButtons[]>([]);
  const [referrer, setReferrer] = useState<string | null>(null);
  const router = useRouter();
  
  // Function to handle button clicks - wrapped in useCallback
  const handleButtonClick = useCallback((buttonText: string) => {
    // For navigation buttons, navigate directly without adding response
    if (buttonText === "Contact Me") {
      router.push("/about");
      return;
    }
    
    if (buttonText === "Explore Playground") {
      router.push("/playground");
      return;
    }
    
    // For other buttons, add user selection to chat
    setMessages(prev => {
      // First make a copy of previous messages with buttons removed
      const updatedMessages = prev.map(msg => {
        if (msg.buttons) {
          return { ...msg, buttons: undefined };
        }
        return msg;
      });
      
      // Then add the user's selection as a right message
      return [
        ...updatedMessages,
        { content: buttonText, side: "right" }
      ];
    });
    
    // Add response for "Who are you?" button
    if (buttonText === "Who are you?") {
      setTimeout(() => {
        setMessages(prev => {
          return [
            ...prev,
            { 
              content: "I'm Insung Cho, a creator of this website. I'm passionate about building meaningful experiences and connecting with people. Thanks for visiting my personal site!", 
              side: "left",
              buttons: ["Contact Me", "Explore Playground"]
            }
          ];
        });
      }, 1000);
    }
    if (buttonText === "한국어?") {
        setTimeout(() => {
          setMessages(prev => {
            return [
              ...prev,
              { 
                content: "미안해요. 제 부족함으로 인해 이 웹페이지는 영어만 지원합니다.", 
                side: "left",
                buttons: ["Who are you?", "Contact Me", "Explore Playground"]
              }
            ];
          });
        }, 1000);
      }
    
  }, [router, setMessages]);
  
  // First useEffect to detect referrer from URL hash
  useEffect(() => {
    // Check for hash in URL (e.g., #instagram)
    const hash = window.location.hash.slice(1);
    const referrers: Record<string, string> = {
      i: "Instagram",
      g: "GitHub",
      t: "Telegram",
      d: "Discord",
      // Add more platforms as needed
    };

    if (hash && referrers[hash.toLowerCase()]) {
      setReferrer(referrers[hash.toLowerCase()]);
    }
  }, []); // Run only once on mount
  
  // Second useEffect to initialize messages, dependent on referrer state
  useEffect(() => {
    // Format current time for timestamp
    const now = new Date();
    const formattedTime = now.toLocaleString('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    // Set up initial messages
    const initialMessages: ChatMessageWithButtons[] = [
      { content: formattedTime, side: "timestamp" },
      { content: "Hello there! 👋", side: "left" },
    ];

    // Add referrer message immediately after the greeting if we detected one
    if (referrer) {
      initialMessages.push({
        content: `I see you came from ${referrer}! Thanks for visiting!`,
        side: "left"
      });
    }

    // Continue with the rest of the messages
    initialMessages.push(
      { content: "Hi! 👋", side: "right" },
      { content: "I'm Insung Cho.", side: "left" },
      { 
        content: "Welcome to my personal site! How can I help you today?", 
        side: "left",
        buttons: [
          "Who are you?",
          "Contact Me",
          "Explore Playground",
          "한국어?"
        ],
        onButtonClick: handleButtonClick
      }
    );

    setMessages(initialMessages);
  }, [referrer, handleButtonClick]); // Added handleButtonClick as a dependency

  return (
    <div>
      <ChatMessageProvider
        messages={messages}
        delay={300}
        typeDelays={{
          timestamp: 100,
          left: 500,
          right: 200,
        }}
        animated={true}
        onButtonClick={handleButtonClick}
      />
    </div>
  );
}
