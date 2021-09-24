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

// $("#newExpenseBtn").on("click", () => {
//   $(function () {

//   });
// });

$("#saveNewExpense").on("click", () => {
  var expenseData = {
    expenseId: $("#expenseId").val(),
    item: $("#item").val(),
    notes: $("#notes").val(),
    expenseCategory: $("#expenseCategory").val(),
    expenseAmount: $("#expenseAmount").val(),
    expenseDate: $("#expenseDate")
      .data("datetimepicker")
      .date()
      .format("MM/DD/YYYY"),
  };

  var apiUrl = "/api/expense";
  let update = false;

  if ($("#saveNewExpense").attr("action") === "update") {
    update = true;
  }

  if (update === true) {
    apiUrl += "/" + expenseData.expenseId;
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
      $("#newExpenseForm")[0].reset();
      if (update === false) {
        expenseData = {
          expenseId: res.expenseId,
          item: res.item,
          expenseAmount: res.expenseAmount,
          expenseCategory: res.expenseCategory,
          expenseDate: res.expenseDate,
          notes: res.notes,
        };

        $("#expenseTable").DataTable().row.add(expenseData).draw(false);
      } else {
        $("#expenseTable")
          .DataTable()
          .row("#" + expenseData.expenseId)
          .data(expenseData)
          .draw();
      }

      $("#newExpenseModal").modal("hide");
      $("#expenseDate").datetimepicker("destroy");
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
        type: "date",
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

  $("#expenseDate").datetimepicker({
    format: "MM/DD/YYYY",
  });

  $("#newExpenseModalLabel").text(data.item);
  $("#saveNewExpense").text("Update");
  $("#item").val(data.item);
  $("#expenseId").val(data.expenseId);
  $("#expenseAmount").val(data.expenseAmount);
  $("#expenseCategory").val(data.expenseCategory);
  $("#notes").val(data.notes);
  var expenseDate = moment(data.expenseDate).format("MM/DD/YYYY");
  //$("#expenseDate").val();

  $("#newExpenseForm").attr("action", "/api/expense/" + data.expenseId);
  $("#saveNewExpense").attr("action", "update");
  $("#newExpenseModal").modal("show");
  $("#expenseDate").datetimepicker("date", expenseDate);
});

$("#expenseTable tbody").on("click", ".deleteExpense", function () {
  var expenseId = $(this).data("value");
  $("#continueDelete").attr("data-option", "Expense");
  $("#continueDelete").attr("data-id", expenseId);
  $("#deleteConfirmationModal").modal("show");
});

$("#newExpenseBtn").on("click", () => {
  $("#newExpenseModalLabel").text("New Expense");
  $("#newExpenseForm").attr("action", "/api/expense");
  $("#saveNewExpense").text("Save");
  $("#expenseDate").datetimepicker({
    format: "MM/DD/YYYY",
  });
});

$("#closeDeleteConfirmationModal").on("click", () => {
  $("#confirmDeleteErrorMessage").text("");
  $("#confirmDeleteSuccessMessage").addClass("d-none");
  $("#deleteModalBody").removeClass("d-none");
  $("#deleteSuccessConfirmationModalLabel").addClass("d-none");
  $("#deleteConfirmationModalLabel").removeClass("d-none");
  $("#continueDelete").removeClass("d-none");
  $("#deleteConfirmationModal").modal("hide");
});

$("#continueDelete").on("click", () => {
  var expenseIdParam = $("#continueDelete").attr("data-id");
  var apiRouteUrl = "/api/expense/" + expenseIdParam;
  fetch(apiRouteUrl, {
    method: "POST",
  }).then((res) => {
    //$("#confirmDeleteErrorMessage").text(res.errors[0].message);
    $("#expenseTable").DataTable().row().remove(`${expenseIdParam}`).draw();
    $("#expenseItemSpan").text($("#continueDelete").attr("data-option"));
    $("#confirmDeleteSuccessMesaage").removeClass("d-none");
    $("#deleteModalBody").addClass("d-none");
    $("#deleteSuccessConfirmationModalLabel").removeClass("d-none");
    $("#continueDelete").addClass("d-none");
    $("#deleteConfirmationModalLabel").addClass("d-none");
    $(".message").text("");
  });
});
