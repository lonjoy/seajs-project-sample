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
            js: {
                files: [
                    {
                        'demo/dist/main.js': 'demo/tmp/main.js',
                        'demo/dist/main-debug.js': 'demo/tmp/main-debug.js'
                    }
                ]
            },
            css: {
                files: [
                    {
                        'demo/dist/main.css': 'demo/tmp/main.css',
                        'demo/dist/main-debug.css': 'demo/tmp/main-debug.css'
                    }
                ]
            }
        },

        transport: {
            options: {
                idleading: './dist/',
                debug: true
            },
            js: {
                files: [
                    {
                        cwd: 'demo',
                        src: '**/*.js',
                        filter: 'isFile',
                        dest: 'demo/tmp'
                    }
                ]
            },
            css: {
                files: [
                    {
                        cwd: 'demo',
                        src: '**/*.css',
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
            js: {
                src: 'demo/dist/main.js',
                dest: 'demo/dist/main.js'
            }
        },

        cssmin: {
            options: {
                expand: true
            },
            css: {
                src: 'demo/dist/main.css',
                dest: 'demo/dist/main.css'
            }
        },

        clean: {
            temp: ['demo/tmp'],
            dist: ['demo/dist']
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task.
    grunt.registerTask('default', [
        'clean:dist',
        'transport',
        'concat',
        'uglify',
        'cssmin',
        'clean:temp'
    ]);

};
