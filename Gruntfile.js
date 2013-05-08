/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        // Task configuration.
        concat: {
            options: {
                include: 'all'
            },
            dist: {
                files: [{
                    'demo/dist/main.js': 'demo/tmp/main.js',
                    'demo/dist/main-debug.js': 'demo/tmp/main-debug.js'
                }]
            }
        },

        transport: {
            options: {
                idleading: './dist/',
                debug: true
            },
            dist: {
                files: [
                    {
                        cwd: 'demo',
                        src: '**/*.js',
                        filter: 'isFile',
                        dest: 'demo/tmp'
                    }
                ]
            }
        },

        uglify: {
            options: {
                banner: ''
            },
            dist: {
                src: 'demo/dist/main.js',
                dest: 'demo/dist/main.js'
            }
        },
        clean: {
            temp: ['demo/tmp']
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task.
    grunt.registerTask('default', ['transport', 'concat', 'uglify', 'clean']);

};
