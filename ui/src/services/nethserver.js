var NethServerService = {
  methods: {
    exec(args, success, error) {
      args[0] = "/usr/libexec/nethserver/api/" + args[0]
      cockpit.spawn(args, {
        "superuser": "require"
      }).
      done(success).
      fail(error);
    },
  }
};
export default NethServerService;
