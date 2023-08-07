import {useLoaderData} from '@remix-run/react';
import {LoaderArgs, json} from '@shopify/remix-oxygen';
import ProductGrid from '~/components/ProductGrid';

export async function loader({params, context, request}: LoaderArgs) {
  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  const cursor = searchParams.get('cursor');

  const {collection} = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      cursor,
    },
  });

  //handle 404s
  if (!collection) {
    throw new Response(null, {status: 404});
  }

  return json({
    collection,
  });
}

/*
 * Hydrogen offers a convenient Seo (look at routes/root.tsx -> We imported and used the component in order to use bellow function (seo) and object (handle) ) component to automatically generate additional tags and allow for more granular metadata.
 * This component will use the handle > seo export instead and infer the correct meta tags for you.
 */
const seo = ({data}: any) => ({
  title: data?.collection?.title,
  //Truncated the description to 155 characters. This is because Shopify's SEO description is limited to 155 characters.
  description: data?.collection?.description.substr(0, 154),
});

export const handle = {
  seo,
};

export default function Collection() {
  const {collection} = useLoaderData();
  return (
    <>
      <header className="grid w-full gap-8 py-8 justify-items-start">
        <h1 className="text-4xl whitespace-pre-wrap font-bold inline-block">
          {collection.title}
        </h1>

        {collection.description && (
          <div className="flex items-baseline justify-between w-full">
            <div>
              <p className="max-w-md whitespace-pre-wrap inherit text-copy inline-block">
                {collection.description}
              </p>
            </div>
          </div>
        )}
      </header>
      <ProductGrid
        collection={collection}
        url={`/collections/${collection.handle}`}
      />
    </>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionDetails($handle: String!, $cursor: String){
    collection(handle: $handle) {
      title
      description
      handle
      products(first: 4, after: $cursor) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          publishedAt
          handle
          variants(first: 1) {
            nodes {
              id
              image {
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;
