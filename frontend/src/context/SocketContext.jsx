import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

/**
 * SocketContext
 * Responsibilities:
 *  - Establish authenticated socket.io connection using current user id (if logged in)
 *  - Expose connection status
 *  - Provide helpers: respondToConsent, sendChatMessage, joinIssueRoom (future), leaveIssueRoom (future)
 *  - Maintain in-memory lists of:
 *      * pendingConsentRequests: issueIds awaiting user action
 *      * consentStatus: { [issueId]: true|false|null }
 *      * liveMessages: { [issueId]: message[] } (recent buffer)
 *  - Emit debug logs to console for lifecycle + events
 *
 * Quick Dev Usage:
 *  import { useSocket } from '.../SocketContext';
 *  const { pendingConsentRequests, consentStatus, liveMessages, sendChatMessage, respondToConsent } = useSocket();
 *
 *  <IssueChatPanel issueId={someId} /> will auto-merge historical + live messages.
 */

const defaultSocketContext = {
  socket: null,
  connected: false,
  pendingConsentRequests: [],
  consentStatus: {},
  liveMessages: {},
  respondToConsent: () => Promise.resolve({ success: false, error: 'socket not ready' }),
  sendChatMessage: () => Promise.reject(new Error('socket not ready'))
};
const SocketContext = createContext(defaultSocketContext);

export const SocketProvider = ({ children }) => {
  // Auth context currently exposes user but not token; derive from storage
  const { user } = useAuth();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [pendingConsentRequests, setPendingConsentRequests] = useState([]); // list of issueIds
  const [consentStatus, setConsentStatus] = useState({});
  const [liveMessages, setLiveMessages] = useState({});
  const reconnectTimer = useRef(null);

  const apiBase = import.meta.env.VITE_API_URL || '/api';
  const socketBase = apiBase.replace(/\/api$/, '');

  const connect = useCallback(() => {
    if (!user || !token) {
      console.log('[Socket] No user/token -> skipping connect', { hasUser: !!user, hasToken: !!token });
      return;
    }
    if (socketRef.current) {
      try { socketRef.current.disconnect(); } catch (_) {}
    }
    console.log('[Socket] Connecting to', socketBase, 'as user', user?.id);
    const sock = io(socketBase, {
      transports: ['websocket'],
      auth: { userId: user.id, token },
      query: { userId: user.id }, // redundancy for backend code that checks query
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    socketRef.current = sock;

    sock.on('connect', () => {
      console.log('[Socket] CONNECTED id=', sock.id);
      setConnected(true);
      // registerUser fallback if server didn't catch auth (defense-in-depth)
      sock.emit('registerUser', user.id);
    });

    sock.on('disconnect', (reason) => {
      console.log('[Socket] DISCONNECTED reason=', reason);
      setConnected(false);
    });

    sock.on('connect_error', (err) => {
      console.warn('[Socket] connect_error', err.message);
    });

    // Consent request from backend when an issue you created merged into another
    sock.on('issueConsentRequest', (payload) => {
      console.log('[Socket] issueConsentRequest payload=', payload);
      if (!payload?.issueId) return;
      setPendingConsentRequests(prev => prev.includes(payload.issueId) ? prev : [...prev, payload.issueId]);
      setConsentStatus(prev => ({ ...prev, [payload.issueId]: null }));
    });

    // Consent updated after responding
    sock.on('issueConsentUpdated', ({ issueId, consent }) => {
      console.log('[Socket] issueConsentUpdated issue=', issueId, 'consent=', consent);
      setPendingConsentRequests(prev => prev.filter(id => id !== issueId));
      setConsentStatus(prev => ({ ...prev, [issueId]: consent }));
    });

    // Live chat message event
    sock.on('issueChatMessage', ({ issueId, message }) => {
      if (!issueId || !message) return;
      setLiveMessages(prev => {
        const list = prev[issueId] ? [...prev[issueId]] : [];
        list.push(message);
        // keep only last 100 messages client-side per issue to bound memory
        const trimmed = list.slice(-100);
        return { ...prev, [issueId]: trimmed };
      });
    });
  }, [user, token, socketBase]);

  // Reconnect when auth changes
  useEffect(() => {
    if (user && token) {
      connect();
    } else if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setConnected(false);
      setPendingConsentRequests([]);
      setConsentStatus({});
      setLiveMessages({});
    }
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [user, token, connect]);

  const respondToConsent = async (issueId, accept) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch(`${apiBase}/issues/${issueId}/consent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ accept })
      });
      const data = await res.json();
      if (!res.ok) {
        console.warn('[Socket] respondToConsent failed', data);
        return { success: false, error: data.error || 'Failed' };
      }
      // Server will emit issueConsentUpdated; optimistic update:
      setConsentStatus(prev => ({ ...prev, [issueId]: accept }));
      setPendingConsentRequests(prev => prev.filter(id => id !== issueId));
      return { success: true };
    } catch (e) {
      console.error('[Socket] respondToConsent error', e);
      return { success: false, error: e.message };
    }
  };

  const sendChatMessage = (issueId, text) => {
    // We post via REST so backend does auth + permission + canonical resolution
    // (Socket emit is only for receiving new messages broadcast by server)
    return fetch(`${apiBase}/issues/${issueId}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message: text })
    }).then(async res => {
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed to send');
      return body.data;
    });
  };

  const value = {
    socket: socketRef.current,
    connected,
    pendingConsentRequests,
    consentStatus,
    liveMessages,
    respondToConsent,
    sendChatMessage
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
