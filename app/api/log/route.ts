import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK;

export async function POST() {
    try {
        const headersList = await headers();
        const referer = headersList.get('referer') || 'Direct visit';
        const userAgent = (headersList).get('user-agent') || 'Unknown';

        if (!DISCORD_WEBHOOK_URL) {
            console.error('Discord webhook URL not configured');
            return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
        }

        const message = {
            content: '🌐 New Visit Detected!',
            embeds: [{
                title: 'Visit Log',
                color: 0x00ff00,
                fields: [
                    {
                        name: 'Referer',
                        value: referer,
                        inline: true
                    },
                    {
                        name: 'User Agent',
                        value: userAgent,
                        inline: true
                    },
                    {
                        name: 'Timestamp',
                        value: new Date().toISOString(),
                        inline: false
                    }
                ]
            }]
        };

        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        if (!response.ok) {
            throw new Error(`Discord webhook failed: ${response.statusText}`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending to Discord:', error);
        return NextResponse.json({ error: 'Failed to log visit' }, { status: 500 });
    }
} 