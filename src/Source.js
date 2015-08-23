import fs from 'fs';
import sourceMap from 'source-map';

class Source {
  constructor() {
    this.sourceMapURL = null;
  }

  setSourceMapURL(cssRootDir, sourceMapURLComment) {
    if (!cssRootDir) {return;}
    this.sourceMapURL = sourceMapURLComment.split('/').pop();
    let map = fs.readFileSync(cssRootDir + this.sourceMapURL);
    this.smc = new sourceMap.SourceMapConsumer(JSON.parse(map));
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
