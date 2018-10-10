var Lang = {
  initLang() {
    // get browser lang and init locales
    var messages = {};
    var userLang = cockpit.language || navigator.language || navigator.userLanguage;
    userLang = userLang.replace("-", "_").split("_")[0];

    // try loading browser locale
    try {
      messages = require("./locale-" + userLang + ".json");
    } catch (e) {
      console.log("locale: " + userLang + " not found. fallback to en");
      messages = require("./locale-en.json");
      userLang = "en";
    }

    return {
      messages: messages,
      locale: userLang
    };
  }
};

export default Lang;
