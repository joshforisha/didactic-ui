const styles = `
:host {
  align-items: center;
  background-color: var(--lighter-gray);
  border: 1px solid var(--dark-gray);
  cursor: pointer;
  display: inline-flex;
  font-weight: 500;
  justify-content: center;
  min-height: var(--min-control-height);
  min-width: var(--min-control-height);
  padding: var(--small) var(--medium);
  position: relative;
  transition: background-color var(--fast), color var(--slow);
}

:host(:state(disabled)) {
  color: var(--gray);
  cursor: not-allowed;
}

:host(:state(inverted)) {
  background-color: var(--darker-gray);
  color: var(--white);
}

:host(:state(disabled):state(inverted)) {
  color: var(--dark-gray);
}

.loader {
  align-items: center;
  background-color: inherit;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  top: 0;
  transition: opacity var(--slow);
  width: 100%;

  svg {
    fill: currentColor;
    height: 1.5rem;
  }
}

:host(:state(busy)) {
  cursor: wait;

  .loader {
    opacity: 1;
  }
}

@media screen and (hover: hover) {
  :host(:not(:state(busy)):not(:state(disabled)):hover) {
    background-color: var(--light-gray);
  }

  :host(:state(inverted):not(:state(busy)):not(:state(disabled)):hover) {
    background-color: var(--dark-gray);
  }
}
`

const barsSource = `<svg viewBox="0 0 24 14" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="0" width="6" height="14" opacity="1">
    <animate id="spinner_rQ7m" begin="0;spinner_2dMV.end-0.25s" attributeName="opacity" dur="0.75s" values="1;.2" fill="freeze" />
  </rect>
  <rect x="9" y="0" width="6" height="14" opacity=".4">
    <animate begin="spinner_rQ7m.begin+0.15s" attributeName="opacity" dur="0.75s" values="1;.2" fill="freeze" />
  </rect>
  <rect x="17" y="0" width="6" height="14" opacity=".3">
    <animate id="spinner_2dMV" begin="spinner_rQ7m.begin+0.3s" attributeName="opacity" dur="0.75s" values="1;.2" fill="freeze" />
  </rect>
</svg>`

class DidacticButton extends HTMLElement {
  static observedAttributes = ['busy', 'disabled', 'href', 'inverted', 'type']

  constructor() {
    super()

    this.stylesheet = document.createElement('style')
    this.stylesheet.textContent = styles

    this.content = document.createElement('slot')
    this.content.innerHTML = this.innerHTML

    this.loader = document.createElement('div')
    this.loader.classList.add('loader')
    this.loader.innerHTML = barsSource

    this.addEventListener(
      'click',
      (event) => {
        if (
          this._internals.states.has('busy') ||
          this._internals.states.has('disabled')
        ) {
          event.preventDefault()
          event.stopPropagation()
          return
        }
      },
      true
    )

    this._internals = this.attachInternals()

    const root = this.attachShadow({ mode: 'open' })
    root.append(this.stylesheet, this.content, this.loader)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'busy':
      case 'disabled':
      case 'inverted':
        if (newValue === '') this._internals.states.add(name)
        else this._internals.states.delete(name)
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }
}

customElements.define('di-button', DidacticButton)
