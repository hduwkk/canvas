import {resetStyle} from './util.js'
import shape from './shape.js'
import './axis/yAxis.js'

export function initDraw(dChart) {
  dChart.prototype.clearAll = function() {
    this.ctx.clearRect(0,0, this.canvasWidth, this.canvasHeight)
  },
  dChart.prototype.drawLine = function(line) {
    const ctx = this.ctx
    line = shape.createLine(line)
    console.log(line, 'line')
    const PIXOFFSET = line.style.lineWidth % 2 === 1 ? this.PIXOFFSET : 0
    console.log(PIXOFFSET, 'PIXOFFSET')
    if (line.isRestore) ctx.restore()
    if (line.style) resetStyle(ctx, line.style)
    if (line && line.points) {
      if (Array.isArray(line.points[0])) {
        ctx.beginPath()
        line.points.forEach((points) => {
          drawLine(ctx, points, PIXOFFSET)
        })
        ctx.stroke()
      } else {
        ctx.beginPath()
        drawLine(ctx, line.points, PIXOFFSET, true)
      }
    }
    if (line.needCache && !this.lineMap.hasOwnProperty(line.name)) {
      this.lineMap[line.name] = line
    }
  },
  dChart.prototype.drawRect = function(rect) {
    const ctx = this.ctx
    rect = shape.createRect(rect)
    ctx.beginPath()
    // if (rect.borderWidth) {
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
      // ctx.stroke()
      // ctx.fill()
    // }
  }

  dChart.prototype.drawRects = function(chartOffsetX = 0) {
    const arr = [10, 20, 30, 40, 50, 60, 10, 20, 30, 40, 50, 60, 10, 20, 30, 40, 50, 60]
    const barWidth = 30
    const gap = 5
    const unitY = getUnitY(this.canvasHeight * 0.8, Math.max.apply(null, arr))
    let startX
    for (let i = 0; i < arr.length; i++) {
      startX = i * (barWidth + gap)
      if (startX < this.canvasWidth) {
        this.drawRect({x: startX + chartOffsetX, y: this.canvasHeight - 10,  height: converValToHeight(arr[i], unitY), width: barWidth})
      }
    }
    this.rectsWidth = startX + barWidth
    this.maxOffsetX = Math.abs(this.canvasWidth - this.rectsWidth) + gap
  }
}

function drawLine(ctx, points, PIXOFFSET, needStroke) {
  const startPoint = points[0]
  ctx.moveTo(startPoint.x + PIXOFFSET, startPoint.y + PIXOFFSET)
  points.forEach((point) => {
    ctx.lineTo(point.x + PIXOFFSET, point.y + PIXOFFSET)
  })
  if (needStroke) ctx.stroke()
}

function getUnitY(maxHeight, max, min, type = 'bar') {
  if (type === 'bar') {
    return maxHeight / max 
  }
}

function converValToHeight(value, unitY) {
  let v = parseInt(value * unitY)
  return -v
}