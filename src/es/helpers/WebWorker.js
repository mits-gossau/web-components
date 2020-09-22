// @ts-check

/**
 * A helper to easily spawn new WebWorkers
 *
 * @export
 * @class WebWorker
 * @property {
    make,
    run
  }
 */
export default class WebWorker {
  /**
   * Easy Interface to make a web worker
   * throw in pure function
   * optionally add urls to additional scripts
   * returns a web worker runner function which accepts primitive parameters and a callback
   * https://github.com/Weedshaker/ProxifyJS/blob/master/JavaScript/Classes/Helper/Misc/WebWorkers.js
   *
   * @static
   * @param {string | function(any): any} workerFunc
   * @param {string[] | string=} scripts
   * @return {function(number[] | string[], function(ErrorEvent | null, any=):void):true|Error}
   */
  static make (workerFunc, scripts) {
    // add scripts outside of event
    scripts = Array.isArray(scripts) && scripts.length ? `importScripts('${scripts.join("','")}');\n` : ''
    if (typeof workerFunc !== 'string') {
      workerFunc = workerFunc.toLocaleString()
      workerFunc = workerFunc.replace(/this\./g, '')
      if (/^\(.*?\).*?=>.*?\{/.test(workerFunc)) {
        // arrow functions need to be wrapped with ()
        workerFunc = `(${workerFunc})`
      } else if (!/^function/.test(workerFunc)) {
        // class functions need the keyword function
        workerFunc = `function ${workerFunc}`
      }
    }
    const response = `onmessage=(event)=>{postMessage(${workerFunc}(...event.data));}`
    let blob = new Blob([scripts, response], { type: 'application/javascript' })
    const worker = new Worker(URL.createObjectURL(blob))
    let running = false
    return (data = [], callback = () => { }) => {
      if (!running) {
        worker.onmessage = (e) => {
          running = false
          callback(null, e.data)
        }
        worker.onerror = (e) => {
          running = false
          callback(e)
        }
        worker.postMessage(data) // can only have one argument as message
        running = true
        return true
      } else {
        return new Error(`Worker is still running and can't be executed at this time: ${workerFunc}`)
      }
    }
  }

  /**
   * Wraps the execution of the web worker into a promise instead of expecting a callback when directly calling the webworker
   *
   * @static
   * @param {number[] | string[]} [data=[]]
   * @param {function(number[] | string[], function(ErrorEvent | null, any=):void):true|Error} worker
   * @return {Promise<any>}
   */
  static run (data = [], worker) {
    return new Promise((resolve, reject) => {
      const doesRun = worker(data, (err, result) => {
        if (err) {
          reject(err)
          console.warn(`Error at webworker -> ${err.message}`)
        }
        resolve(result)
      })
      if (doesRun !== true) reject(doesRun)
    })
  }
}
