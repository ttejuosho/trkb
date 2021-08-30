localStorage.removeItem("activeTab");

function getTransactionCount(obj) {
  console.log(obj);
  return obj.transactionCount;
}

var dynamicColors = function () {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
};

fetch(`/api/transactions/todayByLocation`)
  .then((data) => {
    return data.json();
  })
  .then((res) => {
    var locationNames = res.map((l) => {
      return l.locationName;
    });
    var transactionCounts = res.map((t) => {
      return t.transactionCount;
    });

    var ctx = $("#LocationTransactionsChart");
    var locationTransactionsChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: locationNames,
        datasets: [
          {
            label: "Transactions By Locations",
            data: transactionCounts,
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
            borderColor: "rgba(255, 99, 132, 1)",
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
  });

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

    var ctx = $("#RecentTransactionsChart");
    var recentTransactionsChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Lagos", "Abuja", "Chicago", "Aurora"],
        datasets: [
          {
            label: "Yesterday",
            data: [7, 14, 3, 10],
            backgroundColor: "transparent",
            borderColor: "rgba(255, 99, 132, 1)",
          },
          {
            label: "Last Week",
            data: [17, 4, 13, 9],
            backgroundColor: "transparent",
            borderColor: "rgba(54, 162, 235, 1)",
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
  });
