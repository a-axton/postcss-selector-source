var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var fs = _interopRequire(require("fs"));

var sourceMap = _interopRequire(require("source-map"));

var Source = (function () {
  function Source() {
    _classCallCheck(this, Source);

    this.sourceMapURL = null;
  }

  _createClass(Source, {
    setSourceMapURL: {
      value: function setSourceMapURL(cssRootDir, sourceMapURLComment) {
        if (!cssRootDir) {
          return;
        }
        this.sourceMapURL = sourceMapURLComment.split("/").pop();
        var map = fs.readFileSync(cssRootDir + this.sourceMapURL);
        this.smc = new sourceMap.SourceMapConsumer(JSON.parse(map));
      }
    },
    getOriginalPosition: {
      value: function getOriginalPosition(start, end) {
        var originalPositionStart = this.getPosition(start.line, start.column);
        var originalPositionEnd = this.getPosition(end.line, end.column);

        return {
          start: originalPositionStart,
          end: originalPositionEnd
        };
      }
    },
    getPosition: {
      value: function getPosition(line, column) {
        return this.smc.originalPositionFor({
          line: line,
          column: column
        });
      }
    }
  });

  return Source;
})();

module.exports = Source;