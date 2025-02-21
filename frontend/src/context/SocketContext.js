import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create SocketContext
const SocketContext = createContext();

// Provider to manage the socket connection
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io("http://localhost:5001"); // Update to your backend URL
        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

// Hook to use the socket in components
export const useSocket = () => {
    return useContext(SocketContext);
};
