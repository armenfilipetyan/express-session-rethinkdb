module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        es5: true,
        indent: 2,
        camelcase: true,
        nonew: true,
        plusplus: true,
        quotmark: true,
        bitwise: true,
        forin: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        undef: true,
        unused: true,
        regexp: true,
        trailing: true,
        node: true,
        globals: {
          define: true,
          require: true
        }
      },
      gruntfile: {
        files: {
          src: ['Gruntfile.js']
        }
      },
      dev: {
        files: {
          src: ['index.js', 'lib/**/*.js']
        },
        options: {
          debug: true,
          devel: true
        }
      },
      dist: {
        files: {
          src: ['index.js', 'lib/**/*.js']
        }
      }
    },
    watch: {
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: 'jshint:gruntfile'
      },
      lib: {
        files: ['index.js', 'lib/**/*.js'],
        tasks: ['jshint:dev']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', 'watch');
};
