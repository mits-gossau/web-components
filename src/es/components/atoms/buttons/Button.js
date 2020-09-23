// @ts-check

import { Shadow } from '../../prototypes/Shadow.js'

/**
 * Creates an MSWC Button by the blueprints of:
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

  constructor () {
    super({ mode: 'open' })

    this.clickListener = event => this.button.classList.add('active')
    this.animationendListener = event => this.button.classList.remove('active')
    this.labelText = this.textContent // allow its initial textContent to become the label
  }

  connectedCallback () {
    if (this.shouldComponentRenderCSS()) this.renderCSS()
    if (this.shouldComponentRenderHTML()) this.renderHTML()
    this.button.addEventListener('click', this.clickListener)
    this.ripple.addEventListener('animationend', this.animationendListener)
  }

  disconnectedCallback () {
    this.button.removeEventListener('click', this.clickListener)
    this.ripple.removeEventListener('animationend', this.animationendListener)
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'label') {
      this.labelText = newValue
      if (this.label) {
        this.label.textContent = this.labelText || ''
        this.label.classList[this.labelText ? 'remove' : 'add']('hide')
      }
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
        --default-border-color: #a33307;
        --default-border-radius: 4px;
        --default-button-color-disabled: #ff9b58;
        --default-button-color-hover: #cc5200;
        --default-button-color: #ff6600;
        --default-button-width: auto;
        --default-font-color: white;
        --default-font-family: "Helvetica Neue Condensed", "Impact", arial, sans-serif;
        --default-font-size: inherit;
        --default-icon-size: 24px;
        display: block;
      }
      button {
        align-items: center;
        background-color: var(--button-color, var(--default-button-color));
        border: none;
        border-bottom:2px solid var(--border-color, var(--default-border-color));
        border-radius: var(--border-radius, var(--default-border-radius));
        color: var(--font-color, var(--default-font-color));
        cursor: pointer;
        display: flex;
        justify-content: center;
        letter-spacing: .5px;
        outline: none;
        overflow: hidden;
        padding: 11px 15px 9px;
        position: relative;
        touch-action: manipulation;
        width: var(--button-width, var(--default-button-width));
      }
      button:hover {
        background-color: var(--button-color-hover, var(--default-button-color-hover));
        transition: background-color 0.3s ease-out;
      }
      button.active .ripple {
        animation-duration: 0.4s;
        animation-name: ripple;
        animation-timing-function: ease-out;
        background-color: #808080;
        border-radius: 50%;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      :host([disabled]) button {
        cursor: not-allowed;
        opacity: 0.5;
      }
      :host([disabled]) button:hover {
        background-color: var(--button-color-disabled, var(--default-button-color-disabled));
      }
      :host([disabled]) button .ripple {
        display: none;
      }
      :host([circle]) button {
        padding: 8px;
        border-radius: 50%;
      }
      :host([small]) button {
        padding: 6px 10px 4px;
      }
      :host([big]) button {
        padding: 16px 20px 14px;
      }
      :host([outline]) button {
        background-color: transparent;
        border: 2px solid var(--button-color, var(--default-button-color));
        color: var(--button-color, var(--default-button-color));
      }
      :host([raised]) button {
        background-color: var(--button-color, var(--default-button-color));
        border: none;
        box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px;
      }
      :host([raised]) button:hover {
        background-color: var(--button-color-hover, var(--default-button-color-hover));
      }
      :host([raised]) button[disabled]:hover {
        background-color: var(--button-color, var(--default-button-color));
      }
      #label {
        display: inline-block;
        font-family: var(--font-family, var(--default-font-family));
        font-size: var(--font-size, var(--default-font-size));
        font-weight: 700;
        position: relative;
        text-transform: uppercase;
      }
      #label.hide {
        display: none;
      }
      ::slotted([slot="left-icon"]) {
        font-size: var(--icon-size, var(--default-icon-size)) !important;
      }
      :host([label]) ::slotted([slot="left-icon"]) {
        margin-right: 8px;
      }
      ::slotted([slot="right-icon"]) {
        font-size: var(--icon-size, var(--default-icon-size)) !important;
      }
      :host([label]) ::slotted([slot="right-icon"]) {
        margin-left: 8px;
      }
      ::slotted([slot="file-input"]) {
        bottom: 0;
        cursor: pointer;
        left: 0;
        opacity: 0;
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
        z-index: 9;
      }
      @keyframes ripple {
        from {
          height: 0;
          opacity: 0.8;
          width: 0;
        }
        to {
          height: 100px;
          opacity: 0.1;
          width: 100px;
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
        <span id="label"${!this.labelText ? ' class="hide"' : ''}>${this.labelText || ''}</span>
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
