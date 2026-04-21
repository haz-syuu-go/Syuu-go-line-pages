// ============================================================
// しゅうごうのLINE - Landing Page Interactions
// ============================================================

/* ---------- Utilities ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Navbar scroll state ---------- */
const navbar = $('#navbar');
const onScroll = () => {
  if (window.scrollY > 10) navbar.classList.add('is-scrolled');
  else navbar.classList.remove('is-scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobile menu ---------- */
window.toggleMenu = () => {
  $('#mobileMenu').classList.toggle('is-open');
};

/* ---------- Hero animated text (letter-by-letter) ---------- */
(function initHeroText() {
  $$('.animated-text').forEach((el) => {
    const text = el.textContent;
    const html = [...text].map((ch) => {
      if (ch === ' ') return '<span style="width:0.3em;display:inline-block">&nbsp;</span>';
      return `<span>${ch}</span>`;
    }).join('');
    el.innerHTML = html;

    const chars = $$('span', el);
    chars.forEach((span, i) => {
      span.style.transitionDelay = `${i * 0.04}s`;
    });
  });

  requestAnimationFrame(() => {
    $$('.animated-text').forEach((el) => el.classList.add('is-in'));
  });
})();

/* ---------- Intersection Observer for reveal ---------- */
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  $$('.reveal').forEach((el) => io.observe(el));
} else {
  $$('.reveal').forEach((el) => el.classList.add('is-in'));
}

/* ---------- Horizontal scroll controls ---------- */
window.scrollH = (dir) => {
  const track = $('#hScrollTrack');
  if (!track) return;
  const card = track.querySelector('.h-card');
  const gap = 24;
  const delta = (card ? card.offsetWidth + gap : 320) * dir;
  track.scrollBy({ left: delta, behavior: 'smooth' });
};

/* ---------- Feature modal ---------- */
const featureData = {
  1: {
    icon: 'i-calendar',
    title: 'ご命日通知',
    desc: 'ご家族のご命日や年忌法要の時期を、LINEで事前にお知らせ。ご家族も、お寺も、大切な日を忘れません。',
    list: ['ご命日の前日・当日に自動通知', '年忌法要の該当年を自動計算', '法要のご案内・申込導線とも連携可']
  },
  2: {
    icon: 'i-newspaper',
    title: 'デジタル寺報',
    desc: '紙の寺報をデジタルに。郵送コストを1/3に削減しながら、タイムリーに情報をお届けできます。',
    list: ['画像・動画入りのリッチな配信', '開封率・クリック率を計測', '紙版との併用もOK']
  },
  3: {
    icon: 'i-flame',
    title: 'ご法事受付',
    desc: '法要の日程調整・人数確認・お布施の事前決済までをワンストップで受付。電話対応の手間が大幅に軽減されます。',
    list: ['日程・時間帯のカレンダー予約', '出席人数・お斎の要不要まで収集', '事前決済も可能']
  },
  4: {
    icon: 'i-lotus',
    title: '永代供養墓の案内',
    desc: '永代供養墓の特徴・費用・お申込みまでをLINE内で完結。「LINEで知って、すぐ申込」という事例も多数。',
    list: ['画像・動画で丁寧に案内', '費用シミュレーション機能', '内見予約もスムーズ']
  },
  5: {
    icon: 'i-search',
    title: '墓じまい診断',
    desc: 'いくつかの質問に答えるだけで、墓じまいの最適な選択肢をご提案。悩みを抱える檀信徒様に寄り添います。',
    list: ['簡単な質問で最適解を提示', '相談窓口への自然な導線', 'プライバシーに配慮']
  },
  6: {
    icon: 'i-card',
    title: '事前決済',
    desc: 'お布施・護持会費・年会費などをLINE内で事前決済。お手持ちの現金を気にせず、スマートにご参拝いただけます。',
    list: ['クレジットカード・各種Pay対応', '領収書の自動発行', '集金作業の手間を大幅削減']
  },
  7: {
    icon: 'i-cpu',
    title: 'オリジナルAI制作',
    desc: 'お寺のお考え・宗派の教えを反映した、オーダーメイドのAIチャットボットを制作。24時間、気軽な仏事相談が可能に。',
    list: ['お寺専用のAI学習', '仏事・お墓・法要の相談対応', '住職への橋渡しもスムーズ']
  },
  8: {
    icon: 'i-tag',
    title: '塔婆・祈祷札の申込',
    desc: '塔婆・祈祷札のお申込みから、戒名・俗名・志納金の受付・決済までをデジタル化。お盆やお彼岸も混乱なく。',
    list: ['複数本の同時申込に対応', '戒名・俗名などの受付フォーム', '志納金の事前決済も可']
  },
  9: {
    icon: 'i-party',
    title: '行事催しの参加受付',
    desc: 'お施餓鬼・花まつり・除夜の鐘など、各種行事の出欠確認をLINEでスムーズに。人数把握が容易に。',
    list: ['イベントごとの受付フォーム', 'リマインド通知', '参加履歴の蓄積・分析']
  },
  10: {
    icon: 'i-coin',
    title: '護持会費の案内',
    desc: '護持会費のご案内から納付までをLINE完結に。督促のお手紙・電話対応の負担を大きく軽減します。',
    list: ['年間スケジュールに合わせた自動配信', '納付状況の管理', '事前決済にも対応']
  },
  11: {
    icon: 'i-chat',
    title: '仏事相談チャットボット',
    desc: 'よくある仏事のご相談にチャットボットが24時間対応。必要に応じて住職さまへお繋ぎする導線も設計します。',
    list: ['よくある質問に即レスポンス', '住職への相談予約への導線', '相談履歴の蓄積']
  },
  12: {
    icon: 'i-ticket',
    title: '参拝記録証',
    desc: 'ご参拝のたびにLINEで参拝記録証を発行。スタンプラリー形式で、ご参拝のモチベーションを高めます。',
    list: ['QRコードで参拝登録', 'スタンプを貯める仕組み', '特典・記念品との連携']
  },
  13: {
    icon: 'i-scroll',
    title: 'LINEでおみくじ',
    desc: '手軽に楽しめるLINEおみくじ。日々の参拝のきっかけとなり、お寺との距離を近づけます。',
    list: ['毎日引ける・週一など自由設計', '住職の一言メッセージ付き', 'SNSシェア機能']
  },
  14: {
    icon: 'i-beads',
    title: 'お念仏記録',
    desc: 'お念仏・お題目をLINE上で記録。日々のご信心を見える化し、檀信徒様の心の拠り所に。',
    list: ['タップで簡単記録', '継続日数の可視化', '宗派ごとのカスタマイズ可']
  },
  15: {
    icon: 'i-book',
    title: 'まいにち学ぶ!日めくり仏教',
    desc: '1日1つ、やさしい仏教の教えを配信。檀信徒さまに教えを伝え続ける、新しい法話のかたちです。',
    list: ['宗派に合わせた内容', '画像・音声でもお届け', '住職の解説付き']
  },
  16: {
    icon: 'i-sparkles',
    title: 'その他、オーダーメイド',
    desc: '10ヵ寺あれば10通り。お寺さま固有のご要望に合わせて、新しい機能を企画・開発します。まずはご相談ください。',
    list: ['ヒアリングから課題抽出', '費用対効果を検討しご提案', '既存機能との組み合わせも柔軟']
  }
};

$$('.feature').forEach((btn) => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-f');
    const data = featureData[id];
    if (!data) return;
    $('#modalIconUse').setAttribute('href', '#' + data.icon);
    $('#modalTitle').textContent = data.title;
    $('#modalDesc').textContent = data.desc;
    const list = $('#modalList');
    list.innerHTML = '';
    data.list.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
    $('#featureModal').classList.add('is-open');
    document.body.style.overflow = 'hidden';
  });
});

window.closeModal = (e) => {
  if (e && e.target && e.target !== $('#featureModal') && !e.target.closest('.modal__close')) return;
  $('#featureModal').classList.remove('is-open');
  document.body.style.overflow = '';
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    $('#featureModal').classList.remove('is-open');
    document.body.style.overflow = '';
  }
});
