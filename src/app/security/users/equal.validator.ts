import {Directive, forwardRef} from '@angular/core';
import {NG_VALIDATORS, Validator, AbstractControl} from '@angular/forms';
import {Input} from '@angular/core';

@Directive({
  selector: '[validateEqualTo][ngModel],[validateEqualTo][formControlName]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualTextValidatorDirective), multi: true}
  ]
})
export class EqualTextValidatorDirective implements Validator {
  @Input() validateEqualTo: string;

  validate(c: AbstractControl) {
    const inputValue = c.value;
    const otherValue = c.root.get(this.validateEqualTo);
    return this.checkEquality(inputValue, otherValue);
  }

  checkEquality(inputValue: string, otherValue: any) {
    if (otherValue && inputValue !== otherValue.value) {
      return {
        validateEqual: true
      };
    }
    return null;
  }
}
