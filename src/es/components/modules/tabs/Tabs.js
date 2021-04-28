// @ts-check
'use strict'

import { Shadow } from '../../prototypes/Shadow.js'

/**
 * Creates Tabs
 * adapted from https://gist.github.com/ebidel/2d2bb0cdec3f2a16cf519dbaa791ce1b
 * @export
 * @attribute {selected} preselected tab index (default the first tab is selected)
 * @type {CustomElementConstructor}
 */
export default class Tabs extends Shadow() {
  constructor () {
    super({ mode: 'open' })

    this.onClick = (e) => {
      const target = e.target.slot === 'tabBtn' ? e.target : e.target.closest('[slot=tabBtn]')

      if (target.slot === 'tabBtn') {
        this.selectedElement = this.tabBtns.indexOf(target)
        target.focus()
      }
    }
  }

  connectedCallback () {
    if (this.shouldComponentRenderHTML()) this.renderHTML()

    this.tabBtns.forEach((btn, index) => {
      btn.addEventListener('click', this.onClick)

      // set initial state
      if (this.selectedElement === index) this.selectedElement = index
    })
  }

  disconnectedCallback () {
    this.tabBtns.forEach(btn => btn.removeEventListener('click', this.onClick.bind(this)))
  }

  get templateContent () {
    const template = document.getElementById('tabs-template')
    return template.content.cloneNode(true)
  }

  get tabBtns () {
    return this.root.querySelector('#tabBtn') && this.root.querySelector('#tabBtn').assignedNodes({ flatten: true }) || []
  }

  get tabContent () {
    return this.root.querySelector('#tabContent') && this.root.querySelector('#tabContent').assignedNodes({ flatten: true }) || []
  }

  get selectedElement () {
    return Number(this.getAttribute('selected')) || 0
  }

  set selectedElement (id) {
    this.setAttribute('selected', id)

    this.tabBtns.forEach((btn, index) => {
      const isSelected = index === id
      btn.setAttribute('tabindex', isSelected ? 0 : -1)
      btn.setAttribute('aria-selected', isSelected)
      this.tabContent[index].hidden = !isSelected
    })
  }

  /**
   * evaluates if a render is necessary
   *
   * @return {boolean}
   */
  shouldComponentRenderHTML () {
    return this.children.length > 0
  }

  /**
   * renders the HTML from the template
   */
  renderHTML () {
    this.html = this.templateContent

    this.setAttribute('role', 'tablist')

    this.tabContent.forEach((tab) => {
      tab.setAttribute('role', 'tabpanel')
      tab.setAttribute('tabindex', 0)
    })
  }
}
