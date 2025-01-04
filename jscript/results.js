document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("results");

  // Fetch JSON data
  fetch("https://admin.shillongteerground.com/teer/api/results/")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data && Array.isArray(data)) {
        // Loop through the data and create HTML elements
        data.forEach((result) => {
          const resultDiv = document.createElement("tr");
          resultDiv.className = "result-container";

          const date = document.createElement("td");
          date.textContent = result.date;

          const result1 = document.createElement("td");
          result1.textContent = result.first_round;

          const result2 = document.createElement("td");
          result2.textContent = result.second_round;

          if (result.date && result.date.includes("2024")) {
            resultDiv.style.backgroundColor = "#212121"; // Apply red background
            resultDiv.style.color = "#FFFFFF"; // Optional: Improve text contrast
          }
          if (result.date && result.date.includes("2023")) {
            resultDiv.style.backgroundColor = "#3FB5BA"; // Apply red background
            resultDiv.style.color = "#000000"; // Optional: Improve text contrast
          }

          resultDiv.appendChild(date);
          resultDiv.appendChild(result1);
          resultDiv.appendChild(result2);

          resultsContainer.appendChild(resultDiv);
        });
      } else {
        resultsContainer.textContent = "No results available.";
      }
    })
    .catch((error) => {
      console.error("Error fetching the results:", error);
      resultsContainer.textContent =
        "Failed to load results. Please try again later.";
    });
});
