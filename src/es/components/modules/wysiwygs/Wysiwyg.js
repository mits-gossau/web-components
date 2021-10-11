// @ts-check
'use strict'

import { Shadow } from '../../prototypes/Shadow.js'

/**
 * Creates an customizable Wysiwyg Field
 *
 * @export
 * @attribute {namespace} namespace
 * @attribute {show-more} toggle content
 * @attribute {double} 2-col layout
 * @type {CustomElementConstructor}
 */
export default class Wysiwyg extends Shadow() {
  constructor () {
    super({ mode: 'open' })

    if (this.showMore) {
      this.toggle = () => {
        this.toggleShowMore = !this.toggleShowMore
      }
    }
  }

  connectedCallback () {
    if (this.shouldComponentRenderCSS()) this.renderCSS()
    if (this.shouldComponentRenderHTML()) this.renderHTML()
    if (this.showMoreButton) this.showMoreButton.addEventListener('click', this.toggle)
  }

  disconnectedCallback () {
    if (this.showMoreButton) this.showMoreButton.removeEventListener('click', this.toggle)
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
    return this.children.length > 0
  }

  renderCSS () {
    this.css = /* css */`
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      p,
      ul,
      ol,
      dl {
        margin-top: 0;
      }

      :host {
        --default-border-color: #000000;
        --default-bg-color: #F1EFEE;
        --default-bg-gradient: linear-gradient(0deg, rgba(241,239,238,1) 0%, rgba(241,239,238,0) 100%);

        --default-font-family: text, Helvetica, Arial, sans-serif;
        --default-font-color: #000000;
        --default-font-size: 16px;

        display: block;
      }

      .wysiwyg {
        padding: 40px;
        background: var(--bg-color, var(--default-bg-color));
        font-family: var(--font-family, var(--default-font-family));
        color: var(--font-color, var(--default-font-color));
        font-size: var(--font-size, var(--default-font-size));
        line-height: 1.5em;
      }

      .wysiwyg__wrapper {
        position: relative;
        transition: max-height .5s ease-out;
        max-height: 200px;
        overflow: hidden;
      }

      .wysiwyg__wrapper::after {
        content: '';
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100px;
        background: var(--bg-gradient, var(--default-bg-gradient));
      }

      ::slotted([slot="header"]) {
        border-bottom: 1px solid black;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }

      ::slotted([slot="button"]) {
        margin: 10px 0 20px 0;
        transition: margin-top .3s ease-out;
      }

      :host([double]) .wysiwyg__content {
        columns: 2;
        column-gap: 20px;
      }

      :host([toggled]) .wysiwyg__wrapper {
        max-height: 1000px;
        transition: max-height .5s ease-in;
      }

      :host([toggled]) ::slotted([slot="button"]) {
        margin-top: 30px;
        transition: margin-top .3s ease-in;
      }
    `
  }

  renderHTML () {
    this.html = /* html */`
      <article class="wysiwyg">
        <slot name="header" class="wysiwyg__header"></slot>
        ${this.showMore ? '<div class="wysiwyg__wrapper">' : ''}
        ${this.content ? `<section class="wysiwyg__content">${this.content.innerHTML}</section>` : ''}
        ${this.showMore ? '</div><slot name="button"></slot>' : ''}
      </article>
    `
  }

  get content () {
    return this.querySelector('[slot=content]')
  }

  get showMore () {
    return this.hasAttribute('show-more')
  }

  get showMoreButton () {
    return this.querySelector('[slot=button]')
  }

  get showMoreWrapper () {
    return this.root.querySelector('.wysiwyg__wrapper')
  }

  get toggleShowMore () {
    return this.hasAttribute('toggled')
  }

  set toggleShowMore (toggleShowMore) {
    if (toggleShowMore) {
      this.setAttribute('toggled', '')
    } else {
      this.removeAttribute('toggled')
    }

    if (this.showMoreButton) this.showMoreButton.setAttribute('label', toggleShowMore ? 'Weniger anzeigen' : 'Mehr anzeigen')
  }
}
