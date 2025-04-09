// jest.config.js
module.exports = {
    testEnvironment: "node", // pour tester dans un environnement Node.js
    collectCoverage: true, // active la couverture
    collectCoverageFrom: [
      "**/*.js",           // tous les fichiers JS...
      "!**/node_modules/**", // ...sauf node_modules
      "!**/tests/**",        // ...et les fichiers de tests eux-mêmes
      "!jest.config.js"      // ...et ce fichier de config
    ]
  };
  