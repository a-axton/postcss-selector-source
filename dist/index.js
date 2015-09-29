var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var postcss = _interopRequire(require("postcss"));

var Scouter = require("scouter").Scouter;

var Source = _interopRequire(require("./Source"));

var source = new Source();
var scouter = new Scouter();
var selectors = [];
var removeAbove = {
  line: 0,
  set: function set(line) {
    this.line = line;
  }
};

// maps out the relevant css declaration info
function _buildDecls(decls) {
  return decls.map(function (decl) {
    var start = decl.source.start;
    var end = decl.source.end;
    var important = decl.important ? true : false;
    var entry = {
      property: decl.prop,
      value: decl.value,
      important: important,
      start: start,
      end: end
    };
    if (source.smc) {
      entry.originalPosition = source.getOriginalPosition(start, end);
    }

    return entry;
  });
}

function _buildMediaParams(params) {
  params = params.match(/\((.*?)\)/g);

  return params.map(function (param) {
    param = param.replace(/[\])(]/g, "").replace(/\s/g, "").split(":");
    return {
      property: param[0],
      value: param[1]
    };
  });
}

function _buildRuleEntry(rule) {
  if (rule.source.start.line < removeAbove.line) {
    return;
  }

  var start = rule.source.start;
  var end = rule.source.end;
  var decls = _buildDecls(rule.nodes);
  var entry = {
    selector: rule.selector,
    selectors: rule.selectors,
    specificity: scouter.score(rule.selector),
    decls: decls,
    start: start,
    end: end
  };

  if (rule.parent.name === "media") {
    entry.params = _buildMediaParams(rule.parent.params);
  }

  if (source.smc) {
    entry.originalPosition = source.getOriginalPosition(start, end);
  }

  selectors.push(entry);
}

module.exports = postcss.plugin("selector-source", function (callback) {
  // logs each selector with startend position
  return function (css, result) {
    css.walkComments(function (comment) {
      if (comment.text.indexOf("!ATTN") > -1) {
        removeAbove.set(comment.source.start.line);
      } else if (comment.text.indexOf("sourceMappingURL") > -1) {
        source.setSourceMap(comment.text);
      }
    });

    css.walkRules(_buildRuleEntry);

    if (!source.smc) {
      result.warn("make sure an external css source-map is being generated");
    }

    if (callback && typeof callback === "function") {
      callback(selectors);
    } else {
      result.warn("provide a callback to see the results");
    }

    return result;
  };
});