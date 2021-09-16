localStorage.removeItem("activeTab");

var dynamicColors = function () {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
};

$("input[name='dataOption']").click(function () {
  var time = $("input[name='dataOption']:checked").val();
  if (time) {
    getLocationChartsData(time);
  }
});

getLocationNames = (data) => {
  let locationNames = data.map((l) => {
    return l.locationName;
  });
  return locationNames;
};

getTransactionCounts = (data) => {
  let transactionCounts = data.map((t) => {
    return t.transactionCount;
  });
  return transactionCounts;
};

getTransactionAmounts = (data) => {
  let transactionAmounts = data.map((ta) => {
    return ta.transactionAmount;
  });
  return transactionAmounts;
};

getTransactionCharges = (data) => {
  let transactionCharges = data.map((tc) => {
    return tc.transactionCharge;
  });
  return transactionCharges;
};

getPosCharges = (data) => {
  let posCharges = data.map((pc) => {
    return pc.posCharge;
  });
  return posCharges;
};

getEstimatedProfits = (data) => {
  let estimatedProfits = data.map((ep) => {
    return ep.estimatedProfit;
  });
  return estimatedProfits;
};

getLocationChartsData = (time) => {
  fetch(`/api/transactions/chart/byLocation/${time}`)
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      let locationNames = getLocationNames(res);
      let transactionCounts = getTransactionCounts(res);
      let transactionAmounts = getTransactionAmounts(res);
      let transactionCharges = getTransactionCharges(res);
      let posCharges = getPosCharges(res);
      let estimatedProfits = getEstimatedProfits(res);

      buildTransactionsChart(locationNames, transactionCounts);
      buildTransactionAmountsChart(locationNames, transactionAmounts);
      buildEstimatedProfitsChart(locationNames, estimatedProfits);
      buildChargesChart(locationNames, posCharges, transactionCharges);
    });
};

buildTransactionsChart = (locationNames, transactionCounts) => {
  var ctx = $("#transactionsChart");
  var transactionsChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: locationNames,
      datasets: [
        {
          label: ["Transactions By Locations"],
          data: transactionCounts,
          backgroundColor: [
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              min: 0,
              suggestedMax: 5,
              stepSize: 0.5,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      responsive: true,
    },
  });
};

buildTransactionAmountsChart = (locationNames, transactionAmounts) => {
  var ctx = $("#transactionAmountsChart");
  var transactionAmountsChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: locationNames,
      datasets: [
        {
          label: [`Transaction Amounts By Locations`],
          data: transactionAmounts,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      responsive: true,
    },
  });
};

buildEstimatedProfitsChart = (locationNames, estimatedProfits) => {
  var epctx = $("#estimatedProfitsChart");
  var estimatedProfitsChart = new Chart(epctx, {
    type: "bar",
    data: {
      labels: locationNames,
      datasets: [
        {
          label: ["Estimated Profits By Locations"],
          data: estimatedProfits,
          backgroundColor: [
            "rgba(50, 205, 50, 0.5)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(50, 205, 50, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      responsive: true,
    },
  });
};

buildChargesChart = (locationNames, posCharges, transactionCharges) => {
  var cctx = $("#chargesChart");
  var chargesChart = new Chart(cctx, {
    type: "line",
    data: {
      labels: locationNames,
      datasets: [
        {
          label: "POS Charges",
          data: posCharges,
          backgroundColor: "transparent",
          borderColor: ["rgba(153, 102, 255, 1)", "rgba(153, 102, 255, 0.2)"],
        },
        {
          label: "Transaction Charges",
          data: transactionCharges,
          backgroundColor: "transparent",
          borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 0.2)"],
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      responsive: true,
    },
  });
};

fetch(`/api/transactions/getMostRecent`)
  .then((data) => {
    return data.json();
  })
  .then((res) => {
    res.forEach((transaction) => {
      var transactionData = `
      <tr>
        <td>${transaction.locationName}</td>
        <td>${transaction.transactionTerminal}</td>
        <td>&#8358;${numeral(transaction.transactionAmount).format(
          "0,0.00"
        )}</td>
        <td>${transaction.transactionType}</td>
        <td>${transaction.preparedBy}</td>
        <td>${moment(transaction.createdAt).fromNow()}</td>
      </tr>
      `;
      $("#recentActivity").append(transactionData);
    });
  });

getLocationChartsData("day");
