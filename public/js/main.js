document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById('repoForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const repoUrl1 = document.getElementById('repoUrl1').value;
    const repoUrl2 = document.getElementById('repoUrl2').value;

    if (validateUrl(repoUrl1) && validateUrl(repoUrl2)) {
      form.style.display = 'none';
      showAlertSpinner('Gathering data, please wait, this may take a while...', 'info');
      loadChartPluginThenFetchData(repoUrl1, repoUrl2);
    } else {
      console.log('Validation failed for one or both URLs');
      alert('Please enter valid GitHub repository URLs.');
    }
  });

  function showAlertSpinner(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} d-flex align-items-center`;
    alertDiv.innerHTML = `
      <div class="spinner-border text-primary me-3" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      ${message}
      <button type="button" class="btn btn-primary btn-sm ms-auto" onclick="goBack()">Go Back</button>
    `;

    const alertPlaceholder = document.getElementById('alertPlaceholder');
    if(alertPlaceholder) {
      alertPlaceholder.innerHTML = '';
      alertPlaceholder.appendChild(alertDiv);
    } else {
      console.error('Alert placeholder element is not found in the document.');
    }
  }

  window.goBack = function() {
    const alertDiv = document.querySelector('#alertPlaceholder .alert');
    if(alertDiv) {
      alertDiv.remove();
    } else {
      console.error('Alert element could not be found when attempting to remove it.');
    }
    form.style.display = 'block';
  };

  function loadChartPluginThenFetchData(repoUrl1, repoUrl2) {
    if (typeof Chart === 'undefined') {
      console.error('Chart is not defined. Make sure Chart.js is loaded.'); // gpt_pilot_debugging_log
      alert('Chart rendering library not loaded. Please refresh the page and try again.');
      return;
    }

    fetch('/github/fetch-stars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ repoUrl1, repoUrl2 })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Successfully fetched star history data', data); // gpt_pilot_debugging_log
      createChart(data);
      const alertDiv = document.querySelector('#alertPlaceholder .alert');
      if(alertDiv) {
        alertDiv.remove();
      }
      form.style.display = 'block';
    })
    .catch(error => {
      console.error('Error fetching star history:', error); // gpt_pilot_debugging_log
      alert('Failed to fetch star history. Please try again.');
    });
  }

  function createChart(data) {
    const ctx = document.getElementById('starChart').getContext('2d');

    const chartLabels = data[0].stars.map(entry => moment(entry.date).format('YYYY-MM-DD'));
    const dataSets = data.map((repoData, index) => {
      return {
        label: repoData.repoName,
        data: repoData.stars.map(entry => {
          return { x: moment(entry.date).format('YYYY-MM-DD'), y: entry.count };
        }),
        fill: false,
        borderColor: index === 0 ? 'rgb(255, 99, 132)' : 'rgb(54, 162, 235)',
        tension: 0.1
      };
    });

    if (window.starHistoryChart) {
      window.starHistoryChart.destroy();
    }

    try {
      window.starHistoryChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: chartLabels,
          datasets: dataSets
        },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'time',
              time: {
                parser: 'YYYY-MM-DD',
                tooltipFormat: 'll',
              },
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Star Count'
              }
            }
          },
          plugins: {
            zoom: {
              limits: {
                x: {min: 'original', max: 'original', minRange: 1},
                y: {min: 'original', max: 'original', minRange: 1}
              },
              zoom: {
                wheel: {
                  enabled: true
                },
                pinch: {
                  enabled: true
                },
                mode: 'xy'
              },
              pan: {
                enabled: true,
                mode: 'xy',
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error initializing the chart:', error.stack || error); // gpt_pilot_debugging_log
      alert('An error occurred while initializing the chart. Please try again.');
    }
  }
});