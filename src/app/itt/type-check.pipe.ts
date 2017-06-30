import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typeCheck'
})
export class TypeCheckPipe implements PipeTransform {

  transform(value: any, classType?: any): boolean {
    console.log(classType);
    console.log(value);
    return (value && !(value instanceof classType));
  }

}
