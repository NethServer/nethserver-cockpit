module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['dist/**'],
    concat: {
      core: {
        src: ['node_modules/cryptojs/lib/Crypto.js', 'node_modules/cryptojs/lib/MD5.js', 'node_modules/promise-polyfill/promise.min.js', 'core/*.js'],
        dest: 'dist/core.js'
      },
      system: {
        src: 'system/*.js',
        dest: 'dist/system.js',
      },
      applications: {
        src: 'applications/*.js',
        dest: 'dist/applications.js',
      }
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
      applications: {
        files: {
          'dist/applications.min.js': ['<%= concat.applications.dest %>']
        }
      },
    },
    jshint: {
      files: ['core/*.js', 'system/*.js', 'test/*.js', 'applications/*.js', 'Gruntfile.js'],
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
    docma: {
      options: {
        traceFatal: true,
        config: {
          jsdoc: {
            encoding: 'utf8',
            recurse: true,
            pedantic: false,
            access: null, // ['public', 'protected'],
            package: null,
            module: true,
            undocumented: true,
            undescribed: true,
            hierarchy: true,
            sort: 'alphabetic',
            filter: null,
            plugins: ['markdown']
          },
          debug: 1
        }
      },
      code: {
        options: {
          config: {
            template: {
              path: 'default',
              options: {
                sidebar: true,
                collapsed: false,
                badges: true,
                outline: "flat",
                symbolMeta: false,
                search: true,
                navbar: true,
                "navItems": [
                  {
                    "iconClass": "ico-embed",
                    "label": "Home",
                    "href": "./"
                  },
                  {
                    "iconClass": "ico-book",
                    "label": "Building Docs",
                    "items": [
                      { "label": "Dev environment", "href": "./environment" },
                      { "separator": true },
                      { "label": "API guidelines", "href": "./api_guidelines" },
                      { "label": "UI guidelines", "href": "./ui_guidelines" },
                      { "label": "Application manifest", "href": "./application_manifest" },
                      { "separator": true },
                      { "label": "API reference", "href": "./api" },
                      { "separator": true },
                      { "label": "Build RPM", "href": "./build_rpm" },
                      { "label": "Build documentation", "href": "./build_doc" },
                    ]
                  },
                  {
                    "iconClass": "ico-mouse-pointer",
                    "label": "Manuals",
                    "items": [
                      { "label": "Developer manual", "href": "http://docs.nethserver.org/projects/nethserver-devel", "target": "_blank" },
                      { "label": "Administrator manual", "href": "http://docs.nethserver.org", "target": "_blank" },
                      { "separator": true },
                      { "label": "Cockpit Guide", "href": "http://cockpit-project.org/guide/latest/", "target": "_blank" }
                    ]
                  },

                  {
                    "iconClass": "ico-md ico-github",
                    "label": "GitHub",
                    "href": "https://github.com/NethServer/nethserver-cockpit",
                    "target": "_blank"
                  }
                ]
              }
            },
            app: {
              title: 'NethServer Cockpit',
              routing: 'path',
              base: '/nethserver-cockpit',
              entrance: "content:readme"
            }
          }
        },
        src: [
              "./core/*.js",
              "./system/*.js",
              "./applications/*.js",
              "./tutorial/*.md",
              "README.md",
        ],
        dest: '../docs'
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-docma');

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
