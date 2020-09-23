$(document).ready(function () {
  var agentsTable;
  var locationsTable;
  var activeTab = localStorage.getItem('activeTab');

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

      $('#locationUID').selectize({
            maxItems: 1,
            create: false,
            labelField: 'locationName',
            valueField: 'locationUID',
            searchField: 'locationName',
            render: {
                option: function (item, escape) {
                    return '<div>' + escape(item.locationName) + '</div>';
                }
            },
            options: res
        });
    });

  function fixNull(string) {
        if (string === null) {
        return "";
        }
        return string;
    }

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
              '<button onclick="activateEditAgentModal(' +
              "'" +
              row.locationId +
              "'" +
              ')" data-toggle="modal" data-target="#editAgentModal" class="btn btn-warning mr-1"><i class="fas fa-edit"></i></button> <button onclick="activateEditLocationModal(' +
              "'" +
              row.locationId +
              "'" +
              ')" data-toggle="modal" data-target="#deleteLocationModal" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>'
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
              '<button onclick="activateEditAgentModal(' +
              "'" +
              row.userId +
              "'" +
              ')" data-toggle="modal" data-target="#editAgentModal" class="btn btn-warning mr-1"><i class="fas fa-edit"></i></button> <button onclick="activateDeleteAgentModal(' +
              "'" +
              row.userId +
              "'" +
              ')" data-toggle="modal" data-target="#deleteAgentModal" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>'
            );
          },
        },
      ],
    });
  }

  $('#closeNewAgentModal').on('click', ()=>{
    $('#newAgentForm')[0].reset();
    $('#newAgentModal').modal('hide');
  });

  $('#closeNewLocationModal').on('click', ()=>{
    $('#newLocationForm')[0].reset();
    $('#newLocationModal').modal('hide');
  });

  $("#saveNewAgent").on("click", () => {
    var locationName = $('#locationUID')[0].selectize.getItem($('#locationUID').val()).text();
    var data = {
        name: $('#name').val(),
        emailAddress: $('#emailAddress').val(),
        locationUID: $('#locationUID').val(),
        phoneNumber: $('#phoneNumber').val()
    }

    fetch('/api/newAgent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then((data)=>{
        return data.json()
    }).then((res)=>{
        console.log(res.response);
        agentsTable.row.add({
            userId: res.response.userId,
            name: res.response.name,
            emailAddress: res.response.emailAddress,
            phoneNumber: res.response.phoneNumber,
            locationUID: res.response.locationUID,
            locationName: locationName
        });
        if(res.errors.length < 1){
            $('#newAgentForm')[0].reset();
            $('.message').text('New agent created !!');
        }
    });

  });

  $("#saveNewLocation").on("click", () => {
    var data = {
        locationName: $('#locationName').val(),
        locationEmail: $('#locationEmail').val(),
        locationAddress: $('#locationAddress').val(),
        locationCity: $('#locationCity').val(),
        locationState: $('#locationState').val(),
        locationPhone: $('#locationPhone').val(),
        locationContactName: $('#contactNameModal').val(),
        locationContactEmail: $('#contactEmailModal').val(),
        locationContactPhone: $('#contactPhoneModal').val()
    }

    fetch('/api/newLocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then((data)=>{
        return data.json()
    }).then((res)=>{
        console.log(res);
        if(res.errors.length < 1){
            $('#newLocationForm')[0].reset();
            $('.message').text('Location saved !!');
        }
    });
  });

  $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    localStorage.setItem('activeTab', $(e.target).attr('href'));
    activeTab = localStorage.getItem('activeTab');
    });

    if(activeTab){
        $('a[href="' + activeTab + '"]').tab('show');
    }


});
