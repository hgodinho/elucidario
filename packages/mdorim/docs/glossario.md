# Glossário

[Início](../README.md)

---

- [Glossário](#glossário)
  - [Descrição](#descrição)
  - [Tipos de dados](#tipos-de-dados)
  - [WordPress](#wordpress)
  - [MySQL](#mysql)
  - [WEB](#web)
  - [RFC2119](#rfc2119)

---

## Descrição

Lista de termos utilizados no MDORIM e suas definições.

---

## Tipos de dados

- [`null`](https://developer.wordpress.org/rest-api/extending-the-rest-api/schema/#primitive-types) - valor nulo
- [`boolean`](https://developer.wordpress.org/rest-api/extending-the-rest-api/schema/#primitive-types) - tipo de dado primitivo, representa true/false, 1/0, sim/não
- [`integer`](https://developer.wordpress.org/rest-api/extending-the-rest-api/schema/#primitive-types) - tipo de dado primitivo, representa um número inteiro (1; 2; 13; 1000...)
- [`number`](https://developer.wordpress.org/rest-api/extending-the-rest-api/schema/#primitive-types) - tipo de dado primitivo, representa um número com casas decimais (0.3; 1.5; 3.141592653589793238...)
- [`string`](https://developer.wordpress.org/rest-api/extending-the-rest-api/schema/#primitive-types) - tipo de dado primitivo, representa um fragmento de texto
- [`object`](https://developer.wordpress.org/rest-api/extending-the-rest-api/schema/#primitive-types) - pares de chave e valor
- [`array`](https://developer.wordpress.org/rest-api/extending-the-rest-api/schema/#primitive-types) - lista de valores. Uma outra forma de representar arrays seria utilizando o nome do metadado seguido de colchetes aberto e fechado, por exemplo: [`Denominacao[]`](./metadados.md/#denominacoes), [`Data[]`](./metadados.md#datas), [`Programa[]`](./metadados.md#programas)

---

## WordPress

- [`tax`](https://developer.wordpress.org/reference/functions/register_taxonomy/) Taxonomia WordPress
- [`cpt`](https://developer.wordpress.org/reference/functions/register_post_type/) Custom-post type WordPress

---

## MySQL

- [`PK`](https://dev.mysql.com/doc/refman/8.0/en/partitioning-limitations-partitioning-keys-unique-keys.html) - Primary Key, utilizado para definir a coluna principal em uma tabela MySQL
- [`FK`](https://dev.mysql.com/doc/refman/8.0/en/create-table-foreign-keys.html) - Foreign Key, utilizado para definir a coluna que referencia uma linha em outra tabela MySQL (relational database).

---

## WEB

- http - *Hyper Text Transfer Protocol* - Protocolo para transferências de informação hipermídia entre sistemas
  - https - Versão com criptografia de ponta a ponta, o `s` representa `security`
- URI - *Uniform Resource Identifer* - Identificado único de um recurso utilizado por sistemas web
  - URL - *Uniform Resource Locator* - Extensão da URI que além de identificador única também representa um endereço acessível na web

---

## [RFC2119](https://www.ietf.org/rfc/rfc2119.txt)

As palavras-chave “DEVE“, “NÃO DEVE“, “REQUER“, “DEVERIA“, “NÃO DEVERIA“, “PODERIA“, “NÃO PODERIA“, “RECOMENDÁVEL“, “PODE“, e “OPCIONAL” neste documento devem ser interpretadas como descritas no RFC 2119.

Note que a força destas palavras é modificada pelo nível de exigência do documento no qual são usadas.

1. DEVE – Esta palavra, ou os termos “REQUER” ou “DEVERIA“, significa que a definição é uma exigência absoluta da especificação.

2. NÃO DEVE – Esta frase, ou a frase “NÃO DEVERIA“, significa que a definição é uma proibição absoluta da especificação.

3. PODERIA – Esta palavra, ou o adjetivo “RECOMENDÁVEL” significa que podem existir razões válidas em circunstâncias particulares para ignorar um item específico, mas todas as implicações devem ser compreendidas e cuidadosamente ponderadas antes de escolher um curso diferente.

4. NÃO PODERIA – Esta frase, ou a frase “NÃO RECOMENDÁVEL“, significa que podem existir razões validas em circunstâncias particulares em que um comportamento é aceitável ou mesmo útil, mas todas as implicações devem ser compreendidas e cuidadosamente ponderadas antes de implementar qualquer comportamento descrito com essa rotulagem.

5. PODE – Esta palavra, ou o adjetivo “OPCIONAL“, significa que um item é realmente opcional. Um fornecedor pode optar por incluir o item porque um mercado em particular o requer ou porque o fornecedor sente que isso melhora o produto enquanto outro fornecedor pode omitir o mesmo item. Uma implementação que não incluir esta opção em particular DEVE estar preparada para interoperar com outra aplicação que incluir a opção, embora possivelmente com funcionalidade reduzida. No mesmo sentido, uma implementação que inclui a opção em particular DEVE estar preparada para interoperar com outra implementação que não inclui a opção (exceto, é claro, para funcionalidade que a opção fornece).

6. Orientação no uso desses Imperativos

Imperativos do tipo definido no presente memorando devem ser utilizado com cuidado e moderação. Em particular, eles DEVEM ser usados somente onde são realmente exigidos para interoperação ou para limitar um comportamento potencialmente danoso (pro exemplo, limitar retransmissões). Por exemplo, eles não devem ser usados para tentar impor um método em particular quando o método não é requerido para interoperabilidade.

7. Considerações de Segurança

Estes termos são frequentemente usados para especificar o comportamento com implicações de segurança. Os efeitos sobre a segurança de não implementar um DEVE ou PODERIA, ou fazer algo que a especificação diz NÃO DEVERIA ou NÃO PODERIA ser feito pode ser muito sutil. Autores de documentação devem dedicar tempo para elaborar as implicações de segurança de não seguir recomendações ou requisitos visto que a maioria dos implementadores não tiveram o benefício da experiência e da discussão que produziu a especificação.

> Fonte
> Tradução retirada de: <http://rfc.pt.webiwg.org/rfc2119>
> Documento oficial em inglês: <https://www.ietf.org/rfc/rfc2119.txt>

---
