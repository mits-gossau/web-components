// @ts-check

import { Shadow } from '../../prototypes/Shadow.js'

/**
 * Creates an MSWC Textarea by the blueprints of:
 * https://components.migros.ch/components/atoms/inputs.html
 *
 * @export
 * @attribute {namespace} namespace
 * @type {CustomElementConstructor}
 */
export default class Textarea extends Shadow() {
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

    if (this.placeholder && this.textareaField) this.textareaField.setAttribute('placeholder', this.placeholder);
    if (this.autocomplete && this.textareaField) this.textareaField.setAttribute('autocomplete', this.autocomplete);
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

      textarea {
        display: block;
        padding: 10px 15px;
        width: 100%;
        max-width: 100%;
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

      textarea::placeholder {
        color: var(--font-color, var(--default-font-color));
        opacity: 1;
      }

      textarea:focus:not(:read-only):not(:invalid) {
        background: #fff;
        border-color: var(--border-color, var(--default-border-color));
      }

      textarea:visited {
        text-decoration: none;
      }

      textarea:disabled,
      textarea:read-only {
        cursor: not-allowed;
      }

      :host([error]) label,
      :host([error]) textarea::placeholder,
      label.error {
        color: var(--color-error, var(--default-color-error));
      }

      :host([error]) textarea,
      :host([error]) textarea:focus,
      textarea:invalid {
        border-color: var(--color-error, var(--default-color-error));
        color: var(--color-error, var(--default-color-error));
        background: var(--input-color-bg-error, var(--default-input-bg-color-error));
        outline: none;
        box-shadow: none;
      }

      @media (hover: hover) {
        textarea:hover:not(:disabled):not(:read-only):not(:invalid) {
          border-color: var(--border-color, var(--default-border-color));
        }

        :host([error]) textarea:hover:not(:disabled):not(:read-only) {
          border-color: var(--color-error, var(--default-color-error));
        }
      }
    `
  }

  renderHTML () {
    this.html = /* html */`
      <div class="mui-form-group">
        ${ this.labelHtml }
        <textarea id="${this.inputId}" name="${this.inputId}"></textarea>
      </div>
    `
  }

  get labelHtml () {
    return this.textContent ? `<label for="${this.inputId}">${this.textContent}</label>` : '';
  }

  get inputId () {
    return this.getAttribute('inputId')
  }

  get labelField() {
    return this.root.querySelector('label');
  }

  get textareaField () {
    return this.root.querySelector('textarea');
  }

  get placeholder () {
    return this.getAttribute('placeholder');
  }

  get autocomplete () {
    return this.getAttribute('autocomplete');
  }

  get disabled () {
    return this.hasAttribute('disabled')
  }

  set disabled (isDisabled) {
    if (!this.textareaField) return;

    isDisabled ? this.textareaField.setAttribute('disabled', '') : this.textareaField.removeAttribute('disabled')
  }

  get readonly () {
    return this.hasAttribute('disabled')
  }

  set readonly (isReadOnly) {
    if (!this.textareaField) return;

    isReadOnly ? this.textareaField.setAttribute('readonly', '') : this.textareaField.removeAttribute('readonly')
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
  }
}
