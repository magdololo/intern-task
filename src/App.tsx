import React from 'react';
import {Route, Routes} from "react-router-dom";
import './App.css';
import Main from "./features/products/Main";

import {Box} from "@mui/material";


function App() {
  return (

    <Box className="App">
         <Routes>
             <Route path="/" element={<Main/>}/>
         </Routes>
    </Box>
  );
}

export default App;
