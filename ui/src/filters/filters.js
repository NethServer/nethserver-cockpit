import Vue from "vue"

/*global ns*/
var Filters = {
  byteFormat: function (size) {
    var result;

    switch (true) {
      case size === null || size === "" || isNaN(size):
        result = "-";
        break;

      case size >= 0 && size < 1024:
        result = size + " B";
        break;

      case size >= 1024 && size < Math.pow(1024, 2):
        result = Math.round(size / 1024 * 100) / 100 + " KB";
        break;

      case size >= Math.pow(1024, 2) && size < Math.pow(1024, 3):
        result = Math.round(size / Math.pow(1024, 2) * 100) / 100 + " MB";
        break;

      case size >= Math.pow(1024, 3) && size < Math.pow(1024, 4):
        result = Math.round(size / Math.pow(1024, 3) * 100) / 100 + " GB";
        break;

      default:
        result = Math.round(size / Math.pow(1024, 4) * 100) / 100 + " TB";
    }

    return result;
  },
  humanFormat: function (number, decimals = false) {
    var result;

    switch (true) {
      case number === null || number === "" || isNaN(number):
        result = "-";
        break;

      case number >= 0 && number < 1000:
        result = number;
        break;

      case number >= 1000 && number < Math.pow(1000, 2):
        if (decimals) {
          result = Math.round(number / 1000 * 10) / 10 + " K";
        } else {
          result = Math.round(number / 1000) + " K";
        }
        break;

      case number >= Math.pow(1000, 2) && number < Math.pow(1000, 3):
        if (decimals) {
          result = Math.round(number / Math.pow(1000, 2) * 10) / 10 + " M";
        } else {
          result = Math.round(number / Math.pow(1000, 2)) + " M";
        }
        break;

      case number >= Math.pow(1000, 3) && number < Math.pow(1000, 4):
        if (decimals) {
          result = Math.round(number / Math.pow(1000, 3) * 10) / 10 + " G";
        } else {
          result = Math.round(number / Math.pow(1000, 3)) + " G";
        }
        break;

      default:
        if (decimals) {
          result = Math.round(number / Math.pow(1000, 4) * 10) / 10 + " T";
        } else {
          result = Math.round(number / Math.pow(1000, 4)) + " T";
        }
    }
    return result;
  },
  secondsInHour: function (value) {
    let hours = parseInt(Math.floor(value / 3600));
    let minutes = parseInt(Math.floor((value - hours * 3600) / 60));
    let seconds = parseInt((value - (hours * 3600 + minutes * 60)) % 60);

    let dHours = hours > 9 ? hours : "0" + hours;
    let dMins = minutes > 9 ? minutes : "0" + minutes;
    let dSecs = seconds > 9 ? seconds : "0" + seconds;

    return dHours + "h " + dMins + "m " + dSecs + "s";
  },
  dateFormat: function (value) {
    var moment = require("moment");
    if (+new Date(value) > 0) {
      var converted = isNaN(value) ? String(value) : String(value).length == 10 ? value * 1000 : value
      return moment(converted).format("DD MMMM YYYY, HH:mm");
    } else if (value == -1) {
      return ns._i18n.t('never_expires')
    } else return "-";
  },
  capitalize: function (value) {
    return value && value.toString().charAt(0).toUpperCase() + value.toString().slice(1);
  },
  uppercase: function (value) {
    return value && value.toUpperCase()
  },
  isEmpty: function (value) {
    jQuery.isEmptyObject(value);
  },
  camelToSentence: function (value) {
    var result = value.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  },
  cronToHuman: function (value) {
    var cronstrue = require("cronstrue/i18n");
    return value && cronstrue.toString(value, {
      locale: ns.$options.currentLocale
    });
  },
  normalize: function (value, arg) {
    if (arg == 'StartTls' && value.length == 0) {
      return ns._i18n.t('users_groups.disabled')
    }

    if (!value || value.length == 0) {
      return '-'
    }

    if (typeof value === "boolean") {
      return value.toString()
    }

    if (value == 1) {
      return ns._i18n.t('users_groups.enabled')
    }

    if (value == 0) {
      return ns._i18n.t('users_groups.disabled')
    }

    return value
  },
  sanitize: function (value) {
    return value.replace(/^[^a-z]+|[^\w-]+/gi, "");
  },
  textOverflow: function (value) {
    if (value.length > 50) {
        return value.substring(0,50) + '...';
    } else {
        return value;
    }
  }
};

for (var f in Filters) {
  Vue.filter(f, Filters[f])
}
