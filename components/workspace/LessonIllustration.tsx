'use client';

import { useState } from 'react';
import { ArrowDown, ArrowRight, Box, Check, Play, Monitor, RotateCcw, Terminal } from '@/components/ui/icons';
import type { LessonVisual } from '@/lib/lesson-visuals';

export function CafeIllustration({ caption, variant = 'welcome' }: { caption: string; variant?: 'welcome' | 'practice' }) {
  return <figure className="cafe-illustration">
    <svg viewBox="0 0 640 320" role="img" aria-label={variant === 'welcome' ? 'Nara di Kedai Kode, dengan komputer dan pesanan minuman' : 'Meja praktik dengan laptop, catatan, dan secangkir kopi'}>
      <ellipse cx="322" cy="286" rx="255" ry="16" fill="#c4d1f1" opacity=".5" />
      <rect x="62" y="37" width="516" height="239" rx="24" fill="#ffffff" />
      <rect x="84" y="57" width="160" height="116" rx="13" fill="#d5ebff" />
      <path d="M164 58v114M85 115h158" stroke="#ffffff" strokeWidth="8" />
      <circle cx="208" cy="84" r="15" fill="#ffcf59" />
      <path d="M86 154q35-42 73 0t83-7v25H86Z" fill="#a8c9fa" />
      <rect x="267" y="61" width="139" height="38" rx="9" fill="#3456e3" />
      <text x="336" y="85" textAnchor="middle" fill="#ffffff" fontSize="14" fontFamily="sans-serif" fontWeight="700">KEDAI KODE</text>
      <path d="M430 98h113" stroke="#a7b9e3" strokeWidth="6" strokeLinecap="round" />
      {[448, 480, 512].map((x, i) => <g key={x}><rect x={x} y={73 - i * 2} width="20" height={24 + i * 2} rx="4" fill={i === 1 ? '#ff967b' : '#7c9cfa'} /><path d={`M${x + 20} 79q13 0 7 12h-7`} fill="none" stroke={i === 1 ? '#ff967b' : '#7c9cfa'} strokeWidth="4" /></g>)}
      {variant === 'welcome' && <g>
        <path d="M131 238v-30q2-44 46-43 40 1 45 43v30" fill="#5678ec" />
        <path d="M159 176l18 23 17-23 10 62h-53Z" fill="#ffe1a2" />
        <rect x="168" y="150" width="19" height="29" rx="8" fill="#d6a67e" />
        <ellipse cx="178" cy="132" rx="32" ry="38" fill="#e7b98e" />
        <path d="M146 138q-14-62 30-61 44-6 38 56l-10-21q-28 7-42-9l-5 35Z" fill="#283e33" />
        <circle cx="170" cy="133" r="2.6" fill="#283e33" /><circle cx="190" cy="133" r="2.6" fill="#283e33" />
        <path d="M173 147q8 7 15-1" fill="none" stroke="#8c573c" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M141 209q-15 18 18 27M209 204q29-9 38-33" fill="none" stroke="#e7b98e" strokeWidth="15" strokeLinecap="round" />
        <path d="M246 173l-2-16m4 14 8-10" stroke="#e7b98e" strokeWidth="8" strokeLinecap="round" />
      </g>}
      <rect x="89" y="237" width="462" height="15" rx="6" fill="#b58a62" />
      <path d="M105 252h430v28H105Z" fill="#dfbe95" />
      <g transform={variant === 'practice' ? 'translate(-55, 0)' : undefined}>
        <rect x="296" y="121" width="176" height="112" rx="11" fill="#354c86" />
        <rect x="306" y="131" width="156" height="88" rx="5" fill="#182848" />
        <circle cx="318" cy="141" r="2" fill="#ffcc63" /><circle cx="326" cy="141" r="2" fill="#ff957e" />
        <path d="M324 163l10 8-10 8m20 0h14" fill="none" stroke="#a8c5ff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M324 195h74m-74 8h48" stroke="#8aa7df" strokeWidth="4" strokeLinecap="round" />
        <path d="M284 233h201l-12 9H295Z" fill="#839bd3" />
      </g>
      {variant === 'practice' && <g transform="rotate(-9 174 202)"><rect x="125" y="169" width="80" height="61" rx="5" fill="#f1dc9e" /><path d="M140 183h47m-47 11h37m-37 11h24" stroke="#ac925c" strokeWidth="3" strokeLinecap="round" /></g>}
      <rect x="489" y="206" width="31" height="30" rx="7" fill="#f28469" /><path d="M520 212q22 0 10 16h-10" stroke="#f28469" strokeWidth="6" fill="none" />
      <path d="M498 195q-6-6 0-12m11 12q-6-6 0-12" fill="none" stroke="#a8b6d2" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="54" y="219" width="26" height="47" rx="6" fill="#cfaa7b" /><path d="M67 220v-44m0 26q-25-7-17-27 20 3 17 27m0-10q27-8 18-27-20 9-18 27" fill="#769e76" stroke="#769e76" strokeWidth="3" />
      <g transform="translate(394 14)"><rect width="180" height="47" rx="13" fill="white" stroke="#d7e0f5" /><path d="M25 47v12l14-12" fill="white" stroke="#d7e0f5" /><text x="90" y="29" textAnchor="middle" fill="#344b7b" fontSize="13" fontWeight="600" fontFamily="sans-serif">{variant === 'welcome' ? 'Kita coba bareng, yuk.' : 'Sekarang, giliranmu.'}</text></g>
    </svg>
    <figcaption><span className="illustration-avatar">N</span><span>{caption}</span></figcaption>
  </figure>;
}

