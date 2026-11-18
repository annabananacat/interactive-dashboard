
/* Dashboard */

const sales = [
  40, 65, 50, 85, 70, 95,
  75, 88, 62, 90, 82, 100
];

const visits = [
  80, 55, 90, 60, 100, 75,
  85, 70, 95, 65, 88, 110
];

const months = [
  "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec"
];

/* HTML */
const chart = document.getElementById("chart");
const tooltip = document.getElementById("tooltip");
const chartTitle = document.getElementById("chartTitle");
const legendText = document.getElementById("legendText");

const salesBtn = document.getElementById("salesBtn");
const visitsBtn = document.getElementById("visitsBtn");
const themeToggle = document.getElementById("themeToggle");

const totalValue = document.getElementById("totalValue");
const averageValue = document.getElementById("averageValue");
const highestMonth = document.getElementById("highestMonth");

// Start with Sales data
let currentData = sales;



// Read colors from the active CSS theme
function getThemeColor(variable) {
  return getComputedStyle(document.body)
    .getPropertyValue(variable)
    .trim();
}

// Create SVG elements
function createSVGElement(type) {
  return document.createElementNS(
    "http://www.w3.org/2000/svg",
    type
  );
}

/* =================================
   UPDATE SUMMARY STATISTICS
================================= */

function updateStats(data) {
  // Calculate total
  const total = data.reduce(
    (sum, value) => sum + value,
    0
  );

  // Calculate monthly average
  const average = total / data.length;

  // Find highest value and its month
  const highest = Math.max(...data);
  const highestIndex = data.indexOf(highest);

  // Display results
  totalValue.textContent = total.toLocaleString();

  averageValue.textContent = average.toFixed(1);

  highestMonth.textContent =
    `${months[highestIndex]} (${highest})`;
}



function drawChart(data) {
  chart.innerHTML = "";
  tooltip.style.display = "none";

  const svg = createSVGElement("svg");

  svg.setAttribute("viewBox", "0 0 760 260");
  svg.setAttribute("width", "100%");



  svg.setAttribute("role", "group");

  const datasetName =
    data === sales ? "Sales" : "Website Visits";

  svg.setAttribute(
    "aria-label",
    `${datasetName} bar chart showing monthly values from January through December`
  );

  // Chart dimensions
  const chartBottom = 210;
  const chartHeight = 180;
  const maxValue = 120;
  const scale = chartHeight / maxValue;

  // Chart layout
  const chartLeft = 55;
  const barSpacing = 57;
  const barWidth = 32;
  const chartRight = 735;

  // Theme colors
  const normalColor = getThemeColor("--bar-color");
  const hoverColor = getThemeColor("--bar-hover");
  const labelColor = getThemeColor("--label-color");



  for (let value = 0; value <= maxValue; value += 30) {
    const y = chartBottom - value * scale;

    // Horizontal gridline
    const line = createSVGElement("line");

    line.setAttribute("x1", chartLeft - 5);
    line.setAttribute("y1", y);
    line.setAttribute("x2", chartRight);
    line.setAttribute("y2", y);

    line.setAttribute("stroke", labelColor);
    line.setAttribute("stroke-opacity", "0.25");
    line.setAttribute("stroke-dasharray", "4 4");

    svg.appendChild(line);

    // Numeric axis labels
    const axisLabel = createSVGElement("text");

    axisLabel.setAttribute("x", 35);
    axisLabel.setAttribute("y", y + 4);
    axisLabel.setAttribute("text-anchor", "end");
    axisLabel.setAttribute("font-size", "12");
    axisLabel.setAttribute("fill", labelColor);

    axisLabel.textContent = value;

    svg.appendChild(axisLabel);
  }

  /* Vertical Label */

  const yAxisLabel = createSVGElement("text");

  yAxisLabel.setAttribute("x", 14);
  yAxisLabel.setAttribute("y", 120);
  yAxisLabel.setAttribute("text-anchor", "middle");
  yAxisLabel.setAttribute("font-size", "13");
  yAxisLabel.setAttribute("font-weight", "bold");
  yAxisLabel.setAttribute("fill", labelColor);

  yAxisLabel.setAttribute(
    "transform",
    "rotate(-90 14 120)"
  );

  yAxisLabel.textContent = "Value";

  svg.appendChild(yAxisLabel);

  /*  Bars */

  data.forEach((value, index) => {
    const bar = createSVGElement("rect");

    const x = chartLeft + index * barSpacing;
    const barHeight = value * scale;
    const y = chartBottom - barHeight;

    // Bar appearance
    bar.setAttribute("x", x);
    bar.setAttribute("y", y);
    bar.setAttribute("width", barWidth);
    bar.setAttribute("height", barHeight);
    bar.setAttribute("fill", normalColor);
    bar.setAttribute("class", "bar");

    // Keyboard and screen reader accessibility
    bar.setAttribute("tabindex", "0");
    bar.setAttribute("role", "img");

    bar.setAttribute(
      "aria-label",
      `${months[index]}: ${value}`
    );

    /* Tooltip */

    function showTooltip() {
      bar.setAttribute("fill", hoverColor);

      tooltip.textContent =
        `${months[index]}: ${value}`;

      tooltip.style.display = "block";
    }

    function hideTooltip() {
      bar.setAttribute("fill", normalColor);
      tooltip.style.display = "none";
    }

    // Position tooltip near mouse
    function positionTooltip(event) {
      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;

      const left = Math.min(
        event.clientX + 10,
        window.innerWidth - tooltipWidth - 8
      );

      const top = Math.max(
        8,
        event.clientY - tooltipHeight - 10
      );

      tooltip.style.left =
        `${Math.max(8, left)}px`;

      tooltip.style.top = `${top}px`;
    }

    /* Mouse Interactions */

    bar.addEventListener("mouseenter", (event) => {
      showTooltip();
      positionTooltip(event);
    });

    bar.addEventListener("mousemove", (event) => {
      positionTooltip(event);
    });

    bar.addEventListener("mouseleave", () => {
      if (document.activeElement !== bar) {
        hideTooltip();
      }
    });

    /* Keyboard Focus*/

    bar.addEventListener("focus", () => {
      showTooltip();

      const rect = bar.getBoundingClientRect();
      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;

      const left = Math.max(
        8,
        Math.min(
          rect.left + rect.width / 2 - tooltipWidth / 2,
          window.innerWidth - tooltipWidth - 8
        )
      );

      const top = Math.max(
        8,
        rect.top - tooltipHeight - 10
      );

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    });

    bar.addEventListener("blur", () => {
      hideTooltip();
    });

    /* Touchscreen Interaction*/

    bar.addEventListener("click", () => {
      bar.focus();
    });

    svg.appendChild(bar);

    /* Month Labels */

    const label = createSVGElement("text");

    label.setAttribute(
      "x",
      x + barWidth / 2
    );

    label.setAttribute("y", 235);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "13");
    label.setAttribute("fill", labelColor);

    label.textContent = months[index];

    svg.appendChild(label);
  });

  // Display chart
  chart.appendChild(svg);
}

