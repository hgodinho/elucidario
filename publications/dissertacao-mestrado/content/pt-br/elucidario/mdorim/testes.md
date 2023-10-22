**Testes**

Os testes do Mdorim foram definidos utilizando o método `validate` do objeto `Schemas` definido no pacote.

Para cada schema definido no pacote foi definido dois testes unitários, um que valida um objeto JSON com o JSON-Schema correspondente, e outro que espera um erro quando o objeto JSON não é válido.

**{{count:figures;legend=Exemplo de testes utilizando o método validate}}**

{{code:elucidario/mdorim/teste-exemplo.php}}

Fonte: Elaborado pelo autor.
