import { html, css, SlotMixin } from '@lion/core';
import { LionLitElement } from '../../core/src/LionLitElement.js';
import { updatePosition } from '../../overlays/src/utils/manage-position.js';
import { getPlacement } from '../../overlays/src/utils/get-position.js';
import pointerSvg from '../../../assets/icons/pointer.svg.js';

import '../../icon/lion-icon.js';

export class LionPointingFrame extends SlotMixin(LionLitElement) {
  static get styles() {
    return css`
      :host {
        box-sizing: border-box;
      }
    `;
  }

  get slots() {
    return {
      ...super.slots,
      // TODO: Refactor to put it on instance instead of constructor. No need for clone ;)
      pointer: () => {
        const icon = document.createElement('lion-icon');
        icon.style.height = '8px';
        icon.style.verticalAlign = 'top';
        if (!this.constructor.pointer) {
          this.constructor.pointer = document.createElement('div');
          this.constructor.pointer.setAttribute('slot', 'pointer');
          this.constructor.pointer.appendChild(icon);
        }
        const node = this.constructor.pointer.cloneNode(true);
        node.firstElementChild.svg = pointerSvg;
        return node;
      },
    };
  }

  static get properties() {
    return {
      position: {
        type: String,
        reflect: true,
      },
      invokerWidth: {
        type: Number,
        attribute: 'invoker-width',
      },
      invokerHeight: {
        type: Number,
        attribute: 'invoker-height',
      },
      pointerDistanceFromEdge: {
        type: Number,
      },
    };
  }

  constructor() {
    super();
    this.pointerDistanceFromEdge = 16;
  }

  updated() {
    super.updated();
    if (this.position) {
      const pointerEl = this.$$slot('pointer');
      /**
       * 1) Reset pointer rotation / styles
       * Necessary with rectangular pointers since 90deg or 270deg rotation
       * flip height and width. Calculations will then be wrong.
       */
      const defaultPointerStyles = this.__resetPointerStyles(pointerEl);

      /* 2) Set padding / margin based on pointer */
      this.__setFrameStyles(pointerEl);

      /* 3) Hide the pointer */
      this.__hidePointer(pointerEl, defaultPointerStyles);

      /**
       * 4) Reposition with the new spacing on the pointing-frame
       * Pointer is hidden first so it does not influence the placement,
       * since we already set padding for it.
       *
       * The parentElement position is taken (user-defined preferred position)
       * This to prevent infinite loops when using the actual position that is given
       */
      updatePosition(this, this.nextElementSibling, {
        placement: this.parentElement.position,
        position: 'absolute',
      });

      /* 5) Rotate, position and display the pointer properly */
      this.__setPointerStyles(pointerEl, defaultPointerStyles);
    }
  }

  /* eslint-disable-next-line class-methods-use-this */
  __hidePointer(pointerEl, defaultPointerStyles) {
    const pointerStyles = defaultPointerStyles;
    pointerStyles.display = 'none';
    Object.assign(pointerEl.style, pointerStyles);
  }

  /* eslint-disable-next-line class-methods-use-this */
  __resetPointerStyles(pointerEl) {
    const pointerStyles = {
      display: 'block',
      position: 'absolute',
      bottom: 'auto',
      top: 'auto',
      left: 'auto',
      right: 'auto',
      transform: 'rotate(0deg)',
    };
    Object.assign(pointerEl.style, pointerStyles);
    pointerStyles.height = `${pointerEl.firstElementChild.getBoundingClientRect().height}px`;
    Object.assign(pointerEl.style, pointerStyles);
    return pointerStyles;
  }

