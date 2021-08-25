localStorage.removeItem("activeTab");

fetch(`/api/transactions/todayByLocation`)
  .then((data) => {
    return data.json();
  })
  .then((res) => {
    res.forEach((locationInfo, key) => {
      $("#locationTabLinks").append(
        `<a class="nav-link ${
          key === 0 && "active"
        }" data-toggle="tab" href="#${
          locationInfo.locationName
        }TransactionsTab">${locationInfo.locationName}</a>`
      );
      let tabContent = `
            <div
            class="tab-pane fade mt-4 ${key === 0 && "show active"}"
            id="${locationInfo.locationName}TransactionsTab"
            role="tabpanel"
            aria-labelledby="${locationInfo.locationName}-transactions-tab"
            >
            <p><button
                id=""
                class="btn btn-sm btn-outline-dark"
                >${
                  locationInfo.transactionCount
                } Transactions Today</button></p>
            <table
                id="${locationInfo.locationName}TransactionsTable"
                class="table table-striped"
                style="width: 100%;"
            >
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Terminal</th>
                        <th scope="col">Type</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Charge</th>
                        <th scope="col">Pos Charge</th>
                        <th scope="col">Recorded By</th>
                        <th scope="col">Time</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            </div>
      `;
      $("#locationsContent").append(tabContent);
      renderTransactionsTable(locationInfo);
    });
  });

function renderTransactionsTable(data) {
  $(`#${data.locationName}TransactionsTable`).DataTable({
    data: data.transactions,
    rowId: "transactionUID",
    responsive: true,
    language: {
      sEmptyTable: "No Transactions Available",
    },
    columns: [
      {
        className: "transactionUID",
        data: "transactionUID",
        render: function (data, type, row, meta) {
          return `<span><a href='/transaction/detail/${data}' target='_blank'>${data}</a></span>`;
        },
      },
      {
        className: "transactionTerminal",
        data: "transactionTerminal",
      },
      {
        className: "transactionType",
        data: "transactionType",
      },
      {
        className: "transactionAmount",
        data: "transactionAmount",
        render: function (data, type, row) {
          return `&#8358;${numeral(data).format("0,0.00")}`;
        },
      },
      {
        className: "transactionCharge",
        data: "transactionCharge",
        render: function (data, type, row) {
          return `&#8358;${numeral(data).format("0,0.00")}`;
        },
      },
      {
        className: "posCharge",
        data: "posCharge",
        render: function (data, type, row) {
          return `&#8358;${numeral(data).format("0,0.00")}`;
        },
      },
      {
        className: "preparedBy",
        data: "preparedBy",
      },
      {
        className: "Time",
        data: "createdAt",
        type: "date",
        render: function (data, type, row) {
          if (data !== null) {
            return moment(data).format("MM/DD/YYYY HH:mm");
          } else {
            return "";
          }
        },
      },
    ],
  });
}