export function ConceptIllustration({ visual }: { visual: LessonVisual }) {
  const [active, setActive] = useState(0);
  return <figure className={`concept-illustration concept-${visual.kind}`}>
    <div className="concept-topline"><span>PETA KONSEP</span><span>Klik bagian untuk melihat penjelasan</span></div>
    {visual.kind === 'divide' && <div className="cookie-groups" aria-label="Tiga kelompok berisi lima kue, dengan dua kue tersisa">{[5, 5, 5, 2].map((count, index) => <div key={index} className={index === 3 ? 'cookie-remainder' : ''}>{Array.from({ length: count }, (_, i) => <i key={i} />)}</div>)}</div>}
    <div className="concept-nodes">{visual.steps.map((step, i) => <div className="concept-node-wrap" key={step.label}><button className={`concept-node ${i === active ? 'is-active' : ''}`} onClick={() => setActive(i)} aria-pressed={i === active}><span className="concept-node-icon">{visual.kind === 'list' ? <span>{i}</span> : visual.kind === 'types' ? <span>{['Aa', '12', '.5', '✓'][i]}</span> : i === 0 ? <Box size={24} /> : i === visual.steps.length - 1 ? <Monitor size={24} /> : <Terminal size={24} />}</span><span className="concept-node-label">{step.label}</span><strong>{step.value}</strong></button>{i < visual.steps.length - 1 && <ArrowRight className="concept-arrow" size={20} aria-hidden="true" />}</div>)}</div>
    {visual.kind === 'loop' && <div className="loop-return"><RotateCcw size={16} /><span>Ulangi untuk kondisi atau item berikutnya.</span></div>}
    {visual.kind === 'branch' && <div className="branch-note"><ArrowDown size={15} /> Pilih salah satu cabang, sesuai hasil kondisi.</div>}
    <figcaption className="concept-caption" aria-live="polite"><span>{String(active + 1).padStart(2, '0')}</span><p>{visual.steps[active].note}</p><button onClick={() => setActive((active + 1) % visual.steps.length)} aria-label="Lihat bagian konsep berikutnya"><ArrowRight size={17} /></button></figcaption>
  </figure>;
}

export function MissionIllustration() {
  return <div className="mission-visual" aria-label="Alur praktik: tulis kode, jalankan, lalu periksa"><span><Terminal size={27} /><small>Tulis</small></span><ArrowRight size={19} /><span><Play size={27} /><small>Coba</small></span><ArrowRight size={19} /><span><Check size={27} /><small>Periksa</small></span></div>;
}
