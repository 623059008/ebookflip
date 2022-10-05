/*
 * @Author: Tempest (Tao Ren)
 * @Date: 2022-08-17 03:59:39 
 * @Last Modified by: Tempest(Tao Ren)
 * @Last Modified time: 2022-08-17 04:02:18
 */
import React, { useState, useEffect, useRef } from 'react'
import CanvasOperator from './canvasOperator'

const FlipPageCanvas = props => {
  const [canvasOperator, setCanvasOperator] = useState(null)
  const { book, imageList, setCanvasOperator: parentCanvasOperator, updateFlag } = props
  const width = 500
  const height = 500
  const canvasRef = useRef(null)
  const drawImage = (canvas, image) => {
    const ctx = canvas.getContext('2d', { alpha: false })
    let startX,
      startY = [0, 0]
    let scale = 1
    const imageWidth = image.width
    const imageHeight = image.height
    if (imageWidth < width && imageHeight < height) {
      startX = (width - imageWidth) / 2
      startY = (height - imageHeight) / 2
    } else {
      // scale the image to fit the canvas
      scale = Math.min(width / imageWidth, height / imageHeight)
      startX = (width - imageWidth * scale) / 2
      startY = (height - imageHeight * scale) / 2
    }
    ctx.drawImage(
      image,
      0,
      0,
      imageWidth,
      imageHeight,
      startX,
      startY,
      imageWidth * scale,
      imageHeight * scale
    )
  }

  // Initialize canvas operation
  useEffect(() => {
    if (!book) {
      return
    }
    const canvas = canvasRef.current
    const image = imageList[book.page]
    if (!canvas || !image) {
      return
    }
    const op = new CanvasOperator({
      ele: canvas, // 画布对象
      draw: () => {
        drawImage(canvas, image)
      }, // 用户绘图方法
      width, // 画布宽
      height, // 画布高
      cssWidth: 600, // css设置的宽(对应css style的width)
      cssHeight: 600, // css设置的高(对应css style的height)
      maxScale: 2, // 缩放最大倍数（缩放比率倍数）
      minScale: 0.4, // 缩放最小倍数（缩放比率倍数）
      scaleStep: 0.2 // 缩放比率
    })
    op.addMusewheelEvent() // 添加滚轮放大缩小事件
    op.addDragEvent() // 添加拖动事件
    op.draw()
    setCanvasOperator(op)
    parentCanvasOperator(op)
  }, [book, imageList])

  // update for each frame
  useEffect(() => {
    if (!book) {
      return
    }
    const image = imageList[book.page]
    if (!canvasOperator || !image) {
      return
    }
    drawImage(canvasOperator.ele, image)
  }, [updateFlag])

  return (
    <div className='book-pages'>
      {!book && <div>No Available Content</div>}
      {book && (
        <canvas
          className='page-content'
          ref={canvasRef}
          width={width}
          height={height}
          style={{ cursor: 'move' }}
        />
      )}
    </div>
  )
}

export default FlipPageCanvas
