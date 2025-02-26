'use client';

import { useEffect } from 'react';

export default function VisitLogger() {
    useEffect(() => {
        fetch('/api/log', {
            method: 'POST',
        }).catch(error => {
            console.error('Failed to log visit:', error);
        });
    }, []);

    return null;
} 