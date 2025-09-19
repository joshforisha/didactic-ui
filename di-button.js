const styles = `
:host {
  position: relative;
}

button {
  align-items: center;
  background-color: var(--lighter-gray);
  border: 1px solid var(--dark-gray);
  color: var(--black);
  cursor: pointer;
  display: inline-flex;
  font-family: var(--system-fonts);
  font-size: 0.9em;
  font-weight: 500;
  justify-content: center;
  min-height: var(--min-control-height);
  min-width: var(--min-control-height);
  padding: var(--small) var(--medium);
  transition: background-color var(--fast), color var(--slow);
}

button:disabled {
  color: var(--gray);
  cursor: not-allowed;
}

:host(:state(inverted)) button,
:host(:state(inverted)) .loader {
  background-color: var(--darker-gray);
  color: var(--white);
}

:host(:state(disabled):state(inverted)) button,
:host(:state(disabled):state(inverted)) .loader {
  color: var(--dark-gray);
}

.loader {
  align-items: center;
  background-color: var(--lighter-gray);
  display: flex;
  height: calc(100% - 2px);
  justify-content: center;
  left: 1px;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  top: 1px;
  transition: opacity var(--slow);
  width: calc(100% - 2px);

  svg {
    fill: currentColor;
    height: 1.5rem;
  }
}

:host(:state(busy)) button {
  cursor: wait;
}

:host(:state(busy)) .loader {
  opacity: 1;
}

@media screen and (hover: hover) {
  :host(:not(:state(busy)):not(:state(disabled))) button:not(:disabled):hover {
    background-color: var(--light-gray);
  }

  :host(:state(inverted):not(:state(busy)):not(:state(disabled))) button:not(:disabled):hover {
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

    this._internals = this.attachInternals()

    this.stylesheet = document.createElement('style')
    this.stylesheet.textContent = styles

    this.button = document.createElement('button')
    this.button.innerHTML = this.innerHTML

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

    const root = this.attachShadow({ mode: 'open' })
    root.append(this.stylesheet, this.button, this.loader)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'busy':
      case 'inverted':
        if (newValue === '') this._internals.states.add(name)
        else this._internals.states.delete(name)
        break
      case 'disabled':
        if (newValue === '') this.button.setAttribute('disabled', '')
        else this.button.removeAttribute('disabled')
        break
      case 'type':
        this.button.setAttribute(name, newValue)
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }
}

customElements.define('di-button', DidacticButton)
