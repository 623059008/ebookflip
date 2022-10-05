/*
 * @Author: Tempest (Tao Ren)
 * @Date: 2022-08-17 03:59:29 
 * @Last Modified by: Tempest(Tao Ren)
 * @Last Modified time: 2022-08-17 04:02:11
 */
import React, { useState, useEffect, useRef } from 'react'
import { Card, Spin, Select } from 'antd'
import FlipHeader from './FlipHeader'
import FlipPageNaive from './FlipPageNaive'
import FlipPagePreload from './FlipPagePreload'
import FlipPageCanvas from './FlipPageCanvas'
import FlipController from './FlipController'
import config from '../../config'
import debounce from './debounce'
import BookInfo from './bookInfo'
import './index.css'
import 'antd/dist/antd.css'

const { serverBaseUrl, themeColor } = config

// custom hook to initialize book data
const useBookInit = videoId => {
  const [book, setBook] = useState(null)
  useEffect(() => {
    const fetchVideo = async id => {
      const response = await fetch(`${serverBaseUrl}/video/${id}`)
      const res = await response.json()
      setBook(
        new BookInfo(
          videoId,
          res.name,
          res.author,
          res.description,
          res.numTotalFrames,
          res.source,
          res.frames,
          60
        )
      )
    }
    const fetchInitBook = async (videoId, offset, count) => {
      // const videoInfo = await fetchVideo(videoId)
      const reqUrl = `${serverBaseUrl}/video/${videoId}?offset=${offset}&count=${count}`
      const response = await fetch(reqUrl)
      const res = await response.json()
      setBook(
        new BookInfo(
          videoId,
          res.name,
          res.author,
          res.description,
          res.numTotalFrames,
          res.source,
          res.frames,
          60
        )
      )
    }
    fetchVideo(videoId)
    // fetchInitBook(videoId, 0, video.numTotalFrames)
  }, [videoId])
  return book
}

const FlipBook = props => {
  const cbSaver = useRef()
  const [updateFlag, setUpdateFlag] = useState(0)
  const [playInterval, setPlayInterval] = useState(null) // time interval for playing
  const [canvasOperator, setCanvasOperator] = useState(null) // canvas operator

  const { book, mode, imageList, setMode } = props
  const setFps = v => {
    if (!book) {
      return
    }
    if (isNaN(v)) {
      console.log('[error] fps is not a number')
      return
    }
    if (v > 60 || v < 10) {
      console.log('[error] fps is out of range')
      return
    }
    book.fps = v
    cbSaver.current()
  }
  const setPage = page => {
    book.page = page
    cbSaver.current()
  }
  const setPageDebounce = page => {
    book.page = page
    // when slider is moved, it needs to use debounce to avoid too frequent update
    debounce(() => {
      setUpdateFlag(updateFlag + 1)
    }, 500)()
  }
  cbSaver.current = () => {
    if (updateFlag > 9999999) {
      setUpdateFlag(0)
      return
    }
    setUpdateFlag(updateFlag + 1)
  }
  const playBook = () => {
    if (playInterval) {
      console.log('[error] book is playing')
      return
    }
    // console.log(`[play] start to play, ${book.fps} fps, page: ${book.page}`)
    setPlayInterval(
      window.setInterval(() => {
        book.page += 1
        // console.log('page', book.page)
        // trigger image update
        cbSaver.current()
        if (book.page >= book.frames.length) {
          book.page = 0
        }
      }, 1000 / book.fps)
    )
  }
  const pauseBook = () => {
    if (!playInterval) {
      console.log('[error] book is not playing')
    }
    clearInterval(playInterval)
    setPlayInterval(null)
  }
  const setScale = indicator => {
    if(!canvasOperator) {
      console.log('[error] canvas operator is not initialized')
      return
    }
    if (indicator === 'bigger') {
      canvasOperator.zoomIn()
    } else if (indicator === 'smaller') {
      canvasOperator.zoomOut()
    } else if (indicator === 'reset') {
      // recover to default scale
      canvasOperator.reset()
    }
    cbSaver.current()
  }
  return (
    <div className='flipbook'>
      <FlipHeader book={book} mode={mode} updateFlag={updateFlag} scale={!canvasOperator ? 1 : canvasOperator.scale} />
      <Card
        hoverable
        style={{ width: '100%', paddingTop: '20px' }}
        cover={
          mode === 1 ? (
            <FlipPageNaive book={book} updateFlag={updateFlag} />
          ) : mode === 2 ? (
            <FlipPagePreload
              book={book}
              imageList={imageList}
              updateFlag={updateFlag}
            />
          ) : (
            <FlipPageCanvas
              book={book}
              imageList={imageList}
              setCanvasOperator={setCanvasOperator}
              updateFlag={updateFlag}
            />
          )
        }
      >
        {/* <Card.Meta style={{ width: '100%' }} title={'Digital Flip Book'} description={book?.description || 'Not Available'} /> */}
        <FlipController
          book={book}
          playBook={playBook}
          pauseBook={pauseBook}
          setPage={setPage}
          setPageDebounce={setPageDebounce}
          setFps={setFps}
          setScale={setScale}
          setMode={setMode}
          mode={mode}
          status={!!playInterval}
          updateFlag={updateFlag}
        />
      </Card>
    </div>
  )
}

const FlipBookContainer = props => {
  const [mode, setMode] = useState(3) // default mode is canvas mode
  const [loading, setLoading] = useState(false)
  const book = useBookInit(props.videoId || 1)
  const [imageList, setImageList] = useState([])
  useEffect(() => {
    if (mode === 1) {
      return
    }
    const fetchAllImages = async () => {
      if (!book) {
        return
      }
      // cache mode
      const tmp = []
      for (let i = 0; i < book.numTotalFrames; i++) {
        const p = new Promise((resolve, reject) => {
          const image = new Image()
          image.src = serverBaseUrl + '/' + book.frames[i]
          image.onload = () => {
            resolve(image)
          }
        })
        tmp.push(p)
      }
      const res = await Promise.all(tmp)
      setImageList(res)
      setLoading(false)
    }
    setLoading(true)
    // cache all images, use Image Element to preload
    fetchAllImages()
  }, [book, mode])
  return (
    <div className='flip-container'>
      <Select
        hidden
        defaultValue={3}
        style={{ width: '150px', color: '#87d068' }}
        dropdownMatchSelectWidth={true}
        onChange={v => {
          setMode(v)
        }}
        value={mode}
        placement='topLeft'
      >
        <Select.Option value={1}>Naive</Select.Option>
        <Select.Option value={2}>Preload img</Select.Option>
        <Select.Option value={3}>Preload Canvas</Select.Option>
      </Select>
      <Spin spinning={loading} color={themeColor} tip='Loading...'>
        <FlipBook
          book={book}
          mode={mode}
          setMode={setMode}
          imageList={imageList}
        />
      </Spin>
    </div>
  )
}

export default FlipBookContainer
