import {Link, useLocation, useSearchParams} from '@remix-run/react';

const ProductOptions: React.FC<{options: any[]}> = ({options}) => {
  const {pathname, search} = useLocation();
  const [currentSearchParams] = useSearchParams();

  const searchParams = currentSearchParams;

  return (
    <div className="grid gap-4 mb-6">
      {/* Each option will show a label and ption value <Link/> */}
      {options.map((option: any) => {
        if (!option) {
          return;
        }

        // get currently selected option value
        const currentOptionVal = searchParams.get(option.name);
        return (
          <div
            key={option.name}
            className="flex flex-col flex-wrap mb-4 gap-y-2 last:mb-0"
          >
            <h3 className="whitespace-pre-wrap max-w-prose font-bold text-lead min-w-[4rem]">
              {option.name}
            </h3>

            <div className="flex flex-wrap items-baseline gap-4">
              {option.values.map((value: any) => {
                // Build a URLSearch object from the current search string
                const linkParams = new URLSearchParams(search);
                const isSelected = currentOptionVal === value;
                // Set the option name and value, overwriting any existing values
                linkParams.set(option.name, value);
                return (
                  <Link
                    key={value}
                    to={`${pathname}?${linkParams.toString()}`}
                    preventScrollReset
                    replace
                    className={`leading-none py-1 border-b-[1.5px] cursor-pointer transition-all duration-200 ${
                      isSelected ? 'border-gray-500' : 'border-neutral-50'
                    }`}
                  >
                    {value}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductOptions;