/* Sales button*/

salesBtn.addEventListener("click", () => {
  currentData = sales;

  chartTitle.textContent =
    "Monthly Sales Performance";

  legendText.textContent = "Sales";

  salesBtn.classList.add("active");
  visitsBtn.classList.remove("active");

  salesBtn.setAttribute("aria-pressed", "true");
  visitsBtn.setAttribute("aria-pressed", "false");

  updateStats(currentData);
  drawChart(currentData);
});

/* Website visits button */

visitsBtn.addEventListener("click", () => {
  currentData = visits;

  chartTitle.textContent =
    "Monthly Website Visits";

  legendText.textContent = "Website Visits";

  visitsBtn.classList.add("active");
  salesBtn.classList.remove("active");

  visitsBtn.setAttribute("aria-pressed", "true");
  salesBtn.setAttribute("aria-pressed", "false");

  updateStats(currentData);
  drawChart(currentData);
});

/*Light/Darkmode */

function updateTheme() {
  const isDark =
    document.body.classList.contains("dark-mode");

  themeToggle.textContent = isDark
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";

  themeToggle.setAttribute(
    "aria-pressed",
    String(isDark)
  );

  drawChart(currentData);
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  const isDark =
    document.body.classList.contains("dark-mode");

  // Remember selected theme
  try {
    localStorage.setItem(
      "dashboardTheme",
      isDark ? "dark" : "light"
    );
  } catch (error) {
    console.warn("Theme preference could not be saved.");
  }

  updateTheme();
});

/* Initial dashboard */

// Set Sales as the active dataset
salesBtn.classList.add("active");

salesBtn.setAttribute("aria-pressed", "true");
visitsBtn.setAttribute("aria-pressed", "false");

legendText.textContent = "Sales";

// Restore saved theme
let savedTheme = null;

try {
  savedTheme = localStorage.getItem("dashboardTheme");
} catch (error) {
  console.warn("Theme preference could not be loaded.");
}

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
}

// Display initial statistics
updateStats(currentData);

// Display initial chart and theme
updateTheme();
