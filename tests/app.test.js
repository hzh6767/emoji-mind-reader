const { analyze, emojis } = require('../app.js');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (err) {
    console.error(`✗ ${name}`);
    console.error(err.message);
    process.exit(1);
  }
}

test('analyze returns valid emoji index', () => {
  const result = analyze('开心哈哈');
  assert(result >= 0 && result < emojis.length, 'Index out of range');
});

test('analyze matches 开心 emoji for happy keywords', () => {
  const result = analyze('哈哈真开心');
  const emoji = emojis[result];
  assert(emoji.name === '开心', `Expected 开心, got ${emoji.name}`);
});

test('analyze matches 困倦 emoji for tired keywords', () => {
  const result = analyze('好累好困想睡觉');
  const emoji = emojis[result];
  assert(emoji.name === '困倦', `Expected 困倦, got ${emoji.name}`);
});

test('analyze matches 烦躁 emoji for annoyed keywords', () => {
  const result = analyze('真烦真生气');
  const emoji = emojis[result];
  assert(emoji.name === '烦躁', `Expected 烦躁, got ${emoji.name}`);
});

test('analyze returns a deterministic fallback index for an empty clue', () => {
  const result = analyze('');
  assert(result >= 0 && result < emojis.length, 'Index out of range');
});

test('analyze returns a deterministic fallback index for a short clue', () => {
  const result = analyze('x');
  assert(result >= 0 && result < emojis.length, 'Index out of range');
});

test('analyze returns a deterministic fallback index for no matching keywords', () => {
  const result = analyze('这是一段没有情绪词的普通文字');
  assert(result >= 0 && result < emojis.length, 'Index out of range');
});

test('analyze matches single-character keyword 累', () => {
  const result = analyze('累');
  assert(emojis[result].name === '困倦', `Expected 困倦, got ${emojis[result].name}`);
});

test('analyze prefers longer keyword 想念 over substring 想', () => {
  const result = analyze('想念');
  assert(emojis[result].name === '委屈', `Expected 委屈, got ${emojis[result].name}`);
});

test('analyze prefers longer keyword 没想到 over substring 想', () => {
  const result = analyze('没想到');
  assert(emojis[result].name === '震惊', `Expected 震惊, got ${emojis[result].name}`);
});

test('emojis array has 8 entries', () => {
  assert(emojis.length === 8, `Expected 8 emojis, got ${emojis.length}`);
});

test('each emoji has required fields', () => {
  emojis.forEach((emoji, i) => {
    assert(emoji.char, `Emoji ${i} missing char`);
    assert(emoji.name, `Emoji ${i} missing name`);
    assert(Array.isArray(emoji.words), `Emoji ${i} missing words array`);
    assert(emoji.words.length > 0, `Emoji ${i} has empty words array`);
  });
});

test('analyze is deterministic (no random fallback)', () => {
  assert.strictEqual(analyze(''), 0, 'empty clue should fall back to index 0');
  for (let i = 0; i < 50; i++) {
    assert.strictEqual(analyze(''), 0, 'empty clue result drifted between calls');
    assert.strictEqual(analyze('这是一段没有情绪词的普通文字'), 0, 'no-match clue result drifted between calls');
  }
});

test('overlapping keywords do not double-count (气 within 生气)', () => {
  // 开心(哈哈=2) must tie-beat 烦躁, whose 生气(2)+气(1) overlap on one character.
  const result = analyze('哈哈生气');
  assert(emojis[result].name === '开心', `Expected 开心, got ${emojis[result].name}`);
});

test('README documents the test command', () => {
  const readme = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8');
  assert(readme.includes('npm test'), 'README does not mention `npm test`');
});
console.log('\nAll tests passed!');
