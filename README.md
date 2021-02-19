# web-components

POC; Reusable VanillaJS web components collection \

## Roadmap

* Button
* Image
* Image Slider
* Form
* Menu
* Wysiwyg with Show More

## Rules

### Variables naming rule: --{selector aka component aka namespace}-{css property}-{pseudo class or media query name} eg. --p-background-color-hover-desktop
NOTE: Within the component don't use any name spacing eg. component header don't use --header-color just use --color the namespace can be added by the Shadow as an html attribute
- if a component holds other components or nodes you can declare or remap classes eg. :host > h1 {--color: var(--h1-color, white);}
- if a component holds other components you should share the attribute namespace with its children

## Manifest

1. load children by returning a promise
2. getter and setter for nodes within the web component.  If required create on the fly through getter access.
3. Web Components only communicate through events (if anything gets loaded, attach the promise/fetch on event.detail)
4. code everything with the assumption that the web component is isolatet. Prespective from within.
5. Web Components do not include namespaces except for children references
6. CSS has no absolute values, all var(), except for interlocked logic
7. render usually is prepended with an shouldComponentRender logic, especially when triggered at connectedCallback
