$(document).ready(function () {
  var agentsTable;
  var locationsTable;
  var activeTab = localStorage.getItem("activeTab");

  fetch(`/api/getAgents`)
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      renderAgentsTable(res);
    });

  fetch(`/api/getLocations`)
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      renderLocationsTable(res);

      $("#locationUID").selectize({
        maxItems: 1,
        create: false,
        labelField: "locationName",
        valueField: "locationUID",
        searchField: "locationName",
        render: {
          option: function (item, escape) {
            return "<div>" + escape(item.locationName) + "</div>";
          },
        },
        options: res,
      });
    });

  function renderLocationsTable(data) {
    locationsTable = $("#locationsTable").DataTable({
      data: data,
      rowId: "locationId",
      responsive: true,
      columns: [
        {
          className: "locationName",
          data: "locationName",
          render: function (data, type, row, meta) {
            return (
              "<span>" +
              row.locationName +
              " <p class='mb-0'>(" +
              row.locationUID +
              ")</p>" +
              "</span>"
            );
          },
        },
        {
          data: null,
          className: "locationAddress",
          render: function (data, type, row, meta) {
            if (
              row.locationAddress === null &&
              row.locationCity === null &&
              row.locationState === null
            ) {
              return "";
            }
            return (
              "<span><p class='mb-0'>" +
              row.locationAddress +
              ",</p><p class='mb-0'>" +
              row.locationCity +
              ",</p> " +
              row.locationState +
              "</span>"
            );
          },
        },
        {
          className: "locationEmail",
          data: "locationEmail",
        },
        {
          className: "locationPhone",
          data: "locationPhone",
        },
        {
          className: "locationContactName",
          data: "locationContactName",
        },
        {
          className: "locationContactEmail",
          data: "locationContactEmail",
        },
        {
          className: "locationContactPhone",
          data: "locationContactPhone",
        },
        {
          data: null,
          orderable: false,
          className: "locationOptions",
          render: function (data, type, row, meta) {
            return (
              '<button id="activateEditLocationModal" data-value="' +
              data.locationId +
              '" class="editLocation btn btn-warning mr-1"><i class="fas fa-edit"></i></button> <button id="activateEditLocationModal" data-value="' +
              data.locationId +
              '" class="deleteLocation btn btn-danger"><i class="fas fa-trash-alt"></i></button>'
            );
          },
        },
      ],
    });
  }

  function renderAgentsTable(data) {
    agentsTable = $("#agentsTable").DataTable({
      data: data,
      rowId: "userId",
      responsive: true,
      columns: [
        {
          className: "name",
          data: "name",
          render: function (data, type, row, meta) {
            return `<span>${row.name}${
              row.role === "admin"
                ? "<span class='ml-1 btn btn-success' style='padding: 0.01rem .30rem;'>Admin</span>"
                : "<span class='ml-1 btn btn-danger' style='padding: 0.01rem .30rem;'>Basic</span>"
            }${
              row.active === 0
                ? "<span class='ml-1 btn btn-secondary' style='padding: 0.01rem .30rem;'>Inactive</span>"
                : ""
            }</span>`;
          },
        },
        {
          className: "locationUID",
          data: "locationUID",
          render: function (data, type, row, meta) {
            return (
              "<span>" +
              row.locationName +
              " (" +
              row.locationUID +
              ")" +
              "</span>"
            );
          },
        },
        {
          className: "emailAddress",
          data: "emailAddress",
        },
        {
          className: "phoneNumber",
          data: "phoneNumber",
        },
        {
          className: "active",
          data: "active",
          visible: false,
          searchable: false,
        },
        {
          data: null,
          orderable: false,
          className: "agentsOptions",
          render: function (data, type, row, meta) {
            return (
              '<button id="activateEditAgentModal" data-value="' +
              data.userId +
              '" class="editAgent btn btn-warning mr-1"><i class="fas fa-edit"></i></button> <button id="activateDeleteAgentModal" data-value="' +
              data.userId +
              '" class="deleteAgent btn btn-danger"><i class="fas fa-trash-alt"></i></button>'
            );
          },
        },
      ],
    });
  }

  $("#saveNewAgent").on("click", () => {
    var locationName = $("#locationUID")[0]
      .selectize.getItem($("#locationUID").val())
      .text();
    var agentData = {
      name: $("#name").val(),
      emailAddress: $("#emailAddress").val(),
      locationUID: $("#locationUID").val(),
      phoneNumber: $("#phoneNumber").val(),
      role: $("#role").val(),
    };

    var apiUrl = "/api/newAgent";

    if ($("#saveNewAgent").attr("action") == "update") {
      apiUrl = $("#newAgentForm").attr("action");
    }

    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(agentData),
    })
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        //console.log(res);
        // agentsTable.rows.add({
        //   userId: res.response.userId,
        //   role: res.response.role,
        //   name: res.response.name,
        //   emailAddress: res.response.emailAddress,
        //   phoneNumber: res.response.phoneNumber,
        //   locationUID: res.response.locationUID,
        //   locationName: locationName,
        // });
        if (res.errors.length < 1) {
          if ($("#saveNewAgent").attr("action") == "update") {
            $(".message").text("Update Successful !!");
          } else {
            $(".message").text("New Agent Created !!");
          }
          $("#newAgentForm")[0].reset();
          $("#locationUID")[0].selectize.setValue("");
        } else {
          $(".errorMessage").text(res.errors[0].message);
        }
        return;
      });
  });

  $("#saveNewLocation").on("click", () => {
    var locationData = {
      locationName: $("#locationName").val(),
      locationEmail: $("#locationEmail").val(),
      locationAddress: $("#locationAddress").val(),
      locationCity: $("#locationCity").val(),
      locationState: $("#locationState").val(),
      locationPhone: $("#locationPhone").val(),
      locationContactName: $("#contactNameModal").val(),
      locationContactEmail: $("#contactEmailModal").val(),
      locationContactPhone: $("#contactPhoneModal").val(),
    };

    var apiUrl = "/api/newLocation";

    if ($("#saveNewLocation").attr("action") == "update") {
      apiUrl = $("#newLocationForm").attr("action");
    }

    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(locationData),
    })
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        console.log(res);
        if (res.errors.length < 1) {
          $("#newLocationForm")[0].reset();
          if ($("#saveNewLocation").attr("action") == "update") {
            $(".message").text("Update Successful !!");
          } else {
            $(".message").text("Location saved !!");
          }
        } else {
          $(".errorMessage").text(res.errors[0].message);
        }
      });
  });

  $("#agentsTable tbody").on("click", ".editAgent", function () {
    var rowId = $(this).data("value");
    var data = agentsTable.row($("#" + rowId)).data();

    $("#newAgentModalLabel").text(data.name);
    $("#saveNewAgent").text("Update");
    $("#name").val(data.name);
    $("#emailAddress").val(data.emailAddress);
    $("#phoneNumber").val(data.phoneNumber);
    $("#locationUID")[0].selectize.setValue(data.locationUID);
    $("#newAgentForm").attr("action", "/api/updateUser/" + data.userId);
    $("#saveNewAgent").attr("action", "update");
    if (data.role === "admin") {
      $("#role").attr("checked", true);
    }
    $("#activeCheckbox").removeClass("d-none");
    if (data.active == 1) {
      $("#active").attr("checked", true);
    }
    $("#newAgentModal").modal("show");
  });

  $("#locationsTable tbody").on("click", ".editLocation", function () {
    var rowId = $(this).data("value");
    var data = locationsTable.row($("#" + rowId)).data();
    //console.log(data);
    $("#newLocationModalLabel").text(data.locationName);
    $("#saveNewLocation").text("Update");
    $("#saveNewLocation").attr("action", "update");

    $("#locationName").val(data.locationName);
    $("#locationAddress").val(data.locationAddress);
    $("#locationCity").val(data.locationCity);
    $("#locationState").val(data.locationState);
    $("#locationEmail").val(data.locationEmail);
    $("#locationPhone").val(data.locationPhone);
    $("#contactNameModal").val(data.locationContactName);
    $("#contactEmailModal").val(data.locationContactEmail);
    $("#contactPhoneModal").val(data.locationContactPhone);
    $("#newLocationForm").attr(
      "action",
      "/api/updateLocation/" + data.locationId
    );
    $("#newLocationModal").modal("show");
  });

  $("#agentsTable tbody").on("click", ".deleteAgent", function () {
    var agentId = $(this).data("value");
    console.log(agentId);
    $("#continueDelete").attr("data-option", "user");
    $("#continueDelete").attr("data-id", agentId);
    $("#deleteConfirmationModal").modal("show");
  });

  $("#locationsTable tbody").on("click", ".deleteLocation", function () {
    var locationId = $(this).data("value");
    console.log(locationId);
    $("#continueDelete").attr("data-option", "location");
    $("#continueDelete").attr("data-id", locationId);
    $("#deleteConfirmationModal").modal("show");
  });

  $("#closeDeleteConfirmationModal").on("click", () => {
    $("#deleteConfirmationModal").modal("hide");
  });

  $("#continueDelete").on("click", () => {
    var apiParamId = $("#continueDelete").attr("data-id");
    var apiRouteUrl = "/api/deleteUser/" + apiParamId;
    if ($("#continueDelete").attr("data-option") == "location") {
      apiRouteUrl = "/api/deleteLocation/" + apiParamId;
    }
    fetch(apiRouteUrl)
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        console.log(res);
      });

    console.log(apiParamId);
  });

  $("#newAgentBtn").on("click", () => {
    $("#newAgentModalLabel").text("New Agent");
    $("#saveNewAgent").text("Save");
  });

  $("#closeNewAgentModal").on("click", () => {
    $("#newAgentForm")[0].reset();
    $("#role").attr("checked", false);
    $("#active").attr("checked", false);
    $("#locationUID")[0].selectize.setValue("");
    $(".message").text("");
    $(".errorMessage").text("");
    $("#activeCheckbox").addClass("d-none");
    $("#newAgentModal").modal("hide");
  });

  $("#closeNewLocationModal").on("click", () => {
    $("#newLocationForm")[0].reset();
    $(".message").text("");
    $(".errorMessage").text("");
    $("#newLocationModal").modal("hide");
  });

  $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
    localStorage.setItem("activeTab", $(e.target).attr("href"));
    activeTab = localStorage.getItem("activeTab");
  });

  if (activeTab) {
    $('a[href="' + activeTab + '"]').tab("show");
  }
});
