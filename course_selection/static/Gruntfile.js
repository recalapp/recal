/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    karma: {
        unit: {
            configFile: './test/karma-unit.conf.js',
            autoWatch: false,
            singleRun: true
        },
        unit_auto: {
            configFile: './test/karma-unit.conf.js'
        }
        // midway: {
        //   configFile: './test/karma-midway.conf.js',
        //   autoWatch: false,
        //   singleRun: true
        // },
        // midway_auto: {
        //   configFile: './test/karma-midway.conf.js'
        // },
        // e2e: {
        //   configFile: './test/karma-e2e.conf.js',
        //   autoWatch: false,
        //   singleRun: true
        // },
        // e2e_auto: {
        //   configFile: './test/karma-e2e.conf.js'
        // }
    },
    typescript: {
        base: {
            src: ['js/**/*.ts'],
            options: {
                module: 'amd', //or commonjs
                target: 'es5', //or es3
                sourceMap: true,
                declaration: false,
                watch: true
            }
        }
    },
    less: {
        development: {
            options: {
                paths: ["less/"],
                watch: true
            },
            files: {
                "less/course-search.css" : "less/course-search.less",
                "less/nice.css" : "less/nice.less",
                "less/calendar.css" : "less/calendar.less",
                "less/queue.css" : "less/queue.less",
                "less/modal.css" : "less/modal.less",
            }
        },
    },
    watch: {
        less: {
            files: ["./less/*.less"],
            tasks: ["less"],
            options: {
                nospawn: true
            }
        },
        typescript: {
            files: ["./js/**/*.ts"],
            tasks: ["typescript"]
        }
    },
    concurrent: {
        options: {
            logConcurrentOutput: true
        },
        dev: {
            tasks: ["watch:less", "watch:typescript"]
        }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-karma');

  // Default task.
  grunt.registerTask('default', ["concurrent:dev"]);

  // karma

  grunt.registerTask('test', ['connect:testserver','karma:unit','karma:midway', 'karma:e2e']);
  grunt.registerTask('test:unit', ['karma:unit']);
  grunt.registerTask('test:midway', ['connect:testserver','karma:midway']);
  grunt.registerTask('test:e2e', ['connect:testserver', 'karma:e2e']);

};
