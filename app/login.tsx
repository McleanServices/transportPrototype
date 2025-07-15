import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Keyboard } from 'react-native';
// Add icon support
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    const handleSubmit = async () => {
        router.push('./(app)')
    };

    const handleInputFocus = () => setKeyboardVisible(true);
    const handleInputBlur = () => setKeyboardVisible(false);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={60}
        >
            <View style={styles.splitContainer}>
                {/* Left Info Panel */}
                <View style={styles.leftPanel}>
                    <Text style={styles.leftTitle}>DIRECTION TRANSPORT{"\n"}ET REGLEMENTATIONS</Text>
                    <Text style={styles.leftSubtitle}>Unité Contrôle et Vérification</Text>
                    <View style={styles.featureList}>
                        <View style={styles.featureItem}>
                            <MaterialIcons name="edit-document" size={24} color="#fff" style={styles.featureIcon} />
                            <Text style={styles.featureText}>Saisie des fiches de rotations</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <MaterialIcons name="edit-note" size={24} color="#fff" style={styles.featureIcon} />
                            <Text style={styles.featureText}>Saisie de fiches d'information</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <MaterialCommunityIcons name="alarm-light-outline" size={24} color="#fff" style={styles.featureIcon} />
                            <Text style={styles.featureText}>Signalement d'incidents</Text>
                        </View>
                        <View style={[styles.featureItem, { marginTop: 30 }]}> 
                            <Text style={styles.featureText}>Consultation des fiches enregistrées</Text>
                        </View>
                    </View>
                    <View style={styles.bottomIcons}>
                        <MaterialCommunityIcons name="taxi" size={40} color="#fff" style={{ marginRight: 30 }} />
                        <MaterialCommunityIcons name="bus" size={40} color="#fff" />
                    </View>
                </View>
                {/* Right Login Panel */}
                <View style={styles.rightPanel}>
                  <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {!keyboardVisible && (
                      <Image source={require('../assets/images/logo.png')} style={styles.logoSaintMartin} />
                    )}
                    <View style={styles.loginBox}>
                        <Text style={styles.loginTitle}>Connexion Agent</Text>
                        <Text style={styles.label}>Identifiant</Text>
                        <TextInput
                            placeholder="agent@gmail.com"
                            value={username}
                            onChangeText={setUsername}
                            style={styles.input}
                            autoCapitalize="none"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />
                        <Text style={styles.label}>Mot de passe</Text>
                        <TextInput
                            placeholder="agent!@1209"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />
                        <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
                            <Text style={styles.loginButtonText}>Se Connecter</Text>
                        </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    splitContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
    },
    leftPanel: {
        flex: 1,
        backgroundColor: '#0a6d8a',
        padding: 40,
        justifyContent: 'space-between',
    },
    leftTitle: {
        color: '#fff',
        fontSize: 34,
        fontWeight: '300',
        marginBottom: 30,
        marginTop: 30,
        lineHeight: 40,
        fontFamily: 'Roboto',
    },
    leftSubtitle: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 40,
        fontFamily: 'Roboto',
    },
    featureList: {
        marginTop: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    featureIcon: {
        marginRight: 15,
    },
    featureText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Roboto',
    },
    bottomIcons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 10,
    },
    rightPanel: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    logoSaintMartin: {
        width: 200,
        height: 100,
        resizeMode: 'contain',
        position: 'absolute',
        top: 40,
        alignSelf: 'center',
    },
    loginBox: {
        width: 400,

  
        padding: 40,
       
      

        alignItems: 'center',
    },
    loginTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#000',
        textAlign: 'center',
        fontFamily: 'Roboto',
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 16,
        color: '#888',
        marginBottom: 5,
        marginTop: 15,
        fontFamily: 'Roboto',
    },
    input: {
        width: '100%',
        height: 45,
        borderColor: '#bdbdbd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 5,
        fontSize: 16,
        backgroundColor: '#f5f5f5',
        color: '#000',
        fontFamily: 'Roboto',
    },
    loginButton: {
        backgroundColor: '#0a6d8a',
        paddingVertical: 14,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginTop: 30,
    },
    loginButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        fontFamily: 'Roboto',
    },
});

export default Login;

// TODO: create signup page
// TOTDO: add crpyt to password
