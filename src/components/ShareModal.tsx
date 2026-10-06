'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Share2, Sparkles } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MARKA_SHARE_TEMPLATES = {
  viral: `Stop wrestling with laggy markdown and mermaid editors! 🚀

Check out Marka: a modern, 100% FREE live Markdown + HTML component + Mermaid studio:
✨ Debounced real-time Mermaid diagrams (20+ types)
✨ Bidirectional Markdown ↔ Tailwind UI card transpiler
✨ Dual-pane synchronized scrolling & document library
✨ Zero sign-up, zero ads, runs in your browser

Try it free 👉 https://majortank.space/marka

#markdown #mermaidjs #webdev #frontend #devtools #opensource`,

  architecture: `Need to document system architectures or sequence flows quickly? 📊

Marka is a 100% free live studio with first-class Mermaid support:
🔹 Flowcharts, Sequence, State, Class, ERD, ZenUML & 15+ more diagrams
🔹 Live syntax validation with zero UI locking
🔹 Instant export to Markdown, standalone HTML & print-to-PDF
🔹 No login, no telemetry, all features unlocked:

Try it here 👉 https://majortank.space/marka

#mermaid #softwarearchitecture #sysadmin #devops #documentation`,

  component: `1-click convert between Markdown docs and interactive Tailwind UI component cards! ⚡

Marka is a lightning-fast playground built with Next.js 15 & React 19:
⚡ Live sandboxed iframe preview (Desktop, Tablet, Mobile)
⚡ Instant AST parsing sanitized with DOMPurify
⚡ 100% Free with offline localStorage persistence

Free studio 👉 https://majortank.space/marka

#tailwindcss #reactjs #nextjs #javascript #webdevelopment`
};

