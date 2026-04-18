const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const KEEP_RULES = `
# Keep all Expo modules (used via reflection)
-keep class expo.modules.** { *; }
-keep interface expo.modules.** { *; }
-dontwarn expo.modules.**

# Keep React Native internals
-keep class com.facebook.react.** { *; }
-dontwarn com.facebook.react.**
`;

function withProguardRules(config) {
  return withDangerousMod(config, [
    'android',
    (config) => {
      const filePath = path.join(
        config.modRequest.platformProjectRoot,
        'app/proguard-rules.pro'
      );
      const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
      if (!existing.includes('expo.modules')) {
        fs.writeFileSync(filePath, existing + KEEP_RULES);
      }
      return config;
    },
  ]);
}

module.exports = withProguardRules;
