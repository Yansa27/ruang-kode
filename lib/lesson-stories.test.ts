import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lessonStories, splitLessonContent } from './lesson-stories';

test('every authored lesson has a valid answer and a complete narrative', () => {
  assert.equal(Object.keys(lessonStories).length, 14);
  for (const story of Object.values(lessonStories)) {
    assert.ok(story.title && story.situation && story.idea && story.explanation);
    assert.ok(story.code && story.output);
    assert.ok(story.answer >= 0 && story.answer < story.choices.length);
    assert.equal(new Set(story.choices).size, story.choices.length);
  }
});

test('Markdown pagination preserves fenced code and its blank lines', () => {
  const code = '```python\n# Heading inside code\n\nprint("hello")\n```';
  const slides = splitLessonContent(`## Intro\n\n${'A sentence. '.repeat(80)}\n\n${code}\n\n## Next\n\nKeep going.`);
  assert.ok(slides.length > 1);
  assert.ok(slides.some(slide => slide.includes(code)));
  assert.ok(slides.every(slide => (slide.match(/```/g)?.length ?? 0) % 2 === 0));
  assert.ok(slides.at(-1)?.includes('Keep going.'));
});

test('Markdown pagination keeps a heading with the following paragraph', () => {
  assert.deepEqual(splitLessonContent('## One\n\nFirst paragraph.\n\n## Two\n\nSecond paragraph.'), ['## One\n\nFirst paragraph.', '## Two\n\nSecond paragraph.']);
});

test('empty material does not create empty slides', () => {
  assert.deepEqual(splitLessonContent(' \n\n'), []);
});

test('every authored story has a concise visual lesson', async () => {
  const { lessonVisuals } = await import('./lesson-visuals');
  assert.deepEqual(Object.keys(lessonVisuals).sort(), Object.keys(lessonStories).sort());
  for (const visual of Object.values(lessonVisuals)) {
    assert.ok(visual.intro.split(/\s+/).length <= 20);
    assert.ok(visual.steps.length >= 3);
    assert.ok(visual.steps.every(step => step.value && step.note && step.label));
  }
});
