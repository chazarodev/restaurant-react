import React, {useContext, useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {FirebaseContext} from '../../firebase';
import { useNavigate } from 'react-router'; 
import FileUploader from 'react-firebase-file-uploader';

const NuevoPlatillo = () => {

    //State para las imagenes
    const [subiendo, guardarSubiendo] = useState(false);
    const [progreso, guardarProgreso] = useState(0);
    const [urlimagen, guardarUrlimagen] = useState('');

    //Conext con las operaciones de firebase
    const {firebaseApp} = useContext(FirebaseContext);

    //Hook para redireccionar
    const navigate = useNavigate();

    //Validación y leer los datos del formulario
    const formik = useFormik({
        initialValues: {
            nombre: '',
            precio: '',
            categoria: '',
            imagen: '',
            descripcion: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().min(4, 'Coloca un nombre más extenso').required('Agrega un nombre al platillo'),
            precio: Yup.number().min(1, 'Agrega un precio').required('Agrega un precio'),
            categoria: Yup.string().required('Selecciona una categoría'),
            descripcion: Yup.string().min(10, 'Escribe una descripción más amplia').required('Agrega un descripción'),
        }),
        onSubmit: platillo => {
            try {
                platillo.existencia = true;
                platillo.imagen = urlimagen;
                firebaseApp.db.collection('productos').add(platillo);
                //Redireccionar
                navigate('/menu');
            } catch (error) {
                console.log(error);
            }
        }
    });

    //Todo sobre las imagenes
    const handleUploadStart = () => {
        guardarProgreso(0);
        guardarSubiendo(true);
    }

    const handleUploadError = error => {
        guardarSubiendo(false);
        console.log(error);
    }

    const handleUploadSuccess = async nombre => {
        guardarProgreso(100);
        setTimeout(() => {
            guardarSubiendo(false);

        }, 300)

        //Almacenar la url de destino
        const url = await firebaseApp.storage.ref("productos").child(nombre).getDownloadURL();
        guardarUrlimagen(url);
    }

    const handleProgress = progreso => {
        guardarProgreso(progreso);
    }

    return ( 
        <>
            <h1 className="text-3xl font-light mb-4">Agregar Platillo</h1>
            <div className="flex justify-center mt-10">
                <div className="w-full max-w-3xl">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                            <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="nombre"
                                type='text'
                                placeholder='Nombre Platillo'
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.nombre && formik.errors.nombre ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-2" role="alert">
                                <p>{formik.errors.nombre}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">Precio</label>
                            <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="precio"
                                type='number'
                                placeholder='$precio'
                                min='0'
                                value={formik.values.precio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        {formik.touched.precio && formik.errors.precio ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-2" role="alert">
                                <p>{formik.errors.precio}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">Categoría</label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="precio"
                                name="categoria" 
                                value={formik.values.categoria}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option>- Seleccione -</option>
                                <option value="desayuno">Desayuno</option>
                                <option value="comida">Comida</option>
                                <option value="cena">Cena</option>
                                <option value="bebida">Bebidas</option>
                                <option value="postre">Postre</option>
                                <option value="ensalada">Ensalada</option>
                            </select>
                        </div>
                        {formik.touched.categoria && formik.errors.categoria ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-2" role="alert">
                                <p>{formik.errors.categoria}</p>
                            </div>
                        ) : null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imagen">Imagen</label>
                            <FileUploader 
                                accept="image/*"
                                id="imagen"
                                name="imagen"
                                randomizeFilename
                                storageRef={firebaseApp.storage.ref("productos")} //Crear un carpeta donde se guardarán los archivos
                                onUploadStart={handleUploadStart}
                                onUploadError={handleUploadError}
                                onUploadSuccess={handleUploadSuccess}
                                onProgress={handleProgress}
                            />
                        </div>
                        {subiendo && (
                            <div className="h-5 w-full border relative">
                                <div className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-5 rounded flex items-center" style={{width:`${progreso}%`}}>
                                    {progreso}%
                                </div>
                            </div>
                        )}
                        {urlimagen && (
                            <p className="text-green-500 p-3 text-center my-2 font-bold">La Imagen se subió correctamente</p>
                        )}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">Descripcion</label>
                            <textarea 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
                                id="descripcion"
                                type='text'
                                placeholder='Descripción del platillo'
                                value={formik.values.descripcion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            ></textarea>
                        </div>
                        {formik.touched.descripcion && formik.errors.descripcion ? (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-2" role="alert">
                                <p>{formik.errors.descripcion}</p>
                            </div>
                        ) : null}
                        <input 
                            type="submit"
                            className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
                            value="Agregar Platillo"
                        />
                    </form>
                </div>
            </div>
        </>
    );
}
 
export default NuevoPlatillo;