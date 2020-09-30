//@ts-check

import{ Intersection } from '../../prototypes/Intersection.js';

/**
 * Creates a picture element with the given images
 * 
 * @exports
 * @type {CustomElementConstructor}
 */
export default class Image extends Intersection(){

  constructor () {
    super({intersectionObserverInit: {}});
  }

  connectedCallback(){
      this.css= /* css */`
      :host > picture > svg {
        display: block;
      }
      :host > picture > * {
        height: auto;
        width: 100%;
        max-width: ${this.width};
      }
      `
      this.html = /* html */`<picture class=placeholder><svg style="background-color: ${this.placeholderColor ? this.placeholderColor : '#808080'}; width:100%; height:100%;" width="${this.width}" height="${this.height}"></svg></picture>`
      super.connectedCallback()
  }

  disconnectedCallback(){
    super.disconnectedCallback();
  }

  intersectionCallback (entries) {
    if(entries[0] && entries[0].isIntersecting){
      if (this.shouldComponentRenderCSS()) this.renderCSS()
      if (this.shouldComponentRenderHTML()) this.renderHTML()
      this.intersectionObserveStop()
    }
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
    return !this.root.querySelector('.m-image');
  }

  renderCSS () {
    this.css = /* css */`
      .m-image img {
        object-fit: cover;
        width: ${this.width};
        height: ${this.height};
        max-width: 100%;
        max-height: 100%;
        background-color: ${this.placeholderColor ? this.placeholderColor : '#808080'};
      }
    `
  }

  renderHTML(){
    let picture = document.createElement("picture");
    picture.innerHTML = /* html */`
    <picture class="m-image">
      <source srcset="${this.smallImg ? this.smallImg + ' 768w': ''}, ${this.mediumImg ? this.mediumImg + ' 1000w': ''}, ${this.largeImg ? this.largeImg + ' 1200w': ''}">
      <img src="${this.mediumImg ? this.mediumImg : this.smallImg ? this.smallImg: this.largeImg ? this.largeImg : 'no Image submitted'}" />
    </picture>  
    `
    this.root.querySelector('.placeholder').replaceWith( picture);
  }

  get smallImg(){
    return this.getAttribute('small');
  }

  get mediumImg(){
    return this.getAttribute('medium');
  }

  get largeImg(){
    return this.getAttribute('large');
  }

  get width(){
    return this.getAttribute('width') ? this.getAttribute('width') + 'px' : '100%';
  }

  get height(){
    return this.getAttribute('height') ? this.getAttribute('height') + 'px' : '100%';

  }

  get placeholderColor(){
    return this.getAttribute('placeholderColor');
  }
}