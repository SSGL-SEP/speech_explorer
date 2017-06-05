
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
            options: {
                node: true,
                browser: true,
                strict: true,
                loopfunc: true,
                globals: {
                    "Map": false
                }
            },
            app: ['app/**/*.js'],
            tests: {
                options: {
                    esversion: 6,
                    strict: "implied",
                    mocha: true
                },
                files: {
                    src: ['test/**/*.js']
                }
            }
        },

        exec: {
            run_istanbul_mocha_tests:{
                command: 'istanbul cover ./node_modules/.bin/_mocha test/unit/**/*.js'
            },
            run_istanbul_cucumber_tests:{
                command: 'node app/server.js & istanbul cover ./node_modules/.bin/cucumberjs -r test/features'
            },
            kill_all:{
                command: 'killall node'
            },
            run_cucumber_tests: {
                command: 'node_modules/.bin/cucumberjs test/features'
            }
        },

        webpack: {
            options: webpackConfig
        },

        watch: {
            app: {
                files: ['./app/**/*.js', 'webpack.config.js'],
                tasks: ['webpack:build']
            }
        },

        nodemon: {
            dev: {
                script: 'app/server.js'
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
        },

        cucumber_coverage: {
            example: {
                src: 'test/features'
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
    // grunt.registerTask('default', ['env:firefox', 'jshint', 'exec']);
    grunt.registerTask('default', ['env:firefox', 'jshint','exec:run_istanbul_mocha_tests']);
    // grunt.registerTask('default', ['env:firefox', 'exec:run_cucumber_tests', 'exec:run_istanbul_mocha_tests']);

    grunt.registerTask('serve-and-watch', ['webpack:build', 'concurrent:watchers']);

};
