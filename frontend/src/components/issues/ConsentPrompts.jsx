import React from 'react';
import { useSocket } from '../../context/SocketContext.jsx';

/**
 * Global consent prompt list.
 * Renders small toasts for each pending consent request.
 */
export default function ConsentPrompts() {
  const ctx = useSocket() || {};
  const pendingConsentRequests = ctx.pendingConsentRequests || [];
  const respondToConsent = ctx.respondToConsent || (() => {});

  if (!pendingConsentRequests.length) return null;

  return (
    <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 2000, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {pendingConsentRequests.map(issueId => (
        <div key={issueId} style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 8, padding: '0.75rem 0.9rem', width: 280, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Join Merged Issue Chat?</div>
          <div style={{ fontSize: 13, lineHeight: 1.3, marginBottom: 8 }}>Your reported issue was merged. Accept to participate in the shared discussion.</div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button onClick={() => respondToConsent(issueId, false)} style={{ background: '#eee', border: '1px solid #bbb', padding: '4px 10px', cursor: 'pointer' }}>Decline</button>
            <button onClick={() => respondToConsent(issueId, true)} style={{ background: '#0b6', color: '#fff', border: '1px solid #0a5', padding: '4px 10px', cursor: 'pointer' }}>Accept</button>
          </div>
        </div>
      ))}
    </div>
  );
}
