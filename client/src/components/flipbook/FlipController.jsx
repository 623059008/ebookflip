/*
 * @Author: Tempest (Tao Ren)
 * @Date: 2022-08-17 03:59:35 
 * @Last Modified by: Tempest(Tao Ren)
 * @Last Modified time: 2022-08-17 04:02:15
 */
import React, { useState, useEffect } from 'react'
import { Button, Tooltip, Slider, Select } from 'antd'
import {
  CaretRightOutlined,
  PauseOutlined,
  RightOutlined,
  LeftOutlined,
  PlusOutlined,
  MinusOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import config from '../../config'

const { themeColor } = config

const formatter = value => `${value}%`

const FlipController = props => {
  const {
    book,
    setPage,
    setPageDebounce,
    setScale,
    playBook,
    pauseBook,
    setFps,
    status,
    mode,
    updateFlag
  } = props
  const [progressText, setProgressText] = useState('')
  const [progress, setProgress] = useState(0)
  const progressChange = value => {
    if (!book) {
      return
    }
    if (isNaN(value)) {
      return
    }
    setProgress(value)
    // map [0,100] to [0, book.numTotalPages-1]
    const page = parseInt((book.numTotalFrames - 1) * (value / 100))
    setPageDebounce(page)
  }
  const fpsSelectedChange = v => {
    setFps(v)
  }

  useEffect(() => {
    if (!book) {
      return
    }
    setProgress(parseInt((book.page / book.numTotalFrames) * 100))
  }, [book, updateFlag])

  useEffect(() => {
    if (!book) {
      return
    }
    setProgressText(`${book.page + 1} / ${book.numTotalFrames}`)
  }, [progress, book, updateFlag])
  return (
    <div className='book-control'>
      {book && (
        <div className='control-container'>
          <div className='slider-control'>
            <label className='progress-label' style={{ marginRight: '2px' }}>
              {progressText}
            </label>
            <Slider
              min={0}
              max={100}
              onChange={progressChange}
              tipFormatter={formatter}
              value={typeof progress === 'number' ? progress : 0}
              style={{ width: '70%', color: '#87d068' }}
              step={1}
            />
          </div>
          <div className='control-secondline'>
            <Tooltip color={themeColor} placement='topLeft' title='left'>
              <Button
                type='default'
                shape='circle'
                disabled={status}
                icon={
                  <LeftOutlined
                    onClick={() => {
                      setPage(Math.max(0, book.page - 1))
                    }}
                  />
                }
              />
            </Tooltip>
            <Tooltip
              color={themeColor}
              placement='topLeft'
              title={status ? 'pause' : 'play'}
            >
              <Button
                type='default'
                shape='circle'
                icon={status ? <PauseOutlined /> : <CaretRightOutlined />}
                onClick={status ? pauseBook : playBook}
              />
            </Tooltip>
            <Tooltip color={themeColor} placement='topLeft' title='right'>
              <Button
                type='default'
                shape='circle'
                disabled={status}
                icon={<RightOutlined />}
                onClick={() => {
                  setPage(Math.min(book.numTotalFrames - 1, book.page + 1))
                }}
              />
            </Tooltip>
            {mode === 3 && (
              <Tooltip color={themeColor} placement='topLeft' title='zoom'>
                <Button
                  type='default'
                  shape='circle'
                  disabled={status}
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setScale('bigger')
                  }}
                />
              </Tooltip>
            )}
            {mode === 3 && (
              <Tooltip color={themeColor} placement='topLeft' title='zoom'>
                <Button
                  type='default'
                  shape='circle'
                  disabled={status}
                  icon={<MinusOutlined />}
                  onClick={() => {
                    setScale('smaller')
                  }}
                />
              </Tooltip>
            )}
            {mode === 3 && (
              <Tooltip color={themeColor} placement='topLeft' title='reset zoom'>
                <Button
                  type='default'
                  shape='circle'
                  disabled={status}
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setScale('reset')
                  }}
                />
              </Tooltip>
            )}
            <Select
              defaultValue={60}
              style={{ width: 'auto', color: '#87d068' }}
              dropdownMatchSelectWidth={true}
              onChange={fpsSelectedChange}
              value={book.fps}
              placement='topLeft'
            >
              <Select.Option value={10}>10 FPS</Select.Option>
              <Select.Option value={30}>30 FPS</Select.Option>
              <Select.Option value={60}>60 FPS</Select.Option>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}
export default FlipController
