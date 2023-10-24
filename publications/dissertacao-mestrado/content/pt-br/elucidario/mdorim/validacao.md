A validação é feita por meio de um objeto PHP chamado `Schemas` que contêm um método `validate` que recebe três parâmetros: o primeiro é o nome do arquivo JSON-Schema que será utilizado para validação, o segundo é o objeto JSON que será validado, e a terceira é um array opcional de configurações extras. O método `validate` retorna `true` quando os dados recebidos são válidos ou uma `Exception` que esclarece o motivo da falha na validação. Por baixo dos panos, o método `validate` utiliza a biblioteca Opis JsonSchema [@opis2022] para realizar a validação do objeto JSON com o JSON-Schema correspondente.

```php
<?php

$mdorim = \Mdorim\Core::getInstance();
$schema = $core->schemas;
$result = $schema->validate( '<nome do esquema>', '<objeto json>', '<configurações>' );
```
