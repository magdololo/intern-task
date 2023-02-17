import {screen, render, within} from "@testing-library/react";
import user from '@testing-library/user-event';
import {setupServer} from "msw/node";
import {rest} from "msw";
import {MemoryRouter} from "react-router-dom";
import ProductTable from "./ProductTable";
import {apiSlice, ListResponse, Product} from "../features/api/apiSlice";
import {ApiProvider} from "@reduxjs/toolkit/dist/query/react";


function renderComponent (){
    const productId = 0

    render(

        <MemoryRouter>
        <ApiProvider api={apiSlice}>
        <ProductTable productId={productId} />
        </ApiProvider>
    </MemoryRouter >

    )
}

function renderComponentWithParameter () {
    const productId = 4
    render(

        <MemoryRouter>
            <ApiProvider api={apiSlice}>
                <ProductTable productId={productId} />
            </ApiProvider>
        </MemoryRouter >

    )
    return productId;
}

const handlers = [
    rest.get('https://reqres.in/api/products', (req, res, ctx)=>{ //przechwytuje wszystkie rzadania get ktore leca do api/repositories przed query stringiem
         let page = req.url.searchParams.get('page')//obiekt ktory zawiera wszystkie informacje o query string
        if(!page) page='0'
        const responseObject: ListResponse<Product> = {
            page: parseInt(page),
            per_page: 5,
            total: 13,
            total_pages: 3,
            data: [
            ]
        }

        for (let i=1; i<= responseObject.per_page; i++){
            let product:Product = {
                    id: i + ((parseInt(page) - 1)*5),
                    name: "Product name "+ (i + ((parseInt(page) - 1)*5)),
                    year: 2022,
                    color: 'yellow',
                    pantone_value: '#000000'
                }
                responseObject.data.push(product)
        }

        return res( //musi byc taki obiekt jaki otrzymujemy z prawdziwego zadania i on jest w konsoli Network Preview/Podglad
            ctx.json(responseObject)
            )
    }),
    rest.get('https://reqres.in/api/products/:productId', (req, res, ctx)=>{ //przechwytuje wszystkie rzadania get ktore leca do api/repositories przed query stringiem
        const responseObject: Product = {
            id: parseInt(req.params.productId as string),
            name: "Product name "+ parseInt(req.params.productId as string),
            year: 2022,
            color: 'yellow',
            pantone_value: '#000000'
        }
        return res( //musi byc taki obiekt jaki otrzymujemy z prawdziwego zadania i on jest w konsoli Network Preview/Podglad

            ctx.json({data: responseObject})
        )
    })
]


const server = setupServer(...handlers);

beforeAll(()=>{
  server.listen();
});
afterEach(()=>{
});
afterAll(()=>{
    server.close()
});

test('check if amount of product on the page is equal=5', async ()=>{
    renderComponent()

    const allProduct = await within( await screen.findByTestId('products')).findAllByRole('row')
    expect(allProduct.length).toEqual(5)
})

test ('check number of all products',  async()=>{
    renderComponent()

    const paginationInfo = await screen.findByText(/of/i)
    expect(paginationInfo.textContent).toEqual('1–5 of 13')
})

test('check if next page button shows next set of products', async ()=>{
    renderComponent()
    const buttonNextPage = await screen.findByRole( "button",{ name: /go to next page/i})
    user.click(buttonNextPage)
    const paginationInfo = await screen.findByText(/of/i)
    const product_10 = await screen.findByRole("row", {name: /product name 10/i})
    expect(paginationInfo.textContent).toEqual('6–10 of 13')
    expect(product_10).toBeInTheDocument()

})

test ('check if selected product is visible on the page', async()=>{
    let selectedProductId = renderComponentWithParameter()
    const visibleProduct = await screen.findByRole("row", {name: new RegExp(`Product name ${selectedProductId}`)})
    expect(visibleProduct).toBeInTheDocument()
})
