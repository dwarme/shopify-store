import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {MoneyV2, Product} from '@shopify/hydrogen/storefront-api-types';
import {Maybe} from 'graphql/jsutils/Maybe';
import React from 'react';

function checkDiscount(
  compareAtPrice: Maybe<MoneyV2> | undefined,
  price: Maybe<MoneyV2> | undefined,
): boolean {
  if (compareAtPrice && price) {
    return compareAtPrice.amount > price.amount;
  }

  return false;
}
export const ProductCard: React.FC<{product: Product}> = ({product}) => {
  const {price, compareAtPrice} = product.variants.nodes[0] || {};
  const isDiscounted = checkDiscount(compareAtPrice, price);

  return (
    <Link to={`/products/${product.handle}`}>
      <div className="grid gap-6">
        <div className="shadow-sm rounded relative">
          {isDiscounted && (
            // eslint-disable-next-line jsx-a11y/label-has-associated-control
            <label className="subpixel-antialiased absolute top-0 right-0 m-4 text-right text-notice text-red-600 text-xs">
              Sale
            </label>
          )}
          <Image
            data={product.variants.nodes[0].image ?? undefined}
            alt={product.variants.nodes[0].image?.altText ?? ''}
          />
        </div>
        <div className="grid gap-1">
          <h3 className="max-w-prose text-copy w-full overflow-hidden whitespace-nowrap text-ellipsis">
            {product.title}
          </h3>
          <div className="flex gap-4">
            <span className="max-w-prose whitespace-pre-wrap inherit text-copy flex gap-4">
              <Money withoutTrailingZeros data={price} />
              {isDiscounted && compareAtPrice && (
                <Money
                  className="line-through opacity-50"
                  withoutTrailingZeros
                  data={compareAtPrice}
                />
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
