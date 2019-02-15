import {query, getCss} from './util';

class DrawingBoard {
  constructor(option) {
    this.init(option)
  }
  initContext(option) {
    this.container = query(option.el);
    const canvas = document.createElement('canvas');
    this.container.append(canvas);
    this.ctx = canvas.getContext('2d')
    this.canvas = {
      canvas: canvas,
      height: parseFloat(getCss(canvas, 'height')),
      width: parseFloat(getCss(canvas, 'width'))
    }
  }
  initState(option) {
    // 初始化配置
  }
  init(option) {
    this.initContext(option)
    this.initState(option)
  }
}

export default DrawingBoard