/* eslint-disable no-underscore-dangle */

import { LionInputDate } from '../input-date/LionInputDate.js';
import { html, render } from '../core/lit-html.js';
import { overlays } from '../overlays/overlays.js';
import { ModalDialogController } from '../overlays/ModalDialogController.js';
import '../calendar/lion-calendar.js';

// !!!!!!!!!!! THIS IS A POC
// !! could serve as insipration => but no hard feelings if completely ignored/destroyed

/**
 *
 * @customElement
 * @extends {LionInputDate}
 */
export class LionInputDatepicker extends LionInputDate {
  // Renders the invoker button + the overlay with calendar displayed
  pickerTemplate() {
    this.overlayCtrl = overlays.add(
      new ModalDialogController({
        contentTemplate: () =>
          html`
            <div class="calendar-overlay">
              <div class="calendar-overlay__header">
                <h1 class="calendar-overlay__heading">${this.title}</h1>
                <button class="calendar-overlay__close-button" aria-label="Close calendar">
                  x
                </button>
              </div>
              <lion-calendar id="calendar"></lion-calendar>
            </div>
          `,
      }),
    );
    return this.invokerTemplate();
  }

  invokerTemplate() {
    return html`
      <button
        id="invoker"
        @click="${ev => this.overlayCtrl.show(ev.currentTarget)}"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        &#128540;
      </button>
    `;
  }

  get slots() {
    return {
      ...super.slots,
      suffix: () => render(this.pickerTemplate()),
    };
  }
}
