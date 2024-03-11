import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {
  transform(array: any[], order = ''): any[] {
    if (!Array.isArray(array) || array.length <= 1) {
      return array;
    }

    if (order === 'asc') {
      return array.slice().sort((a, b) => a.Ref - b.Ref);
    } else if (order === 'desc') {
      return array.slice().sort((a, b) => b.Ref - a.Ref);
    } else {
      return array;
    }
  }
}