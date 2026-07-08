import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3000/attendance';
console.log(import.meta.env.VITE_SOCKET_URL);

export function useSocket(sessionId: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentQrToken, setCurrentQrToken] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });
    
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join_session', { sessionId, interval: 5000 });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('qr_updated', (data: { qrCode: string }) => {
      setCurrentQrToken(data.qrCode);
    });

    socket.on("connect_error", (err) => {
      console.error(err);
    });

    return () => {
      if (socket) {
        socket.emit('leave_session', { sessionId });
        socket.disconnect();
      }
      setIsConnected(false);
      setCurrentQrToken(null);
    };
  }, [sessionId]);

  return {
    socket: socketRef.current,
    isConnected,
    currentQrToken,
  };
}