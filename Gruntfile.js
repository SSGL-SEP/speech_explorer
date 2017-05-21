'use strict';

var path = require('path');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

module.exports = function(grunt) {

    grunt.initConfig({

        env: {
            chrome: {
                PLATFORM: 'CHROME'
            },
            firefox: {
                PLATFORM: 'FIREFOX'
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'features/step_definitions/*.js', 'features/support/*.js'],
            options: {
                node: true,
                strict: true,
                globalstrict: true
            }
        },

        exec: {
            run_istanbul_mocha_tests:{
                command: 'istanbul cover ./node_modules/.bin/_mocha'
            },
            run_istanbul_cucumber_tests:{
                command: 'node app.js & istanbul cover ./node_modules/.bin/cucumberjs'
            },
            kill_all:{
                command:'killall node'
            }

        },

        webpack: {
            options: webpackConfig
        },

        watch: {
            app: {
                files: ['./app/**/*.js'],
                tasks: ['webpack:build']
            }
        },

        nodemon: {
            dev: {
                script: 'app.js'
            },
            options: {
                ignore: ['node_modules/**', 'Gruntfile.js'],
                env: {
                    PORT: '3000'
                }
            }
        },

        concurrent: {
            watchers: {
                tasks: ['watch', 'nodemon'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');

    //grunt.registerTask('default', ['jshint', 'exec']);
    //grunt.registerTask('chrome', ['env:chrome', 'jshint', 'exec']);
    grunt.registerTask('default', ['env:firefox', 'jshint', 'exec']);

    grunt.registerTask('serve-and-watch', ['webpack:build', 'concurrent:watchers']);

};
