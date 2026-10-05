const { analyze, emojis } = require('../app.js');
const assert = require('assert');

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

test('analyze returns random index for empty clue', () => {
  const result = analyze('');
  assert(result >= 0 && result < emojis.length, 'Index out of range');
});

test('analyze returns random index for short clue', () => {
  const result = analyze('x');
  assert(result >= 0 && result < emojis.length, 'Index out of range');
});

test('analyze returns random index for no matching keywords', () => {
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

console.log('\nAll tests passed!');
