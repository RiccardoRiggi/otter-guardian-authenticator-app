import { Text } from '@rneui/themed';
import { Button } from '@rneui/base';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Divider } from '@rneui/themed';

import { View, StyleSheet } from 'react-native';


import { Stack, useRouter } from "expo-router";


import { useState, useEffect, useRef } from 'react';

import * as React from "react";
import { Header, Icon } from "@rneui/base";

import * as SecureStore from 'expo-secure-store';

import { ScrollView } from 'react-native';

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';



import autenticazioneService from './services/autenticazioneService';
import config from '../config';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

// Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {

    console.info(expoPushToken);

    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Original Title',
        body: 'And here is the body!',
        data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync({
            projectId: config.idProgetto,
        })).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}

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

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();



    const [testo, setTesto] = useState("CLICCA PER SCOPRIRE COSA SUCCEDE A WALTER");

    const [avviato, setAvviato] = React.useState(false);

    const [codice, setCodice] = useState("");
    const [oraCreazione, setOraCreazione] = useState("");
    const [dataCreazione, setDataCreazione] = useState("");
    const [idTwoFact, setIdTwoFact] = useState("");
    const [indirizzoIp, setIndirizzoIp] = useState("");
    const [idTipoLogin, setIdTipoLogin] = useState("");

    const avviaRicercaTentativiAppesi = async () => {
        setAvviato(true);

        const idDispositivoFisico = await SecureStore.getItemAsync("idDispositivoFisico");


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
            //---------------------------------------------
            try {
                console.error(e.response.data);

            } catch (e) {

            }

            //---------------------------------------------v
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
            //---------------------------------------------
            try {
                console.error(e);

            } catch (e) {

            }

            //---------------------------------------------

        });
    }

    const verificaEsistenzaIdDispositivo = async () => {
        const idDispositivo = await SecureStore.getItemAsync("idDispositivoFisico");
        if (idDispositivo === null) {
            router.push('/pages/inserisci-nome-dispositivo')
        }


    }

    const salvaToken = (token) => {
        setExpoPushToken(token)
    }

    const gestioneNotifiche = () => {
        registerForPushNotificationsAsync().then(token => salvaToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
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
                <Divider width={10} color='#ffffff00' />
                <Button color={"#5e72e4"} onPress={async () => {
                    await sendPushNotification("");
                }} title={"Abilita notifiche"} />



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