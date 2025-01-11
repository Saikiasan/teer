document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = CONFIG.API_URL;
  const filterType = document.getElementById("filter-type");
  const filterInputs = {
    date: document.getElementById("filter-date"),
    month: document.getElementById("filter-month"),
    year: document.getElementById("filter-year"),
  };
  const applyFilter = document.getElementById("apply-filter");
  const resultsBody = document.getElementById("results-body");
  const chartTypeSelector = document.getElementById("chart-type");
  const chartCanvas = document
    .getElementById("occurrence-chart")
    .getContext("2d");
  let allData = [];
  let chartInstance;

  // Fetch and Initialize
  fetchData();

  // Fetch Data from API
  async function fetchData() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch data");
      allData = await response.json();
      // renderTable(allData);
      updateChart(allData, "bar"); // Default chart type
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Unable to fetch data. Please try again later.");
    }
  }

  // Render Table
  function renderTable(data) {
    if (!data.length) {
      resultsBody.innerHTML = `<tr><td colspan="3" style="color: #fff;">No results found</td></tr>`;
      return;
    }
    resultsBody.innerHTML = data
      .map(
        (result) => `
        <tr>
          <td style="color: #fff;">${result.date || "N/A"}</td>
          <td style="color: #fff;">${result.first_round || "N/A"}</td>
          <td style="color: #fff;">${result.second_round || "N/A"}</td>
        </tr>`
      )
      .join("");
  }

  // Update Chart
  function updateChart(data, chartType) {
    const occurrences = countOccurrences(data);
    const labels = Object.keys(occurrences);
    const values = Object.values(occurrences);

    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(chartCanvas, {
      type: chartType === "horizontalBar" ? "bar" : chartType,
      data: {
        labels,
        datasets: [
          {
            label: "Occurrences",
            data: values,
            backgroundColor: generateColors(values.length, chartType),
            borderColor: "#FFFFFF", // White border for contrast
            borderWidth: 1,
          },
        ],
      },
      options: getChartOptions(chartType),
      plugins: [
        {
          id: "customBackground",
          beforeDraw: (chart) => {
            const ctx = chart.ctx;
            ctx.save();
            ctx.fillStyle = "#212121"; // Dark background color
            ctx.fillRect(0, 0, chart.width, chart.height);
            ctx.restore();
          },
        },
      ],
    });
  }

  // Count Occurrences of Numbers
  function countOccurrences(data) {
    return data.reduce((occurrences, result) => {
      [result.first_round, result.second_round].forEach((num) => {
        if (num) occurrences[num] = (occurrences[num] || 0) + 1;
      });
      return occurrences;
    }, {});
  }

  // Generate Chart Colors
  function generateColors(length, chartType) {
    const baseColors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
    ];
    if (chartType === "pie" || chartType === "radar") {
      return Array.from(
        { length },
        (_, i) => baseColors[i % baseColors.length]
      );
    }
    return "rgba(49, 185, 97, 0.7)";
  }

  // Get Chart Options
  function getChartOptions(chartType) {
    return {
      responsive: true,
      plugins: {
        legend: {
          display: chartType === "pie" || chartType === "radar",
          labels: {
            color: "#FFFFFF", // White legend text
          },
        },
      },
      scales:
        chartType === "pie" || chartType === "radar"
          ? {}
          : {
              x: {
                title: { display: true, text: "Numbers", color: "#FFFFFF" }, // White axis title
                ticks: { color: "#FFFFFF" }, // White tick labels
                grid: { color: "rgba(255, 255, 255, 0.2)" }, // Light gridlines
              },
              y: {
                title: { display: true, text: "Occurrences", color: "#FFFFFF" }, // White axis title
                ticks: { color: "#FFFFFF" }, // White tick labels
                grid: { color: "rgba(255, 255, 255, 0.2)" }, // Light gridlines
              },
            },
      indexAxis: chartType === "horizontalBar" ? "y" : "x",
    };
  }

  // Filter Data
  function filterData() {
    const filterValue = {
      date: filterInputs.date.value,
      month: filterInputs.month.value,
      year: filterInputs.year.value,
    };

    const filteredData = allData.filter((d) => {
      if (filterType.value === "date") return d.date === filterValue.date;
      if (filterType.value === "month") {
        const [year, month] = filterValue.month.split("-");
        return d.date.startsWith(`${year}-${month}`);
      }
      if (filterType.value === "year")
        return d.date.startsWith(filterValue.year);
      return true;
    });

    renderTable(filteredData);
    updateChart(filteredData, chartTypeSelector.value);
  }

  // Event Listeners
  filterType.addEventListener("change", () => {
    Object.keys(filterInputs).forEach((key) => {
      filterInputs[key].style.display =
        key === filterType.value ? "inline-block" : "none";
    });
  });

  applyFilter.addEventListener("click", filterData);
  chartTypeSelector.addEventListener("change", () => {
    updateChart(allData, chartTypeSelector.value);
  });
});
