import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import List from './pages/List';
import Subscribe from './pages/Subscribe';
import Home from './pages/Home';
import Header from './components/Header';
import PageNotFound from './pages/PageNotFound';
import Favourites from './pages/Favourites';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/list/my-favourites" element={<Favourites />} />
          <Route path="/list" element={<List />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
