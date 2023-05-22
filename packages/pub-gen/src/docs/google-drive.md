---
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# Sincronizando com o Google Drive

Para sincronizar com o google drive é necessário criar um novo app no google cloud console e gerar um arquivo `credentials.json` com as credenciais do app. Para mais informações sobre como criar um app e gerar as credenciais acesse [este link](https://developers.google.com/drive/api/v3/quickstart/nodejs).

É necessário adicionar a Apis do Google Drive no app criado.

O arquivo `credentials.json` deve ser colocado na raiz da pasta `<nome-da-publicacao>`. Certifique-se de que o arquivo não está sendo versionado pelo git.

Depois execute o comando `pnpm authenticate` para autenticar o app com o google ou `pnpm create-doc` autenticar e criar um novo doc.

O arquivo `token.json` será gerado com as credenciais do usuário. Esse arquivo não deve ser versionado pelo git.
