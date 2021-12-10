// @ts-check

/* global AbortController */
/* global CustomEvent */
/* global fetch */
/* global location */

import { Shadow } from '../../prototypes/Shadow.js'

/**
 * Creates an MSWC Giphy by the blueprints of:
 *
 * @export
 * @attribute {namespace} namespace
 * @type {CustomElementConstructor}
 */
export default class Giphy extends Shadow() {
  constructor (options = {}, ...args) {
    super(Object.assign(options, { mode: 'open' }), ...args)

    /**
     * Used to cancel ongoing, older fetches
     * this makes sense, if you only expect one and most recent true result and not multiple
     *
     * @type {AbortController | null}
    */
    this.abortController = null
    let timeout = null
    this.inputListener = event => {
      const q = event.target.value
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (this.abortController) this.abortController.abort()
        this.abortController = new AbortController()
        // https://developers.giphy.com/docs/api/endpoint#search
        // https://developers.giphy.com/explorer/
        fetch(`https://api.giphy.com/v1/gifs/search?api_key=${this.getAttribute('key') || 'bEonDR8ELYyNvCQPgASGoG0C3Mu9vRls'}&q=${q}&limit=${this.getAttribute('limit') || '25'}&offset=${this.getAttribute('offset') || '0'}${this.getAttribute('rating') ? `&rating=${this.getAttribute('rating')}` : ''}&lang=${this.getAttribute('lang') || 'en'}`, {
          signal: this.abortController.signal
        }).then(response => {
          if (response.status >= 200 && response.status <= 299) return response.json()
          throw (new Error(response.statusText))
        }).then(obj => (this.result.assignedNodes()[0].innerHTML = obj.data.reduce((acc, curr) => `${acc}
          <figure mp4="${curr.images.original.mp4}" webp="${curr.images.original.webp}">
            <video autoplay loop>
              <source src="${curr.images.fixed_width.mp4}" type="video/mp4">
              <source src="${curr.images.fixed_width.webp}" type="video/webp">
            </video>
          </figure>`
        , '')))
      }, 200)
    }
    this.clickListener = event => {
      const target = event.target.hasAttribute('mp4') ? event.target : event.target.parentNode
      if (target.hasAttribute('mp4') && target.hasAttribute('webp')) {
        this.dispatchEvent(new CustomEvent(this.getAttribute('giphyClick') || 'giphyClick', {
          detail: { mp4: target.getAttribute('mp4'), webp: target.getAttribute('webp') },
          bubbles: true,
          cancelable: true,
          composed: true
        }))
      }
    }
  }

  connectedCallback () {
    if (this.shouldComponentRenderHTML()) this.renderHTML()
    if (this.shouldComponentRenderCSS()) this.renderCSS()
    if (this.input) this.input.addEventListener('input', this.inputListener)
    if (this.result) this.result.addEventListener('click', this.clickListener)
    if (this.getAttribute('hash') !== null && location.hash.length > 1) this.inputListener({ target: { value: location.hash.replace('#', '') } })
  }

  disconnectedCallback () {
    if (this.input) this.input.removeEventListener('input', this.inputListener)
    if (this.result) this.result.removeEventListener('click', this.clickListener)
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRenderCSS () {
    return !this.root.querySelector('style[_css]')
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRenderHTML () {
    return !this.input && !this.result
  }

  renderCSS () {
    this.css = /* css */`
      :host input {
      }
      
    `
  }

  renderHTML () {
    this.html = /* html */`
      <slot name="input"></slot>
      <slot name="result"></slot>
    `
  }

  get input () {
    return this.root.querySelector('slot[name=input]')
  }

  get result () {
    return this.root.querySelector('slot[name=result]')
  }
}
