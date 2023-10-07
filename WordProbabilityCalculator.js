const fs = require("fs");
const path = require("path");

function loadStopWords(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return new Set(
      data
        .trim()
        .toLowerCase()
        .split("\n")
        .map((word) => word.trim())
    );
  } catch (err) {
    console.error("Error loading stopwords file:", err.message);
    return new Set();
  }
}

function calculateWordProbabilities(text, stopWords) {
  const words = text.toLowerCase().split(/\s+/);
  return words.filter(
    (word) => word.match(/[A-Za-z0-9]+/) && !stopWords.has(word)
  );
}

function main() {
  const folderPath = "documents";
  const stopwordsFilePath = "stopwords.txt";

  try {
    const stopWords = loadStopWords(stopwordsFilePath);
    const allWordCounts = {};

    const files = fs.readdirSync(folderPath);

    files.forEach((fileName) => {
      if (fileName.endsWith(".txt")) {
        try {
          const filePath = path.join(folderPath, fileName);
          const documentText = fs.readFileSync(filePath, "utf8");
          const filteredWords = calculateWordProbabilities(
            documentText,
            stopWords
          );

          filteredWords.forEach((word) => {
            allWordCounts[word] = (allWordCounts[word] || 0) + 1;
          });
        } catch (err) {
          console.error("Error reading file:", err.message);
        }
      }
    });

    const totalWords = Object.values(allWordCounts).reduce(
      (sum, count) => sum + count,
      0
    );

    const sortedWordCounts = Object.keys(allWordCounts).sort(
      (a, b) => allWordCounts[b] - allWordCounts[a]
    );

    const topWords = sortedWordCounts.slice(
      0,
      Math.min(5, sortedWordCounts.length)
    );

    console.log("Top 5 words across all documents:");
    topWords.forEach((word) => {
      const count = allWordCounts[word];
      const probability = count / totalWords;
      console.log(
        `  Word: ${word}, Probability: ${probability.toFixed(
          4
        )}, Count: ${count}`
      );
    });
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
