// @ts-check

import { Shadow } from './Shadow.js'

/**
 * ComponentList is a helper to generate a list to demonstrate custom-components
 * use the dt inside the componentList to define a list item
 * the custom components with prefix mui- as well as style tags are printed in the list inside a dd element
 *
 * @export
 * @type {CustomElementConstructor}
 */
export default class ComponentList extends Shadow() {
  constructor () {
    super({ mode: 'open' })
  }

  connectedCallback () {
    if (!this.children) return

    this.renderHTML()

    if (this.shouldComponentRenderCSS()) this.renderCSS()
  }

  renderHTML () {
    const list = Array.from(this.root.children).filter((i) => i.tagName === 'DT')

    if (list.length === 0) return

    const dl = document.createElement('dl')

    list.forEach((dt) => {
      const dd = document.createElement('dd')
      const custom = Array.from(dt.children).find((i) => i.tagName.indexOf('MUI') !== -1)
      const title = dt.querySelector('p')

      dt.classList.add('componentlist-item-title')
      dd.classList.add('componentlist-item')

      if (title) title.classList.add('componentlist-name')

      dl.appendChild(dt)

      if (dt.querySelector('style')) {
        const codeCSS = document.createElement('code')

        codeCSS.classList.add('code-css')
        codeCSS.textContent = dt.querySelector('style').textContent

        dd.appendChild(codeCSS)
      }

      if (custom) {
        const codeHTML = document.createElement('code')

        codeHTML.textContent = custom.outerHTML.replace(/=""/g, '').replace(/\n[\s]{8}/, '\n  ').replace(/\n[\s]*?(<\/)/, '\n$1')
        codeHTML.classList.add('code-html')

        dd.appendChild(codeHTML)
      }

      dl.appendChild(dd)
    })

    this.html = dl
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRenderCSS () {
    return !this.root.querySelector('style[_css]')
  }

  renderCSS () {
    this.css = /* css */`
      :host {
        --default-code-bg-color: #000000;
        --default-code-color: greenyellow;
        --default-color: #000000;

        display: block;
        content: contain;
      }

      .code-html,
      .code-style {
        background-color: var(--code-bg-color, var(--default-code-bg-color));
        color: var(--code-color, var(--default-code-color));
        display: block;
        margin: 5px 0;
        padding: 5px;
        white-space: break-spaces;
      }

      .code-html {
        padding: 1rem 62px
      }

      .componentlist-item-title,
      .componentlist-item {
        border: 1px solid var(--color, var(--default-color));
        padding: 10px;
        margin: 20px 0 10px;
      }

      .componentlist-item-title {
        border-bottom: none;
        margin-bottom: 0;
      }

      .componentlist-item {
        border-top: none;
        margin-top: 0;
      }

      .componentlist-name {
        background-color: white;
        color: var(--color, var(--default-color));
        display: inline-block;
        font-style: italic;
        margin: 0;
        padding: 0 10px 0 5px;
        transform: translateY(-18px);
      }
    `
  }
}
