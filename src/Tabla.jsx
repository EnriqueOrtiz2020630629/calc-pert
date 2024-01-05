import { useState } from "react";
import { useEffect } from "react";
import { useReducer } from "react";
import FilaTabla from "./FilaTabla";
import GrafoPERT from "./Grafo";
import './Tabla.css'

export default function Tabla({setDuracionProyecto, setRutaCritica, setMinSemanas, setMaxSemanas, setDesvStd}) {   
    const [listaAct, dispatch] = useReducer(actReducer, actIniciales);
    
    const agregarAct = () => {
        dispatch({
            tipo: 'agregarAct'
        });
    };

    const quitarAct = () => {
        dispatch({
            tipo: 'quitarAct'
        });
    }

    const actualizarAct = (nuevaAct) => {
        dispatch({
            tipo: 'actualizarAct',
            act: nuevaAct
        });
    };

    const calcularPERT = () =>{
        dispatch({
            tipo:'calcularPERT'
        });

        
    }

    useEffect(() => {
        if(listaAct[0].t_esperado != null){
            const grafo = new GrafoPERT(listaAct);
            grafo.recorridoHaciaAdelante();
            grafo.recorridoHaciaAtras();
            grafo.calcularHolgura();

            const rutaCritica = grafo.getRutaCritica();
            setRutaCritica(rutaCritica);
            setDuracionProyecto(grafo.getDuracionProyecto());

            
            let minSum = 0;
            let maxSum = 0;
            let sumVarianza = 0;

            rutaCritica.forEach(nombre => {
                const activ = listaAct.filter(act => act.nombre === nombre)[0];
                minSum += Number(activ.t_optimista);
                maxSum += Number(activ.t_pesimista);
                sumVarianza += Number(activ.varianza);
            })

            console.log(minSum, maxSum, sumVarianza);
            setDesvStd(Math.sqrt(sumVarianza))
            setMinSemanas(Math.ceil(minSum));
            setMaxSemanas(Math.floor(maxSum));
                        
        }
    }, [listaAct]);

    return (
        <div class="main-container">
            <div className="tabla-container">
                <table>
                        <tr>
                            <th>Actividad</th>
                            <th>Precedente</th>
                            <th>Tiempo optimista</th>
                            <th>Tiempo mas probable</th>
                            <th>Tiempo pesimista</th>
                            <th>Tiempo esperado</th>
                            <th>Varianza</th>
                        </tr>
                        
                        {listaAct.map((act) => (
                            <FilaTabla
                                key={act.nombre}
                                act={act}
                                actualizarAct={actualizarAct}
                                listaAct={listaAct}
                            />
                        ))}
                </table>
            </div>

            <div className="btn-container">
                    <button className="btn-agregar" onClick={agregarAct}>+</button>
                    <button className="btn-quitar" onClick={quitarAct}>-</button>
                    <button className="btn-calcular" onClick={calcularPERT}>Calcular</button>
            </div>


        </div>
    );
}

const actReducer = (listaAct, accion) => {
    switch (accion.tipo) {
        case "agregarAct": {
            const longitudLista = listaAct.length;
            return [
                ...listaAct,
                {
                    nombre: posALetra(longitudLista),
                    precedente: [],
                    t_optimista: 0,
                    t_probable: 0,
                    t_pesimista: 0,
                    t_esperado: null,
                    varianza: null,
                }
            ]
        }

        case "actualizarAct": {
            return listaAct.map(act => {
                if(act.nombre === accion.act.nombre){
                    return accion.act;
                } else{
                    return act;
                }
            });
        }

        case "quitarAct": {
            if(listaAct.length > 1){
                const prec = listaAct[listaAct.length-1].nombre;
                return listaAct
                    .map((act) => {
                        const nuevoPrecedente = act.precedente.filter(
                            (item) => item !== prec
                        );
                        return { ...act, precedente: nuevoPrecedente };
                    })
                    .slice(0, -1);
            } else {
                return listaAct;
            }
        }

        case "calcularPERT": {
            const calcTiempoEsperado = (opt, prob, pes) => {
                const resultado = (Number(opt) + (4*Number(prob)) + Number(pes)) / 6;
                return Number(resultado.toFixed(2));
            };
        
            const calcVarianza = (opt, pes) => {
                const resultado = ((Number(pes) - Number(opt)) / 6.0) ** 2;
                return Number(resultado.toFixed(2));
            };

            const nuevaLista = listaAct.map((act) => {
                const nuevoTiempoEsperado = calcTiempoEsperado(
                    act.t_optimista,
                    act.t_probable,
                    act.t_pesimista
                );
                const nuevaVarianza = calcVarianza(
                    act.t_optimista,
                    act.t_pesimista
                );
                return {
                    ...act,
                    t_esperado: nuevoTiempoEsperado,
                    varianza: nuevaVarianza,
                };
            });
                
            return nuevaLista;
        }
    }
}


const actIniciales = [
    {
        nombre: "A",
        precedente: [],
        t_optimista: 0,
        t_probable: 0,
        t_pesimista: 0,
        t_esperado: null,
        varianza: null,
    },
];

const posALetra = (num) => {
    let resultado = "";

    while (num >= 0) {
        resultado = String.fromCharCode(65 + (num % 26)) + resultado;
        num = Math.floor(num / 26) - 1;
        if (num < 0) 
            break;
    }

    return resultado;
}
