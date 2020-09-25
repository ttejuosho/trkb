const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("basic").readOwn("profile").updateOwn("profile");
  ac.grant("basic").createOwn("transaction").readOwn("transaction");
  ac.grant("admin")
    .extend("basic")
    .readAny("profile")
    .updateAny("profile")
    .deleteAny("profile");
  ac.grant("admin").readAny("transaction").updateAny("transaction");
  ac.grant("admin")
    .createOwn("location")
    .readAny("location")
    .updateAny("location");
  return ac;
})();
