import { useEffect, useRef, useState } from 'react';

interface UseTypingIndicatorProps {
  roomId: string;
  currentUserId: string;
  currentUsername?: string;
}

// Demo mode - works without Socket.IO server
const DEMO_MODE = true;

export const useTypingIndicator = ({ roomId, currentUserId, currentUsername }: UseTypingIndicatorProps) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUserTypingRef = useRef(false);
  const [isSocketConnected, setIsSocketConnected] = useState(DEMO_MODE);

  // Demo mode simulation - no real Socket.IO connection
  useEffect(() => {
    if (DEMO_MODE) {
      console.log('Running in demo mode - typing indicators work locally only');
      setIsSocketConnected(true);
      
      // Simulate other users typing occasionally for demo purposes
      const demoInterval = setInterval(() => {
        if (Math.random() > 0.95) { // 5% chance every second
          const demoUsers = ['Alice', 'Bob', 'Charlie'];
          const randomUser = demoUsers[Math.floor(Math.random() * demoUsers.length)];
          
          setTypingUsers(prev => {
            if (!prev.includes(randomUser)) {
              return [...prev, randomUser];
            }
            return prev;
          });
          
          // Stop demo typing after 2-3 seconds
          setTimeout(() => {
            setTypingUsers(prev => prev.filter(user => user !== randomUser));
          }, 2000 + Math.random() * 1000);
        }
      }, 1000);
      
      return () => {
        clearInterval(demoInterval);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }
    
    // Real Socket.IO implementation would go here when DEMO_MODE is false
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [roomId, currentUserId]);

  // Start typing indicator
  const startTyping = () => {
    if (!isSocketConnected) {
      return;
    }

    // If user is not already marked as typing
    if (!isUserTypingRef.current) {
      isUserTypingRef.current = true;
      
      if (DEMO_MODE) {
        // In demo mode, just log the action
        console.log('User started typing (demo mode)');
      } else {
        // Real Socket.IO emit would go here
        // socket.emit('typing_start', { ... });
      }
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  };

  // Stop typing indicator
  const stopTyping = () => {
    if (isSocketConnected && isUserTypingRef.current) {
      isUserTypingRef.current = false;
      
      if (DEMO_MODE) {
        // In demo mode, just log the action
        console.log('User stopped typing (demo mode)');
      } else {
        // Real Socket.IO emit would go here
        // socket.emit('typing_stop', { ... });
      }
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  // Format typing message
  const getTypingMessage = () => {
    if (typingUsers.length === 0) return '';
    if (typingUsers.length === 1) return `${typingUsers[0]} yazıyor...`;
    if (typingUsers.length === 2) return `${typingUsers[0]} ve ${typingUsers[1]} yazıyor...`;
    return `${typingUsers[0]} ve ${typingUsers.length - 1} kişi daha yazıyor...`;
  };

  return {
    typingUsers,
    isAnyoneTyping: typingUsers.length > 0,
    isSocketConnected,
    startTyping,
    stopTyping,
    getTypingMessage
  };
};