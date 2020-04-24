import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import MainRouter from './MainRouter';

const App = () => (
    <BrowserRouter forceRefresh={true}>
        <MainRouter />
    </BrowserRouter>
)

export default App;
