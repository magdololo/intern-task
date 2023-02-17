import {screen, render} from "@testing-library/react";
import SearchInput from "./SearchInput";
import {apiSlice} from "../features/api/apiSlice";
import {ApiProvider} from "@reduxjs/toolkit/dist/query/react";
import {MemoryRouter} from "react-router-dom";

test ('check if search input is visible on the page', ()=>{
    const setProductId= ()=> {}

    render (
<MemoryRouter>
    <ApiProvider api={apiSlice}>
        <SearchInput setProductId={setProductId} />
    </ApiProvider>
</MemoryRouter>

    )
    const searchInput = screen.getByLabelText('Id product')
    expect(searchInput).toBeInTheDocument()
})