type ShareAngle = 'viral' | 'architecture' | 'component';

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [activeAngle, setActiveAngle] = useState<ShareAngle>('viral');
  const [postContent, setPostContent] = useState<string>(MARKA_SHARE_TEMPLATES.viral);
  const [isEdited, setIsEdited] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPost, setCopiedPost] = useState(false);

  const shareUrl = 'https://majortank.space/marka';

  useEffect(() => {
    if (!isEdited) {
      setPostContent(MARKA_SHARE_TEMPLATES[activeAngle]);
    }
  }, [activeAngle, isEdited]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAngleSelect = (angle: ShareAngle) => {
    setActiveAngle(angle);
    setPostContent(MARKA_SHARE_TEMPLATES[angle]);
    setIsEdited(false);
  };

  const handleShareX = () => {
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(postContent)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer,width=600,height=520');
  };

  const handleShareLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer,width=620,height=600');
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(postContent)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareReddit = () => {
    const title = 'Marka — 100% Free Live Markdown, HTML Component & Mermaid Studio (Next.js 15, No login)';
    const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`;
    window.open(redditUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(postContent)}`;
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Marka — 100% Free Markdown & Mermaid Studio',
          text: postContent,
          url: shareUrl,
        });
        return;
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          console.warn('Native share failed', e);
        }
      }
    }
    handleCopyLink();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {
      console.error('Failed to copy share link', e);
    }
  };

  const handleCopyPost = async () => {
    try {
      await navigator.clipboard.writeText(postContent);
      setCopiedPost(true);
      setTimeout(() => setCopiedPost(false), 2000);
    } catch (e) {
      console.error('Failed to copy post', e);
    }
  };

  const charCount = postContent.length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Share2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Share Marka Studio</h3>
                <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                  100% Free
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Spread the word • Live Markdown, Mermaid &amp; Tailwind UI Studio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Highlight Banner */}
          <div className="bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-emerald-500/10 border border-sky-500/30 rounded-xl p-3 sm:p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] uppercase tracking-wide">
              <Sparkles size={13} />
              <span>100% Free Developer Studio Forever</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
              No subscription paywalls, no login walls, no ads. 20+ real-time Mermaid diagrams, dual-pane synchronized scrolling, and 1-click Markdown ↔ Tailwind UI component transformation.
            </p>
          </div>

          {/* Social Platforms Quick Share */}
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-2">
              Quick Share to Social Platforms
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {/* X / Twitter (Primary) */}
              <button
                type="button"
                onClick={handleShareX}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-black hover:bg-zinc-900 border border-zinc-800 text-white font-medium transition group shadow-sm"
              >
                <div className="w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <div className="text-left overflow-hidden">
                  <div className="font-bold leading-tight">Post on X</div>
                  <div className="text-[10px] text-zinc-400 truncate">Viral Dev Hook</div>
                </div>
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                onClick={handleShareLinkedIn}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium transition"
              >
                <div className="w-6 h-6 rounded-md bg-[#0a66c2] text-white flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 1.64-1.64A1.64 1.64 0 0 0 6.46 5.5a1.64 1.64 0 0 0-1.64 1.62c0 .91.73 1.64 1.64 1.64m1.39 9.74v-8.37H5.07v8.37h2.78z" />
                  </svg>
                </div>
                <div className="text-left overflow-hidden">
                  <div className="font-bold leading-tight">LinkedIn</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Dev Network</div>
                </div>
              </button>

              {/* WhatsApp */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium transition"
              >
                <div className="w-6 h-6 rounded-md bg-[#25d366] text-white flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m-3.53 4.2c-.19 0-.52.07-.79.37-.27.29-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.19 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.08-.13-.27-.2-.57-.35-.29-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.29-.77.97-.95 1.17-.17.19-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.29-.02-.45.13-.6.13-.13.3-.34.45-.51.15-.17.2-.29.3-.49.1-.19.05-.37-.02-.52-.08-.14-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51z" />
                  </svg>
                </div>
                <div className="text-left overflow-hidden">
                  <div className="font-bold leading-tight">WhatsApp</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Send to Devs</div>
                </div>
              </button>

              {/* Reddit */}
              <button
                type="button"
                onClick={handleShareReddit}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium transition"
              >
                <div className="w-6 h-6 rounded-md bg-[#ff4500] text-white flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm5.01 4.744c.688 0 1.25.56 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 14c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-4.466 3.99a.327.327 0 0 0-.231.096.33.33 0 0 0 0 .466c.712.71 1.83.743 2.946.002a.332.332 0 0 0 .09-.465.33.33 0 0 0-.465-.09c-.77.51-1.63.468-2.11-.009a.326.326 0 0 0-.23-.09z" />
                  </svg>
                </div>
                <div className="text-left overflow-hidden">
                  <div className="font-bold leading-tight">Reddit</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">r/webdev</div>
                </div>
              </button>

              {/* Telegram */}
              <button
                type="button"
                onClick={handleShareTelegram}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium transition"
              >
                <div className="w-6 h-6 rounded-md bg-[#229ed9] text-white flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.674c.458 0 .66-.21.916-.457l2.199-2.138 4.574 3.379c.843.464 1.45.225 1.66-.785l2.997-14.125c.307-1.23-.467-1.786-1.21-1.445z" />
                  </svg>
                </div>
                <div className="text-left overflow-hidden">
                  <div className="font-bold leading-tight">Telegram</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Dev Channels</div>
                </div>
              </button>

              {/* Device Share */}
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium transition"
              >
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-sky-500 to-indigo-500 text-white flex items-center justify-center shrink-0">
                  <Share2 size={13} />
                </div>
                <div className="text-left overflow-hidden">
                  <div className="font-bold leading-tight">Device Share</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Any App</div>
                </div>
              </button>
            </div>
          </div>

          {/* Marketing Angle Tabs & Editable Post */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
                Catchy Pitch Angles (Editable)
              </span>
              <span className={`text-[11px] font-mono ${charCount > 280 ? 'text-amber-500 dark:text-amber-400 font-bold' : 'text-slate-400'}`}>
                {charCount} chars
              </span>
            </div>

            <div className="flex gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => handleAngleSelect('viral')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  activeAngle === 'viral'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                🚀 Viral / 100% Free
              </button>
              <button
                type="button"
                onClick={() => handleAngleSelect('architecture')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  activeAngle === 'architecture'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                📊 Mermaid &amp; Architecture
              </button>
              <button
                type="button"
                onClick={() => handleAngleSelect('component')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  activeAngle === 'component'
                    ? 'bg-sky-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                ⚡ Tailwind UI Transpiler
              </button>
            </div>

            <div className="relative">
              <textarea
                value={postContent}
                onChange={(e) => {
                  setPostContent(e.target.value);
                  setIsEdited(true);
                }}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs leading-relaxed text-slate-900 dark:text-slate-100 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 min-h-[120px] resize-y font-sans"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleShareX}
                className="flex-1 py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>Post on X</span>
              </button>
              <button
                type="button"
                onClick={handleCopyPost}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition active:scale-98"
              >
                {copiedPost ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{copiedPost ? 'Copied Post!' : 'Copy Text'}</span>
              </button>
            </div>
          </div>

          {/* Direct Link Copy */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400">
              Studio Direct Link
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 dark:text-slate-400 outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition active:scale-98"
              >
                {copiedLink ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
