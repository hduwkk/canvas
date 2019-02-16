export function query(el) {
  if (typeof el === 'string') {
    el = document.querySelector(el)
  }
  if (el && el.nodeType === 1) {
    return el
  }
  warn(`query filed [${el}]`)
  return document.createElement('div')
}

const STYLE = ['fillStyle', 'strokeStyle', 'shadowColor', 'shadowBlur', 'shadowOffsetX',
'shadowOffsetY', 'lineCap', 'lineJoin', 'lineWidth', 'miterLimit', 'font', 'textAlign', 'textBaseline', ]

export function resetStyle(ctx, style) {
  if (!ctx || !style) return
  for (let property in style) {
    if (STYLE.indexOf(property) > -1) {
      ctx[property] = style[property]
    }
  }
}

export function getCss(dom, pty) {
  if (dom.currentStyle) {
    return dom.currentStyle[pty]
  } else {
    return window.getComputedStyle(dom, null)[pty]
  }
}

function warn(msg) {
  console.warn(`[dChart]: ${msg}`)
}
