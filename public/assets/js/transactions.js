localStorage.removeItem("activeTab");

$("#transactionFilter").selectize({
  onChange: function (value) {
    if (value.length > 0) {
      getData();
    }
  },
});

fetch(`/api/getLocations`)
  .then((data) => {
    return data.json();
  })
  .then((res) => {
    $("#locationName").selectize({
      maxItems: 1,
      create: false,
      labelField: "locationName",
      valueField: "locationUID",
      searchField: "locationName",
      placeholder: "Choose Location",
      options: res,
      render: {
        option: function (item, escape) {
          return "<div>" + escape(item.locationName) + "</div>";
        },
      },
      onChange: function (value) {
        if (
          value.length > 0 &&
          $("#transactionFilter")[0].selectize.getValue().length > 0
        ) {
          getData();
        }
      },
    });
  });

function getData() {
  const locationUID = $("#locationName")[0].selectize.getValue();
  const transactionFilter = $("#transactionFilter")[0].selectize.getValue();
  fetch(`/api/transaction/getTransactions/${locationUID}/${transactionFilter}`)
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      if (!$.fn.DataTable.isDataTable("#transactionsTable")) {
        renderTransactionsTable(res.transactions);
      } else {
        $("#transactionsTable").DataTable().clear().draw();
        $("#transactionsTable").DataTable().rows.add(res.transactions).draw();
      }
      $("#transactionCount").text(
        `${
          res.transactionCount === 0 ? "No" : res.transactionCount
        } Transaction${res.transactions.length === 1 ? "" : "s"} Today`
      );
      $("#estimatedProfit").html(
        `Estimated Profit: &#8358;${numeral(res.estimatedProfit).format(
          "0,0.00"
        )}`
      );
      $("#results").removeClass("d-none");
      $("#infoBtn").removeClass("d-none");
    });
}

// fetch(`/api/transactions/todayByLocation`)
//   .then((data) => {
//     return data.json();
//   })
//   .then((res) => {
// res.forEach((locationInfo, key) => {
//   $("#locationTabLinks").append(
//     `<a class="nav-link ${
//       key === 0 && "active"
//     }" data-toggle="tab" href="#${
//       locationInfo.locationName
//     }TransactionsTab">${locationInfo.locationName}</a>`
//   );

//   let tabContent = `
//       <div class="tab-pane fade mt-4 ${key === 0 && "show active"}" id="${
//     locationInfo.locationName
//   }TransactionsTab" role="tabpanel" aria-labelledby="${
//     locationInfo.locationName
//   }-transactions-tab">
//         <nav class="nav nav-pills nav-justified">
//           <a class="nav-link active" data-toggle="tab" href="#${
//             locationInfo.locationName
//           }DayTransactionsTab">Day</a>
//           <a class="nav-link" data-toggle="tab" href="#${
//             locationInfo.locationName
//           }MonthTransactionsTab">Month</a>
//           <a class="nav-link" data-toggle="tab" href="#${
//             locationInfo.locationName
//           }YearTransactionsTab">Year</a>
//         </nav>

//         <div class="tab-content">
//           <div class="tab-pane fade mt-4 ${
//             key == 0 ? "show active" : "ok"
//           }" id="${
//     locationInfo.locationName
//   }DayTransactionsTab" role="tabpanel" aria-labelledby="${
//     locationInfo.locationName
//   }-day-transactions-tab">
//             <p>
//               <button id="" class="btn btn-sm btn-outline-dark mr-2">${
//                 locationInfo.transactionCount === 0
//                   ? "No"
//                   : locationInfo.transactionCount
//               } Transaction${
//     locationInfo.transactions.length === 1 ? "" : "s"
//   } Today</button>
//               <button class="btn btn-sm btn-outline-success">Day's Estimated Profit: &#8358;${numeral(
//                 locationInfo.daysEstimatedProfit
//               ).format("0,0.00")}</button>
//             </p>
//             <table id="${
//               locationInfo.locationName
//             }DayTransactionsTable" class="table table-striped" style="width: 100%;">
//               <thead class="thead-light">
//                   <tr>
//                       <th scope="col">ID</th>
//                       <th scope="col">Terminal</th>
//                       <th scope="col">Type</th>
//                       <th scope="col">Amount</th>
//                       <th scope="col">Charge</th>
//                       <th scope="col">Pos Charge</th>
//                       <th scope="col">Recorded By</th>
//                       <th scope="col">Time</th>
//                   </tr>
//               </thead>
//               <tbody></tbody>
//             </table>
//           </div>
//           <div class="tab-pane fade mt-4" id="${
//             locationInfo.locationName
//           }MonthTransactionsTab" role="tabpanel" aria-labelledby="${
//     locationInfo.locationName
//   }-month-transactions-tab">${
//     locationInfo.locationName
//   } Monthly Analysis</div>
//           <div class="tab-pane fade mt-4" id="${
//             locationInfo.locationName
//           }YearTransactionsTab" role="tabpanel" aria-labelledby="${
//     locationInfo.locationName
//   }-year-transactions-tab">${
//     locationInfo.locationName
//   } Yearly Analysis</div>
//         </div>
//       </div>
//   `;
//   $("#locationsContent").append(tabContent);
//   renderTransactionsTable(locationInfo);
// });
// });

function renderTransactionsTable(data) {
  $(`#transactionsTable`).DataTable({
    data: data,
    rowId: "transactionUID",
    responsive: true,
    language: {
      sEmptyTable: "No Transactions Available",
    },
    order: [[7, "desc"]],
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
