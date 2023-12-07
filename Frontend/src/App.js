import { useState } from 'react';
import { Route, Routes } from 'react-router-dom'
import './App.css';
import {FileUploader} from './FileUploader'
import Home from './Home';


function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path='/' element={ <FileUploader/>} />
        <Route path='/home' element={ <Home/> } />
        <Route path='**' element={ <FileUploader/> } />
      </Routes>
    </div>
  );
}

export default App;



