import {resetStyle} from './util.js'
import {createLine} from './line.js'

export function initDraw(dChart) {
  dChart.prototype.drawLine = function(line) {
    const ctx = this.ctx
    line = createLine(line)
    console.log(line, 'line')
    const PIXOFFSET = line.style.lineWidth % 2 === 1 ? this.PIXOFFSET : 0
    console.log(PIXOFFSET, 'PIXOFFSET')
    if (line.isRestore) ctx.restore()
    if (line.style) resetStyle(ctx, line.style)
    if (line && line.points) {
      if (Array.isArray(line.points[0])) {
        line.points.forEach
      }
    }
    if (line.needCache && !this.lineMap.hasOwnProperty(line.name)) {
      this.lineMap[line.name] = line
    }
  }
}

function drawLine(ctx, points, PIXOFFSET, needStroke) {
  const startPoint = points[0]
  ctx.beginPath()
  ctx.moveTo(startPoint.x + PIXOFFSET, startPoint.y + PIXOFFSET)
  points.forEach((point) => {
    ctx.lineTo(point.x + PIXOFFSET, point.y + PIXOFFSET)
  })
  if (needStroke) ctx.stroke()
}