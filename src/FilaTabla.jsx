import { useState } from "react";
import "./FilaTabla.css";

export default function FilaTabla({actualizarAct, act, listaAct}) {
    const [estaAbierto, setEstaAbierto] = useState(false);

    const toggleDropdown = () => {
        setEstaAbierto((prevState) => !prevState);
    };

    const agregarPrecedente = (nombre) => {
        const nuevoPrecedente = [...act.precedente, nombre]
        actualizarAct({...act, precedente: nuevoPrecedente})
    }
    const quitarPrecedente = (nombre) =>{
        const nuevoPrecedente = act.precedente.filter(prec => prec !== nombre)
        actualizarAct({...act, precedente: nuevoPrecedente})
    }

    
    return (
        <tr>
            <td className="td-nombre">{act.nombre}</td>
            <td className="td-precedente">
                {act.precedente.map(prec => {
                    return <div>{prec}<button onClick={() => quitarPrecedente(prec)}>x</button></div>
                })}
                <div className="custom-dropdown">
                    <button className="custom-btn" onClick={toggleDropdown}>
                        +
                    </button>
                    {estaAbierto && (
                        <div className="custom-dropdown-content">
                            {listaAct
                                .filter((item) => item.nombre !== act.nombre && !act.precedente.includes(item.nombre))
                                .map((item) => {
                                    return <a onClick={() => agregarPrecedente(item.nombre)}>{item.nombre}</a>
                                })}
                        </div>
                    )}
                </div>
            </td>
            <td className="td-tiempo">
                <input
                    size="2"
                    type="text"
                    value={act.t_optimista}
                    onChange={(e) => actualizarAct({...act, t_optimista: e.target.value})}
                />
            </td>
            <td className="td-tiempo">
                <input
                    size="2"
                    type="text"
                    value={act.t_probable}
                    onChange={(e) => actualizarAct({...act, t_probable: e.target.value})}
                />
            </td>
            <td className="td-tiempo">
                <input
                    size="2"
                    type="text"
                    value={act.t_pesimista}
                    onChange={(e) => actualizarAct({...act, t_pesimista: e.target.value})}/>
            </td>
            <td className="td-tiempo">{act.t_esperado}</td>
            <td className="td-tiempo">{act.varianza}</td>
        </tr>
    );
}
