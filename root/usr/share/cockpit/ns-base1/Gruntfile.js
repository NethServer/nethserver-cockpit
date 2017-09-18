module.exports = function (grunt) {

  var sources = [
      'src/namespace.js', 
      'src/db.js', 
      'src/event.js',
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ''
      },
      dist: {
        src: sources,
        dest: 'dist/nethserver.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! nethserver <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/nethserver.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: sources.concat(['test/test.js']),
      options: {
        // options here to override JSHint defaults
        globals: {
          'jQuery': true,
          'console': true,
          'module': true,
          'document': true,
          'cockpit': true,
        }
      }
    },
    shell: {
      rsync: {
        command: function (login, port, source, dest) {
          return "rsync -aiz -e 'ssh -p " + port + "' " + source + " " + login + ':' + dest;
        },
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('build', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('rsync', 'Sync folder with remote host', function (login, port, dest) {
    if(port === undefined) {
        port = 22;
    }
    if(dest === undefined) {
        dest = '~/.local/share/cockpit/ns-base1';
    }
    grunt.task.run([
        ['shell:rsync', login, port, 'dist/', dest].join(':'),
        ['shell:rsync', login, port, 'test/', dest].join(':'),
        ['shell:rsync', login, port, 'node_modules/mocha/mocha.*', dest].join(':'),
        ['shell:rsync', login, port, 'node_modules/should/should.js', dest].join(':'),
    ]);
  });
};
