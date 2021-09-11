import { Product } from '@audi/data';
import { endOfDay, isAfter, isToday, parseJSON } from 'date-fns';

export function isProductDiscounted(product: Product): boolean {
  if (product.isDiscounted) {
    if (product.discountDeadline != null) {
      const discountDeadlineDate = new Date(product.discountDeadline);

      const today = isToday(parseJSON(discountDeadlineDate));

      const laterThanToday = isAfter(
        parseJSON(discountDeadlineDate),
        endOfDay(new Date())
      );

      return today || laterThanToday;
    }

    return true;
  }

  return false;
}
