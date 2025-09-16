import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../context/SocketContext.jsx';
import { useAuth } from '../../context/AuthContext';
import { getIssueMessages } from '../../services/chat';

/**
 * IssueChatPanel
 * Props: issueId (canonical or duplicate id)
 * Behavior:
 *  - Fetch initial messages (paged) via REST
 *  - Append real-time messages from SocketContext.liveMessages
 *  - Provide message input if user has consent OR is government
 *  - Show consent pending UI if consentStatus null
 */
export default function IssueChatPanel({ issueId, assumeReporter = true }) {
  const { user } = useAuth();
  const { liveMessages, consentStatus, sendChatMessage } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [input, setInput] = useState('');
  const listRef = useRef(null);

  const isGov = user?.role === 'government';
  const consent = consentStatus?.[issueId]; // true | false | null | undefined

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!issueId) return;
      setLoading(true);
      const res = await getIssueMessages(issueId, { page: 1 });
      if (cancelled) return;
      if (res.success) {
        setMessages(res.data);
        setHasMore(res.pagination?.page < res.pagination?.totalPages);
      } else {
        setError(res.error);
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [issueId]);

  // Merge in live messages
  useEffect(() => {
    if (!issueId) return;
    const live = liveMessages[issueId];
    if (live && live.length) {
      // Deduplicate by _id
      setMessages(prev => {
        const existingIds = new Set(prev.map(m => m._id));
        const toAdd = live.filter(m => !existingIds.has(m._id));
        if (!toAdd.length) return prev;
        return [...prev, ...toAdd].sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
      });
    }
  }, [liveMessages, issueId]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    const next = page + 1;
    setLoading(true);
    const res = await getIssueMessages(issueId, { page: next });
    if (res.success) {
      setMessages(prev => [...res.data, ...prev]); // prepend older
      setPage(next);
      setHasMore(res.pagination?.page < res.pagination?.totalPages);
    }
    setLoading(false);
  };

  // Permission logic:
  // - Government always allowed
  // - consent === true allowed
  // - If reporter (heuristic: assumeReporter && consent === undefined) allow (issue before any merge)
  const canChat = isGov || consent === true || (assumeReporter && consent === undefined);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      await sendChatMessage(issueId, input.trim());
      setInput('');
    } catch (e) {
      console.error('[IssueChatPanel] send failed', e);
    }
  };

  if (!issueId) return null;

  return (
    <div className="issue-chat-panel" style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: 8, marginTop: '1rem' }}>
      <h3 style={{ marginTop: 0 }}>Issue Discussion</h3>
      {consent === false && !isGov && (
        <div style={{ color: '#b00', marginBottom: '0.75rem' }}>You declined consent. You can still view updates but cannot participate.</div>
      )}
      {consent === null && !isGov && (
        <div style={{ color: '#b8860b', marginBottom: '0.75rem' }}>Consent pending. Accept to participate once the prompt appears.</div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div style={{ maxHeight: 300, overflow: 'auto', background: '#fafafa', padding: '0.5rem', border: '1px solid #eee', borderRadius: 4 }} ref={listRef}>
        {loading && !messages.length && <div>Loading messages...</div>}
        {hasMore && !loading && (
          <button onClick={loadMore} style={{ marginBottom: '0.5rem' }}>Load older</button>
        )}
        {messages.map(m => (
          <div key={m._id} style={{ marginBottom: '0.5rem' }}>
            <strong>{m.author?.name || 'User'}{m.author?.role === 'government' ? ' (Gov)' : ''}:</strong> {m.message}
            <div style={{ fontSize: 10, color: '#777' }}>{new Date(m.createdAt).toLocaleString()}</div>
          </div>
        ))}
        {!messages.length && !loading && <div>No messages yet.</div>}
      </div>
      <form onSubmit={handleSend} style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={canChat ? 'Type a message...' : (consent === false ? 'Consent declined' : 'Consent required to chat')}
          disabled={!canChat}
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={!canChat || !input.trim()}>Send</button>
      </form>
    </div>
  );
}
