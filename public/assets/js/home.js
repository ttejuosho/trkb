localStorage.removeItem("activeTab");

fetch(`/api/transactions/todayByLocation`)
  .then((data) => {
    return data.json();
  })
  .then((res) => {
    var ctx = $("#LocationTransactionsChart");
    var locationTransactionsChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Lagos", "Abuja", "Chicago", "Aurora"],
        datasets: [
          {
            label: "Transactions By Locations",
            data: [12, 19, 3, 16],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
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
        //responsive: true,
      },
    });
  });
