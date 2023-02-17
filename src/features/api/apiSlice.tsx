import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


export interface Product {

        id: number
        name: string
        year: number
        color: string,
        pantone_value: string

}

export interface ListResponse<Product> {
    page: number
    per_page: number
    total: number
    total_pages: number
    data: Product[]
}
export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({baseUrl: "https://reqres.in/api"}),
    tagTypes: ["Product"],
    endpoints: (build) => ({
        listProducts: build.query<ListResponse<Product>,number|void>({
            query: (page) => `/products?page=${page}&per_page=5`,
        }),
        singleProduct: build.query<Product,number>({
            query: (productId) => `/products/${productId}`,
            transformResponse: (response: { data: Product}) => {
                console.log(response)
                return response.data
            },
            transformErrorResponse:(
                response: { status: string | number }
            ) => response.status,
        })
    }),
});

export const { useListProductsQuery, useSingleProductQuery } = apiSlice