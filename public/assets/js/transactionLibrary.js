localStorage.removeItem("activeTab");

$("#searchBy").selectize({
  onChange: function (value) {
    if (value.length > 0) {
      getDropdownData(value);
    }
  },
});

$("#searchQuery").selectize({
  maxItems: 1,
  create: true,
  labelField: "value",
  valueField: "value",
  searchField: "value",
  render: {
    option: function (item, escape) {
      return "<div>" + escape(item.value) + "</div>";
    },
  },
  onChange: function (value) {
    if (value.length > 0) {
      appendSearchInput();
    }
  },
});

function getDropdownData(columnName) {
  $("#newInputDiv").empty();
  fetch(`/api/transaction/getDistinct/${columnName}`)
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      $("#searchQuery")[0].selectize.clearOptions();
      $("#searchQuery")[0].selectize.load(function (callback) {
        callback(res);
      });
    });
}

function resetInputs(res) {
  $("#searchQuery")[0].selectize.clearOptions();
  $("#searchQuery")[0].selectize.load(function (callback) {
    callback(res);
  });
}

function appendSearchInput() {
  $("#newInputDiv").empty();
  var searchBy = $("#searchBy").val();
  var searchQuery = $("#searchQuery").val();
  fetch(`/api/getTransactions/${searchBy}/${searchQuery}`)
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      if (res.length > 1) {
        let html =
          '<input type="text" id="searchQuery0" name="searchQuery0" class="form-control mb-2" placeholder="Search" value="">';
        $("#newInputDiv").append(html);
        $("#searchQuery0").selectize({
          labelField: "transactionUID",
          valueField: "transactionUID",
          searchField: [
            "transactionUID",
            "locationUID",
            "transactionType",
            "transactionTerminal",
            "transactionAmount",
            "transactionCharge",
            "customerName",
            "preparedBy",
          ],
          maxItems: 1,
          create: false,
          options: res,
          render: {
            option: function (item, escape) {
              return "<div>" + escape(item.transactionUID) + "</div>";
            },
          },
        });
      }
    });
}

$("#goSearch").click(() => {
  if ($("#searchQuery0").length === 1) {
    var queryInput = $("#searchQuery0")[0].selectize.getValue();
    var dataObject = $("#searchQuery0")[0].selectize.options[queryInput];
    $("#resultsDiv").empty();
    appendDataTable(dataObject);
  } else if (
    $("#searchQuery")[0].selectize.getValue().length > 0 &&
    $("#searchBy")[0].selectize.getValue().length > 0
  ) {
    getSearchData();
  }
});

$(document).keypress(function (e) {
  var keycode = e.keyCode ? e.keyCode : e.which;
  if (keycode == "13" && $("#searchQuery")[0].selectize.getValue().length > 0) {
    getSearchData();
  }
});

function getSearchData() {
  event.preventDefault();
  $("#spinner").removeAttr("hidden");
  var searchQuery = $("#searchQuery")[0].selectize.getValue();
  var searchBy = $("#searchBy")[0].selectize.getValue();
  fetch(`/api/search/${searchBy}/${searchQuery}`)
    .then((data) => {
      return data.json();
    })
    .then((res) => {
      if (res.message) {
        $("#errorMessage").text(res.message);
      } else {
        $("#resultsDiv").empty();
        res.results.forEach((dataObject) => {
          appendDataTable(dataObject);
        });
        $("#searchInfo").text(
          res.count + " record(s) in " + res.processingTime
        );
      }
    });
}

function appendDataTable(dataObject) {
  var html = `<div class="container">
        <div class="form-row justify-content-center">
            <div class="col-12 col-md-6 p-4 border mb-3">
                <table class="table table-striped">
                    <thead></thead>
                    <tbody>
                        <tr>
                            <th scope="row">Transaction Id:</th>
                            <td><a class="text-dark" href="/transaction/detail/${
                              dataObject.transactionUID
                            }">${dataObject.transactionUID}</a></td>
                        </tr>
                        <tr>
                            <th scope="row">Location Id:</th>
                            <td>${dataObject.locationUID}</td>
                        </tr>
                        <tr>
                            <th scope="row">Transaction Date:</th>
                            <td>${moment(dataObject.transactionDate).format(
                              "MMMM Do YYYY, h:mm:ss a"
                            )}</td>
                        </tr>
                        <tr>
                            <th scope="row">Transaction Type:</th>
                            <td>${dataObject.transactionType}</td>
                        </tr>
                        <tr>
                            <th scope="row">Transaction Terminal:</th>
                            <td>${dataObject.transactionTerminal}</td>
                        </tr>
                        <tr>
                            <th scope="row">Agent Name:</th>
                            <td>${dataObject.preparedBy}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="text-right">
                <a href="/transaction/detail/${
                  dataObject.transactionUID
                }">More Info</a>
                <a href="/transaction/detail/${
                  dataObject.transactionUID
                }" class="ml-2 text-right" target="_blank"><i class="fas fa-external-link-square-alt fa-2x"></i></a>
                </div>
            </div>
        </div>
    </div>`;
  $("#resultsDiv").append(html);
}
