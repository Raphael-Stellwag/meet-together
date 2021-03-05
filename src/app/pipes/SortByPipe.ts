/*
 *ngFor="let c of oneDimArray | sortBy:'asc'"
 *ngFor="let c of arrayOfObjects | sortBy:'asc':'propertyName'"
*/
import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';

@Pipe({
    name: 'sortBy',
    pure: false
})
export class SortByPipe implements PipeTransform {

    transform(value: any[], order = '', column: string = ''): any[] {
        if (!value || order === '' || !order) { 
            // no array
            return value; 
        } 
        if (value.length <= 1) { 
            // array with only one item
            return value; 
        } 
        if (!column || column === '') {
            if (order === 'asc') {
                return value.sort() 
            } else { 
                return value.sort().reverse(); 
            }
        } 
        // sort 1d array
        return orderBy(value, [column], [order]);
    }
}