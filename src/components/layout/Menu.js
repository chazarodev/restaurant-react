import React, {useState, useEffect, useContext} from 'react';
import { Link } from 'react-router-dom';
import { FirebaseContext } from '../../firebase';
import Platillo from '../UI/Platillo';

const Menu = () => {

    //Definir el state para los platillos
    const [platillos, guardarPlatillos] = useState([]);
    const {firebaseApp} = useContext(FirebaseContext);

    //COnsultar la base de datos al cargar
    useEffect(() => {
        const obtenerPlatillos = () => {
            firebaseApp.db.collection('productos').onSnapshot(handleSnapshot);
        }
        obtenerPlatillos();
        // eslint-disable-next-line
    }, [])

    //Snapshot nos permite utilizar la bd en tiempo real de firestore
    function handleSnapshot(snapshot) {
        const platillos = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        });
        // Almacenar los resultado en el sate
        guardarPlatillos(platillos);
    }

    return ( 
        <>
            <h1 className="text-3xl font-light mb-4">Menu</h1>
            <Link to="/nuevo-platillo" className="bg-blue-800 hover:bg-blue-700 inline-block mb-5 p-2 text-white uppercase font-bold">
                Agregar Platillo
            </Link>
            {platillos.map(platillo => (
                <Platillo 
                    key={platillo.id}
                    platillo={platillo}
                />
            ))}
        </>
    );
}
 
export default Menu;