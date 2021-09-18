console.log("Ex-Trak");
let expenseTable;

fetch(`/api/expense`)
  .then((data) => {
    return data.json();
  })
  .then((res) => {
    renderExpenseTable(res);
  });

$("#closeNewExpenseModal").on("click", () => {
  $("#newExpenseForm")[0].reset();
  $(".message").text("");
  $(".newExpenseServerMessages").text("");
  $(".messageError").text("");
  $("#newExpenseModal").modal("hide");
});

$("#saveNewExpense").on("click", () => {
  var expenseData = {
    item: $("#item").val(),
    notes: $("#notes").val(),
    expenseCategory: $("#expenseCategory").val(),
    expenseAmount: $("#expenseAmount").val(),
    expenseDate: $("#expenseDate").val(),
  };

  var apiUrl = "/api/expense";

  if ($("#saveNewExpense").attr("action") == "update") {
    apiUrl = $("#newExpenseForm").attr("action");
  }

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expenseData),
  })
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      $(".errorMessage").text("");
      if (res.errors.length < 1) {
        $("#newExpenseForm")[0].reset();

        // $("#expenseTable")
        //   .DataTable()
        //   .row.add({
        //     locationId: res.response.locationId,
        //     locationUID: res.response.locationUID,
        //     locationName: expenseData.locationName,
        //     locationAddress: expenseData.locationAddress,
        //   })
        //   .draw(false);
        $("#newExpenseModal").modal("hide");
      } else {
        res.errors.forEach((error) => {
          $("." + error.param + "Error").text(error.msg);
        });
      }
    });
});

function renderExpenseTable(data) {
  expenseTable = $("#expenseTable").DataTable({
    data: data,
    rowId: "expenseId",
    responsive: true,
    dom: "lBfrtip",
    buttons: ["pdf", "excel", "print"],
    columns: [
      {
        className: "item",
        data: "item",
      },
      {
        className: "expenseAmount",
        data: "expenseAmount",
        render: function (data, type, row) {
          return `&#8358;${numeral(data).format("0,0.00")}`;
        },
      },
      {
        className: "expenseCategory",
        data: "expenseCategory",
      },
      {
        className: "expenseDate",
        data: "expenseDate",
        render: function (data, type, row) {
          if (data !== null) {
            return moment(data).format("MM/DD/YYYY h:mm a");
          } else {
            return "";
          }
        },
      },
      {
        className: "notes",
        data: "notes",
      },
      {
        data: null,
        orderable: false,
        className: "expenseOptions",
        render: function (data, type, row, meta) {
          return (
            '<button id="activateEditExpenseModal" data-value="' +
            data.expenseId +
            '" class="editExpense btn btn-warning mr-1"><i class="fas fa-edit"></i></button> <button id="activateEditExpenseModal" data-value="' +
            data.expenseId +
            '" class="deleteExpense btn btn-danger"><i class="fas fa-trash-alt"></i></button>'
          );
        },
      },
    ],
  });
}
