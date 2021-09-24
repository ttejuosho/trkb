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
        } Transaction${res.transactions.length === 1 ? "" : "s"} ${$(
          "#transactionFilter"
        )[0]
          .selectize.getItem($("#transactionFilter").val())
          .text()}`
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
            return moment(data).format("MM/DD/YYYY h:mm a");
          } else {
            return "";
          }
        },
      },
    ],
  });
}
