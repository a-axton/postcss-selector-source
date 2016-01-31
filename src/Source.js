import fs from 'fs';
import sourceMap from 'source-map';
import convert from 'convert-source-map';

class Source {
  constructor() {
    this.smc = null;
  }

  setSourceMap(sourceMapURLComment) {
    if (sourceMapURLComment.indexOf('base64') > -1) {
      let map = convert.fromComment(sourceMapURLComment).toObject();
      this.smc = new sourceMap.SourceMapConsumer(map);
    } else {
      let sourceMapURL = sourceMapURLComment.split('=').pop();
      let map = fs.readFileSync(sourceMapURL).toString();
      this.smc = new sourceMap.SourceMapConsumer(JSON.parse(map));
    }
  }

  getOriginalPosition(start, end) {
    let originalPositionStart = this.getPosition(start.line, start.column);
    let originalPositionEnd = this.getPosition(end.line, end.column);

    return {
      start: originalPositionStart,
      end: originalPositionEnd
    };
  }

  getPosition(line, column) {
    return this.smc.originalPositionFor({
      line: line,
      column: column
    });
  }
}

export default Source;
