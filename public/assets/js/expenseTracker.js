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
  let update = false;

  if ($("#saveNewExpense").attr("action") === "update") {
    update = true;
  }

  if (update === true) {
    apiUrl = $("#newExpenseForm").attr("action");
  }

  fetch(apiUrl, {
    method: update === true ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expenseData),
  })
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      $(".errorMessage").text("");
      //if (res) {
      $("#newExpenseForm")[0].reset();

      $("#expenseTable")
        .DataTable()
        .row.add({
          item: res.item,
          expenseAmount: res.expenseAmount,
          expenseCategory: res.expenseCategory,
          expenseDate: res.expenseDate,
          notes: res.notes,
        })
        .draw(false);
      $("#newExpenseModal").modal("hide");
      //   } else {
      //     res.errors.forEach((error) => {
      //       $("." + error.param + "Error").text(error.msg);
      //     });
      //   }
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
            return moment(data).format("MM/DD/YYYY");
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

$("#expenseTable tbody").on("click", ".editExpense", function () {
  var rowId = $(this).data("value");
  var data = expenseTable.row($("#" + rowId)).data();

  $("#newExpenseModalLabel").text(data.item);
  $("#saveNewExpense").text("Update");
  $("#item").val(data.item);
  $("#expenseId").val(data.expenseId);
  $("#expenseAmount").val(data.expenseAmount);
  $("#expenseCategory").val(data.expenseCategory);
  $("#notes").val(data.notes);
  $("#expenseDate").val(moment(data.expenseDate).format("MM/DD/YYYY"));

  $("#newExpenseForm").attr("action", "/api/expense/" + data.expenseId);
  $("#saveNewExpense").attr("action", "update");

  $("#newExpenseModal").modal("show");
});

$("#expenseTable tbody").on("click", ".deleteExpense", function () {
  var expenseId = $(this).data("value");
  $("#continueDelete").attr("data-option", "Expense");
  $("#continueDelete").attr("data-id", expenseId);
  $("#actionMessage").text(`This operation can not be reversed. Please
    make sure to reassign other agents to the location which this agent is currently
    assigned before proceeding.`);
  $("#deleteConfirmationModal").modal("show");
});

$("#newExpenseBtn").on("click", () => {
  $("#newExpenseModalLabel").text("New Expense");
  $("#newExpenseForm").attr("action", "/api/expense");
  $("#saveNewExpense").text("Save");
});

$("#closeDeleteConfirmationModal").on("click", () => {
  $("#confirmDeleteErrorMesaage").text("");
  $("#confirmDeleteSuccessMesaage").addClass("d-none");
  $("#deleteModalBody").removeClass("d-none");
  $("#deleteSuccessConfirmationModalLabel").addClass("d-none");
  $("#deleteConfirmationModalLabel").removeClass("d-none");
  $("#continueDelete").removeClass("d-none");
  $("#deleteConfirmationModal").modal("hide");
});
