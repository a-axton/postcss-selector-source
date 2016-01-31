var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Source = (function () {
  function Source() {
    _classCallCheck(this, Source);

    this.smc = null;
  }

  _createClass(Source, {
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
        var results = this.smc.origin(line, column);
        return results ? results : null;
      }
    }
  });

  return Source;
})();

module.exports = Source;