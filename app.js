const $ = (selector) => {
  const el = document.querySelector(selector);
  if (!el) throw new Error(`Element not found: ${selector}`);
  return el;
};

const emojis = [
  {char: '😀', name: '开心', words: ['哈哈', '开心', '棒', '成功', '笑', '爽', '终于', '好耶']},
  {char: '🥳', name: '庆祝', words: ['庆祝', '生日', '派对', '礼物', '赢', '惊喜']},
  {char: '😴', name: '困倦', words: ['困', '睡', '熬夜', '疲惫', '累', '床']},
  {char: '🤔', name: '思考', words: ['想', '决定', '问题', '纠结', '研究', '为什么']},
  {char: '😤', name: '烦躁', words: ['烦', '生气', '气', '无语', '堵', '讨厌']},
  {char: '🥺', name: '委屈', words: ['难过', '委屈', '哭', '求', '可怜', '想念']},
  {char: '😎', name: '酷', words: ['酷', '帅', '搞定', '简单', '牛', '潇洒']},
  {char: '🤯', name: '震惊', words: ['震惊', '天啊', '居然', '没想到', '爆炸', '离谱']}
];

function analyze(clue) {
  const scores = emojis.map((emoji) => emoji.words.reduce((score, word) => score + (clue.includes(word) ? word.length : 0), 0));
  if (Math.max(...scores) === 0) return Math.floor(Math.random() * emojis.length);
  return scores.indexOf(Math.max(...scores));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { analyze, emojis };
}

let selected = null;
let rounds = 0;
let wins = 0;

if (typeof document !== 'undefined') {
  const grid = $('#emojiGrid');

  emojis.forEach((emoji, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'emoji-choice';
    button.textContent = emoji.char;
    button.title = emoji.name;
    button.setAttribute('aria-label', emoji.name);
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      selected = index;
      document.querySelectorAll('.emoji-choice').forEach((item, i) => {
        const on = i === index;
        item.classList.toggle('selected', on);
        item.setAttribute('aria-pressed', String(on));
      });
      $('#read').disabled = false;
      $('#message').textContent = '秘密已锁定。现在给一点文字线索吧。';
    });
    grid.append(button);
  });

  function updateScore() { $('#score').textContent = `${wins} / ${rounds}`; }

  $('#read').addEventListener('click', () => {
    if (selected === null) return;
    const guessIndex = analyze($('#clue').value);
    const hit = guessIndex === selected;
    rounds += 1;
    if (hit) wins += 1;
    $('#guess').textContent = emojis[guessIndex].char;
    $('#message').textContent = hit ? `猜中了！你现在的气场确实是「${emojis[selected].name}」。` : `差一点！你心里的答案是 ${emojis[selected].char}「${emojis[selected].name}」。`;
    updateScore();
  });

  $('#reset').addEventListener('click', () => {
    selected = null;
    rounds = 0;
    wins = 0;
    document.querySelectorAll('.emoji-choice').forEach((item) => {
      item.classList.remove('selected');
      item.setAttribute('aria-pressed', 'false');
    });
    $('#read').disabled = true;
    $('#guess').textContent = '？';
    $('#message').textContent = '先选择一个秘密表情，读心雷达才会启动。';
    $('#clue').value = '';
    updateScore();
  });
}
