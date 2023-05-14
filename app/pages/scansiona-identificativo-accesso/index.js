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


const ScansionaIdentificativoAccesso = () => {

    const router = useRouter();


    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    const handleBarCodeScanned = async ({ type, data }) => {

        const idDispositivoFisico = await SecureStore.getItemAsync("idDispositivoFisico");



        let jsonBody = {
            idQrCode: data,
            idDispositivoFisico: idDispositivoFisico,
        }

        await autenticazioneService.autorizzaQrCode(jsonBody).then(response => {
            router.push('/')

        }).catch(e => {
            console.error(e);
        });

    };

    const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    useEffect(() => {



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
                    textAlign: 'center',
                    marginHorizontal: 10,
                    marginTop: 10,
                    fontSize: 20
                }}
            >
                Scansiona il Qr Code mostrato a video per effettuare l'autenticazione
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

export default ScansionaIdentificativoAccesso;