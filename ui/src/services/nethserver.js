var NethServerService = {
  methods: {
    exec(args, input, stream, success, error) {
      var systemCheck = false

      function isJsonString(str) {
        try {
          JSON.parse(str);
        } catch (e) {
          return false;
        }
        return true;
      }

      args[0] = "/usr/libexec/nethserver/api/" + args[0]
      var process = cockpit.spawn(args, input ? {} : {
        pty: true
      })

      if (input) {
        process.input(JSON.stringify(input))
      }

      if (stream) {
        process.stream(function (data) {
          ns.$children[0].notifications.success.show = false
          ns.$children[0].notifications.error.show = false
          ns.$children[0].notifications.event.progress = 0
          ns.$children[0].taskInProgress = true

          var pieces = data.replace(/\n|\r/g, "").split("}");
          pieces.pop()
          for (var p in pieces) {
            var c = pieces[p] + "}";
            c = c.replace(/\n|\r/g, "");
            var j = c !== "}" && isJsonString(c) ? JSON.parse(c) : "{}";

            if (j.event) {
              ns.$children[0].notifications.event.show = true;

              if (j.action && j.action != ns.$children[0].notifications.event.message) {
                ns.$children[0].notifications.event.message = j.action;
              }

              if (j.event && j.event != ns.$children[0].notifications.event.name) {
                ns.$children[0].notifications.event.name = j.event;
              }

              var progress = parseFloat(j.progress);
              if (
                !isNaN(progress) && progress * 100 > ns.$children[0].notifications.event.progress
              ) {
                systemCheck = false
                ns.$children[0].notifications.event.steps = 0
                ns.$children[0].notifications.event.progress = progress * 100;
              }

              ns.$children[0].notifications.event.steps = j.steps
              ns.$children[0].notifications.event.progress = j.steps == -1 ? 100 : ns.$children[0].notifications.event.progress
            }

            if (j.status == "failed" || j.status == "success" || j.message == "no running tasks") {
              setTimeout(function () {
                ns.$children[0].notifications.event.show = false;
                ns.$children[0].notifications.event.message = "";
                ns.$children[0].notifications.event.name = ""
              }, 500)
              stream(j.status)
            }

            if (j.steps == -1) {
              systemCheck = true
              stream(j.message)
            }
          }
        })
      }
      process.done(function (successResp) {
        if (stream && !systemCheck) {
          ns.$children[0].notifications.success.show = true
          setTimeout(function () {
            ns.$children[0].notifications.success.show = false;
          }, 3000)
          ns.$children[0].notifications.error.show = false
          ns.$children[0].taskInProgress = false
        }
        success(successResp)
      }).
      fail(function (errorResp, errorData) {
        if (stream) {
          ns.$children[0].notifications.success.show = false
          ns.$children[0].notifications.error.show = true
          ns.$children[0].taskInProgress = false
        }
        error(errorResp, errorData)
      });
    },
  }
};
export default NethServerService;
