let _lineId = 0
let _rectId = 0

class Line {
  constructor(option) {
    this.points = option.points || []
    this.style = option.style || {lineWidth: 1, strokeStyle: '#000'}
    this.needCache = option.needCache || false
    this.name = option.name || `lineid${_lineId++}`
  }
}

const SMALL_RECT = {
  width: 2,
  borderWidth: 0
}
const NORMAL_RECT = {
  width: 5,
  borderWidth: 1
}
class Rect {
  constructor(option) {
    this.x = option.x
    this.y = option.y
    this.height = option.height
    this.fillStyle = option.fillStyle

    if (option.width) {
      this.width = option.width
    } else {
      this.width = option.size === 'small' ? SMALL_RECT.width : NORMAL_RECT.width
    }
    this.borderWidth = option.size === 'small' ? SMALL_RECT.borderWidth : NORMAL_RECT.borderWidth

  }
}

export default {
  createLine: function(option) {
    if (option instanceof Line) return option
    if (Array.isArray(option)) return new Line({points: option})
    return new Line(option)
  },
  createRect: function(option) {
    if (option instanceof Rect) return option
    return new Rect(option)
  }
}
