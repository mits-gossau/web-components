// @ts-check

import { Shadow } from '../../prototypes/Shadow.js'

/**
 * https://components.migros.ch/components/atoms/buttons.html
 * https://github.com/DannyMoerkerke/material-webcomponents/blob/master/src/material-button.js
 *
 * @export
 * @attribute {namespace} namespace
 * @type {CustomElementConstructor}
 */
export default class Button extends Shadow() {
  static get observedAttributes () {
    return ['label']
  }

  /**
   * Creates an MSC Button
   *
   * @param {*} args
   */
  constructor (...args) {
    super({ mode: 'open' }, ...args)

    // TODO: icomoon
    // TODO: Test variables overwrite from outside [x] works but I want it width fallback instead of overwrite
    // TODO: msc styles (sizes, etc)
    // TODO: test functionality https://dannymoerkerke.github.io/material-webcomponents/material-button
    // TODO: test functionality Shadow
    // TODO: write unit test
    // TODO: add https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
    // TODO: test it with mutationobserver and intersectionobserver

    if (this.shouldComponentRenderCSS()) this.renderCSS()
    if (this.shouldComponentRenderHTML()) this.renderHTML()
    this.clickListener = event => this.button.classList.add('active')
    this.animationendListener = event => this.button.classList.remove('active')
  }

  connectedCallback () {
    this.button.addEventListener('click', this.clickListener)
    this.ripple.addEventListener('animationend', this.animationendListener)
  }

  disconnectedCallback () {
    this.button.removeEventListener('click', this.clickListener)
    this.ripple.removeEventListener('animationend', this.animationendListener)
  }

  attributeChangedCallback (name) {
    if (name === 'label') {
      this.label.textContent = this.getAttribute('label') || ''
      this.label.classList[this.hasAttribute('label') ? 'remove' : 'add']('hide')
    }
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRenderCSS () {
    return !this.root.querySelector('style[protected="true"]')
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRenderHTML () {
    return !this.button || !this.label || !this.ripple
  }

  renderCSS () {
    this.css = /* css */`
      :host {
        --button-color: transparent;
        --button-color-hover: #e2e2e2;
        --font-color: #000000;
        --font-size: 1em;
        --icon-size: 24px;
        --button-padding: 0 8px 0 8px;
        --button-padding-circle: 8px;
        --border-radius: 2px;
        display: block;
        width: fit-content;
      }
      :host([raised]) {
        --button-color: #e2e2e2;
      }
      button {
        border: none;
        border-radius: var(--border-radius);
        min-height: 36px;
        padding: var(--button-padding);
        font-size: var(--font-size);
        color: var(--font-color);
        background-color: var(--button-color);
        cursor: pointer;
        outline: none;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      }
      :host([label]) button {
        min-width: 88px;
      }
      button:hover {
        transition: background-color 0.3s ease-out;
        background-color: var(--button-color-hover);
      }
      :host([disabled]) button {
        opacity: 0.5;
        cursor: not-allowed;
      }
      :host([disabled]) button:hover {
        background-color: transparent;
      }
      :host([disabled]) button .ripple {
        display: none;
      }
      button.active .ripple {
        animation-name: ripple;
        animation-duration: 0.4s;
        animation-timing-function: ease-out;
        background-color: #808080;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      #label {
        display: inline-block;
        position: relative;
        margin-right: 8px;
        margin-left: 8px;
      }
      #label.hide {
        display: none;
      }
      :host([circle]) button {
        border-radius: 50%;
        --button-padding: var(--button-padding-circle);
      }
      :host([raised]) button {
        background-color: var(--button-color);
        box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px;
      }
      :host([raised]) button[disabled]:hover {
        background-color: var(--button-color);
      }
      ::slotted([slot="left-icon"]) {
        float: left;
        font-size: var(--icon-size) !important;
      }
      ::slotted([slot="right-icon"]) {
        float: right;
        font-size: var(--icon-size) !important;
      }
      ::slotted([slot="file-input"]) {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        opacity: 0;
        z-index: 9;
      }
      
      @keyframes ripple {
        from {
          width: 0;
          height: 0;
          opacity: 0.8;
        }
        to {
          width: 100px;
          height: 100px;
          opacity: 0.1;
        }                
      }
    `
  }

  renderHTML () {
    this.html = /* html */`
      <button type="button">
        <div class="ripple"></div>
        <slot name="file-input"></slot>
        <slot name="left-icon"></slot>
        <span id="label"></span>
        <slot name="right-icon"></slot>
      </button>
    `
  }

  get disabled () {
    return this.hasAttribute('disabled')
  }

  set disabled (isDisabled) {
    this.button.disabled = isDisabled
    isDisabled ? this.setAttribute('disabled', '') : this.removeAttribute('disabled')
  }

  get button () {
    return this.root.querySelector('button')
  }

  get label () {
    return this.root.querySelector('#label')
  }

  get ripple () {
    return this.root.querySelector('.ripple')
  }
}
