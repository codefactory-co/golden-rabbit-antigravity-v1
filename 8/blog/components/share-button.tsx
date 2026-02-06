'use client';

import { Share2, Check } from 'lucide-react';
import { useState } from 'react';

export default function ShareButton() {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E293B] hover:bg-[#334155] text-gray-300 hover:text-white transition-colors text-sm font-medium"
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span>복사됨!</span>
                </>
            ) : (
                <>
                    <Share2 className="w-4 h-4" />
                    <span>공유하기</span>
                </>
            )}
        </button>
    );
}
