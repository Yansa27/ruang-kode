'use client';

import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowRight, BookOpen, Check, Code2, Lightbulb } from 'lucide-react';
import { lessonStories, splitLessonContent } from '@/lib/lesson-stories';

interface LessonStoryProps {
  lesson: { slug: string; title: string; description: string; content: string; learningObjectives: string[]; exercise?: { title: string; description: string } | null };
  onPractice: () => void;
  courseSlug: string;
}

export default function LessonStory({ lesson, onPractice, courseSlug }: LessonStoryProps) {
  const story = courseSlug === 'python-fundamental' ? lessonStories[lesson.slug] : undefined;
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const scrollArea = useRef<HTMLDivElement>(null);
  const material = story ? [] : splitLessonContent(lesson.content);
  const steps = story ? ['Cerita', 'Konsep', 'Contoh', 'Cek pemahaman', 'Misi kamu'] : ['Mulai', ...material.map((_, i) => `Konsep ${i + 1}`), 'Misi kamu'];
  const last = index === steps.length - 1;
  const title = story ? [story.title, 'Kenali alat yang kamu butuhkan', 'Lihat bagaimana ceritanya menjadi kode', 'Berhenti sebentar. Sudah terbayang?', 'Sekarang, giliranmu mencoba.'][index] : index === 0 ? lesson.title : last ? 'Sekarang, giliranmu mencoba.' : `Pahami satu langkah ini`;
  function go(next: number) {
    setIndex(Math.max(0, Math.min(next, steps.length - 1)));
    scrollArea.current?.scrollTo({ top: 0 });
    requestAnimationFrame(() => heading.current?.focus());
  }
  return <section className="lesson-story" aria-label="Belajar dengan cerita" onKeyDown={event => {
    if ((event.target as HTMLElement).closest('input, textarea, select, button, a, summary')) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); go(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1); }
  }}>
    <div className="story-scroll" ref={scrollArea}><div className="story-wrap">
      <div className="story-heading"><span><BookOpen size={15} /> {story ? 'CERITA KEDAI KODE' : 'BELAJAR BERTAHAP'}</span><span>{lesson.title}</span></div>
      <nav className="story-steps" aria-label="Tahap materi">{steps.map((step, i) => <button key={step} onClick={() => go(i)} aria-current={i === index ? 'step' : undefined} className={i === index ? 'current' : i < index ? 'visited' : ''}><span>{i < index ? <Check size={12} /> : String(i + 1).padStart(2, '0')}</span><span>{step}</span></button>)}</nav>
      <article className="story-card"><div className="story-card-label"><span>LANGKAH {String(index + 1).padStart(2, '0')}</span><span>{steps[index]}</span></div><h1 ref={heading} tabIndex={-1}>{title}</h1>
        {index === 0 && <><p className="story-lead">{story?.situation ?? lesson.description}</p><div className="story-takeaway"><Lightbulb size={20} /><div><strong>Yang akan kamu bawa pulang</strong><ul>{lesson.learningObjectives.map(objective => <li key={objective}>{objective}</li>)}</ul></div></div><p className="story-reassurance">Tidak perlu menghafal. Pahami idenya dulu, lalu kita coba bersama.</p></>}
        {story && index === 1 && <><p className="story-lead">{story.idea}</p><div className="story-context"><span>KEMBALI KE CERITA</span><p>{story.situation}</p></div></>}
        {story && index === 2 && <><p className="story-lead">Baca dari atas ke bawah. Sebelum melihat hasilnya, coba bayangkan apa yang akan muncul di layar.</p><div className="story-code"><header><span>kedai_kode.py</span><span>Python</span></header><pre><code>{story.code}</code></pre></div><button className="story-reveal" onClick={() => setShowOutput(!showOutput)} aria-expanded={showOutput}>{showOutput ? 'Sembunyikan hasil contoh' : 'Perlihatkan hasil contoh'} <ArrowRight size={16} /></button>{showOutput && <div className="story-output" aria-live="polite"><span>HASIL CONTOH</span><pre>{story.output}</pre><p>Ini hasil contoh yang dijelaskan. Jalankan dan ubah kodemu sendiri di ruang praktik.</p></div>}</>}
        {story && index === 3 && <><p className="story-lead">{story.question}</p><div className="story-choices" role="group" aria-label="Pilihan jawaban">{story.choices.map((choice, i) => <button key={choice} onClick={() => setAnswer(i)} aria-pressed={answer === i} className={answer === i ? (i === story.answer ? 'correct' : 'retry') : ''}><span>{String.fromCharCode(65 + i)}</span><code>{choice}</code>{answer === i && i === story.answer && <Check size={18} />}</button>)}</div>{answer !== null && <div className={`story-feedback ${answer === story.answer ? 'correct' : ''}`} role="status"><strong>{answer === story.answer ? 'Ya, kamu menangkap idenya.' : 'Belum tepat. Tidak apa-apa, coba pikirkan lagi.'}</strong><p>{answer === story.answer ? story.explanation : 'Baca lagi contoh di langkah sebelumnya, lalu pilih jawaban lain. Cek ini tidak mengurangi XP.'}</p></div>}</>}
        {!story && index > 0 && !last && <div className="story-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{material[index - 1]}</ReactMarkdown></div>}
        {last && <><p className="story-lead">Kamu sudah melihat konsepnya bekerja. Sekarang terapkan ide yang sama pada latihan berikut. Kamu boleh kembali ke cerita kapan saja.</p>{lesson.exercise ? <div className="story-mission"><span><Code2 size={17} /> TANTANGAN PRAKTIK</span><h2>{lesson.exercise.title}</h2><div className="story-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.exercise.description}</ReactMarkdown></div></div> : <p className="story-lead">Buka editor, ubah contoh kode, dan perhatikan bagaimana hasilnya berubah.</p>}<div className="story-checklist"><span><Check size={15} /> Tulis kode</span><span><Check size={15} /> Jalankan & periksa hasil</span><span><Check size={15} /> Kirim jawaban</span></div><p className="story-reassurance">Membaca slide tidak menandai latihan selesai. Progres latihan tetap mengikuti hasil pengerjaanmu.</p></>}
      </article>
      <details className="story-reference"><summary>Butuh penjelasan lengkap? Buka catatan materi.</summary><div className="story-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content}</ReactMarkdown></div></details>
    </div></div>
    <footer className="story-controls"><button className="story-back" onClick={() => go(index - 1)} disabled={index === 0}><ArrowLeft size={17} /><span>Kembali</span></button><span className="story-count" aria-live="polite">{index + 1} <span>/ {steps.length}</span></span><button className="button-primary" onClick={() => last ? onPractice() : go(index + 1)}>{last ? 'Buka ruang praktik' : index === 0 ? 'Mulai ceritanya' : 'Lanjut'}<ArrowRight size={17} /></button></footer>
  </section>;
}
