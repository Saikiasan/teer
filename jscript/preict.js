document.addEventListener("DOMContentLoaded", () => {
  const resultsURL = "https://admin.shillongteerground.com/teer/api/results/";

  // Fetch JSON data
  fetch(resultsURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data && Array.isArray(data)) {
        // Predict today's numbers based on historical data
        const predictions = predictTodaysNumbers(data);
        console.log("Predicted Numbers for Today:", predictions);
        alert(
          `Predicted Numbers:\nFirst Round: ${predictions.firstRound}\nSecond Round: ${predictions.secondRound}`
        );
      } else {
        console.error("No data available for predictions.");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  // Function to predict today's numbers
  function predictTodaysNumbers(data) {
    // Extract all past numbers
    const firstRoundNumbers = data
      .map((result) => parseInt(result.first_round))
      .filter((num) => !isNaN(num));
    const secondRoundNumbers = data
      .map((result) => parseInt(result.second_round))
      .filter((num) => !isNaN(num));

    // Get random number or most common number (example logic)
    const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const mostFrequent = (arr) => {
      const freqMap = {};
      arr.forEach((num) => (freqMap[num] = (freqMap[num] || 0) + 1));
      return parseInt(
        Object.keys(freqMap).reduce((a, b) => (freqMap[a] > freqMap[b] ? a : b))
      );
    };

    return {
      firstRound: randomPick(firstRoundNumbers), // Replace `randomPick` with `mostFrequent` for pattern-based predictions
      secondRound: randomPick(secondRoundNumbers),
    };
  }
});
