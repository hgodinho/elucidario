# Script para converter markdown para google docs

## Autenticação

Para que o script possa acessar a sua conta do google, você precisa criar um arquivo de credenciais. Para isso, siga os passos abaixo:

1. Acesse o [Google Developers Console](https://console.developers.google.com/).
2. Crie um novo projeto.
3. Clique em "Enable and manage APIs".
4. Procure por "Google Drive API" e clique em "Enable".
5. Clique em "OAuth consent screen"
6. Selecione "Internal" e clique em "Create".
7. Preencha os campos obrigatórios e clique em "Save".
8. Clique em "Credentials" no menu lateral.
9. Clique em "Create credentials" e selecione "OAuth client ID".
10. Selecione "Desktop" e clique em "Create".
11. Clique em "Download JSON" e salve o arquivo como `credentials.json` em uma pasta no seu projeto, não se esqueça de adicionar o arquivo ao `.gitignore`.
