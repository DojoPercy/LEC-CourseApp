const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Pins the Gradle wrapper to a stable version already cached on EAS build servers
function withGradleWrapper(config) {
  return withDangerousMod(config, [
    'android',
    (config) => {
      const filePath = path.join(
        config.modRequest.platformProjectRoot,
        'gradle/wrapper/gradle-wrapper.properties'
      );
      let contents = fs.readFileSync(filePath, 'utf8');
      contents = contents.replace(
        /distributionUrl=.*/,
        'distributionUrl=https\\://services.gradle.org/distributions/gradle-8.13-bin.zip'
      );
      fs.writeFileSync(filePath, contents);
      return config;
    },
  ]);
}

module.exports = withGradleWrapper;
