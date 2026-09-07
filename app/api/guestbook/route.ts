import { NextResponse } from 'next/server';

// In-memory store — works great on Vercel serverless with warm instances.
// For full persistence across cold starts, connect a Postgres/Supabase/PlanetScale DB
// and replace the array operations with database queries.
const notes: Note[] = [
    {
        id: 1,
        name: 'Umesh',
        message: 'Welcome to my guestbook! Leave a note — I read every one. 👋',
        created_at: '2026-09-01T10:00:00.000Z',
    },
];

type Note = {
    id: number;
    name: string;
    message: string;
    created_at: string;
};

export async function GET() {
    try {
        // Return newest first, limit to 30
        const sorted = [...notes].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ).slice(0, 30);
        return NextResponse.json(sorted);
    } catch (err) {
        console.error('Guestbook GET error:', err);
        return NextResponse.json({ error: 'Failed to load notes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, message } = body;

        if (!message || typeof message !== 'string' || !message.trim()) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const sanitizedName = (name && typeof name === 'string' ? name.trim() : 'Anonymous').slice(0, 20) || 'Anonymous';
        const sanitizedMessage = message.trim().slice(0, 120);

        const newNote: Note = {
            id: Date.now(),
            name: sanitizedName,
            message: sanitizedMessage,
            created_at: new Date().toISOString(),
        };

        notes.push(newNote);

        return NextResponse.json(newNote, { status: 201 });
    } catch (err) {
        console.error('Guestbook POST error:', err);
        return NextResponse.json({ error: 'Failed to post note' }, { status: 500 });
    }
}
