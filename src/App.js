import React from 'react';
import {Routes, Route} from 'react-router';
import firebaseApp, { FirebaseContext } from './firebase';
import Ordenes from './components/layout/Ordenes';
import Menu from './components/layout/Menu';
import NuevoPlatillo from './components/layout/NuevoPlatillo';
import SideBar from './components/UI/Sidebar';

function App() {
  return (
    <FirebaseContext.Provider
      value={{firebaseApp}}
    >
      <div className="md:flex min-h-screen">
        <SideBar />
        <div className="md:w-3/5 xl:w-4/5 p-6">
          <Routes>
            <Route path="/home" element={<Ordenes />}>Ordenes</Route>
            <Route path="/menu" element={<Menu />}>Menu</Route>
            <Route path="/nuevo-platillo" element={<NuevoPlatillo />}>NuevoPlatillo</Route>
          </Routes>
        </div>
      </div>
    </FirebaseContext.Provider>
  );
}

export default App;
