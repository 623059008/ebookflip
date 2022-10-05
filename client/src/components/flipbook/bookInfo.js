import config from '../../config'

const { serverBaseUrl } = config

class BookInfo {
  fps = 30
  constructor (
    id,
    name,
    author,
    description,
    numTotalFrames,
    source,
    frames,
    fps = 30
  ) {
    this.id = id
    this.name = name
    this.author = author
    this.description = description
    this.numTotalFrames = numTotalFrames
    this.source = source
    this.frames = frames
    this.fps = fps
    this.page = 0
    this.scale = 1
    // console.log(`[constructor] book info: ${this.name}, ${this.author}, ${this.description}, ${this.numTotalFrames}, ${this.source}, ${this.fps}`);
  }

  appendFrames (frames) {
    this.frames += frames
  }
  getPage () {
    // page = frames
    if (this.page >= this.frames.length) {
      console.log('[error] page exceed max frames')
      return null
    }
    return serverBaseUrl + '/' + this.frames[this.page]
  }
}
export default BookInfo
