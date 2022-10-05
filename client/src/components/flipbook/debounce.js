/*
 * @Author: Tempest (Tao Ren)
 * @Date: 2022-08-17 03:59:46 
 * @Last Modified by: Tempest(Tao Ren)
 * @Last Modified time: 2022-08-17 04:02:22
 */
function debounce (fn, timeout = 500) {
  let time = null
  return function () {
    clearTimeout(time)
    time = setTimeout(() => {
      fn.apply(this, arguments)
    }, timeout)
  }
}
export default debounce
