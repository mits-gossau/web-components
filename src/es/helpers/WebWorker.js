// @ts-check

/* global Blob */
/* global Worker */

/**
 * Easy Interface to make a web worker
 * throw in a pure function
 * optionally add urls to additional scripts
 * returns a web worker runner function which accepts primitive parameters
 * https://github.com/Weedshaker/ProxifyJS/blob/master/JavaScript/Classes/Helper/Misc/WebWorkers.js
 *
 * @param {string | function(...string|number): any} workerFunc
 * @param {string[] | string=} scripts
 * @return {function(...string|number):Promise<any[]>}
 */
export const webWorker = (workerFunc, scripts) => {
  // the function which shall be executed within the worker, must be a string and will be converted here to such
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
  const worker = new Worker(URL.createObjectURL(new Blob([
    Array.isArray(scripts) ? `importScripts('${scripts.join("','")}');\n` : typeof scripts === 'string' ? `importScripts('${scripts}');\n` : '',
    `onmessage=(event)=>{postMessage(${workerFunc}(...event.data));}`
  ], { type: 'application/javascript' })))
  /**
   * one worker can only handle a request at a time
   *
   * @type {boolean}
   */
  let running = false
  return (...data) => {
    return new Promise((resolve, reject) => {
      if (running) return reject(new Error(`Worker is still running and can't execute: ${workerFunc} with data: [${data.join(', ')}] at this time!`))
      worker.onmessage = (event) => {
        running = false
        resolve(event.data)
      }
      worker.onerror = (error) => {
        running = false
        reject(error)
      }
      worker.postMessage(data) // can only have one argument as message
      running = true
    })
  }
}
