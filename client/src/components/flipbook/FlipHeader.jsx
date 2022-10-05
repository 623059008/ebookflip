/*
 * @Author: Tempest (Tao Ren)
 * @Date: 2022-08-17 04:00:08 
 * @Last Modified by: Tempest(Tao Ren)
 * @Last Modified time: 2022-08-17 04:02:17
 */
import React from 'react'
import config from '../../config'

const { themeColor } = config

const FlipHeader = props => {
  const { book, mode, scale, updateFlag } = props
  if (!book) {
    return <div></div>
  }
  return (
    <div className='book-info'>
      <div className='book-general-info'>
        <span>Book Name: {book.name || 'Unknown'} </span>
        <span>Book Author: {book.author || 'Unknown'} </span>
      </div>
      <div className='page-fps-info'>
        <span key={`book-setting-${updateFlag}`}>
          <span style={{ color: themeColor }}>{book.page + 1}</span> /{' '}
          <span style={{ color: themeColor }}>{book.numTotalFrames}</span> |
          fps: <span style={{ color: themeColor }}>{book.fps}</span> |
          mode: <span style={{ color: themeColor }}>{mode}</span> |
          scale: <span style={{ color: themeColor }}>{`${(scale).toFixed(2)*100}%`}</span>
        </span>
      </div>
    </div>
  )
}
export default FlipHeader
