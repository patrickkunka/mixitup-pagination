module.exports = function(grunt) {
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		replace: {
			bumpMixItUpCore: {
				src: ['src/js/jquery.mixitup-pagination.js'],
				dest: ['src/js/jquery.mixitup-pagination.js'],
				replacements: [{
					from: /\/\*([\s\S]*?)\*\//,
					to: ''
				}]
			}
		},
		jshint: {
			ignore_warning: {
				options: {
					'-W032': true,
					'-W030': true,
					'-W103': true,
					'-W004': true,
					'-W122': true
				},
				src: ['src/*.js']
			}
		},
		uglify: {
			build: {
				options: {
					preserveComments: 'some'
				},
		    	src: 'src/jquery.mixitup-pagination.js',
				dest: 'build/jquery.mixitup-pagination.min.js'
		  	}
		},
		bump: {
			options: {
				files: ['package.json','bower.json'],
				updateConfigs: ['pkg'],
				commit: false,
				push: false,
				createTag: false // turn these back on when ready to go live
			}
		},
		usebanner: {
			mixItUpCore:{
				options: {
					position: 'top',
					banner: '/**!\n' + 
							' *\n' +
							' * MixItUp Pagination\n' + 
							' * A Premium Extension for MixItUp\n' + 
							' *\n' +
							' * @version	v<%= pkg.version %>-beta\n' +
							' * @copyright	Copyright '+(new Date().getFullYear())+' KunkaLabs Limited.\n' +
							' * @author		KunkaLabs Limited.\n' +
							' * @link		https://mixitup.kunkalabs.com\n' +
							' *\n' +
							' * @license	Commercial use requires a commercial license.\n' + 
							' *				https://mixitup.kunkalabs.com/licenses/\n' +
							' *\n' +
							' *				Non-commercial use permitted under terms of CC-BY-NC license.\n' +
							' *				http://creativecommons.org/licenses/by-nc/3.0/\n' +
							' *\n' +
							' */',
					linebreak: false
				},
				files: {
					src: ['src/js/jquery.mixitup-pagination.js']
				}
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-bump');
	grunt.loadNpmTasks('grunt-banner');

	grunt.registerTask('build', [
		'jshint',
		'uglify:build'
	]);
	
	grunt.registerTask('release', function(target){
		if(!target){
			target = 'patch';
		}
		return grunt.task.run(
			'bump-only:'+target, 
			'replace:bumpMixItUpCore',
			'usebanner:mixItUpCore',
			'build'
		);
	});
	
	grunt.registerTask('default', 'build');
}
