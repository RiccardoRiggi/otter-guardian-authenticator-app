import { Text } from '@rneui/themed';
import { Button } from '@rneui/base';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Stack, useRouter } from "expo-router";
import * as React from "react";
import { Header, Icon } from "@rneui/base";

import * as SecureStore from 'expo-secure-store';
import { View } from 'react-native';





const EliminaDatiPage = () => {

    const router = useRouter()

    const eliminaDatiDalDispositivo = async () => {
        await SecureStore.deleteItemAsync("nomeDispositivo");
        await SecureStore.deleteItemAsync("idDispositivoFisico");
        router.push('/pages/inserisci-nome-dispositivo');
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

                <Text
                    style={{
                        textAlign: 'justify',
                        paddingBottom: 10,
                        fontSize: 20
                    }}
                >
                    Proseguendo con l'eliminazione dei dati dal dispositivo non potrai più effettuare l'accesso tramite i metodi che richiedono la verifica del secondo fattore attraverso l'Authenticator. {"\n"}{"\n"}
                    Sei sicuro di voler eliminare definitivamente i dati dal dispositivo? {"\n"}{"\n"}
                    L'operazione non può essere annullata!
                </Text>

                <Button
                    onPress={() => eliminaDatiDalDispositivo()}
                    title={"Elimina i dati dal dispositivo"}
                    color={"#f5365c"}
                />

            </View>
        </SafeAreaProvider>
    )
}

export default EliminaDatiPage;