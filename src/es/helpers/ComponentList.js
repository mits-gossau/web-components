// @ts-check

/* global customElements */

/**
 * This global class creates the WebComponent and the List View in the Browser
 *
 * @class ComponentList
 */

export default class ComponentList {
  constructor ({ name, filePath }) {
    this.webComponent = name
    this.filePath = filePath

    if (!this.webComponent || !this.filePath) throw new Error('TypeError')

    this.createComponent()
  }

  /**
   * First level controllers and organisms are loaded and defined here (loadChildComponents)
   */
  createComponent () {
    import(this.filePath).then(module => [this.webComponent, module.default]).then(element => {
      // don't define already existing customElements
      if (element && !customElements.get(element[0])) customElements.define(...element)
      this.createList()
    })
  }

  createList () {
    Array.from(document.querySelectorAll('dt')).forEach(dt => {
      const dd = document.createElement('dd')
      if (dt.querySelector('style')) {
        const codeCSS = document.createElement('code')
        codeCSS.classList.add('code-css')
        codeCSS.textContent = dt.querySelector('style').textContent
        dd.appendChild(codeCSS)
      }
      if (dt.querySelector(this.webComponent)) {
        const codeHTML = document.createElement('code')
        codeHTML.classList.add('code-html')
        codeHTML.textContent = dt.querySelector(this.webComponent).outerHTML.replace(/=""/g, '').replace(/\n[\s]{8}/, '\n  ').replace(/\n[\s]*?(<\/)/, '\n$1')
        dd.appendChild(codeHTML)
      }
      dt.after(dd)
    })
  }
}
