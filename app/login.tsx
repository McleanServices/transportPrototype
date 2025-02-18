import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useAuth } from '../context/auth';
import { router } from 'expo-router';
import { useStorageState } from '../context/useStorageState';

const Login = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useAuth();
    const [storedName, setStoredName] = useStorageState('username');
    
    const handleSubmit = () => {
        if ((name === 'ty' && password === '123') || (name === 'alex' && password === '456')) {
            signIn('dummyToken', { id: 1, role: 'user' });
            setStoredName(name); // Save the name to storage
            console.log('Login successful');
            router.replace('./(app)');
        } else {
            console.log('Invalid credentials');
        }
        console.log('Name:', name);
        console.log('Password:', password);
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text>Name:</Text>
                <TextInput
                    value={name}
                    onChangeText={(text) => setName(text)}
                    style={styles.input}
                />
            </View>
            <View style={styles.form}>
                <Text>Password:</Text>
                <TextInput
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    style={styles.input}
                />
            </View>
            <Button title="Login" onPress={handleSubmit} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    form: {
        width: '100%',
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 4,
    },
});

export default Login;
