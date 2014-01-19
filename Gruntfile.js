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
    },
    nodeunit: {
      all: ['test/**/*Test.coffee']
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-coffeeify');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Default task.
  grunt.registerTask('default', ['nodeunit', 'coffeeify']);

};