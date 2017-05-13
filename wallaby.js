module.exports = function (wallaby) {
	return {
		files: ['src/domain/redux/**/*.js'],

		tests: ['test/redux/**/*.js'],

		env: {
			type: 'node',
			runner: 'node'
		},

		compilers: {
			'**/*.js': wallaby.compilers.babel()
		},

		testFramework: 'jest'
	};
};
