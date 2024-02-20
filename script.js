document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("fileInput");
  const chartContainer = document.getElementById("chartContainer");
  const resetButton = document.getElementById("resetButton");
  let chart = null;

  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];
    if (file) {
      parseExcel(file);
    }
  });

  resetButton.addEventListener("click", function () {
    // Hapus grafik jika ada
    if (chart) {
      chart.destroy();
      chart = null; // Reset variabel chart
    }
    // Kosongkan input file
    fileInput.value = null;
  });

  function parseExcel(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      renderChart(jsonData);
    };

    reader.readAsArrayBuffer(file);
  }

  function renderChart(data) {
    // Clear chart container if it has previous chart
    while (chartContainer.firstChild) {
      chartContainer.removeChild(chartContainer.firstChild);
    }

    // Create new chart canvas
    const canvas = document.createElement("canvas");
    chartContainer.appendChild(canvas);

    // Get chart data from Excel
    const labels = data[0].slice(1); // Assuming the first row contains labels
    const datasets = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const datasetLabel = row[0]; // Assuming the first column contains dataset label
      const values = row.slice(1);

      datasets.push({
        label: datasetLabel,
        data: values,
        backgroundColor: getRandomColor(),
        borderColor: getRandomColor(),
        borderWidth: 1,
      });
    }

    // Create chart using Chart.js
    chart = new Chart(canvas, {
      type: "bar",
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
  }

  // Function to generate random color
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
});

function validateExcel(file) {
  // Validasi jenis file
  const allowedExtensions = /(\.xlsx|\.xls)$/i;
  if (!allowedExtensions.exec(file.name)) {
    alert("Hanya file Excel yang diperbolehkan: .xlsx atau .xls");
    return false;
  }

  // Validasi ukuran file
  const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxSizeInBytes) {
    alert("Ukuran file terlalu besar. Maksimum 10 MB.");
    return false;
  }

  return true;
}

fileInput.addEventListener("change", function () {
  const file = fileInput.files[0];
  if (file) {
    if (validateExcel(file)) {
      parseExcel(file);
    }
  }
});
