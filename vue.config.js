process.env.VUE_APP_VERSION = require("./package.json").version;
module.exports = {
  transpileDependencies: ["vuetify", "vuex-module-decorators"],
};
