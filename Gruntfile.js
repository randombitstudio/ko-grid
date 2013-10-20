module.exports = function(grunt) {
    
    grunt.initConfig(
        {
            //Get package variables.
            'pkg': grunt.file.readJSON('package.json'),
            
            //Concat all javascript files.
            'concat': {
                'options': {
                    'separator': ';'
                },
               'dist': {
                   'src': ['lib/**/*.js'],
                   'dest': 'dist/<%= pkg.name %>.<%= pkg.version%>.js'
               }
            },
            
            //Minify all javascript files
            'uglify': {
                'options': {
                    'banner': "/* <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today('dd-mm-yyyy') %> */\n\n"
                },
                'dist': {
                    'files': {
                        'dist/<%= pkg.name %>.<%= pkg.version%>.min.js': ['<%= concat.dist.dest %>']
                    }
                }
            },
            
            'watch': {
                'scripts': {
                    'files': ['lib/*.js'],
                    'tasks': ['concat', 'uglify'],
                    'options': {
                        'spawn':false
                    }
                },
            }
        }
    );

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    grunt.registerTask('default', ['concat', 'uglify']);    

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' +action);
    });
};
