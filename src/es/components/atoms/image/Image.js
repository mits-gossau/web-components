//@ts-check

import{ Intersection } from '../../prototypes/Intersection.js';

/**
 * Creates a picture element with the given images
 * 
 * @exports
 * @type {CustomElementConstructor}
 */
export default class Image extends Intersection(){
  static get observedAttributes () {
    return [
      'small',
      'medium',
      'large'
    ]
  }

  constructor () {
    super({intersectionObserverInit: {}});
  }

  connectedCallback(){
    console.log(this,  'connectedCallback');
    if (this.shouldComponentRenderCSS()) this.renderCSS()
    if (this.shouldComponentRenderHTML()) this.renderHTML()
  }

  disconnectedCallback(){
    console.log('disconnectedCallback');
  }

  attributeChangedCallback (name,oldValue, newValue){
    console.log('attributeChangedCallback');
    if(name === 'small') this.smallImg = newValue;
    if(name === 'medium') this.mediumImg = newValue;
    if(name === 'large') this.largeImg = newValue;
  }

  intersectionCallback () {
    console.log('intersectionCallback');
    //TBD lazy loading
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
    return this.smallImg || this.mediumImg || this.largeImg;
  }

  renderCSS () {
    this.css = /* css */`
      .m-image img {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }
    `
  }

  renderHTML(){
    this.html = /* html */`
    <picture class="m-image">
      <source srcset="${this.smallImg ? this.smallImg + ' 768w': ''}, ${this.mediumImg ? this.mediumImg + ' 1000w': ''}, ${this.largeImg ? this.largeImg + ' 1200w': ''}">
      <img src="${this.mediumImg}" />
    </picture>  
    `
  }
}