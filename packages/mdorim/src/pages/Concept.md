---
title: Concept
description: Concept
---

# Concept

{{status:warning,"Em desenvolvimento","
    - [ ] Revisão geral
"}}

## Descrição

Utilizado para descrever conceitos como tipos, materiais, linguagens, medidas, entre outros tipos de conceitos. Funciona como um vocabulário controlado. É amplamente baseado no endpoint Concept do Linked Art.

Os Conceitos podem ser definidos como termos únicos ou como agrupamentos ou coleções de termos que compartilham algo em comum, em estruturas de tesauros esses agrupamentos são os termos definidos entre sinais de maior e menor, por exemplo: `<nomes e conceitos relacionados>` no Getty AAT.

Por padrão o MDORIM vem com alguns conceitos pré-definidos baseados inteiramente em ontologias como FOAF e vocabulários do Getty. Os conceitos pré-definidos seguem o mesmo modelo do Concept e são criados automaticamente na instalação do Elucidário.art. Esses conceitos são utilizados para facilitar a integração do modelo com a interface de usuário, servindo também como exemplo de como definir novos conceitos no app.

## Classes

{{json-schema:schemas/Concept.json}}
