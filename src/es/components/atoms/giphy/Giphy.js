// @ts-check

import { Shadow } from '../../prototypes/Shadow.js'

/**
 * Creates an MSWC Giphy by the blueprints of:
 *
 * @export
 * @attribute {namespace} namespace
 * @type {CustomElementConstructor}
 */
export default class Giphy extends Shadow() {
  constructor () {
    super({ mode: 'open' })

    this.inputListener = event => {
      console.log(this.result);
      this.result.assignedNodes()[0].textContent += event.target.value
    }
  }

  connectedCallback () {
    if (this.shouldComponentRenderHTML()) this.renderHTML()
    if (this.shouldComponentRenderCSS()) this.renderCSS()
    if (this.input) this.input.addEventListener('input', this.inputListener)
  }

  disconnectedCallback () {
    if (this.input) this.input.removeEventListener('input', this.inputListener)
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
