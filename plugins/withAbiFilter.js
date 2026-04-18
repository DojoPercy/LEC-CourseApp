const { withAppBuildGradle } = require('expo/config-plugins');

// Limits the APK to arm64-v8a only, cutting ~30% size vs a fat APK
function withAbiFilter(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.contents.includes('abiFilters')) {
      return config;
    }
    config.modResults.contents = config.modResults.contents.replace(
      /defaultConfig\s*\{/,
      `defaultConfig {\n            ndk { abiFilters "arm64-v8a" }`
    );
    return config;
  });
}

module.exports = withAbiFilter;
