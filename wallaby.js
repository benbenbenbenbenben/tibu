module.exports = function(wallaby) {
    return {
      files: [
        'src/**/*.ts',
        '!src/spec/**/*.ts',
      ],
      tests: [
        'src/spec/**/*.spec.ts'
      ],
      debug: true,
      compilers: {
        '**/*.ts': wallaby.compilers.typeScript()
      },
      testFramework: 'mocha',
      env: {
        type: 'node'
      }
    };
  };