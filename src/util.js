function query(el) {
  if (typeof el === 'string') {
    el = document.querySelector(el)
  }
  if (el && el.nodeType === 1) {
    return el
  }
  warn(`query filed [${el}]`)
  return document.createElement('div')
}

function getCss(dom, pty) {
  if (dom.currentStyle) {
    return dom.currentStyle[pty]
  } else {
    return window.getComputedStyle(dom, null)[pty]
  }
}

function warn(msg) {
  console.warn(`[dChart]: ${msg}`)
}

export default {
  query,
  getCss
}