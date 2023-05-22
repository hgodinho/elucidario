---
toc_min_heading_level: 2
toc_max_heading_level: 5
---

# Versionamento

O pub-gen utiliza o [versionamento semântico](https://semver.org/lang/pt-BR/) para gerenciar as versões das publicações. O versionamento semântico é um padrão de versionamento que utiliza três números para definir a versão de um software, neste caso, da publicação. Os números são definidos da seguinte forma:

> `MAJOR`.`MINOR`.`PATCH`

Pode-se incluir também um número de versão pré-lançamento. Exemplo:

> `1.0.0-alpha.1`

## Versionamento no pub-gen

O pub-gen utiliza o número de versão da publicação para gerar o nome da pasta no diretório `<nome-da-publicacao>/files`, desta forma, é possível manter várias versões da publicação no mesmo diretório.

## Atualizando a versão da publicação

Para realizar o update de versão da publicação é necessário rodar o comando:

```bash
pub-gen version -p="<nome-da-publicacao>"
```

Este comando irá realizar uma série de perguntas na cli que serão utilizadas para gerar a nova versão da publicação.

### Orientações para atualização de versão

- **MAJOR**: Utilize quando a publicação estiver pronta, ou seja, quando ela estiver pronta para ser publicada.
- **MINOR**: Utilize quando a publicação estiver em desenvolvimento, ou seja, quando você estiver trabalhando na publicação e progresso consistir na adição ou remoção de novos conteúdos, como adição de novas seções, remoção de seções, adição de novas imagens, remoção de imagens, etc.
- **PATCH**: Utilize quando a publicação estiver em desenvolvimento e o progresso consistir na correção de erros, como correção de erros de digitação, correção de erros de ortografia, correção de erros de formatação, etc.
- Utilize o **PRERELEASE** quando a publicação estiver quase pronta, geralmente na fase de revisão, em que a publicação será revisada por outras pessoas antes de ser publicada.
  - alpha: Utilize quando a publicação estiver em revisão e o progresso consistir na adição ou remoção de novos conteúdos.
  - beta: Utilize quando a publicação estiver em revisão e o progresso consistir na correção de erros.
  - rc: Utilize quando a publicação estiver em revisão e o progresso consistir na correção de erros críticos.
