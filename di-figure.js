const styles = `
:host {
  display: flex;
  column-gap: var(--small);
}

img {
  border: 1px solid var(--black);
  height: auto;
  margin: 0;
  max-width: 100%;
  padding: var(--tiny);
}

.description {
  font-family: var(--didone-fonts);
  font-style: italic;
  line-height: 1.309;
  margin: 0;
}

.heading {
  border-bottom: 1px solid var(--dark-gray);
  display: inline;
  font-family: var(--didone-fonts);
  font-size: 1.618em;
  line-height: 1;
  width: fit-content;
}

.info {
  display: flex;
  flex-direction: column;
  margin-top: var(--small);
  row-gap: var(--small);
}
`

class DidacticFigure extends HTMLElement {
  static observedAttributes = ['alt', 'heading', 'height', 'src', 'width']

  constructor() {
    super()

    this.stylesheet = document.createElement('style')
    this.stylesheet.textContent = styles

    this.image = document.createElement('img')

    const info = document.createElement('div')
    info.classList.add('info')

    this.heading = document.createElement('heading')
    this.heading.classList.add('heading')

    this.description = document.createElement('p')
    this.description.classList.add('description')
    this.description.innerHTML = this.innerHTML

    info.append(this.heading, this.description)

    this._internals = this.attachInternals()

    const root = this.attachShadow({ mode: 'open' })
    root.append(this.stylesheet, this.image, info)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'alt':
      case 'height':
      case 'src':
      case 'width':
        this.image.setAttribute(name, newValue)
        break
      case 'heading':
        this.heading.textContent = newValue
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }
}

customElements.define('di-figure', DidacticFigure)
