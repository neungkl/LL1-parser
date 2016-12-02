var glob = require('glob');

module.exports = function(grunt) {

  grunt.initConfig({
    babel: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.js'],
          dest: 'dist/babel/'
        }]
      }
    },
    uglify: {
      all_src: {
        options: {
          sourceMap: true,
          sourceMapName: 'dist/sourceMap/app.map'
        },
        src: 'dist/app.js',
        dest: 'dist/app.min.js'
      }
    },
    flow: {
      watch: {
        src: 'src/**/*.js'
      }
    },
    webpack: {
      app: {
        entry: glob.sync("./dist/babel/**/*.js"),
        output: {
          path: "dist/",
          filename: "app.js",
        }
      }
    },
    watch: {
      app: {
        files: 'src/**/*.js',
        tasks: ['flow', 'babel', 'webpack'],
        options: {
          event: ['added', 'deleted', 'changed']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-flow');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('valid', ['flow', 'babel']);
  grunt.registerTask('build', ['flow', 'babel', 'webpack', 'uglify']);
  grunt.registerTask('watch', ['flow', 'babel', 'webpack', 'watch']);
  grunt.registerTask('default', ['flow', 'babel', 'webpack']);

};
