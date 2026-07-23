'use client';

import { useEffect, useState, useCallback } from 'react';
import { showToast } from './Toast';

type Note = {
    id: number;
    name: string;
    message: string;
    created_at: string;
};

export default function Guestbook() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchNotes = useCallback(async () => {
        try {
            const response = await fetch('/api/guestbook');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            if (Array.isArray(data)) {
                setNotes(data);
            }
        } catch (err) {
            console.error('Error fetching guestbook:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNotes();
    }, [fetchNotes]);

    const handleSubmit = async () => {
        const msg = message.trim();
        if (!msg || isSubmitting) return;
        const submitName = name.trim() || 'Anonymous';

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/guestbook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: submitName, message: msg }),
            });

            if (response.ok) {
                setMessage('');
                setName('');
                showToast('Note posted!');
                fetchNotes();
            } else {
                showToast('Error posting note.');
            }
        } catch (err) {
            console.error('Error posting note:', err);
            showToast('Error posting note.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="guestbook" id="guestbook">
            <div className="wrap">
                <div className="eyebrow reveal">leave a mark</div>
                <h2 className="reveal">Guestbook</h2>
                <p className="section-sub reveal">Leave a sticky note. It&apos;ll stay for everyone to see.</p>

                <div className="guestbook-container reveal">
                    <div className="guestbook-board" id="guestbookBoard">
                        {isLoading ? (
                            <p style={{ color: 'var(--ink-soft)', width: '100%' }}>Loading notes...</p>
                        ) : notes.length === 0 ? (
                            <p style={{ color: 'var(--ink-soft)', width: '100%' }}>No notes yet. Be the first!</p>
                        ) : (
                            notes.map((note, idx) => {
                                const rot = ((idx % 6) - 3).toFixed(1);
                                const d = new Date(note.created_at).toLocaleDateString();
                                return (
                                    <div key={note.id || idx} className="sticky-note" style={{ transform: `rotate(${rot}deg)` }}>
                                        <div>{note.message}</div>
                                        <div>
                                            <div className="sticky-author">- {note.name || 'Anonymous'}</div>
                                            <div className="sticky-date">{d}</div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className="guestbook-form">
                        <h3>Write a note</h3>
                        <input 
                            type="text" 
                            id="gbName" 
                            placeholder="Your name (optional)" 
                            maxLength={20} 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <textarea 
                            id="gbMessage" 
                            placeholder="Write a nice message..." 
                            maxLength={120} 
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                        <button 
                            className="btn btn-primary" 
                            id="gbSubmit" 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Posting...' : 'Stick Note'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
