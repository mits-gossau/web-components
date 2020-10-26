// @ts-check

import { Shadow } from '../../prototypes/Shadow.js'

/**
 * Creates an MSWC Textarea by the blueprints of:
 * https://components.migros.ch/components/atoms/inputs.html
 * https://github.com/DannyMoerkerke/material-webcomponents/blob/master/src/material-textfield.js
 *
 * @export
 * @attribute {namespace} namespace
 * @type {CustomElementConstructor}
 */
export default class Input extends Shadow() {
  static get observedAttributes () {
    return ['readonly', 'disabled', 'error']
  }

  constructor () {
    super({ mode: 'open' })

    this.allowedTypes = ['text', 'number', 'email', 'password', 'tel', 'url', 'search']
  }

  connectedCallback () {
    // render template
    if (this.shouldComponentRenderCSS()) this.renderCSS()
    if (this.shouldComponentRenderHTML()) this.renderHTML()

    // init configuration
    this.disabled = this.hasAttribute('disabled');
    this.readonly = this.hasAttribute('readonly');
    this.error = this.hasAttribute('error');

    if (this.placeholder && this.inputField) this.inputField.setAttribute('placeholder', this.placeholder);
    if (this.autocomplete && this.inputField) this.inputField.setAttribute('autocomplete', this.autocomplete);

    if (this.search && this.searchButton && !this.readonly && !this.disabled && !this.error) {
      this.searchButton.addEventListener('click', this.onSearch);
    }
  }

  disconnectedCallback () {
    if (this.search && this.searchButton && !this.readonly && !this.disabled && !this.error) {
      this.searchButton.removEventListener('click', this.onSearch);
    }
  }

  attributeChangedCallback (name) {
    this[name] = this.hasAttribute(name);
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
    return this.inputId;
  }

  renderCSS () {
    this.css = /* css */`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      :host {
        --default-border-color: #FF6600;
        --default-border-color-disabled: #E9855F;

        --default-input-bg-color: #F1EFEE;
        --default-input-bg-color-focus: #FFF;
        --default-input-bg-color-error: #FFE5E5;
        --default-input-color: #333;
        --default-input-font-size: 18px;

        --default-font-family: "Helvetica Neue Condensed", "Impact", arial, sans-serif;
        --default-font-color: #767676;
        --default-font-size: 14px;

        --default-color-error: #F00;

        --default-icon-color: #F60;

        --default-search-input-border-color: #E7E5E3;

        display: block;
      }

      .mui-form-group {
        font-family: var(--font-family, var(--default-font-family));
        margin-bottom: 30px;
      }

      label {
        font-size: var(--font-size, var(--default-font-size));
        font-weight: 700;
        letter-spacing: .5px;
        text-transform: uppercase;
        line-height: 1;
        color: var(--font-color, var(--default-font-color));
        display: block;
        margin-bottom: 10px;
      }

      input {
        display: block;
        padding: 10px 15px;
        width: 100%;
        font-family: inherit;
        font-size: var(--input-font-size, var(--default-input-font-size));
        line-height: 1.5;
        color: var(--input-color, var(--default-input-color));
        appearance: none;
        background: var(--input-bg-color, var(--default-input-bg-color));
        border: 2px solid transparent;
        border-bottom-color: var(--border-color, var(--default-border-color));
        transition: background ease-in-out .15s, border-color ease-in-out .15s;
      }

      input::placeholder {
        color: var(--font-color, var(--default-font-color));
        opacity: 1;
      }

      input:focus:not(:read-only):not(:invalid) {
        background: #fff;
        border-color: var(--border-color, var(--default-border-color));
      }

      input:visited {
        text-decoration: none;
      }

      input:disabled,
      input:read-only {
        cursor: not-allowed;
      }

      :host([search]) .mui-form-group {
        position: relative;
      }

      :host([search]) input {
        padding-right: calc(2 * 15px + 24px);
        border-color: var(--search-input-border-color, var(--default-search-input-border-color));
        padding: 10px 15px;
        border-radius: 4px;
      }

      :host([search]) button {
        position: absolute;
        bottom: 2px;
        right: 0;
        padding: 10px 15px;
        border: 0;
        background: transparent;
        outline: none;
        appearance: none;
        box-shadow: none;
        font-family: inherit;
        font-size: var(--input-font-size, var(--default-input-font-size));
        line-height: 1.5;
        color: var(--icon-color, var(--default-icon-color));
        font-style: normal;
        cursor: pointer;
      }

      :host([disabled]) button,
      :host([readonly]) button {
        cursor: not-allowed;
      }

      :host([error]) label,
      :host([error]) input::placeholder,
      :host([search]) button.error,
      label.error {
        color: var(--color-error, var(--default-color-error));
      }

      :host([error]) input,
      :host([error]) input:focus,
      input:invalid {
        border-color: var(--color-error, var(--default-color-error));
        color: var(--color-error, var(--default-color-error));
        background: var(--input-color-bg-error, var(--default-input-bg-color-error));
        outline: none;
        box-shadow: none;
      }

      @media (hover: hover) {
        input:hover:not(:disabled):not(:read-only):not(:invalid) {
          border-color: var(--border-color, var(--default-border-color));
        }

        :host([search]) input:hover {
          border-color: var(--search-input-border-color, var(--default-search-input-border-color));
        }

        :host([error]) input:hover:not(:disabled):not(:read-only) {
          border-color: var(--color-error, var(--default-color-error));
        }
      }
    `
  }

