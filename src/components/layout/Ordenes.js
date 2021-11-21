import React, {useEffect, useState, useContext} from 'react';
import {FirebaseContext} from '../../firebase';
import Orden from '../UI/Orden';

const Ordenes = () => {

    //context con lsd operaciones de firebase
    const {firebaseApp} = useContext(FirebaseContext);

    //State con las ordenes
    const [ordenes, guardarOrdenes] = useState([]);

    useEffect(() => {
        const obtenerOrdenes = () => {
            firebaseApp.db.collection('ordenes').where('completado', '==', false).onSnapshot(handleSnapshot);
        }
        obtenerOrdenes();
        // eslint-disable-next-line
    }, []);

    function handleSnapshot(snapshot) {
        const ordenes = snapshot.docs.map(doc => {
            return{
                id: doc.id,
                ...doc.data()
            }
        });
        guardarOrdenes(ordenes);
    }

    return ( 
        <>
            <h1 className="text-3xl font-light mb-4">Ordenes</h1>
            <div className="sm:flex sm:flex-wrap -mx-3">
                {ordenes.map(orden => (
                    <Orden 
                        key={orden.id}
                        orden={orden}
                    />
                ))}
            </div>
        </>
    );
}
 
export default Ordenes;