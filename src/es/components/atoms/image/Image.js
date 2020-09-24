import { Shadow } from "../../prototypes/Shadow.js";

/**
 * Image Coponents
 * @param {Object} img - The image obejct, containig paths and description.
 */
export default class ImageComponent extends Shadow(){
  constructor(img){
    super({ mode: 'open' })

    // TBD check img Object validity
    // temporary check if a none emtpy object was passed
    if(img && Object.keys(img).length >= 1){
      this.renderHTML(img)
      this.renderCSS()
    }
  }

  connectedCallback () {}

  disconnectedCallback () {}


  renderHTML (img) {
    this.html = /* html */`
      <div class="image-wrapper">
        <picture>
          <source srcset="${img.paths.small} 768w, ${img.paths.medium} 1000w, ${img.paths.large} 1200w">
          <img src="${img.paths.medium}" />
        </picture>  
        <p>${img.description}</p>
      </div>
    `
  }

  //Some example Css
  renderCSS () {
    this.css = /* css */`
      .image-wrapper{
        max-width: 50vw;
        animation: fadeIn 1s
      }

      .image-wrapper img {
        object-fit: cover;
        width: 100%;
        height: 100%;
      }

      .image-wrapper p {
        margin: 0;
        width: 100%;
        padding: 10px;
        background-color: #03162f;
        box-sizing: border-box;
        color: white;
      }

      @keyframes fadeIn{
        0%{
          transform: translateY(20px);
          opacity: 0;
        }
        100%{
          transform: translateY(0);
          opacity: 1;
        }
      }
    `
  }
}