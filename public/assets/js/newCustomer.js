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
