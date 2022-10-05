/*
 * @Author: Tempest (Tao Ren)
 * @Date: 2022-08-17 04:00:00 
 * @Last Modified by: Tempest (Tao Ren)
 * @Last Modified time: 2022-08-17 04:01:14
 */
var _this = null
const isMobile = () => {
  return /Mobi|Android|iPhone/i.test(navigator.userAgent)
}
class CanvasOperation {
  constructor (option) {
    if (!option.ele || !option.draw) return
    this.ele = option.ele
    this.userDraw = option.draw
    this.width = option.width || 500
    this.height = option.height || 500
    this.cssWidth = option.cssWidth || this.width
    this.cssHeight = option.cssHeight || this.height
    this.maxScale = option.maxScale || 8
    this.minScale = option.minScale || 0.4
    this.scaleStep = option.scaleStep || 0.2
    this.ctx = this.ele.getContext('2d')
    this.scale = 1
    this.preScale = 1
    this.offset = { x: 0, y: 0 }
    this.curOffset = { x: 0, y: 0 }
    this.mousePos = { x: 0, y: 0 }
    this.widthRatio = this.width / this.cssWidth
    this.heightRatio = this.height / this.cssHeight
    this.isTouchPad = isMobile()
    this.hasTouch = 'ontouchstart' in window && !this.isTouchPad
    this.touchStart = this.hasTouch ? 'touchstart' : 'mousedown'
    this.touchMove = this.hasTouch ? 'touchmove' : 'mousemove'
    this.touchEnd = this.hasTouch ? 'touchend' : 'mouseup'
    this.zoom = function (isMouse) {
      if (isMouse) {
        _this.mousePos.x *= this.widthRatio
        _this.mousePos.y *= this.heightRatio
      } else {
        _this.mousePos.x = this.width / 2
        _this.mousePos.y = this.height / 2
      }

      this.offset.x =
        _this.mousePos.x -
        ((_this.mousePos.x - this.offset.x) * this.scale) / this.preScale
      this.offset.y =
        _this.mousePos.y -
        ((_this.mousePos.y - this.offset.y) * this.scale) / this.preScale
      this.draw()
      this.preScale = this.scale
      this.curOffset.x = this.offset.x
      this.curOffset.y = this.offset.y
    }
    _this = this
  }

  draw = function () {
    this.clearCanvas()
    this.ctx.translate(this.offset.x, this.offset.y)
    this.ctx.scale(this.scale, this.scale)
    _this.userDraw()
  }

  zoomIn = function (isMouse) {
    this.scale += this.scaleStep
    if (this.scale > this.maxScale) {
      this.scale = this.maxScale
      return
    }
    this.zoom.call(this, isMouse)
  }

  zoomOut = function (isMouse) {
    this.scale -= this.scaleStep
    if (this.scale < this.minScale) {
      this.scale = this.minScale
      return
    }
    this.zoom.call(this, isMouse)
  }

  reset = function () {
    this.clear()
    this.draw()
  }

  clearCanvas = function () {
    this.ele.width = this.width
  }

  clear = function () {
    this.clearCanvas()
    this.scale = 1
    this.preScale = 1
    this.offset = { x: 0, y: 0 }
    this.curOffset = { x: 0, y: 0 }
    this.mousePos = { x: 0, y: 0 } //
  }

  addMusewheelEvent = function () {
    const eventType = document.mozFullScreen ? 'DOMMouseScroll' : 'mousewheel'
    this.ele.addEventListener(eventType, mouseWheel)

    function mouseWheel (e) {
      _this.mousePos.x = e.offsetX
      _this.mousePos.y = e.offsetY
      var b = true
      if (e.wheelDelta) {
        b = e.wheelDelta > 0
      } else {
        b = e.detail < 0
      }
      if (b) {
        _this.zoomIn(true)
      } else {
        _this.zoomOut(true)
      }
      if (e.preventDefault) {
        e.preventDefault()
      }
      return false
    }
  }

  addDragEvent = function () {
    this.ele.addEventListener(this.touchStart, dragStart)
    let x = 0
    let y = 0

    function dragMove (e) {
      _this.offset.x = _this.curOffset.x + (e.x - x) * _this.widthRatio
      _this.offset.y = _this.curOffset.y + (e.y - y) * _this.heightRatio
      _this.draw()
    }

    function dragEnd () {
      _this.curOffset.x = _this.offset.x
      _this.curOffset.y = _this.offset.y
      window.removeEventListener(_this.touchMove, dragMove)
      window.removeEventListener(_this.touchEnd, dragEnd)
    }

    function dragStart (e) {
      x = e.x
      y = e.y
      window.addEventListener(_this.touchMove, dragMove)
      window.addEventListener(_this.touchEnd, dragEnd)
    }
  }
}

export default CanvasOperation
