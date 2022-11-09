let customersTable;
fetch(`/api/autoTracker/customers`)
  .then((data) => {
    return data.json();
  })
  .then((res) => {
    renderCustomersTable(res);
  });

function renderCustomersTable(data) {
  customersTable = $("#customersTable").DataTable({
    data: data,
    rowId: "customerId",
    responsive: true,
    dom: "lBfrtip",
    buttons: ["pdf", "excel", "print"],
    columns: [
      {
        className: "customerExternalId",
        data: "customerExternalId",
      },
      {
        className: "customerName text-center",
        data: null,
        render: function (data, type, row, meta) {
          return `<span><a href='/autoTracker/customer/${
            data.customerId
          }' target='_blank'>${data.customerName}</a> 
          <button class="btn btn-sm btn-outline-info" data-toggle="tooltip" data-placement="top" title="${
            data.privilege
          } User">${data.privilege.toUpperCase()[0]}</button>
          </span>`;
        },
      },
      {
        className: "customerEmail text-center",
        data: "customerEmail",
      },
      {
        className: "customerPhone text-center",
        data: "customerPhone",
      },
      {
        className: "ipAddress text-center",
        data: "ipAddress",
      },
      {
        className: "lastLoginDate text-center",
        data: "lastLoginDate",
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
        className: "expiresOn text-center",
        data: "expiresOn",
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
        className: "registeredOn text-center",
        data: "registeredOn",
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
        data: null,
        orderable: false,
        className: "customerOptions",
        render: function (data, type, row, meta) {
          return `<a href="/autotracker/tracker/new/${data.customerId}" type="button" class="addTracker btn btn-success mr-1" data-toggle="tooltip" data-placement="top" title="Add Tracker for this customer"><i class="fas fa-plus"></i><a/>
                  <a href="/autotracker/customer/edit/${data.customerId}" type="button" class="editCustomer btn btn-warning mr-1" data-toggle="tooltip" data-placement="top" title="Edit Customer Info"><i class="fas fa-edit"></i><a/>
                  <button id="activateDeleteCustomerModal" data-value="${data.customerId}" data-option="${data.customerName}" class="deleteCustomer btn btn-danger" data-toggle="tooltip" data-placement="top" title="Delete Customer"><i class="fas fa-trash-alt"></i></button>`;
        },
      },
    ],
  });
}

$("#customersTable tbody").on("click", ".deleteCustomer", function () {
  var customerId = $(this).data("value");
  $("#continueDelete").attr("data-option", "Customer");
  $("#continueDelete").attr("data-id", customerId);
  $("#deleteConfirmationModal").modal("show");
});

$("#continueDelete").on("click", () => {
  var customerIdParam = $("#continueDelete").attr("data-id");
  var apiRouteUrl = "/api/autoTracker/customer/" + customerIdParam;
  fetch(apiRouteUrl, {
    method: "DELETE",
  }).then((res) => {
    $("#customersTable").DataTable().row().remove(`${customerIdParam}`).draw();
    $("#customerNameSpan").text($("#continueDelete").attr("data-option"));
    $("#confirmDeleteSuccessMesaage").removeClass("d-none");
    $("#deleteModalBody").addClass("d-none");
    $("#deleteSuccessConfirmationModalLabel").removeClass("d-none");
    $("#continueDelete").addClass("d-none");
    $("#deleteConfirmationModalLabel").addClass("d-none");
    $(".message").text("");
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
