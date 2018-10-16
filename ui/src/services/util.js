var UtilService = {
  methods: {
    tableLangs() {
      return {
        nextText: this.$i18n.t("next"),
        prevText: this.$i18n.t("prev"),
        ofText: this.$i18n.t("of"),
        rowsPerPageText: this.$i18n.t("rows_per_page"),
        globalSearchPlaceholder: this.$i18n.t("search"),
        allText: this.$i18n.t("all")
      };
    },
    generateUUID() {
      var d = new Date().getTime();
      var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = ((d + Math.random() * 16) % 16) | 0;
          d = Math.floor(d / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    },
    generatePassword() {
      var length = 12,
        charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,£$%&",
        retVal = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
    },
    urlToFile(dataURI, name) {
      var byteString;
      if (dataURI.split(",")[0].indexOf("base64") >= 0)
        byteString = atob(dataURI.split(",")[1]);
      else byteString = unescape(dataURI.split(",")[1]);

      // separate out the mime component
      var mimeString =
        dataURI &&
        dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      var blob = new Blob([ia], {
        type: mimeString
      });
      return new File([blob], name);
    },
    getBase64(file, callback) {
      var reader = new FileReader();
      reader.onload = function () {
        callback(reader.result)
      };
      reader.onerror = function (error) {
        console.error('Error: ', error);
        callback(null)
      };
      reader.readAsDataURL(file);
    },
    createCSV(columns, rows) {
      var cs = [];
      for (var c in columns) {
        if (columns[c].field !== "") cs.push(columns[c].label);
      }

      var rs = [];
      for (var r in rows) {
        var row = [];
        for (var c in columns) {
          if (columns[c].field !== "") row.push(rows[r][columns[c].field]);
        }
        rs.push(row);
      }

      return {
        cols: cs,
        rows: rs
      };
    },
    downloadCSV(columns, rows, name) {
      var header = '"' + columns.join('","') + '"' + "\r\n";
      var body = "";
      for (var r in rows) {
        body += '"' + rows[r].join('","') + '"' + "\r\n";
      }
      var finalCSV = "data:text/csv;charset=utf-8," + header + body;
      var encodedUri = encodeURI(finalCSV);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      var now = new Date();
      var date =
        now.getFullYear() + "_" + (now.getMonth() + 1) + "_" + now.getDate();
      link.setAttribute("download", name + date + ".csv");
      link.click();
    },
  }
};
export default UtilService;
