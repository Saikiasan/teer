document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("results");
  const paginationContainer = document.getElementById("pagination");
  const yearFilter = document.getElementById("year-filter");
  const monthFilter = document.getElementById("month-filter");
  const dayFilter = document.getElementById("day-filter");

  let allData = [];
  let filteredData = [];
  const itemsPerPage = 7;
  let currentPage = 1;

  fetch(CONFIG.API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data && Array.isArray(data)) {
        allData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        populateFilters(allData); // Populate dropdowns dynamically
        applyDefaultView();
      } else {
        resultsContainer.textContent = "No results available.";
      }
    })
    .catch((error) => {
      console.error("Error fetching the results:", error);
      resultsContainer.textContent =
        "Failed to load results. Please try again later.";
    });

  // Apply default view: Latest 7 days of the current month
  function applyDefaultView() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    filteredData = allData.filter((result) => {
      const resultDate = new Date(result.date);
      return (
        resultDate.getMonth() === currentMonth &&
        resultDate.getFullYear() === currentYear
      );
    });

    renderTable(filteredData.slice(0, itemsPerPage));
    applyFilters();
    renderPagination(filteredData);
  }

  // Render results table
  function renderTable(data) {
    resultsContainer.innerHTML = "";

    if (data.length === 0) {
      resultsContainer.textContent = "No results available.";
      return;
    }

    data.forEach((result) => {
      const resultRow = document.createElement("tr");
      resultRow.className = "result-container";

      const date = document.createElement("td");
      date.textContent = result.date;

      const result1 = document.createElement("td");
      result1.textContent = result.first_round;

      const result2 = document.createElement("td");
      result2.textContent = result.second_round;

      const resultYear = new Date(result.date).getFullYear();
      if (resultYear === 2024) {
        resultRow.style.backgroundColor = "#212121";
        resultRow.style.color = "#FFFFFF";
      } else if (resultYear === 2023) {
        resultRow.style.backgroundColor = "#3FB5BA";
        resultRow.style.color = "#000000";
      }

      resultRow.appendChild(date);
      resultRow.appendChild(result1);
      resultRow.appendChild(result2);
      resultsContainer.appendChild(resultRow);
    });
  }

  // Render pagination controls
  function renderPagination(data) {
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(data.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.textContent = i;
      pageButton.className = i === currentPage ? "active" : "";

      pageButton.addEventListener("click", () => {
        currentPage = i;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        renderTable(data.slice(startIndex, endIndex));
        renderPagination(data);
      });

      paginationContainer.appendChild(pageButton);
    }
  }

  // Populate year, month, and day filters dynamically
  function populateFilters(data) {
    const years = new Set();
    const months = new Set();
    const days = new Set();

    data.forEach((result) => {
      const resultDate = new Date(result.date);
      years.add(resultDate.getFullYear());
      months.add(resultDate.getMonth());
      days.add(resultDate.getDate());
    });

    populateDropdown(
      yearFilter,
      [...years].sort((a, b) => b - a)
    );
    populateDropdown(
      monthFilter,
      [...months].sort((a, b) => a - b),
      (month) => new Date(0, month).toLocaleString("default", { month: "long" })
    );
    populateDropdown(
      dayFilter,
      [...days].sort((a, b) => a - b)
    );
  }

  function populateDropdown(dropdown, values, labelFormatter = (val) => val) {
    dropdown.innerHTML = `<option value="">All</option>`;
    values.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = labelFormatter(value);
      dropdown.appendChild(option);
    });
  }

  // Apply filters
  yearFilter.addEventListener("change", () => {
    applyFilters(yearFilter.value, monthFilter.value, dayFilter.value);
  });

  monthFilter.addEventListener("change", () => {
    applyFilters(yearFilter.value, monthFilter.value, dayFilter.value);
  });

  dayFilter.addEventListener("change", () => {
    applyFilters(yearFilter.value, monthFilter.value, dayFilter.value);
  });

  function applyFilters(year, month, day) {
    filteredData = allData.filter((result) => {
      const resultDate = new Date(result.date);
      const yearMatch = year
        ? resultDate.getFullYear() === parseInt(year)
        : true;
      const monthMatch = month
        ? resultDate.getMonth() === parseInt(month)
        : true;
      const dayMatch = day ? resultDate.getDate() === parseInt(day) : true;
      return yearMatch && monthMatch && dayMatch;
    });

    currentPage = 1;
    renderTable(filteredData.slice(0, itemsPerPage));
    renderPagination(filteredData);
  }
});
