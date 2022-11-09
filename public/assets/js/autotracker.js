let autoTrackerTable;
let customerId = $("#customerId").val();
let currentYear = new Date().getFullYear();

for (let i = 2000; i < currentYear + 2; i++) {
  $("#vehicleYear").append(`<option value=${i}>${i}</option>`);
}

fetch(`/api/autoTracker/tracker/getByCustomerId/${customerId}`)
  .then((data) => {
    return data.json();
  })
  .then((res) => {
    renderAutoTrackerTable(res);
  });

$("#closeNewTrackerModal").on("click", () => {
  $("#newTrackerForm")[0].reset();
  $(".message").text("");
  $(".newTrackerServerMessages").text("");
  $(".messageError").text("");
  $("#newTrackerModal").modal("hide");
});

$("#expiresOn").datetimepicker({
  format: "L",
});

$("#registeredOn").datetimepicker({
  format: "L",
});

$("#lastLoginDate").datetimepicker({
  format: "L",
});

$("#expiresOn").on("change.datetimepicker", function (e) {
  $("#expiresOnValue").val(
    $("#expiresOn").data("datetimepicker").date().format("MM/DD/YYYY")
  );
});

$("#registeredOn").on("change.datetimepicker", function (e) {
  $("#registeredOnValue").val(
    $("#registeredOn").data("datetimepicker").date().format("MM/DD/YYYY")
  );
});

$("#lastLoginDate").on("change.datetimepicker", function (e) {
  $("#lastLoginDateValue").val(
    $("#lastLoginDate").data("datetimepicker").date().format("MM/DD/YYYY")
  );
});

function renderAutoTrackerTable(data) {
  autoTrackerTable = $("#autoTrackerTable").DataTable({
    data: data,
    rowId: "trackerId",
    responsive: true,
    dom: "lBfrtip",
    buttons: ["pdf", "excel", "print"],
    columns: [
      {
        className: "vehicleInfo",
        data: null,
        render: function (data, type, row) {
          return `${data.vehicleYear} ${data.vehicleMake} ${data.vehicleModel} ${data.licensePlateNumber}`;
        },
      },
      {
        className: "imei text-center",
        data: "imei",
      },
      {
        className: "simCardNumber text-center",
        data: "simCardNumber",
      },
      {
        className: "gpsDevice text-center",
        data: "gpsDevice",
      },
      {
        className: "protocol text-center",
        data: "protocol",
        visible: false,
      },
      {
        className: "netProtocol text-center",
        data: "netProtocol",
        visible: false,
      },
      {
        className: "ipAddress text-center",
        data: "ipAddress",
        visible: false,
      },
      {
        className: "port text-center",
        data: "port",
        visible: false,
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
        className: "lastConnectionDate text-center",
        data: "lastConnectionDate",
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
        className: "trackerOptions",
        render: function (data, type, row, meta) {
          return `<a href="/autotracker/tracker/edit/${data.trackerId}" type="button" class="editTracker btn btn-warning mr-1" data-toggle="tooltip" data-placement="top" title="Edit Tracker info"><i class="fas fa-edit"></i><a/>
            <button id="activateDeleteTrackerModal" data-trackerid="${data.trackerId}" data-customerid="${data.customerId}" class="deleteTracker btn btn-danger"><i class="fas fa-trash-alt"></i></button>`;
        },
      },
    ],
  });
}

$("#autoTrackerTable tbody").on("click", ".editTracker", function () {
  var rowId = $(this).data("value");
  var data = autoTrackerTable.row($("#" + rowId)).data();

  $("#expiresOn").datetimepicker({
    format: "MM/DD/YYYY",
  });

  $("#lastConnectionDate").datetimepicker({
    format: "MM/DD/YYYY",
  });

  $("#newTrackerModalLabel").text(data.imei);
  $("#saveNewTracker").text("Update");

  $("#vehicleYear").val(data.vehicleYear);
  $("#vehicleMake").val(data.vehicleMake);
  $("#vehicleModel").val(data.vehicleModel);
  $("#licensePlateNumber").val(data.licensePlateNumber);
  $("#imei").val(data.imei);
  $("#simCardNumber").val(data.simCardNumber);
  $("#gpsDevice").val(data.gpsDevice);
  $("#protocol").val(data.protocol);
  $("#netProtocol").val(data.netProtocol);
  $("#ipAddress").val(data.ipAddress);
  $("#port").val(data.port);
  $("#expiresOnValue").val(data.expiresOn);
  $("#lastConnectionDateValue").val(data.lastConnectionDate);

  var expiresOn = moment(data.expiresOn).format("MM/DD/YYYY");
  var lastConnectionDate = moment(data.lastConnectionDate).format("MM/DD/YYYY");

  $("#newTrackerForm").attr(
    "action",
    "/api/autoTracker/tracker/new/" + data.customerId
  );
  $("#saveNewTracker").attr("action", "update");
  $("#newTrackerModal").modal("show");

  $("#expiresOn").datetimepicker("date", expiresOn);
  $("#lastConnectionDate").datetimepicker("date", lastConnectionDate);
});

$("#autotrackerTable tbody").on("click", ".deleteTracker", function () {
  var trackerId = $(this).data("trackerid");
  var customerId = $(this).data("customerid");
  $("#continueDelete").attr("data-option", "Tracker");
  $("#continueDelete").attr("data-trackerid", trackerId);
  $("#continueDelete").attr("data-customerid", customerId);
  $("#deleteConfirmationModal").modal("show");
});

$("#newTrackerBtn").on("click", () => {
  $("#newTrackerModalLabel").text("New Auto Tracker");
  $("#newTrackerForm").attr(
    "action",
    "/api/autoTracker/tracker/new/" + customerId
  );
  $("#saveNewTracker").text("Save");

  $("#expiresOn").datetimepicker({
    format: "MM/DD/YYYY",
  });

  $("#lastConnectionDate").datetimepicker({
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
  var customerIdParam = $("#continueDelete").attr("data-customerid");
  var trackerIdParam = $("#continueDelete").attr("data-trackerid");
  var apiRouteUrl =
    "/api/autoTracker/tracker/" + customerIdParam + "/" + trackerIdParam;
  fetch(apiRouteUrl, {
    method: "DELETE",
  }).then((res) => {
    console.log(res);
    $("#autoTrackerTable").DataTable().row().remove(`${trackerIdParam}`).draw();
    $("#expenseItemSpan").text($("#continueDelete").attr("data-option"));
    $("#confirmDeleteSuccessMesaage").removeClass("d-none");
    $("#deleteModalBody").addClass("d-none");
    $("#deleteSuccessConfirmationModalLabel").removeClass("d-none");
    $("#continueDelete").addClass("d-none");
    $("#deleteConfirmationModalLabel").addClass("d-none");
    $(".message").text("");
  });
});
