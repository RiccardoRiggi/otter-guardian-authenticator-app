import { Text } from '@rneui/themed';
import { Button } from '@rneui/base';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Stack, useRouter } from "expo-router";
import { useState } from 'react';
import * as React from "react";
import { Header, Icon } from "@rneui/base";
import * as SecureStore from 'expo-secure-store';
import { Input } from '@rneui/themed';
import { View } from 'react-native';

const InserisciNomeDispositivoPage = () => {

    const router = useRouter()

    const [nomeDispositivo, setNomeDispositivo] = useState("");
    const [erroreNomeDispositivo, setErroreNomeDispositivo] = useState("");

    const aggiornaNomeDispositivo = (nuovoValore) => {
        setNomeDispositivo(nuovoValore);
        setErroreNomeDispositivo("");
    }

    const salvaNomeDispositivo = async () => {
        if (nomeDispositivo !== "") {
            await SecureStore.setItemAsync("nomeDispositivo", nomeDispositivo);
            router.push('/pages/scansiona-identificativo-dispositivo');
        } else {
            setErroreNomeDispositivo("Il nome del dispositivo è richiesto");
        }
    }

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
                        justifyContent: 'center',
                        flex: 1,
                        paddingHorizontal: 10

                    }
                }
            >


                <Input

                    placeholder='Inserisci il nome del dispositivo...'
                    errorMessage={erroreNomeDispositivo}
                    onChange={value => aggiornaNomeDispositivo(value.nativeEvent.text)}
                    value={nomeDispositivo}

                />


                <Button
                    onPress={() => salvaNomeDispositivo()}
                    title={"Avanti"}
                    color={"#5e72e4"}


                />

            </View>
        </SafeAreaProvider>
    )
}

export default InserisciNomeDispositivoPage;