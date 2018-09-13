var NethServerService = {
  methods: {
    exec(args, input, stream, success, error) {
      var systemCheck = false

      args[0] = "/usr/libexec/nethserver/api/" + args[0]
      var process = cockpit.spawn(args, input ? {} : {
        pty: true
      })

      if (input) {
        process.input(JSON.stringify(input))
      }

      if (stream) {
        process.stream(function (data) {
          vm.$children[0].notifications.success.show = false
          vm.$children[0].notifications.error.show = false
          vm.$children[0].notifications.event.progress = 0
          vm.$children[0].taskInProgress = true

          var pieces = data.replace(/\n|\r/g, "").split("}");
          pieces.pop()
          for (var p in pieces) {
            var c = pieces[p] + "}";
            c = c.replace(/\n|\r/g, "");
            var j = c !== "}" ? JSON.parse(c) : "{}";

            if (j.event) {
              vm.$children[0].notifications.event.show = true;

              if (j.action && j.action != vm.$children[0].notifications.event.message) {
                vm.$children[0].notifications.event.message = j.action;
              }

              if (j.event && j.event != vm.$children[0].notifications.event.name) {
                vm.$children[0].notifications.event.name = j.event;
              }

              var progress = parseFloat(j.progress);
              if (
                !isNaN(progress) && progress * 100 > vm.$children[0].notifications.event.progress
              ) {
                systemCheck = false
                vm.$children[0].notifications.event.steps = 0
                vm.$children[0].notifications.event.progress = progress * 100;
              }

              vm.$children[0].notifications.event.steps = j.steps
              vm.$children[0].notifications.event.progress = j.steps == -1 ? 100 : vm.$children[0].notifications.event.progress
            }

            if (j.status == "failed" || j.status == "success" || j.message == "no running tasks") {
              setTimeout(function () {
                vm.$children[0].notifications.event.show = false;
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
          vm.$children[0].notifications.success.show = true
          setTimeout(function () {
            vm.$children[0].notifications.success.show = false;
          }, 3000)
          vm.$children[0].notifications.error.show = false
          vm.$children[0].taskInProgress = false
        }
        success(successResp)
      }).
      fail(function (errorResp, errorData) {
        if (stream) {
          vm.$children[0].notifications.success.show = false
          vm.$children[0].notifications.error.show = true
          vm.$children[0].taskInProgress = false
        }
        error(errorResp, errorData)
      });
    },
  }
};
export default NethServerService;
