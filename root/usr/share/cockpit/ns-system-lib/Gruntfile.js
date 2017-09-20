module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '\n'
      },
      dist: {
        src: ['src/ns-system.js', 'src/ns-system-*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['src/ns-system.js', 'src/ns-system-*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          'jQuery': true,
          'console': true,
          'module': true,
          'document': true,
          'cockpit': true
        }
      }
    },
    copy: {
      manifest: {
        src: 'manifest.json',
        dest: 'dist/manifest.json',
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
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'copy:manifest']);
  grunt.registerTask('rsync', 'Sync folder with remote host', function (login, port, dest) {
    if (port === undefined) {
      port = 22;
    }
    if (dest === undefined) {
      dest = '~/.local/share/cockpit/ns-system-lib';
    }
    grunt.task.run([
      ['shell:rsync', login, port, 'dist/', dest].join(':'),
    ]);
  });

};