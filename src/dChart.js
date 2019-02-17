import {query, getCss} from './util';
import {initDraw} from './draw.js'

class DrawingBoard {
  constructor(option) {
    this.init(option)
  }
  initContext(option) {
    const container = this.container = query(option.el);
    const canvas = document.createElement('canvas');

    container.append(canvas);
    this.ctx = canvas.getContext('2d')

    canvas.height = parseFloat(option.height || getCss(container, 'height'));
    canvas.width = parseFloat(option.width || getCss(container, 'width'));
    canvas.style.height = canvas.height + 'px';
    canvas.style.width = canvas.width + 'px';
    this.canvas = canvas
    this.canvasHeight = canvas.height
    this.canvasWidth = canvas.width
  }
  initState(option) {
    // 初始化配置
    this.lineMap = {}
    this.PIXOFFSET = 0.5
    this.data = option.data || null
    this.chartOffsetX = 0
  }
  initEvent() {
    let mouseDownX = 0
    let mouseUpX = 0
    this.canvas.addEventListener('mousedown', (e) => {
      console.log(e.pageX)
      this.isMouseDown = true
      this.chartOffsetX = this.chartOffsetX
      this.mouseDownX = mouseDownX = e.pageX
    })
    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.isBusy && this.isMouseDown) {
        this.isBusy = true
        if (e.pageX !== mouseDownX) {
          this.chartOffsetX += parseInt(e.pageX - mouseDownX)
          if(this.chartOffsetX > 0) this.chartOffsetX = 0
          if(this.chartOffsetX < -this.maxOffsetX) this.chartOffsetX = -this.maxOffsetX
          mouseDownX = e.pageX
          this.clearAll()
          this.drawRects(this.chartOffsetX)
        }
        console.log(this.chartOffsetX, '..')
        this.isBusy = false
      }
    })
    this.canvas.addEventListener('mouseup', (e) => {
      console.log(e.pageX, 'up')
      this.isMouseDown = false
      this.mouseUpX = mouseUpX = e.pageX
    })
  }
  init(option) {
    this.initContext(option)
    this.initState(option)
    this.initEvent()
  }
}

initDraw(DrawingBoard);

export function dChart(option) {
  console.count('ss')
  return new DrawingBoard(option)
}