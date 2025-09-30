'use client'

import { makeAutoObservable, runInAction } from 'mobx'
import qs from 'qs'
import { Option } from '@components/MultiDropdown'

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const API_PRODUCTS = 'api/products';
const API_PRODUCTS_CATEGORIES = 'api/product-categories';

export interface ProductImage {
    id?: number;
    url: string;
    formats?: {
        large?: { url: string };
        medium?: { url: string };
        small?: { url: string };
        thumbnail?: { url: string };
    };
}

export interface ProductType {
    documentId: number;
    title: string;
    price: number;
    productCategory: { id: number; title: string };
    description: string;
    images: ProductImage[];
}

export interface ProductData {
    id: number;
    title: string;
    contentSlot: number;
    subTitle: string;
    images: ProductImage[];
    captionSlot: string;
    categoryId?: number;
}

export interface Category {
    id: number;
    title: string;
}

export interface CategoryOption {
    key: string;
    value: string;
    categoryId: number;
}

export interface PaginationMeta {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
}

interface QueryParams {
    search?: string;
    categories?: string;
    page?: string;
}

class ProductsStore {
    products: ProductData[] = [];
    filteredProducts: ProductData[] = [];
    categories: Category[] = [];
    selectedFilters: CategoryOption[] = [];
    searchValue: string = '';
    currentPage: number = 1;
    isLoading: boolean = false;
    isSearching: boolean = false;
    isFiltering: boolean = false;
    error: string | null = null;
    paginationMeta: PaginationMeta = {
        page: 1,
        pageSize: 9,
        pageCount: 0,
        total: 0
    };

    readonly PRODUCTS_PER_PAGE = 9;
    readonly API_PRODUCTS_URL = `${BASE_API_URL}/${API_PRODUCTS}`;
    readonly API_CATEGORIES_URL = `${BASE_API_URL}/${API_PRODUCTS_CATEGORIES}`;

    constructor() {
        makeAutoObservable(this);
    }

    private setSearchValue = (value: string) => {
        this.searchValue = value;
    };

    private setCurrentPage = (page: number) => {
        this.currentPage = page;
    };

    private setSelectedFilters = (filters: CategoryOption[]) => {
        this.selectedFilters = filters;
    };

    private setError = (error: string | null) => {
        this.error = error;
    };

    private setPaginationMeta = (meta: PaginationMeta) => {
        this.paginationMeta = meta;
    };

    private updateQueryParams = (params: {
        search?: string;
        categories?: number[];
        page?: number;
    }) => {
        if (typeof window === 'undefined') return;

        const searchParams = new URLSearchParams(window.location.search)

        if (params.search !== undefined) {
            if (params.search) {
                searchParams.set('search', params.search)
            } else {
                searchParams.delete('search')
            }
        }

        if (params.categories !== undefined) {
            if (params.categories.length > 0) {
                searchParams.set('categories', params.categories.join(','))
            } else {
                searchParams.delete('categories')
            }
        }

        if (params.page !== undefined) {
            if (params.page > 1) {
                searchParams.set('page', params.page.toString())
            } else {
                searchParams.delete('page')
            }
        }

        const newUrl = `${window.location.pathname}?${searchParams.toString()}`
        window.history.replaceState(null, '', newUrl)
    }

    private getCategoryIds = (selectedFilters: CategoryOption[]) => {
        return selectedFilters.map(filter => filter.categoryId);
    }

    handleSearch = () => {
        const categoryIds = this.getCategoryIds(this.selectedFilters);
        this.updateQueryParams({
            search: this.searchValue.trim(),
            categories: categoryIds,
            page: 1
        });
        this.searchProducts();
    };

    handleFilterChange = (filters: Option[]) => {
        const categoryFilters = filters as CategoryOption[];
        this.setSelectedFilters(categoryFilters);

        const categoryIds = categoryFilters.map(filter => filter.categoryId);
        this.updateQueryParams({
            search: this.searchValue,
            categories: categoryIds,
            page: 1
        });
        this.filterProducts(categoryFilters);
    };

