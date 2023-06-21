### 9.1.2 @elucidario/pkg-mdorim

O Modelo de Dados para Organização e Representação da Informação Museológica (MDORIM), modelo de dados utilizado pelo Elucidário.art, utiliza como base principal o Linked Art, modelo de dados para aplicações criada por um grupo de trabalho de mesmo nome no CIDOC-ICOM.

é inteiramente baseado no modelo de dados para aplicações Linked Art [@linked-art2021.1], porém apresenta algumas modificações para o contexto de uso do WordPress e adiciona novas classes e propriedades como histórico de edições, usuários e capacidades de usuários.

Para a definição do modelo utilizaremos JSON-Schema, a apresentação também será realizada em Diagrama de Entidade e Relacionamento e tabelas para melhor compreensão de suas classes e propriedades.

Descrevemos o modelo a seguir.

### Classes

Para a definição das classes do MDORIM herdaremos os endpoints do Linked Art e suas propriedades, mas as definiremos de duas formas: para armazenamento e para distribuição. As classes para armazenamento são utilizadas para armazenar os dados no banco de dados e são adaptadas ao contexto de uso do WordPress, ou seja em Banco de Dados Relacional, em que diferentemente do Linked Art que referenciamos outra entidade por sua URI, no armazenamento referenciamos pela ID única que define a linha na tabela do banco de dados.
