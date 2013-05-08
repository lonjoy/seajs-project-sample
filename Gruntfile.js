/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        // Task configuration.
        concat: {
            options: {
                include: 'relative'
            },
            dist: {
                files: [{
                    'dist/<%= pkg.name %>.js': 'tmp/<%= pkg.name %>.js',
                    'dist/<%= pkg.name %>-debug.js': 'tmp/<%= pkg.name %>-debug.js'
                }, {}]
            }
        },

        transport: {
            options: {
                idleading: '<%= pkg.family %>/<%= pkg.name %>/<%= pkg.version %>/',
                debug: true
            },
            dist: {
                files: [
                    {
                        cwd: 'lib',
                        src: '**/*',
                        filter: 'isFile',
                        dest: 'tmp'
                    }
                ]
            }
        },

        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: 'dist/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        clean: {
            temp: ['tmp']
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task.
    grunt.registerTask('default', ['transport']);

};
