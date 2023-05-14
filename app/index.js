import { Text } from '@rneui/themed';
import { Button } from '@rneui/base';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Divider } from '@rneui/themed';
import { View } from 'react-native';
import { Stack, useRouter } from "expo-router";
import { useState, useEffect } from 'react';
import * as React from "react";
import { Header, Icon } from "@rneui/base";
import * as SecureStore from 'expo-secure-store';
import autenticazioneService from './services/autenticazioneService';

export function getData(date) {
    if (date != null) {
        date = new Date(date);
        return aggiungiZeri(date.getDate()) + "/" + aggiungiZeriMese(date.getMonth()) + "/" + date.getFullYear();
    } else {
        return "";
    }
}

export function getOra(date) {
    if (date != null) {
        date = new Date(date);
        return aggiungiZeri(date.getHours()) + ":" + aggiungiZeri(date.getMinutes()) + ":" + aggiungiZeri(date.getSeconds());
    } else {
        return "";
    }
}

function aggiungiZeri(giorno) {
    if (giorno > 9) {
        return giorno;
    } else {
        return "0" + (giorno);
    }

}

function aggiungiZeriMese(giorno) {
    if (giorno > 9) {
        return giorno + 1;
    } else {
        return "0" + (giorno + 1);
    }

}


const Home = () => {

    const router = useRouter();


    const [codice, setCodice] = useState("");
    const [oraCreazione, setOraCreazione] = useState("");
    const [dataCreazione, setDataCreazione] = useState("");
    const [idTwoFact, setIdTwoFact] = useState("");
    const [indirizzoIp, setIndirizzoIp] = useState("");
    const [idTipoLogin, setIdTipoLogin] = useState("");

    const avviaRicercaTentativiAppesi = async () => {

        verificaEsistenzaIdDispositivo();

        const idDispositivoFisico = await SecureStore.getItemAsync("idDispositivoFisico");

        if (idDispositivoFisico === null) {
            return;
        }


        let jsonBody = {
            idDispositivoFisico: idDispositivoFisico,
        }

        await autenticazioneService.getRichiesteDiAccessoPendenti(jsonBody).then(response => {


            if (response.data.length === 0) {
                setCodice("");
                setDataCreazione("");
                setIdTipoLogin("");
                setIdTwoFact("");
                setIndirizzoIp("");
                console.info("NON HO TROVATO NULLA")
            } else if ("EMAIL_PSW_BACKUP_CODE" !== response.data[0].idTipoLogin) {

                console.info("ABCD")


                setCodice(response.data[0].codice);
                setOraCreazione(getOra(response.data[0].dataCreazione));
                setDataCreazione(getData(response.data[0].dataCreazione));
                setIdTipoLogin(response.data[0].idTipoLogin);
                setIdTwoFact(response.data[0].idTwoFact);
                setIndirizzoIp(response.data[0].indirizzoIp);

            }


        }).catch(e => {
            console.error(e);
        });




    }

    const autorizzaAccesso = async () => {

        const idDispositivoFisico = await SecureStore.getItemAsync("idDispositivoFisico");


        let jsonBody = {
            idDispositivoFisico: idDispositivoFisico,
            idTwoFact: idTwoFact
        }

        await autenticazioneService.autorizzaAccesso(jsonBody).then(response => {
            setIdTipoLogin("");

        }).catch(e => {
            console.error(e);
        });
    }

    const verificaEsistenzaIdDispositivo = async () => {
        const idDispositivo = await SecureStore.getItemAsync("idDispositivoFisico");

        if (idDispositivo === null) {
            router.push('/pages/inserisci-nome-dispositivo')
        }
    }

    useEffect(() => {
        verificaEsistenzaIdDispositivo();
    }, [])


    return (
        <SafeAreaProvider>
            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: '#ff0000' },
                    headerShadowVisible: false,
                    headerShown: false,
                    headerTitle: "",
                }}
            />

            <Header
                backgroundImageStyle={{}}
                backgroundColor='#5e72e4'
                barStyle="default"
                centerComponent={<><Icon
                    name='otter'
                    type='font-awesome-5'
                    color='#ffffff'
                    onPress={() => router.push('/')} />
                    <Text style={{
                        color: '#ffffff'
                    }} >Otter Guardian Authenticator</Text>
                </>}
                centerContainerStyle={{}}

                leftContainerStyle={{}}
                linearGradientProps={{}}
                placement="center"
                rightContainerStyle={{}}
                statusBarProps={{}}
            />



            <View
                style={
                    {
                        justifyContent: 'flex-start',
                        flex: 1,
                        paddingHorizontal: 10,
                        flexDirection: 'column-reverse'
                    }
                }
            >

                <Button style={{ marginBottom: 20 }} color={"#f5365c"} onPress={() => router.push('/pages/elimina-dati')} title={"Elimina i dati salvati"} />
                <Divider width={10} color='#ffffff00' />
                <Button color={"#5e72e4"} onPress={() => router.push('/pages/scansiona-identificativo-accesso')} title={"Scansiona QR Code"} />
                <Divider width={10} color='#ffffff00' />
                <Button color={"#5e72e4"} onPress={() => avviaRicercaTentativiAppesi()} title={"Richiedi codice di verifica"} />




                <View
                    style={
                        {
                            justifyContent: 'flex-start',
                            flex: 1,
                            paddingHorizontal: 10,
                            flexDirection: 'column'
                        }
                    }
                >

                    <Divider width={20} color='#ffffff00' />


                    {idTipoLogin === "" && <Text style={{
                        fontSize: 20,
                        textAlign: 'center'
                    }}>Nessuna richiesta pendente</Text>}
                    {idTipoLogin !== "" && <Text style={{
                        fontSize: 20,
                        textAlign: 'center'
                    }}
                    >Nuova richiesta in attesa!</Text>}
                    <Divider width={20} color='#ffffff00' />

                    {idTipoLogin !== "" && !idTipoLogin.includes("REC_") &&

                        <>

                            <Text style={{
                                fontSize: 20,
                            }}>Richiesta generata alle ore <Text style={{ fontWeight: "bold" }}>{oraCreazione}</Text> del <Text style={{ fontWeight: "bold" }}>{dataCreazione}</Text> dall'indirizzo ip <Text style={{ fontWeight: "bold" }}>{indirizzoIp}</Text></Text>
                            <Divider width={10} color='#ffffff00' />

                            {idTipoLogin.includes("PSW") && <Text style={{
                                fontSize: 20,
                            }}>La richiesta è avvenuta mediante l'inserimento della tua password, se non sei stato tu adotta immediatamente contromisure!
                                {"\n"}{"\n"}
                                Finché non approvi la richiesta nessuno potrà avere accesso al tuo account!</Text>}

                            {!idTipoLogin.includes("PSW") && <Text style={{
                                fontSize: 20,
                            }}>Se sei stato tu approva l'accesso, altrimenti ignora semplicemente questo messaggio.</Text>

                            }</>
                    }



                    {idTipoLogin != "" && idTipoLogin.includes("REC_") && <>
                        <Text style={{
                            fontSize: 20,
                        }}>Richiesta generata alle ore <Text style={{ fontWeight: "bold" }}>{oraCreazione}</Text> del <Text style={{ fontWeight: "bold" }}>{dataCreazione}</Text> dall'indirizzo ip <Text style={{ fontWeight: "bold" }}>{indirizzoIp}</Text></Text>

                        <Text style={{
                            fontSize: 20,
                        }}>Utilizza questo codice temporaneo per cambiare la tua password</Text>
                    </>
                    }


                    {
                        idTipoLogin.includes("SIX") && <>
                            <Divider width={10} color='#ffffff00' />

                            <Text style={{
                                fontSize: 40,
                                fontWeight: 'bold',
                                textAlign: 'center'
                            }}>{codice}</Text>
                        </>
                    }

                    {
                        idTipoLogin.includes("SI_NO") && <>
                            <Divider width={10} color='#ffffff00' />

                            <Button onPress={() => autorizzaAccesso()} color={"#5e72e4"} title={"Approva la richiesta"} ></Button>

                        </>
                    }





                </View>


            </View>




        </SafeAreaProvider>
    )
}

export default Home;
