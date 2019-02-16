let _lineID = 0

class Line {
  constructor(option) {
    this.points = option.points || []
    this.style = option.style || {lineWidth: 1, strokeStyle: '#000'}
    this.needCache = option.needCache || false
    this.name = option.name || `lineid${_lineID++}`
  }
}

export function createLine(option) {
  if (option instanceof Line) return option
  if (Array.isArray(option)) return new Line({points: option})
  return new Line(option)
}
