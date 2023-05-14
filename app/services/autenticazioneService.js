import http from "../http-common";

let root = "/dispositivoFisico.php";



const abilitaDispositivoFisico = (jsonBody) => {
    return http.put(root,jsonBody, { params: {nomeMetodo: "abilitaDispositivoFisico" }});
}

const getRichiesteDiAccessoPendenti = (jsonBody) => {
    return http.post(root,jsonBody, { params: {nomeMetodo: "getRichiesteDiAccessoPendenti" }});
}

const autorizzaQrCode = (jsonBody) => {
    return http.post(root,jsonBody, { params: {nomeMetodo: "autorizzaQrCode" }});
}

const autorizzaAccesso = (jsonBody) => {
    return http.post(root,jsonBody, { params: {nomeMetodo: "autorizzaAccesso" }});
}


const autenticazioneService = {
    abilitaDispositivoFisico,
    getRichiesteDiAccessoPendenti,
    autorizzaAccesso,
    autorizzaQrCode
};
export default autenticazioneService;