import React from "react";
import { useState } from "react";
import Navbar from "./Navbar";
import Tabla from "./Tabla";
import TablaSemanas from "./TablaSemanas";

export default function App() {
    const [rutaCritica, setRutaCritica] = useState([]);
    const [duracionProyecto, setDuracionProyecto] = useState(0);
    const [desvStd, setDesvStd] = useState(0);
    const [minSemanas, setMinSemanas] = useState(0);
    const [maxSemanas, setMaxSemanas] = useState(0);

    return (
        <>
            <Navbar />
            <Tabla
                setRutaCritica={setRutaCritica}
                setDuracionProyecto={setDuracionProyecto}
                setMaxSemanas={setMaxSemanas}
                setMinSemanas={setMinSemanas}
                setDesvStd={setDesvStd}
            />
            

            {duracionProyecto > 0 && (
                <div>
                    El proyecto tiene 50% de probabilidades de terminarse en{" "}
                    <b>{duracionProyecto}</b> semanas
                </div>
            )}

            {rutaCritica.length > 0 && (
                <div>La ruta critica del proyecto es: <b>{rutaCritica}</b></div>
            )}

            {minSemanas !== 0 && maxSemanas !== 0 && (
                <TablaSemanas
                    maxSemanas={maxSemanas}
                    minSemanas={minSemanas}
                    duracionProyecto={duracionProyecto}
                    desvStd={desvStd}
                />
            )}
        </>
    );
}
