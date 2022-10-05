/*
 * @Author: Tempest (Tao Ren)
 * @Date: 2022-08-17 03:59:49 
 * @Last Modified by: Tempest(Tao Ren)
 * @Last Modified time: 2022-08-17 04:02:24
 */
import React, { useState, useEffect, useRef } from 'react'
import { Image as AntImage } from 'antd'
const FlipPageNaive = props => {
  const { book, updateFlag } = props
  return (
    <div className='book-pages'>
      {!book && <div className='book-pages'>No Available Content</div>}
      {book && (
        <div className='page-content'>
          <AntImage
            alt={book.page}
            key={`book-page-${updateFlag}-${book.page}`}
            className='page-img'
            style={{ width: '300px', height: 'auto' }}
            src={book.getPage()}
          />
        </div>
      )}
    </div>
  )
}
export default FlipPageNaive
