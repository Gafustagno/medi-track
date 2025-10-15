# Projeto

React Native app desenvolvido com [Expo](https://expo.dev).
Autenticação e banco de dados via Firebase (Auth + Firestore).

[`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

O desenvolvimento inicia na pasta **app**. A navegação dos arquivos é feita via Expo Router [file-based routing](https://docs.expo.dev/router/introduction).

## Instalação inicial

1. Instalar dependências (node modules)

   ```bash
   npm install
   ```
   Todas as dependências usadas no projeto estão no arquivo package.json

2. Rodar aplicação

   ```bash
   npx expo start
   ```

## Emuladores

Para este projeto, usamos Android Studio

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go) - sandbox

## Iniciando uma aplicação nova

 Resetar para um projeto novo

```bash
npm run reset-project
```
Isso cria um diretório chamado **app-example** e cria uma pasta nova chamada **app** para que você inicie o projeto.

## Autenticação

O arquivo FirebaseConfig com a API KEY precisa ser feito do zero porque está no arquivo .gitignore.

## Pastas e detalhamentos

app /> - diretório com todas as telas e a navegação.
components /> - diretório com todos os componentes reutilizáveis da aplicação
constant /> - diretório com valores estáticos (cores, tipos de medicamentos e textos)
service /> - diretório com utilitário de conversão de data/hora, armazenamento do async storage e configurações do firebase


## Deploy

Criado arquivo .apk

# Icones
@expo/vector-icons@15.0.2
Vector Icons and Stickers - PNG, SVG, EPS, PSD e CSS
scrap de imagens e sons do jogo Project Zomboid (Steam)


## Documentação

- [Expo documentation](https://docs.expo.dev/) [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/)

## Comunidade Expo Dev

- [Expo on GitHub](https://github.com/expo/expo)
- [Discord community](https://chat.expo.dev)
