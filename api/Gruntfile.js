module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['dist/**'],
    concat: {
      core: {
        src: ['node_modules/promise-polyfill/promise.min.js', 'core/*.js'],
        dest: 'dist/core.js'
      },
      system: {
        src: 'system/*.js',
        dest: 'dist/system.js',
      },
    },
    uglify: {
      options: {
        banner: '/*! nethserver <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      core: {
        files: {
          'dist/core.min.js': ['<%= concat.core.dest %>']
        }
      },
      system: {
        files: {
          'dist/system.min.js': ['<%= concat.system.dest %>']
        }
      },
    },
    jshint: {
      files: ['core/*.js', 'system/*.js', 'test/*.js', 'Gruntfile.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          'jQuery': true,
          'console': true,
          'module': true,
          'document': true,
          'cockpit': true,
        },
      },
    },
    shell: {
      rsync: {
        command: function (login, port, source, dest) {
          return "rsync -aiz -e 'ssh -p " + port + "' " + source + " " + login + ':' + dest;
        },
      },
      manifest: {
        command: function () {
          return "ln -sf /usr/share/cockpit/nethserver/manifest.json dist/manifest.json";
        },
      },
      describe: {
        command: function () {
          return "git describe --tags";
        },
        options: {
          callback: function (err, stdout, stderr, cb) {
            global.gitDescribe = stdout.trim();
            cb();
          }
        }
      },
      compress: {
        command: function () {
          return "tar cvzf nethserver-cockpit-api-"+global.gitDescribe+".tar.gz -C dist/ .";
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('build', 'Make .js files in under dist/', ['clean', 'jshint', 'concat', 'uglify']);
  grunt.registerTask('rsync', 'Sync folder with remote host', function (login, port, dest) {
    if (port === undefined) {
      port = 22;
    }
    if (dest === undefined) {
      dest = '~/.local/share/cockpit/nethserver';
    }
    grunt.task.run([
      'shell:manifest',
      ['shell:rsync', login, port, 'dist/', dest].join(':'),
      ['shell:rsync', login, port, 'test/', dest].join(':'),
      ['shell:rsync', login, port, 'node_modules/mocha/mocha.*', dest].join(':'),
      ['shell:rsync', login, port, 'node_modules/should/should.js', dest].join(':'),
    ]);
  });

  grunt.registerTask('release', 'Create release file', ['shell:describe','shell:compress']);

};
