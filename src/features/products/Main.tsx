import { Box, Container} from "@mui/material";
import React, {useState} from "react";
import ProductTable from "../../components/ProductTable";
import SearchInput from "../../components/SearchInput";
import {useSearchParams} from "react-router-dom";


const Main = () => {
    let [searchParams] = useSearchParams();
    let productFromQueryString = searchParams.get("product")
    const [productId, setProductId] = useState<number|null>(productFromQueryString ? Number(productFromQueryString) : null)

    return (
        <>
            <Container>
                <Box sx={{ width:"max-content",margin: "0 auto", marginTop: 10}}>
                   <SearchInput setProductId={setProductId}/>
                    <Container sx={{"marginTop": 10}}>
                        <ProductTable productId={productId} />
                    </Container>
                </Box>
            </Container>
        </>
    )
}

export default Main