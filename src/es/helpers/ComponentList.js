// @ts-check

/**
 * This global helper function creates the List View in the Browser
 */

export default function (name) {
  if (!name) return

  Array.from(document.querySelectorAll('dt')).forEach(dt => {
    const dd = document.createElement('dd')
    if (dt.querySelector('style')) {
      const codeCSS = document.createElement('code')
      codeCSS.classList.add('code-css')
      codeCSS.textContent = dt.querySelector('style').textContent
      dd.appendChild(codeCSS)
    }
    if (dt.querySelector(name)) {
      const codeHTML = document.createElement('code')
      codeHTML.classList.add('code-html')
      codeHTML.textContent = dt.querySelector(name).outerHTML.replace(/=""/g, '').replace(/\n[\s]{8}/, '\n  ').replace(/\n[\s]*?(<\/)/, '\n$1')
      dd.appendChild(codeHTML)
    }
    dt.after(dd)
  })
}
