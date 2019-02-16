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
  }
  initState(option) {
    // 初始化配置
    this.lineMap = {}
    this.PIXOFFSET = 0.5
  }
  init(option) {
    this.initContext(option)
    this.initState(option)
  }
}

initDraw(DrawingBoard);

export function dChart(option) {
  console.count('ss')
  return new DrawingBoard(option)
}