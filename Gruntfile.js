module.exports = function(grunt) {

  grunt.initConfig({
    babel: {
      options: {
        sourceMap: false,
        presets: ['es2015']
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.js'],
          dest: 'dist/babel/'
        }]
      }
    },
    uglify: {
      all_src: {
        options: {
          sourceMap: true,
          sourceMapName: 'dist/sourceMap/main.map'
        },
        src: 'dist/babel/**/*.js',
        dest: 'dist/main.min.js'
      }
    },
    flow: {
      watch: {
        src: 'src/**/*.js',
        options: {
          server: true
        }
      }
    },
    webpack: {
      app: {
        entry: {
          main: ['./dist/babel/a.js', './dist/babel/b.js']
        },
        output: {
          path: "dist/",
          filename: "[name].js",
        }
      }
    },
    watch: {
      flow: {
        files: ['src/**/*.js'],
        tasks: ['flow']
      }
    }
  });

  grunt.loadNpmTasks('grunt-flow');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-webpack');

  grunt.registerTask('default', ['babel', 'webpack']);

};
