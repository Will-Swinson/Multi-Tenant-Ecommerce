import { parseAsString, useQueryStates } from "nuqs";

export default function useProductFilters() {
  return useQueryStates({
    minPrice: parseAsString.withOptions({
      clearOnDefault: true,
    }),
    maxPrice: parseAsString.withOptions({
      clearOnDefault: true,
    }),
  });
}
