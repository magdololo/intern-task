import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {Box, Modal, Typography} from "@mui/material";
import {useState} from "react";
import {Product, useListProductsQuery, useSingleProductQuery} from "../features/api/apiSlice";
import {skipToken} from "@reduxjs/toolkit/query";
import {useSearchParams} from "react-router-dom";



const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

interface Column {
    id: 'id' | 'name' | 'year' ;
    label: string;
    align?: 'center';
    minWidth?: number;
}

const columns:Column[] = [
    { id: 'id', label: 'Id', minWidth: 170 },
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'year', label: 'Year', minWidth: 170, align: 'center'},
];



interface ProductTableProps{
    productId: number | null
}
export default function ProductTable({productId}: ProductTableProps) {

    let [searchParams, setSearchParams] = useSearchParams();
    let pageFromQueryString = searchParams.get("page")

    const [page, setPage] = useState(pageFromQueryString ? Number(pageFromQueryString) : 0);
    const { data: products, isLoading, isError, error} = useListProductsQuery(!productId || productId === 0? page+1 : skipToken  )
    let {data: singleProduct, error: singleProductError, isError: singleProductIsError} = useSingleProductQuery(productId && productId !== 0? productId : skipToken)

    const [selectedProduct, setSelectedProduct ] = useState<Product|null>(null)
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleChangePage = (event:unknown, newPage: number) => {
        searchParams.set("page", newPage.toString())
        setSearchParams(searchParams)
        setPage(newPage);

    };

    let productsList: Array<Product> | null =  []

    if (singleProduct){
        productsList.push(singleProduct)
    } else if(products){
        productsList= products.data
    }

    if (isLoading) {
        return <div>Loading</div>
    }

    if (!productsList) {
        return <div>No products :(</div>
    }
    if(singleProductIsError && singleProductError){
        if(singleProductError >= 400 && singleProductError < 500){
            return <div>Unfortunately, there is no such product.</div>
        }
        if(singleProductError >= 500){
            return <div>Ups something went wrong...  </div>
        }
    }
    if(isError && error){
        if(error >= 400 && error < 500){
            return <div>No product list.</div>
        }
        if(error >= 500){
            return <div>Ups something went wrong... </div>
        }
    }




    return (
        <>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productsList?
                            productsList
                            .map((product) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={product.name} style={{backgroundColor: product.color, cursor: 'pointer'}} onClick={
                                        ()=>{
                                            setSelectedProduct(product)
                                            handleOpen()
                                        }
                                    }>
                                        {columns.map((column) => {
                                            const value = product[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align} >
                                                    {value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            }): null}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5]}
                component="div"
                count={products?.total ?? 1}
                rowsPerPage={5}
                page={page}
                onPageChange={handleChangePage}
            />
        </Paper>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Product
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                       Name: {selectedProduct?.name}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Id: {selectedProduct?.id}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Color: {selectedProduct?.color}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Year: {selectedProduct?.year}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Pantone value: {selectedProduct?.pantone_value}
                    </Typography>
                </Box>
            </Modal>
        </>
    );
}