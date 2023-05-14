import { Text } from '@rneui/themed';
import { Button } from '@rneui/base';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Stack, useRouter } from "expo-router";


import { useState, useEffect } from 'react';

import * as React from "react";
import { Header, Icon } from "@rneui/base";

import * as SecureStore from 'expo-secure-store';


import { Input } from '@rneui/themed';

import { View, StyleSheet } from 'react-native';

import { BarCodeScanner } from 'expo-barcode-scanner';

import autenticazioneService from '../../services/autenticazioneService';


const ScansionaIdentificativoDispositivo = () => {

    const router = useRouter();


    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);




    const [nomeDispositivo, setNomeDispositivo] = useState("");









    const recuperaNomeDispositivo = async () => {
        try {
            const nomeDispositivoTmp = await SecureStore.getItemAsync("nomeDispositivo");
            setNomeDispositivo(nomeDispositivoTmp);


        } catch (error) {
            // There was an error on the native side
        }
    }

    const salvaIdDispositivo = async (idDispositivoFisico) => {
        await SecureStore.setItemAsync("idDispositivoFisico", idDispositivoFisico);
        router.push('/');

    }

    const handleBarCodeScanned = async ({ type, data }) => {


        let jsonBody = {
            idDispositivoFisico: data,
            nomeDispositivo: nomeDispositivo,
        }

        await autenticazioneService.abilitaDispositivoFisico(jsonBody).then(response => {
            console.info("DISPOSITIVO ASSOCIATO CORRETTAMENTE");
            salvaIdDispositivo(data);

        }).catch(e => {
            //---------------------------------------------
            console.error("ERRORE");
            setScanned(true);
            //---------------------------------------------
        });
    };

    /* if (hasPermission === null) {
        // return <Text>Requesting for camera permission</Text>;
     }
     if (hasPermission === false) {
       //  return <Text>No access to camera</Text>;
     }*/

    const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    useEffect(() => {
        recuperaNomeDispositivo();



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
            <Text
                style={{
                    textAlign: 'justify',
                    marginHorizontal: 10,
                    marginTop: 10
                }}
            >
                Scansiona il Qr Code mostrato a video per associare il dispositivo "{nomeDispositivo}" al tuo account
            </Text>
            <View
                style={
                    {
                        justifyContent: 'center',
                        flex: 1,
                        paddingHorizontal: 10

                    }
                }
            >





                {hasPermission && <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                />}
                {scanned && <Button color={"#ff0000"} title={'Premi per riprovare'} onPress={() => setScanned(false)} />}


                {!hasPermission && <Button
                    onPress={() => getBarCodeScannerPermissions()}
                    title={"Avvia fotocamera..."}
                    color={"#5e72e4"}
                />}




            </View>
        </SafeAreaProvider>
    )
}

export default ScansionaIdentificativoDispositivo;