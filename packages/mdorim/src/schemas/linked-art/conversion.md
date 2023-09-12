# Procedimentos para utilização do Linked Art

1.  Copiar json-schemas do github do [linked art](https://github.com/linked-art/linked.art/tree/master/docs/api/1.0/schema) para o diretório `schemas/linked-art`;
2.  Alterar todas as IDs para `https://elucidario.art/mdorim/schemas/linked-art/<nome-arquivo>.json`;
3.  Alterar todos os `$schema` para `http://json-schema.org/draft-07/schema`;
4.  Acrescentar `<linked-art>` em todos os paths de `$ref`, exemplo:

    ```json
    {
        "$ref": "<linked-art>/core.json#/definitions/Place"
    }
    ```

5.  Rodar o comando `build|dev` no `pnpm`.