  __setPointerStyles(pointerEl, defaultPointerStyles) {
    const pointerStyles = defaultPointerStyles;

    const pointingFrameHeight = this.getBoundingClientRect().height;
    const pointingFrameWidth = this.getBoundingClientRect().width;

    pointerStyles.display = 'block';
    Object.assign(pointerEl.style, pointerStyles);
    const pointerHeight = pointerEl.firstElementChild.getBoundingClientRect().height;
    const pointerWidth = pointerEl.firstElementChild.getBoundingClientRect().width;

    const { vertical, horizontal, horizontalIsPrimary } = getPlacement(this.position);

    if (horizontalIsPrimary) {
      // pointerHeight / 2 here is a correction to do with the 270 and 90 deg rotations
      if (horizontal === 'left') {
        pointerStyles.transform = 'rotate(90deg)';
        pointerStyles.right = `${-(pointerHeight / 2)}px`;
      } else if (horizontal === 'right') {
        pointerStyles.transform = 'rotate(270deg)';
        pointerStyles.left = `${-(pointerHeight / 2)}px`;
      }

      const spacing = this.invokerHeight / 2 - pointerWidth / 2 - this.pointerDistanceFromEdge;
      if (vertical === 'top') {
        if (spacing < 0) {
          pointerStyles.bottom = `${pointerHeight / 2 + this.pointerDistanceFromEdge}px`;
        } else {
          pointerStyles.bottom = `${pointerHeight / 2 +
            this.invokerHeight / 2 -
            pointerWidth / 2}px`;
        }
      } else if (vertical === 'center') {
        pointerStyles.bottom = `${pointingFrameHeight / 2 - pointerHeight / 2}px`;
      } else if (vertical === 'bottom') {
        if (spacing < 0) {
          pointerStyles.top = `${pointerHeight / 2 + this.pointerDistanceFromEdge}px`;
        } else {
          pointerStyles.top = `${pointerHeight / 2 + this.invokerHeight / 2 - pointerWidth / 2}px`;
        }
      }
    } else {
      const spacing = this.invokerWidth / 2 - pointerWidth / 2 - this.pointerDistanceFromEdge;
      if (horizontal === 'left') {
        if (spacing < 0) {
          pointerStyles.right = `${this.pointerDistanceFromEdge}px`;
        } else {
          pointerStyles.right = `${this.invokerWidth / 2 - pointerWidth / 2}px`;
        }
      } else if (horizontal === 'center') {
        pointerStyles.bottom = 0;
        pointerStyles.left = `${pointingFrameWidth / 2 - pointerWidth / 2}px`;
      } else if (horizontal === 'right') {
        if (spacing < 0) {
          pointerStyles.left = `${this.pointerDistanceFromEdge}px`;
        } else {
          pointerStyles.left = `${this.invokerWidth / 2 - pointerWidth / 2}px`;
        }
      }

      if (vertical === 'top') {
        pointerStyles.transform = 'rotate(180deg)';
        pointerStyles.bottom = 0;
      } else if (vertical === 'bottom') {
        pointerStyles.top = 0;
      }
    }

    Object.assign(pointerEl.style, pointerStyles);
  }

  __setFrameStyles(pointerEl) {
    const pointingFrameEl = this.shadowRoot.querySelector('.pointing-frame');

    const frameStyles = {
      boxSizing: 'border-box',
      fontSize: '16px',
      color: 'black',
      backgroundColor: 'white',
      paddingBottom: 0,
      paddingTop: 0,
      paddingRight: 0,
      paddingLeft: 0,
    };

    const hostStyles = {
      marginTop: 0,
      marginBottom: 0,
      marginRight: 0,
      marginLeft: 0,
    };

    // Reset to defaults before getting the content and pointer dimensions
    Object.assign(pointingFrameEl.style, frameStyles);
    Object.assign(this.style, hostStyles);

    const pointerHeight = pointerEl.firstElementChild.getBoundingClientRect().height;
    const pointerWidth = pointerEl.firstElementChild.getBoundingClientRect().width;

    const { vertical, horizontal, horizontalIsPrimary } = getPlacement(this.position);
    if (horizontalIsPrimary) {
      if (horizontal === 'left') {
        frameStyles.paddingRight = `${pointerHeight}px`;
      } else if (horizontal === 'right') {
        frameStyles.paddingLeft = `${pointerHeight}px`;
      }

      const spacing = this.invokerHeight / 2 - pointerWidth / 2 - this.pointerDistanceFromEdge;
      if (vertical === 'top') {
        if (spacing < 0) {
          hostStyles.marginTop = `${Math.abs(spacing)}px`;
        } else {
          frameStyles.paddingBottom = `${spacing}px`;
        }
      } else if (vertical === 'bottom') {
        if (spacing < 0) {
          hostStyles.marginTop = `${spacing}px`;
        } else {
          frameStyles.paddingTop = `${spacing}px`;
        }
      }
    } else {
      const spacing = this.invokerWidth / 2 - pointerWidth / 2 - this.pointerDistanceFromEdge;
      if (horizontal === 'left') {
        if (spacing < 0) {
          hostStyles.marginLeft = `${Math.abs(spacing)}px`;
        } else {
          frameStyles.paddingRight = `${spacing}px`;
        }
      } else if (horizontal === 'right') {
        if (spacing < 0) {
          hostStyles.marginLeft = `${spacing}px`;
        } else {
          frameStyles.paddingLeft = `${spacing}px`;
        }
      }

      if (vertical === 'top') {
        frameStyles.paddingBottom = `${pointerHeight}px`;
      } else if (vertical === 'bottom') {
        frameStyles.paddingTop = `${pointerHeight}px`;
      }
    }

    Object.assign(pointingFrameEl.style, frameStyles);
    Object.assign(this.style, hostStyles);
  }

  // eslint-disable-next-line class-methods-use-this
  render() {
    return html`
      <div class="pointing-frame">
        <slot></slot>
        <slot name="pointer"></slot>
      </div>
    `;
  }
}
