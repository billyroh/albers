module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: 9000,
          livereload: true,
          middleware(connect, options, middlewares) {
            middlewares.unshift(require('connect-livereload')());
            return middlewares;
          }
        }
      }
    },
    pug: {
      compile: {
        options: {
          data: {
            debug: true
          }
        },
        files: {
          'index.html': 'src/index.jade'
        }
      }
    },
    sass: {
      dist: {
        files: {
          'style.css': 'src/style.scss'
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      scripts: {
        files: ['src/*'],
        tasks: ['updateDom']
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('updateDom', ['pug', 'sass']);
  grunt.registerTask('default', ['connect', 'watch']);

};
