'use client';

import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowRight, BookOpen, Check, Code2, Play } from '@/components/ui/icons';
import { lessonStories, splitLessonContent } from '@/lib/lesson-stories';
import { lessonVisuals } from '@/lib/lesson-visuals';
import { CafeIllustration, ConceptIllustration, MissionIllustration } from './LessonIllustration';

interface LessonStoryProps {
  lesson: { slug: string; title: string; description: string; content: string; learningObjectives: string[]; exercise?: { title: string; description: string } | null };
  onPractice: () => void;
  courseSlug: string;
}

export default function LessonStory({ lesson, onPractice, courseSlug }: LessonStoryProps) {
  const story = courseSlug === 'python-fundamental' ? lessonStories[lesson.slug] : undefined;
  const visual = story ? lessonVisuals[lesson.slug] : undefined;
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [showOutput, setShowOutput] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const card = useRef<HTMLElement>(null);
  const animations = useRef<Animation[]>([]);
  const navigationLocked = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; animations.current.forEach(animation => animation.cancel()); };
  }, []);
  const heading = useRef<HTMLHeadingElement>(null);
  const scrollArea = useRef<HTMLDivElement>(null);
  const material = story ? [] : splitLessonContent(lesson.content);
  const steps = story ? ['Cerita', 'Konsep', 'Contoh', 'Cek ide', 'Praktik'] : ['Mulai', ...material.map((_, i) => `Konsep ${i + 1}`), 'Praktik'];
  const last = index === steps.length - 1;
  const title = story ? [story.title, visual?.concept ?? 'Kenali konsepnya.', 'Kode kecil. Hasil nyata.', 'Menurutmu, yang mana?', 'Saatnya mencoba sendiri.'][index] : index === 0 ? lesson.title : last ? 'Saatnya mencoba sendiri.' : 'Satu ide, satu langkah.';
  async function go(next: number) {
    const target = Math.max(0, Math.min(next, steps.length - 1));
    if (target === index || navigationLocked.current) return;
    const element = card.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const direction = target > index ? 1 : -1;
    navigationLocked.current = true;
    setTransitioning(true);
    try {
      const previousHeight = element?.getBoundingClientRect().height ?? 0;
      if (element && !reducedMotion) {
        const exit = element.animate([
          { opacity: 1, transform: 'translateX(0)' },
          { opacity: 0, transform: `translateX(${-direction * 16}px)` },
        ], { duration: 130, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' });
        animations.current = [exit];
        await exit.finished;
      }
      if (!mounted.current) return;
      flushSync(() => setIndex(target));
      scrollArea.current?.scrollTo({ top: 0, behavior: 'instant' });
      const nextHeight = element?.getBoundingClientRect().height ?? 0;
      animations.current.forEach(animation => animation.cancel());
      if (element && !reducedMotion) {
        const enter = element.animate([
          { opacity: 0, transform: `translateX(${direction * 20}px)` },
          { opacity: 1, transform: 'translateX(0)' },
        ], { duration: 260, easing: 'cubic-bezier(.16,1,.3,1)' });
        const resize = element.animate([
          { height: `${previousHeight}px`, overflow: 'clip' },
          { height: `${nextHeight}px`, overflow: 'clip' },
        ], { duration: 260, easing: 'cubic-bezier(.16,1,.3,1)' });
        animations.current = [enter, resize];
        await Promise.all([enter.finished, resize.finished]);
      }
      heading.current?.focus({ preventScroll: true });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) throw error;
    } finally {
      animations.current.forEach(animation => animation.cancel());
      animations.current = [];
      navigationLocked.current = false;
      if (mounted.current) setTransitioning(false);
    }
  }
  return <section className="lesson-story visual-story" aria-label="Belajar dengan cerita" onKeyDown={event => {
    if ((event.target as HTMLElement).closest('input, textarea, select, button, a, summary')) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); go(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1); }
  }}>
    <div className="story-scroll" ref={scrollArea}><div className="story-wrap">
      <div className="story-heading"><span><BookOpen size={15} /> {story ? 'CERITA KEDAI KODE' : 'BELAJAR BERTAHAP'}</span><span>{lesson.title}</span></div>
      <nav className="story-steps" aria-label="Tahap materi">{steps.map((step, i) => <button key={step} disabled={transitioning} onClick={() => go(i)} aria-label={`Langkah ${i + 1}: ${step}`} aria-current={i === index ? 'step' : undefined} className={i === index ? 'current' : i < index ? 'visited' : ''}><span>{i < index ? <Check size={12} /> : String(i + 1).padStart(2, '0')}</span><span>{step}</span></button>)}</nav>
      <article ref={card} className="story-card" aria-busy={transitioning} data-transitioning={transitioning}><div className="story-card-label"><span>EPISODE {lesson.slug.match(/^\d+/)?.[0] ?? '01'}</span><span>{steps[index]}</span></div><h1 ref={heading} tabIndex={-1}>{title}</h1>
        {index === 0 && <><p className="story-lead">{visual?.intro ?? lesson.description}</p><CafeIllustration caption={visual?.takeaway ?? 'Mulai dari satu ide. Lalu coba sendiri.'} /><details className="story-extra"><summary>Cerita & tujuan belajar</summary>{story && <p>{story.situation}</p>}<ul>{lesson.learningObjectives.map((objective, i) => <li key={i}>{objective}</li>)}</ul></details></>}
        {story && index === 1 && <>{visual && <ConceptIllustration visual={visual} />}<p className="visual-takeaway"><span>Ingat ini</span>{visual?.takeaway}</p><details className="story-extra"><summary>Baca penjelasannya</summary><p>{story.idea}</p></details></>}
        {story && index === 2 && <><p className="story-lead">Tebak hasilnya, lalu buka layar di sebelah kanan.</p><div className="visual-code-stage"><div className="story-code"><header><span>kedai_kode.py</span><Code2 size={15} /></header><pre><code>{story.code}</code></pre></div><div className={`visual-result ${showOutput ? 'revealed' : ''}`}><span className="visual-result-label">LAYAR KEDAI</span><div className="result-screen" aria-live="polite">{showOutput ? <pre>{story.output}</pre> : <div className="result-hidden"><span>?</span><p>Apa yang akan muncul?</p></div>}</div><button className="story-reveal" onClick={() => setShowOutput(!showOutput)} aria-expanded={showOutput}><Play size={14} />{showOutput ? 'Tutup hasil' : 'Buka hasil'}</button></div></div><p className="visual-footnote">Pratinjau hasil contoh. Eksekusi kode tersedia di ruang praktik.</p></>}
        {story && index === 3 && <><div className="visual-quiz-prompt"><span className="quiz-symbol">?</span><p>{story.question}</p></div><div className="story-choices" role="group" aria-label="Pilihan jawaban">{story.choices.map((choice, i) => <button key={choice} onClick={() => setAnswer(i)} aria-pressed={answer === i} className={answer === i ? (i === story.answer ? 'correct' : 'retry') : ''}><span>{String.fromCharCode(65 + i)}</span><code>{choice}</code>{answer === i && i === story.answer && <Check size={18} />}</button>)}</div>{answer !== null && <div className={`story-feedback ${answer === story.answer ? 'correct' : ''}`} role="status"><strong>{answer === story.answer ? 'Tepat! Kamu paham idenya.' : 'Belum tepat. Coba sekali lagi.'}</strong>{answer === story.answer ? <details className="story-extra"><summary>Kenapa jawaban ini benar?</summary><p>{story.explanation}</p></details> : <p>Intip contoh sebelumnya. Tidak ada pengurangan XP.</p>}</div>}</>}
        {!story && index > 0 && !last && <div className="story-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{material[index - 1]}</ReactMarkdown></div>}
        {last && <><MissionIllustration />{lesson.exercise ? <div className="story-mission"><span><Code2 size={17} /> MISI KAMU</span><h2>{lesson.exercise.title}</h2><div className="story-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.exercise.description}</ReactMarkdown></div></div> : <p className="story-lead">Ubah contoh kode. Jalankan. Lihat apa yang berubah.</p>}<p className="visual-footnote">Boleh kembali ke cerita kapan saja. Progres selesai setelah latihan lulus.</p></>}
      </article>
      <details className="story-reference"><summary><BookOpen size={14} /> Catatan materi lengkap</summary><div className="story-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content}</ReactMarkdown></div></details>
    </div></div>
    <footer className="story-controls"><button className="story-back" onClick={() => go(index - 1)} disabled={index === 0 || transitioning}><ArrowLeft size={17} /><span>Kembali</span></button><span className="story-count" aria-live="polite">{index + 1} <span>/ {steps.length}</span></span><button className="button-primary" disabled={transitioning} onClick={() => last ? onPractice() : go(index + 1)}>{last ? 'Buka ruang praktik' : index === 0 ? 'Mulai ceritanya' : 'Lanjut'}<ArrowRight size={17} /></button></footer>
  </section>;
}
