/* eslint-disable no-underscore-dangle */
import { html, render, css, LitElement, DomHelpersMixin } from '@lion/core';
import { LionInputDate } from '@lion/input-date';
import { overlays, ModalDialogController } from '@lion/overlays';
import '@lion/calendar/lion-calendar.js';

// !!!!!!!!!!! THIS IS A POC
// !! could serve as insipration => but no hard feelings if completely ignored/destroyed

// TODO: make separate calendar-overlay component?

// Needs to be a webcomponent, so that
class LionCalendarOverlayFrame extends DomHelpersMixin(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          background: white;
          position: relative;
        }
      `,
    ];
  }

  firstUpdated() {
    super.firstUpdated();
    // For extending purposes: separate logic from template structure/style (only keep ids as ref)
    this.$id('close-button').setAttribute('aria-label', 'Close overlay'); // TODO: translate
    this.$id('close-button').addEventListener('click', this.__dispatchCloseEvent.bind(this));
  }

  __dispatchCloseEvent() {
    // Designed to work in conjunction with ModalDialogController
    this.dispatchEvent(new CustomEvent('dialog-close'), { bubbles: true, composed: true });
  }

  render() {
    // eslint-disable-line class-methods-use-this
    return html`
      <div class="calendar-overlay">
        <div class="calendar-overlay__header">
          <h1 id="overlay-heading" class="calendar-overlay__heading">
            <slot name="heading"></slot>
          </h1>
          <button id="close-button" class="calendar-overlay__close-button">
            x
          </button>
        </div>
        <slot></slot>
      </div>
    `;
  }
}
customElements.define('lion-calendar-overlay-frame', LionCalendarOverlayFrame);

/**
 *
 * @customElement
 * @extends {LionInputDate}
 */
export class LionInputDatepicker extends LionInputDate {
  static get properties() {
    return {
      ...super.properties,
      /**
       * The title to be added on top of the calendar overlay
       */
      calendarHeading: {
        type: 'String',
        attribute: 'calendar-heading',
      },
      /**
       * Internal flag used for toggling
       */
      _isCalendarShown: {
        type: Boolean,
      },
    };
  }

  get slots() {
    return {
      ...super.slots,
      suffix: () => {
        const renderParent = document.createElement('div');
        render(this.pickerTemplate(), renderParent);
        return renderParent.firstElementChild;
      },
    };
  }

  get calendarElement() {
    return this.overlayCtrl._container.firstElementChild;
  }

  constructor() {
    super();
    this._invokerId = `${this.localName}-${Math.random()
      .toString(36)
      .substr(2, 10)}`;
  }

  // Renders the invoker button + the overlay with calendar displayed
  pickerTemplate() {
    // Overlay is defined here, since it is the calendar invoker
    this.overlayCtrl = overlays.add(
      new ModalDialogController({
        contentTemplate: () => this.calendarOverlayTemplate(),
      }),
    );
    return this.invokerTemplate();
  }

  calendarOverlayTemplate() {
    // eslint-disable-line class-methods-use-this
    // TODO: decouple event listener from template
    return html`
      <lion-calendar-overlay-frame>
        <span slot="heading"></span>
        <lion-calendar id="calendar" @selected-changed="${this._onCalendarSelectedChanged}">
        </lion-calendar>
      </lion-calendar-overlay-frame>
    `;
  }

  invokerTemplate() {
    // TODO: separate logic and a11y from template + generate unique id (since light dom)
    return html`
      <button
        id="${this._invokerId}"
        @click="${ev => this.overlayCtrl.show(ev.currentTarget)}"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        &#128540;
      </button>
    `;
  }

  _onCalendarSelectedChanged({ target: { selectedDate } }) {
    this.overlayCtrl.hide();
    // Synchronize new selectedDate value to input
    this.modelValue = selectedDate;
  }
}
