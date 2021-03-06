import { Validator } from '../Validator.js';

/**
 * @typedef {import('../../../types/FormControlMixinTypes.js').FormControlHost} FormControlHost
 */

export class Required extends Validator {
  static get validatorName() {
    return 'Required';
  }

  /**
   * We don't have an execute function, since the Required validator is 'special'.
   * The outcome depends on the modelValue of the FormControl and
   * FormControl.__isEmpty / FormControl._isEmpty.
   */

  /**
   * @param {FormControlHost & HTMLElement} formControl
   */
  // eslint-disable-next-line class-methods-use-this
  onFormControlConnect(formControl) {
    if (formControl._inputNode) {
      formControl._inputNode.setAttribute('aria-required', 'true');
    }
  }

  /**
   * @param {FormControlHost & HTMLElement} formControl
   */
  // eslint-disable-next-line class-methods-use-this
  onFormControlDisconnect(formControl) {
    if (formControl._inputNode) {
      formControl._inputNode.removeAttribute('aria-required');
    }
  }
}
