/*
 * @Author: Tempest (Tao Ren)
 * @Date: 2022-08-17 03:59:42 
 * @Last Modified by: Tempest(Tao Ren)
 * @Last Modified time: 2022-08-17 04:02:20
 */
import React, { useState, useEffect, useRef } from 'react'

const FlipPagePreLoad = props => {
  const { book, imageList, updateFlag } = props

  const bookPages = useRef(null)

  useEffect(() => {
    if (!book) {
      return
    }
    const image = imageList[book.page]
    if (bookPages.current && image) {
      // clear the previous image
      bookPages.current.innerHTML = ''
      bookPages.current.appendChild(image)
    }
  }, [updateFlag, imageList, book])

  return (
    <div className='book-pages'>
      {!book && <div>No Available Content</div>}
      {book && <div ref={bookPages} className='page-content'></div>}
    </div>
  )
}
export default FlipPagePreLoad
