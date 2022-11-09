let currentYear = new Date().getFullYear();

for (let i = currentYear + 1; i >= 2000; i--) {
  $("#vehicleYear").append(`<option value=${i}>${i}</option>`);
}

$("#expiresOn").datetimepicker({
  format: "L",
});

$("#lastConnectionDate").datetimepicker({
  format: "L",
});

$("#expiresOn").on("change.datetimepicker", function (e) {
  $("#expiresOnValue").val(
    $("#expiresOn").data("datetimepicker").date().format("MM/DD/YYYY")
  );
});

$("#lastConnectionDate").on("change.datetimepicker", function (e) {
  $("#lastConnectionDateValue").val(
    $("#lastConnectionDate").data("datetimepicker").date().format("MM/DD/YYYY")
  );
});
