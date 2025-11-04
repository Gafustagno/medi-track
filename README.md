# Projeto

React Native app desenvolvido com [Expo](https://expo.dev).
Autenticação e banco de dados via Firebase (Auth + Firestore).
SDK53

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

O arquivo FirebaseConfig com a API KEY está no gitignore e precisa ser refeito. Alternativa: ambiente local .env

## Pastas e detalhamentos

app /> - diretório com todas as telas e a navegação.
components /> - diretório com todos os componentes reutilizáveis da aplicação
constant /> - diretório com valores estáticos (cores, tipos de medicamentos e textos)
service /> - diretório com utilitário de conversão de data/hora, armazenamento do async storage e configurações do firebase
android /> - diretório Android nativo para compilação do APK


## Build + Deploy - Apenas para Emular no Android Studio

Criar arquivo local.properties para apontar o endereço do SDK (explicação em local.properties.exemplo)
npm ci (instala as dependências de package-lock.json)
npx expo run:android (com Android Studio para emular)
npx expo start (para emular no Android Studio se já tiver feito a build anterior do npx expo run:android )

## Build + Deploy + APK - Via EAS Build
npm ci (instala as dependências de package-lock.json)
npx expo prebuild --clean --no-install (apaga a pasta android mas não altera as dependências criadas)
git add android / git commit (commit da pasta NOVA do android)
eas build -p android --profile preview --clear-cache (build com eas na nuvem)
Criado arquivo .apk (conta expo)

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
