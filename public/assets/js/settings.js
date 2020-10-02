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
          className: "locationAddress",
          data: null,
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
            return (
              "<span>" +
              row.name +
              (row.role === "basic"
                ? "<span class='ml-1 btn btn-danger' style='padding: 0.01rem .30rem;'>Basic</span>"
                : "<span class='ml-1 btn btn-success' style='padding: 0.01rem .30rem;'>Admin</span>") +
              "</span>"
            );
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
          data: null,
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
    var data = {
      name: $("#name").val(),
      emailAddress: $("#emailAddress").val(),
      locationUID: $("#locationUID").val(),
      phoneNumber: $("#phoneNumber").val(),
    };

    fetch("/api/newAgent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        console.log(res.response);
        agentsTable.row.add({
          userId: res.response.userId,
          name: res.response.name,
          emailAddress: res.response.emailAddress,
          phoneNumber: res.response.phoneNumber,
          locationUID: res.response.locationUID,
          locationName: locationName,
        });
        if (res.errors.length < 1) {
          $("#newAgentForm")[0].reset();
          $(".message").text("New agent created !!");
        }
      });
  });

  $("#saveNewLocation").on("click", () => {
    var data = {
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

    fetch("/api/newLocation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((data) => {
        return data.json();
      })
      .then((res) => {
        console.log(res);
        if (res.errors.length < 1) {
          $("#newLocationForm")[0].reset();
          $(".message").text("Location saved !!");
        }
      });
  });

  $("#agentsTable tbody").on("click", ".editAgent", function () {
    var rowId = $(this).data("value");
    var data = agentsTable.row($("#" + rowId)).data();
    console.log(data);
    $("#name").val(data.name);
    $("#emailAddress").val(data.emailAddress);
    $("#phoneNumber").val(data.phoneNumber);
    $("#locationUID")[0].selectize.setValue(data.locationUID);
    $("#newAgentForm").attr("action", "/api/updateUser/" + data.userId);
    $("#newAgentModal").modal("show");
  });

  $("#locationsTable tbody").on("click", ".editLocation", function () {
    var rowId = $(this).data("value");
    var data = locationsTable.row($("#" + rowId)).data();
    console.log(data);
    $("#locationName").val(data.locationName);
    $("#locationAddress").val(data.locationAddress);
    $("#locationEmail").val(data.locationEmail);
    $("#locationPhone").val(data.locationPhone);
    $("#contactNameModal").val(data.locationContactName);
    $("#contactEmailModal").val(data.locationContactEmail);
    $("#contactPhoneModal").val(data.locationContactPhone);
    $("#newLocationForm").attr(
      "action",
      "/api/updateLocation/" + data.locationUID
    );
    $("#newLocationModal").modal("show");
  });

  $("#agentsTable tbody").on("click", ".deleteAgent", function () {
    var agentId = $(this).data("value");
    console.log(agentId);
    $("#deleteAgentModal").modal("show");
  });

  $("#locationsTable tbody").on("click", ".deleteLocation", function () {
    var locationId = $(this).data("value");
    console.log(locationId);
    $("#deleteLocationModal").modal("show");
  });

  $("#closeNewAgentModal").on("click", () => {
    $("#newAgentForm")[0].reset();
    $("#newAgentModal").modal("hide");
  });

  $("#closeNewLocationModal").on("click", () => {
    $("#newLocationForm")[0].reset();
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
