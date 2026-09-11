'use client';

import { Check, DoorOpen, LoaderCircle, RefreshCw, TriangleAlert } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type TriggerState = 'loading' | 'success' | 'error';

export default function Home() {
  const [state, setState] = useState<TriggerState>('loading');
  const [message, setMessage] = useState('Connecting to the door…');
  const hasTriggered = useRef(false);

  const triggerDoor = useCallback(async () => {
    setState('loading');
    setMessage('Connecting to the door…');
    try {
      const response = await fetch('/api/trigger', { method: 'POST' });
      const body = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(body.message || 'The door could not be opened.');
      setState('success');
      setMessage('You can enter now.');
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong while opening the door.');
    }
  }, []);

  useEffect(() => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;
    void triggerDoor();
  }, [triggerDoor]);

  return (
    <main className={`door-page is-${state}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className="status-card" aria-live="polite" aria-busy={state === 'loading'}>
        <div className="brand-mark" aria-label="Allocate Space"><span>ALLOCATE</span><span>SPACE</span></div>
        <div className="icon-stage" aria-hidden="true">
          <div className="status-icon">
            {state === 'loading' && <LoaderCircle className="spin" strokeWidth={1.8} />}
            {state === 'success' && <DoorOpen strokeWidth={1.65} />}
            {state === 'error' && <TriangleAlert strokeWidth={1.7} />}
          </div>
          {state === 'success' && <span className="check-badge"><Check size={17} strokeWidth={3} /></span>}
        </div>
        <p className="eyebrow">
          {state === 'loading' && 'Access request in progress'}
          {state === 'success' && 'Access granted'}
          {state === 'error' && 'Access interrupted'}
        </p>
        <h1>
          {state === 'loading' && 'Opening the door'}
          {state === 'success' && 'The door is open'}
          {state === 'error' && 'Unable to open the door'}
        </h1>
        <p className="status-message">{message}</p>
        {state === 'loading' && <div className="progress-track" aria-hidden="true"><span /></div>}
        {state === 'error' && (
          <button className="retry-button" type="button" onClick={() => void triggerDoor()}>
            <RefreshCw size={18} /> Try again
          </button>
        )}
        <p className="support-note">
          {state === 'success' ? 'The door may take a moment to release.' : state === 'error' ? 'Please try again or contact a member of the event team.' : 'Please keep this page open.'}
        </p>
      </section>
    </main>
  );
}