    handlePageChange = (pageNumber: number) => {
        this.setCurrentPage(pageNumber);
        this.updateQueryParams({ page: pageNumber });
        this.fetchProducts(pageNumber);
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    handleSearchChange = (value: string) => {
        this.setSearchValue(value);
    };

    handleRetry = () => {
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    };

    private fetchCategories = async () => {
        try {
            const response = await fetch(this.API_CATEGORIES_URL, {
                next: { revalidate: 60 }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch categories: ${response.status}`);
            }

            const data = await response.json();
            const categoriesData = data.data.map((cat: { id: number, title: string }) => ({
                id: cat.id,
                title: cat.title || 'Unnamed Category'
            }));

            runInAction(() => {
                this.categories = categoriesData;
            });
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    private fetchProducts = async (page: number = 1, searchTerm: string = '', categoryIds: number[] = [], options: { forceRefresh?: boolean } = {}) => {
        try {
            runInAction(() => {
                this.isLoading = true;
                this.error = null;
            });

            const queryParams: { [key: string]: number | string } = {
                'populate[0]': 'images',
                'populate[1]': 'productCategory',
                'pagination[page]': page,
                'pagination[pageSize]': this.PRODUCTS_PER_PAGE,
            };

            if (searchTerm.trim()) {
                queryParams['filters[title][$containsi]'] = searchTerm.trim();
            }

            if (categoryIds.length > 0) {
                categoryIds.forEach((categoryId, index) => {
                    queryParams[`filters[productCategory][id][$in][${index}]`] = categoryId;
                });
            }

            const apiUrl = `${this.API_PRODUCTS_URL}?${qs.stringify(queryParams, { encode: true })}`;

            const fetchOptions: RequestInit = options.forceRefresh 
                ? { cache: 'no-store' }
                : { next: { revalidate: 60 } }

            const response = await fetch(apiUrl, fetchOptions);

            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.status}`);
            }

            const responseData = await response.json();

            const formattedProducts: ProductData[] = responseData.data.map((raw: ProductType) => ({
                id: raw.documentId,
                title: raw.title,
                contentSlot: raw.price,
                captionSlot: raw.productCategory.title,
                categoryId: raw.productCategory.id,
                images: raw.images,
                subTitle: raw.description,
            }));

            runInAction(() => {
                this.filteredProducts = formattedProducts;
                this.paginationMeta = responseData.meta.pagination;
                this.isLoading = false;
                this.isSearching = false;
                this.isFiltering = false;
            });
        } catch (err: unknown) {
            runInAction(() => {
                this.error = err instanceof Error 
                    ? `Failed to load products: ${err.message}`
                    : 'An unexpected error occurred';
                this.isLoading = false;
                this.isSearching = false;
                this.isFiltering = false;
            });
            console.error('Error fetching products:', err);
        }
    };

    private searchProducts = () => {
        this.isSearching = true;
        const categoryIds = this.getCategoryIds(this.selectedFilters);
        this.fetchProducts(1, this.searchValue, categoryIds);
    };

    private filterProducts = (filters: CategoryOption[]) => {
        this.setSelectedFilters(filters);
        this.isFiltering = true;
        const categoryIds = filters.map(filter => filter.categoryId);
        this.fetchProducts(1, this.searchValue, categoryIds);
    };

    private syncWithQueryParams = (queryParams: Record<string, string>) => {
        if (queryParams.search) {
            this.setSearchValue(queryParams.search);
        }

        if (queryParams.page) {
            this.setCurrentPage(Number(queryParams.page));
        }

        if (queryParams.categories && this.categories.length > 0) {
            const categoryIds = queryParams.categories.split(',').map(Number);
            const filters = this.categories
                .filter(cat => categoryIds.includes(cat.id))
                .map(cat => ({
                    key: cat.id.toString(),
                    value: cat.title,
                    categoryId: cat.id
                }));
            this.setSelectedFilters(filters);
        }
    };

    initialize = async (queryParams: Record<string, string>) => {
        this.syncWithQueryParams(queryParams)

        if (this.categories.length === 0) {
            await this.fetchCategories()
        }

        const searchTerm = queryParams.search || ''
        const categoryIds = queryParams.categories
            ? queryParams.categories.split(',').map(Number)
            : []
        const page = queryParams.page ? Number(queryParams.page) : 1

        await this.fetchProducts(page, searchTerm, categoryIds)
    }

    refreshProducts = async () => {
        const searchTerm = this.searchValue || ''
        const categoryIds = this.getCategoryIds(this.selectedFilters)
        const page = this.currentPage

        await this.fetchProducts(page, searchTerm, categoryIds, { forceRefresh: true })
    }

    get categoryOptions(): CategoryOption[] {
        return this.categories.map(category => ({
            key: category.id.toString(),
            value: category.title,
            categoryId: category.id
        }));
    }

    get paginatedProducts(): ProductData[] {
        return this.filteredProducts;
    }

    get totalPages(): number {
        return this.paginationMeta.pageCount;
    }

    get totalProducts(): number {
        return this.paginationMeta.total;
    }
}

export const productsStore = new ProductsStore();