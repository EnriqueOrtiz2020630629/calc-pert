import jStat from "jstat";
export default function TablaSemanas ({minSemanas, maxSemanas, desvStd, duracionProyecto}){

    const zScore = (semana, promedio, desvStd) => {
        const zScore = (semana - promedio)/desvStd;
        const porcentaje = jStat.normal.cdf(zScore, 0, 1) * 100;
        return parseFloat(porcentaje.toFixed(2));
    }

    const weeks = Array.from({ length: maxSemanas - minSemanas + 1 }, (_, index) => minSemanas + index);

    return (
        <table>
            <thead>
                <tr>
                    <th>Semanas</th>
                    <th>Probabilidad</th>
                </tr>
            </thead>
            <tbody>
            {weeks.map((sem, index) => (
                    <tr key={index}> 
                        <td>{sem}</td>
                        <td>{zScore(sem, duracionProyecto, desvStd)} %</td>
                    </tr>))}
            
            </tbody>
            
        </table>
    )
}

/*                            
*/