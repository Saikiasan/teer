document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "https://admin.shillongteerground.com/teer/api/results";
  const analysisTableHeader = document.getElementById("analysis-header");
  const analysisTableBody = document.getElementById("analysis-body");
  const patternChartCanvas = document
    .getElementById("pattern-chart")
    .getContext("2d");
  let allData = [];
  let chartInstance;

  // Dynamically Generate Headers 1-99
  function generateHeaders() {
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `<th>Date</th>`;
    for (let i = 1; i <= 99; i++) {
      const th = document.createElement("th");
      th.textContent = i;
      headerRow.appendChild(th);
    }
    analysisTableHeader.innerHTML = ""; // Clear previous headers
    analysisTableHeader.appendChild(headerRow);
  }

  // Fetch Data from API
  async function fetchData() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch data");
      allData = await response.json();
      renderAnalysisTable(allData);
      renderPatternChart(allData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Unable to fetch data. Please try again later.");
    }
  }

  // Render Analysis Table
  function renderAnalysisTable(data) {
    const occurrencesByDate = calculateOccurrencesByDate(data);

    if (!Object.keys(occurrencesByDate).length) {
      analysisTableBody.innerHTML = `<tr><td colspan="100" style="color: #fff;">No data available</td></tr>`;
      return;
    }

    // Build table rows
    const rows = Object.entries(occurrencesByDate).map(
      ([date, occurrences]) => {
        const cells = Array.from(
          { length: 99 },
          (_, i) => occurrences[i + 1] || 0
        );
        return `
        <tr>
          <td style="color: #fff;">${date}</td>
          ${cells
            .map((count) => `<td style="color: #ccc;">${count}</td>`)
            .join("")}
        </tr>`;
      }
    );

    // Render to table body
    analysisTableBody.innerHTML = rows.join("");
  }

  // Calculate Occurrences by Date
  function calculateOccurrencesByDate(data) {
    return data.reduce((result, entry) => {
      const { date, first_round, second_round } = entry;
      if (!result[date]) result[date] = Array(100).fill(0);

      [first_round, second_round].forEach((num) => {
        if (num) result[date][+num] = (result[date][+num] || 0) + 1;
      });

      return result;
    }, {});
  }

  // Render Pattern Chart
  function renderPatternChart(data) {
    const occurrencesByDate = calculateOccurrencesByDate(data);
    const labels = Object.keys(occurrencesByDate);
    const datasets = Array.from({ length: 99 }, (_, i) => {
      const values = labels.map((date) => occurrencesByDate[date][i + 1] || 0);
      return {
        label: `Number ${i + 1}`,
        data: values,
        borderColor: `hsl(${(i + 1) * 3.6}, 70%, 50%)`,
        backgroundColor: `rgba(${(i + 1) * 2.5}, 100, 200, 0.3)`,
        fill: false,
      };
    });

    // Destroy previous chart if exists
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(patternChartCanvas, {
      type: "line",
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
            labels: { color: "#FFFFFF" },
          },
        },
        scales: {
          x: {
            title: { display: true, text: "Date", color: "#FFFFFF" },
            ticks: { color: "#FFFFFF" },
            grid: { color: "rgba(255, 255, 255, 0.2)" },
          },
          y: {
            title: { display: true, text: "Occurrences", color: "#FFFFFF" },
            ticks: { color: "#FFFFFF" },
            grid: { color: "rgba(255, 255, 255, 0.2)" },
          },
        },
      },
    });
  }

  // Initialize Table Headers and Fetch Data
  generateHeaders();
  fetchData();
});
