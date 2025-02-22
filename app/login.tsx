import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useAuth } from '../context/auth';
import { router } from 'expo-router';
import { useStorageState } from '../context/useStorageState';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useAuth();
    const [storedEmail, setStoredEmail] = useStorageState('email');
    
    useEffect(() => {
        // Set fake user email and password for testing
        setEmail('test');
        setPassword('123');
    }, []);

    const handleSubmit = () => {
        if ((email === 'test' && password === '123') || (email === 'user' && password === '456')) {
            signIn('dummyToken', { id: 1, role: 'user' });
            setStoredEmail(email);
            router.replace('./(app)');
        } else {
            console.log('Invalid credentials');
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                />
            </View>
            <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5fcff',
        padding: 20,
    },
    logo: {
        width: 140,
        height: 100,
        marginBottom: 20,
    },
    inputContainer: {
        width: '100%',
        backgroundColor: '#e3f2fd',
        borderRadius: 25,
        padding: 10,
        marginBottom: 15,
    },
    input: {
        height: 40,
        color: '#000',
        paddingHorizontal: 10,
    },
    loginButton: {
        backgroundColor: '#64b5f6',
        padding: 15,
        borderRadius: 25,
        width: '100%',
        alignItems: 'center',
        marginBottom: 10,
    },
    loginText: {
        color: 'white',
        fontWeight: 'bold',
    },
    forgotPassword: {
        color: '#64b5f6',
        marginBottom: 20,
    },
    footerText: {
        textAlign: 'center',
        color: '#777',
        marginTop: 20,
    },
    linkText: {
        color: '#42a5f5',
        fontWeight: 'bold',
    },
});

export default Login;
