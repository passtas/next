import { ref, Ref, computed } from '@vue/composition-api';
import { UseProduct, AgnosticProductAttribute, UiMediaGalleryItem } from '@vue-storefront/interfaces';
import { wrap } from '@vue-storefront/utils';

type SearchParams = {
  perPage?: number;
  page?: number;
  sort?: any;
  term?: any;
  filters?: any;
}

export type UseProductFactoryParams<PRODUCT, PRODUCT_FILTERS, PRODUCT_SEARCH_PARAMS extends SearchParams> = {
  productsSearch: (searchParams: PRODUCT_SEARCH_PARAMS) => Promise<PRODUCT[]>;
  productHelpers: {
    getName: (product: PRODUCT | Readonly<PRODUCT>) => string;
    getSlug: (product: PRODUCT | Readonly<PRODUCT>) => string;
    getPrice: (product: PRODUCT | Readonly<PRODUCT>) => number | null;
    getGallery: (product: PRODUCT | Readonly<PRODUCT>) => UiMediaGalleryItem[];
    getVariants: (products: PRODUCT[] | Readonly<PRODUCT[]>, filters: PRODUCT_FILTERS) => PRODUCT[] | Readonly<PRODUCT[]>;
    getAttributes: (product: PRODUCT[] | Readonly<PRODUCT[]>, filters?: Array<string>) => Array<AgnosticProductAttribute>;
    getDescription: (product: PRODUCT | Readonly<PRODUCT>) => any;
    getCategories: (product: PRODUCT | Readonly<PRODUCT>) => string[];
    getId: (product: PRODUCT | Readonly<PRODUCT>) => number;
  };
};

export function useProductFactory<PRODUCT, PRODUCT_FILTERS, PRODUCT_SEARCH_PARAMS>(
  factoryParams: UseProductFactoryParams<PRODUCT, PRODUCT_FILTERS, PRODUCT_SEARCH_PARAMS>
) {
  return function useProduct(cacheId: string): UseProduct<PRODUCT, PRODUCT_FILTERS> {
    console.info(
      'SSR Temporarly disbled for product composable https://github.com/DivanteLtd/next/issues/232',
      cacheId
    );
    // const { state, persistedResource } = usePersistedState(id);

    // const products: Ref<ProductVariant[]> = ref(state || []);\
    const products: Ref<PRODUCT[]> = ref([]);
    const loading = ref(false);
    const totalProducts = ref(0);

    const productGetters = {
      getName: (product) => {
        return computed(() => factoryParams.productHelpers.getName(wrap(product).value));
      },

      getSlug: (product) => {
        return computed(() => factoryParams.productHelpers.getSlug(wrap(product).value));
      },

      getPrice: (product) => {
        return computed(() => factoryParams.productHelpers.getPrice(wrap(product).value));
      },

      getGallery: (product) => {
        return computed(() => factoryParams.productHelpers.getGallery(wrap(product).value));
      },

      getVariants: (products, filters?) => {
        return computed(() => factoryParams.productHelpers.getVariants(wrap(products).value, filters));
      },

      getAttributes: (product, filters?) => {
        return computed(() => factoryParams.productHelpers.getAttributes(wrap(product).value, filters));
      },

      getDescription: (product) => {
        return computed(() => factoryParams.productHelpers.getDescription(wrap(product).value));
      },

      getCategories: (product) => {
        return computed(() => factoryParams.productHelpers.getCategories(wrap(product).value));
      },

      getId: (product) => {
        return computed(() => factoryParams.productHelpers.getId(wrap(product).value));
      }
    };

    const search = async (params: PRODUCT_SEARCH_PARAMS) => {
      loading.value = true;
      // products.value = await persistedResource<ProductVariant[]>(loadProductVariants, params);
      products.value = await factoryParams.productsSearch(params);
      loading.value = false;
    };

    return {
      search,
      productGetters,
      products: computed(() => products.value),
      loading: computed(() => loading.value),
      totalProducts: computed(() => totalProducts.value)
    };
  };
}
