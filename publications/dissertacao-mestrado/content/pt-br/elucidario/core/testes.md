**Testes**

Os testes do pacote `@elucidario/pkg-core` foram criados utilizando a biblioteca Pest [@maduro2021] e podem executados com os comandos `pnpm test` ou `composer run-script test` na raíz do projeto.

Os testes estão organizados em dois diretórios diferentes dentro do repositório:

- `tests/Pest/Unit` - Testes unitários, que testam funções do pacote isoladamente e sem dependências externas;
- `tests/Pest/Integration` - Testam a integração entre os pacotes `@elucidario/pkg-core`, `@elucidario/pkg-mdorim`, `@elucidario/pkg-design-system` e outras dependências externas.

Além dos testes executáveis sem a necessidade de instanciar um WordPres, este pacote está diretamente relacionado ao pacote `@elucidario/app-dev-env` no diretório `apps` do repositório, que instancia um WordPress com o plugin Elucidário.art instalado e ativo, e que pode ser utilizado para testes de sistema e usabilidade.
