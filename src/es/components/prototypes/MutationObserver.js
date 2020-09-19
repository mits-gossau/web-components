// @ts-check

import { Shadow } from './Shadow.js'

/**
 * MutationObserver is a helper which sets up a new MutationObserver in the context of a web component
 *
 * @export
 * @function MutationObserver
 * @param {Function | *} ChosenClass
 * @attribute {'string'} [mutationObserverInit=`{
      'attributeFilter': undefined
      'attributes': false,
      'attributeOldValue': true,
      'characterData': false,
      'characterDataOldValue': true,
      'childList': false,
      'subtree': false
    }`]
 * @requires {
      Shadow: {
        connectedCallback,
        disconnectedCallback,
        parseAttribute,
        root,
        shadowRoot
      }
    }
 * @property {
      mutationCallback,
      mutationObserveStart,
      mutationObserveStop
    }
 * @return {CustomElementConstructor | *}
 */
export const MutationObserver = (ChosenClass = Shadow()) => class MutationObserver extends ChosenClass {
  /**
   * Creates an instance of MutationObserver. The constructor will be called for every custom element using this class when initially created.
   *
   * @param {{mutationObserverInit: MutationObserverInit | undefined}} [options = {mutationObserverInit: undefined}]
   * @param {*} args
   */
  constructor (options = { mutationObserverInit: undefined }, ...args) {
    super(options, ...args)

    /**
     * Digest attribute to have MutationObservers or not
     * this will trigger this.mutationCallback and can be extended
     * see => https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit Properties
     *
     * @type {MutationObserverInit}
     */
    let mutationObserverInit = typeof options.mutationObserverInit === 'object' ? options.mutationObserverInit : MutationObserver.parseAttribute(this.getAttribute('mutationObserverInit'))
    if (mutationObserverInit && (mutationObserverInit.attributes || mutationObserverInit.characterData || mutationObserverInit.childList)) {
      /** @type {MutationObserver} */
      const mutationObserver = new MutationObserver(this.mutationCallback.bind(this))
      // add default MutationObserverInit Props
      mutationObserverInit = Object.assign({
        attributeFilter: undefined,
        attributes: false,
        attributeOldValue: mutationObserverInit.attributes === true,
        characterData: false,
        characterDataOldValue: mutationObserverInit.characterData === true,
        childList: false,
        subtree: false
      }, mutationObserverInit)
      // attributes can not be observed on shadow, so we split this observation
      if (this.shadowRoot && mutationObserverInit.attributes) {
        const { attributeFilter, attributes, attributeOldValue, ...restObserverInit } = mutationObserverInit
        /** @return {void} */
        this.mutationObserveStart = () => {
          // @ts-ignore
          mutationObserver.observe(this.shadowRoot, restObserverInit)
          // @ts-ignore
          mutationObserver.observe(this, { attributeFilter, attributes, attributeOldValue })
        }
      } else {
        /** @return {void} */
        this.mutationObserveStart = () => {
          // @ts-ignore
          mutationObserver.observe(this.root, mutationObserverInit)
        }
      }
      /** @return {void} */
      this.mutationObserveStop = () => mutationObserver.disconnect()
    } else {
      /** @return {void} */
      this.mutationObserveStart = () => {}
      /** @return {void} */
      this.mutationObserveStop = () => {}
      console.warn('MutationObserver got not started, due to missing options.mutationObserverInit. At least supply an empty object to activate the observer with the default settings!')
    }
  }

  /**
   * Lifecycle callback, triggered when node is attached to the dom
   *
   * @return {void}
   */
  connectedCallback () {
    super.connectedCallback()
    this.mutationObserveStart()
  }

  /**
   * Lifecycle callback, triggered when node is detached from the dom
   *
   * @return {void}
   */
  disconnectedCallback () {
    super.disconnectedCallback()
    this.mutationObserveStop()
  }

  /**
   * observes mutations on this + children changes
   *
   * @param {MutationRecord[]} mutationList
   * @param {MutationObserver} observer
   * @return {void}
   */
  mutationCallback (mutationList, observer) {}
}
