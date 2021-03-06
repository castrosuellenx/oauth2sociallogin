import React, {useEffect, useState} from 'react';
import {View, Button, Text, StyleSheet, Image} from 'react-native';
import * as AuthSession from 'expo-auth-session';
import axios from 'axios';

// const {CLIENT_ID} = process.env;
// const {REDIRECT_URI} = process.env;

type AuthResponse = {
  type: string;
  params: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    token_type: string;
  };
};

type User = {
  name: string;
  email: string;
  given_name: string;
  family_name: string;
  locale: string;
  picture: string;
};

const App: React.FC = () => {
  const [user, setUser] = useState({} as User);
  const [token, setToken] = useState<string>('');

  const handleSignIn = async () => {
    const CLIENT_ID =
      '687620763558-9bvu4l8qdb8aoe29sb1k4i17sp8kjqem.apps.googleusercontent.com';
    const REDIRECT_URI =
      'https://auth.expo.io/@castrosuellenx/oauth2sociallogin';
    const RESPONSE_TYPE = 'token';
    const SCOPE = encodeURI('profile email');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

    const {type, params} = (await AuthSession.startAsync({
      authUrl,
    })) as AuthResponse;

    if (type === 'success') {
      setToken(params.access_token);
    }
  };

  useEffect(() => {
    if (token) {
      const loadUser = async () => {
        const response = await axios.get(
          `https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${token}`
        );

        setUser(response.data);
      };

      loadUser();
    }
  }, [token]);

  const handleLogout = () => {
    setUser({} as User);
    setToken('');
  };

  return (
    <View style={styles.container}>
      {!user.name ? (
        <Button title="Google Login" onPress={handleSignIn} />
      ) : (
        <>
          <View style={styles.content}>
            <Text style={styles.title}>Profile</Text>

            <Image
              source={{
                uri: user.picture,
              }}
              style={styles.image}
            />

            <Text
              style={[styles.subtitle, {fontWeight: 'bold', marginBottom: 10}]}
            >
              {user.name}
            </Text>

            <Text style={styles.subtitle}>Name</Text>
            <Text style={styles.info}>{user.given_name}</Text>

            <Text style={styles.subtitle}>Sobrenome</Text>
            <Text style={styles.info}>{user.family_name}</Text>

            <Text style={styles.subtitle}>Email</Text>
            <Text style={styles.info}>{user.email}</Text>

            <Text style={styles.subtitle}>Localiza????o</Text>
            <Text style={styles.info}>{user.locale}</Text>
          </View>

          <Button title="Logout" onPress={handleLogout} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 40,
    marginVertical: 30,
    paddingVertical: 30,
    paddingHorizontal: 50,
    backgroundColor: 'peru',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 25,
    marginBottom: 15,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  info: {
    fontSize: 14,
    marginBottom: 20,
  },
});

export default App;
