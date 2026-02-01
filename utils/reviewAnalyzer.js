const positiveWords = [
  "good","great","amazing","excellent","love","fast","perfect",
  "awesome","satisfied","quality","best"
];

const negativeWords = [
  "bad","poor","worst","late","broken","hate","slow",
  "problem","issue","delay"
];

const analyzeReviews = (reviews) => {
  let positive = 0;
  let negative = 0;
  let totalRating = 0;
  let pros = {};
  let cons = {};

  reviews.forEach(r => {
    totalRating += r.rating;
    const words = r.comment.toLowerCase().split(" ");

    words.forEach(word => {
      if (positiveWords.includes(word)) {
        positive++;
        pros[word] = (pros[word] || 0) + 1;
      }
      if (negativeWords.includes(word)) {
        negative++;
        cons[word] = (cons[word] || 0) + 1;
      }
    });
  });

  const avgRating = (totalRating / reviews.length).toFixed(1);

  const sentiment =
    avgRating >= 4 ? "Positive" :
    avgRating >= 3 ? "Neutral" :
    "Negative";

  return {
    totalReviews: reviews.length,
    averageRating: avgRating,
    sentiment,
    pros: Object.keys(pros).slice(0, 3),
    cons: Object.keys(cons).slice(0, 3),
    summary: `
Overall feedback is ${sentiment.toLowerCase()}.
Customers like ${Object.keys(pros).slice(0, 2).join(", ") || "product quality"}.
Some users reported ${Object.keys(cons).slice(0, 2).join(", ") || "minor issues"}.
Average rating is ${avgRating}/5.
    `.trim()
  };
};

module.exports = analyzeReviews;
