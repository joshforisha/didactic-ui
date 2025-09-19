const styles = `
:host {
  width: 100%;
}

input {
  appearance: none;
  background-color: var(--lighter-gray);
  border: 1px solid var(--dark-gray);
  border-radius: var(--tiny);
  box-sizing: border-box;
  color: var(--black);
  display: inline-block;
  font-family: var(--system-fonts);
  font-size: 1em;
  min-height: var(--min-control-height);
  outline: none;
  padding: 0 var(--medium);
  width: 100%;

  &::placeholder {
    color: var(--dark-gray);
    font-family: var(--didone-fonts);
    font-size: 1.125em;
    font-style: italic;
  }

  &:disabled {
    color: var(--dark-gray);

    &::placeholder {
      color: var(--gray);
    }
  }

  &:focus {
    border-color: var(--black);
  }
}

label {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-family: var(--didone-fonts);
  font-weight: 700;
}

:host(:state(disabled)) input,
:host(:state(disabled)) label {
  cursor: not-allowed;
}
`

class DidacticTextInput extends HTMLElement {
  static observedAttributes = ['disabled', 'label', 'placeholder']

  constructor() {
    super()

    this._internals = this.attachInternals()

    this.stylesheet = document.createElement('style')
    this.stylesheet.textContent = styles

    const label = document.createElement('label')
    this.labelSpan = document.createElement('span')
    this.input = document.createElement('input')
    this.input.setAttribute('type', 'text')
    label.append(this.labelSpan, this.input)

    const root = this.attachShadow({ mode: 'open' })
    root.append(this.stylesheet, label)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'disabled':
        if (newValue === '') {
          this._internals.states.add('disabled')
          this.input.setAttribute(name, newValue)
        } else {
          this._internals.states.delete('disabled')
          this.input.removeAttribute(name)
        }
        // if (newValue === '') this._internals.states.add('disabled')
        // else this._internals.states.delete(name)
        break
      case 'label':
        this.labelSpan.textContent = newValue
        break
      case 'placeholder':
        this.input.setAttribute('placeholder', newValue)
        break
      default:
        console.warn(
          `Attribute ${name} has changed from "${oldValue}" to "${newValue}"`
        )
    }
  }
}

customElements.define('di-text-input', DidacticTextInput)
