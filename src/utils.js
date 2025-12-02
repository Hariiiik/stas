export const analyzeSentiment = (text) => {
  if (!text) return "0.00";

  const tokens = text.toLowerCase().match(/\w+|[^\w\s]/g) || [];

  const dictionary = {
    abusive: -3,
    admirable: 3,
    amazing: 4,
    awesome: 4,
    awful: -3,
    bad: -3,
    beautiful: 3,
    best: 3,
    blocked: -2,
    broken: -3,
    bug: -2,
    cant: -2,
    crash: -3,
    critical: -3,
    damn: -4,
    dead: -3,
    difficult: -1,
    disaster: -4,
    down: -2,
    easy: 2,
    effective: 2,
    error: -2,
    excellent: 4,
    fail: -2,
    fantastic: 4,
    fast: 2,
    fault: -2,
    fine: 1,
    fix: 1,
    frustrating: -2,
    garbage: -3,
    glad: 3,
    good: 3,
    great: 3,
    happy: 3,
    hate: -3,
    help: 2,
    horrible: -3,
    hurt: -2,
    impressive: 3,
    issue: -2,
    like: 2,
    love: 3,
    lovely: 3,
    mad: -3,
    mistake: -2,
    nice: 3,
    outstanding: 5,
    perfect: 3,
    please: 1,
    problem: -2,
    regret: -2,
    resolved: 2,
    sad: -2,
    satisfied: 2,
    shit: -4,
    slow: -2,
    solution: 2,
    sorry: -1,
    stop: -1,
    success: 3,
    superb: 5,
    thanks: 2,
    terrible: -3,
    trouble: -2,
    unhappy: -2,
    useless: -2,
    warning: -3,
    wonderful: 4,
    worst: -3,
    wrong: -2,
    yes: 1,
  };

  const emojis = {
    "😀": 2,
    "😃": 2,
    "😄": 2,
    "😁": 2,
    "😊": 2,
    "🙂": 1,
    "😍": 3,
    "🤩": 3,
    "😡": -3,
    "🤬": -4,
    "😠": -2,
    "😞": -2,
    "😢": -2,
    "😭": -3,
    "👎": -2,
    "👍": 2,
    "🔥": 2,
    "❤️": 3,
    "💔": -3,
  };

  const negators = ["not", "no", "never", "dont", "cant", "wont", "isnt"];
  const intensifiers = [
    "very",
    "really",
    "extremely",
    "absolutely",
    "totally",
    "so",
  ];

  let score = 0;
  let wordCount = 0;

  for (let i = 0; i < tokens.length; i++) {
    const word = tokens[i];
    let itemScore = dictionary[word] || emojis[word] || 0;

    if (itemScore !== 0) {
      if (i > 0) {
        const prevWord = tokens[i - 1];
        if (negators.includes(prevWord)) {
          itemScore = -itemScore;
        }
        if (intensifiers.includes(prevWord)) {
          itemScore = itemScore > 0 ? itemScore + 1 : itemScore - 1;
        }
      }
      score += itemScore;
      wordCount++;
    }
  }

  const normalizedScore =
    wordCount > 0 ? Math.min(Math.max(score / (wordCount * 3), -1), 1) : 0;
  return Number(normalizedScore).toFixed(2); // Повертаємо string з 2 знаками
};
