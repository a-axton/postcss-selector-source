export default class Source {
  constructor() {
    this.smc = null;
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
    let results = this.smc.origin(line, column);
    return results ? results : null;
  }
}