  renderHTML () {
    this.html = /* html */`
      <div class="mui-form-group">
        ${ this.renderLabelHTML }
        <input id="${this.inputId}" name="${this.inputId}" type="${this.inputType}" />
        ${ this.renderSarchHTML }
      </div>
    `
  }

  onSearch = () => {
    this.dispatchEvent(new CustomEvent('submitSearch', {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: {
        key: this.inputId,
        value: this.inputField.value
      }
    }));
  }

  get renderLabelHTML () {
    return this.textContent ? `<label for="${this.inputId}">${this.textContent}</label>` : '';
  }

  get renderSarchHTML () {
    return this.search ? `
    <button type="button" title="Suchen">
      <i class="mui-icon-search">Suchen</i>
    </button>` : '';
  }

  get inputId () {
    return this.getAttribute('inputId')
  }

  get inputType () {
    return (this.hasAttribute('type') && this.allowedTypes.includes(this.getAttribute('type'))) ? this.getAttribute('type') : 'text'
  }

  /**
   * get the field to
   *
   * @return {boolean}
   */
  get labelField() {
    return this.root.querySelector('label');
  }

  get inputField () {
    return this.root.querySelector('input');
  }

  get searchButton () {
    return this.root.querySelector('button');
  }

  get placeholder () {
    return this.getAttribute('placeholder');
  }

  get autocomplete () {
    return this.getAttribute('autocomplete');
  }

  get search () {
    return this.hasAttribute('search')
  }

  get disabled () {
    return this.hasAttribute('disabled')
  }

  set disabled (isDisabled) {
    if (!this.inputField) return;

    isDisabled ? this.inputField.setAttribute('disabled', '') : this.inputField.removeAttribute('disabled')
  }

  get readonly () {
    return this.hasAttribute('readonly')
  }

  set readonly (isReadOnly) {
    if (!this.inputField) return;

    isReadOnly ? this.inputField.setAttribute('readonly', '') : this.inputField.removeAttribute('readonly')
  }

  get error () {
    return this.hasAttribute('error')
  }

  set error (isInvalid) {
    if (this.labelField) {
      isInvalid ? this.labelField.classList.add('error') : this.labelField.classList.remove('error');
    }

    if (this.textareaField) {
      isInvalid ? this.textareaField.setAttribute('aria-invalid', 'true') : this.textareaField.removeAttribute('aria-invalid')
    }

    if (this.searchButton) {
      isInvalid ? this.searchButton.classList.add('error') : this.searchButton.classList.remove('error');
    }
  }
}
