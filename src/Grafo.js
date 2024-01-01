class Actividad {
    constructor(nombre, duracion) {
        this.nombre = nombre
        this.duracion = duracion;
        this.TIP = null;
        this.TTP = null;
        this.TIT = null;
        this.TTT = null;
        this.holgura = null;
        this.listaAdj = [];
    }

    agregarArco(nombre) {
        this.listaAdj.push(nombre);
    }

    setTIP(tiempo) {
        this.TIP = tiempo;
        this.calcularTTP()
    }

    calcularTTP() {
        this.TTP = this.TIP + this.duracion;
    }

    setTiemposTardios(TT) {
        this.TTT = TT;
        this.TIT = this.TTT - this.duracion;
        this.calcularHolgura();
    }

    calcularHolgura() {
        this.holgura = this.TTT - this.TTP;
    }

    toString() {
        return `${this.nombre} - TIP: ${this.TIP}, TTP: ${this.TTP}, TIT: ${this.TIT}, TTT: ${this.TTT}, Holgura: ${this.holgura}`;
    }
}

export default class GrafoPERT {
    constructor(listaAct) {
        this.nodos = {};

        this.agregarActividad("INICIO", 0);
        this.agregarActividad("FINAL", 0);
        this.nodos["INICIO"].TIP = 0;
        this.nodos["INICIO"].TTP = 0;


        listaAct.forEach(act => {
            const nombre = act.nombre;
            const duracion = act.t_esperado;
            this.agregarActividad(nombre, duracion);
        });
        
        listaAct.forEach(act => {
            if(act.precedente.length === 0 ){
                this.agregarDependencia("INICIO", act.nombre);
            } else {
                act.precedente.forEach(prec => 
                    this.agregarDependencia(prec, act.nombre)
                )
            }
        });

        for (let key in this.nodos) {
            if(key !== "INICIO" && key !== "FINAL"){
                if(this.nodos[key].listaAdj.length === 0){
                    this.agregarDependencia(key, "FINAL")
                } 
            }
        }
    }

    agregarActividad(nombre, duracion) {
        this.nodos[nombre] = new Actividad(nombre, duracion);
    }

    agregarDependencia(origen, destino) {
        this.nodos[origen].agregarArco(destino);
    }

    getPredecesores(nombre){
        const listaPrec = [];
        for(let key in this.nodos){
            if(this.nodos[key].listaAdj.includes(nombre)){
                listaPrec.push(key)
            }
        }

        return listaPrec;
    }

    calcularTiemposProximos(nombre){
        if(this.nodos[nombre].TTP != null){
            return parseFloat(this.nodos[nombre].TTP.toFixed(2));
        } else {
            const TIPsPrec = this.getPredecesores(nombre).map(key => {
                return this.calcularTiemposProximos(key);
            })
    
            const TIP = Math.max(...TIPsPrec);
            const duracion = this.nodos[nombre].duracion;
            const TTP = parseFloat((TIP + duracion).toFixed(2));
    
            this.nodos[nombre].TIP = TIP;
            this.nodos[nombre].TTP = TTP;
    
            return TTP;
        }
    }

    calcularTiemposTardios(nombre){
        if(this.nodos[nombre].TIT != null){
            return parseFloat(this.nodos[nombre].TIT.toFixed(2));
        } else {
            const TITsSuc = this.nodos[nombre].listaAdj.map(key => {
                return this.calcularTiemposTardios(key);
            });
    
            const TTT = Math.min(...TITsSuc);
            const duracion = this.nodos[nombre].duracion;
            const TIT = parseFloat((TTT - duracion).toFixed(2));
    
            this.nodos[nombre].TTT = TTT;
            this.nodos[nombre].TIT = TIT;
    
            return TIT;
        }
    }

    
    recorridoHaciaAdelante() {
        this.calcularTiemposProximos("FINAL");
    }

    recorridoHaciaAtras() {
        this.nodos["FINAL"].TTT = this.nodos["FINAL"].TTP;
        this.nodos["FINAL"].TIT = this.nodos["FINAL"].TTT;

        this.calcularTiemposTardios("INICIO");
    }

    calcularHolgura(){
        for(let key in this.nodos){
            const TTT = this.nodos[key].TTT;
            const TTP = this.nodos[key].TTP;
            this.nodos[key].holgura = TTT - TTP;
        }
    }

    getRutaCritica(){
        let nodoActual = "INICIO";
        const queue = [];

        while(nodoActual !== "FINAL"){
            for(let nodo of this.nodos[nodoActual].listaAdj){
                if(this.nodos[nodo].holgura === 0){
                    nodoActual = nodo;
                    queue.push(nodo);
                    break;
                }
            }
        }

        return queue.filter(item => item !== "FINAL");
    }

    getDuracionProyecto(){
        return this.nodos["FINAL"].TTT;
    }
}



