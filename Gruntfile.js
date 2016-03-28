module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        includePaths: ['bower_components/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'compressed',
          sourceMap: true,
        },
        files: {
          'css/app.css': 'dev/front_end/scss/app.scss'
        }
      }
    },

    watch: {
      grunt: {
        options: {
          reload: true
        },
        files: ['Gruntfile.js']
      },

      sass: {
        files: 'dev/front_end/scss/**/*.scss',
        tasks: ['sass']
      },
      scripts: {
        files: ['dev/front_end/js/src/**/*.js'],
        tasks: ['uglify']
      }
    },

    uglify: {
      options: {
        compress: {
          drop_debugger: false
        },
        beautify: true
      },
      my_target: {
        files: {
          'js/app.min.js': [
            'dev/front_end/js/src/**/*.js'
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // grunt.event.on('watch', function(action, filepath, target) {

  //   grunt.config('uglify.build.files.src', new Array(filepath) );

  //   // eventually you might want to change your destination file name
  //   var destFilePath = filepath.replace(/(.+)\.js$/, 'js-min/$1.js');
  //   grunt.config('uglify.build.files.dest', destFilePath);
  // });

  grunt.registerTask('build', ['sass']);
  grunt.registerTask('default', ['build', 'uglify', 'watch']);
}
