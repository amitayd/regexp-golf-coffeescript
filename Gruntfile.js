/*global module:false*/
module.exports = function (grunt) {



  grunt.initConfig({
    coffeeify: {
      options: {
        // Task-specific options go here.
      },
      files: {
        src: ['./browser/browserMain.coffee'],
        dest: './browser/browserMain.js'
      }

    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-coffeeify');

  // Default task.
  grunt.registerTask('default', ['coffeeify']);

};