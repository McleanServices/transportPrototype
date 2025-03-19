import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useAuth } from '../context/auth';
import { router } from 'expo-router';
import { useStorageState } from '../context/useStorageState';
import { DatabaseService } from './model/authService';
import type { TransportFormData } from './model/authService';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useAuth();
    const [storedPrenom, setStoredPrenom] = useStorageState('prenom');
    const [storedNom, setStoredNom] = useStorageState('nom');
    const [storedRole, setStoredRole] = useStorageState('role');
    const [users, setUsers] = useState<TransportFormData[]>([]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const dbService = new DatabaseService();
                await dbService.initDatabase(); // Initialize the database first
                const allUsers = await dbService.getallUsers();
                setUsers(allUsers);
                // console.log('Loaded users:', allUsers);
            } catch (error) {
                console.error('Error loading users:', error);
            }
        };

        loadUsers();
    }, []);

    const handleSubmit = async () => {
        const validUser = users.find(
            user => user.username === username && user.password === password
        );

        if (validUser && validUser.user_id) {
            await signIn('dummyToken', { id: validUser.user_id, role: validUser.role });
            setStoredPrenom(validUser.prenom);
            setStoredNom(validUser.nom);
            setStoredRole(validUser.role);
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
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
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

// TODO: create signup page
// TOTDO: add crpyt to password
