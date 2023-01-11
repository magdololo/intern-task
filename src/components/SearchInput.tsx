import {Stack, TextField} from "@mui/material";
import React, {useState} from "react";
import {useSearchParams} from "react-router-dom";

interface SearchInputProps{
    setProductId: (productId: number) => void;
}
const SearchInput=({setProductId}:SearchInputProps)=>{
    const [searchParams, setSearchParams] = useSearchParams()
    let productIdFromQueryString = searchParams.get("product")
    const [num, setNum] = useState<string>(productIdFromQueryString ?? "")
    const handleOnBlur = () => {
        setProductId(Number(num))
        if(num){
            searchParams.set("product", num)
        } else {
            searchParams.delete("product")
        }
        setSearchParams(searchParams)
    };

    return(
        <>
            <Stack spacing={2} sx={{width: 300, margin: "0 auto"}}>
                <TextField
                    id="outlined-number"
                    label="Id product"
                    type="text"
                    onBlur={handleOnBlur}
                    inputProps={{onKeyPress: (event:React.KeyboardEvent<HTMLInputElement>) => {
                            if (event.key === "Enter") {
                                handleOnBlur()
                                event.preventDefault();
                            }
                        },
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (!e.target.value.match(/\D/g)) {
                            setNum(e.target.value)
                        }
                    }
                    }
                    value={num}
                />
            </Stack>
        </>
    )
}

export default SearchInput