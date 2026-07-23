import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://uocjyrybdcnhlnpfdcsz.supabase.co/rest/v1/guestbook_notes';
const SUPABASE_KEY = 'sb_publishable_nk6XHTfB1goeHLmAqv5LHA_WQtf1J7E';

export async function GET() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}?select=*&order=created_at.desc&limit=20`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                },
                // Revalidate every 10 seconds on the server side
                next: { revalidate: 10 },
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Supabase fetch error:', response.status, errorText);
            return NextResponse.json(
                { error: 'Failed to fetch notes' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error('Guestbook GET error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, message } = body;

        if (!message || typeof message !== 'string' || !message.trim()) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        const sanitizedName = (name && typeof name === 'string' ? name.trim() : 'Anonymous').slice(0, 20);
        const sanitizedMessage = message.trim().slice(0, 120);

        const response = await fetch(SUPABASE_URL, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation',
            },
            body: JSON.stringify({
                name: sanitizedName,
                message: sanitizedMessage,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Supabase post error:', response.status, errorText);
            return NextResponse.json(
                { error: 'Failed to post note' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error('Guestbook POST error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
