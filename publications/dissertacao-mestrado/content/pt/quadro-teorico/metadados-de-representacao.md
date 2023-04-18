# 4.1.1. Metadados de representação e descrição de itens museológicos

Neste capítulo analisaremos os padrões de metadados desenvolvidos por Silva (2020) em sua tese de doutorado: “Esquema de metadados para descrição de obras de arte em museus brasileiros: uma proposta”, Object ID (1997) desenvolvido pelo Getty Information Institute e o Linked Art (2021), padrão de metadados desenvolvido pelo Grupo de Trabalho do CIDOC-ICOM Linked Art, formado por Robert Sanderson, Athanasios Velios e Emmanuelle Delmas-Glass. Analisaremos também os procedimentos de gestão de coleções Standard Procedures for Collections Recording Used in Museums - SPECTRUM (2007), mantido pelo Collections Trust, organização sediada no Reino Unido com foco na criação de padrões internacionais de documentação museológica. A partir da análise dos padrões, iremos propor o conjunto de metadados básico para gestão e divulgação de coleções que usaremos no Elucidário.art.

## 4.1.1.1 - Esquema de metadados para descrição de obras de arte em museus brasileiros: uma proposta. (SILVA, 2020)

Silva (2020), para o desenvolvimento de seu esquema de metadados, utiliza como referência os conjunto de metadados do Categories for the Description of Works of Art (CDWA) mantido pelo Getty Vocabulary Program (GVP), nas Categorias de Informação do Comitê Internacional de Documentação (CIDOC-ICOM) e nos grupos de informações da norma SPECTRUM. A partir daí, Silva apresenta 9 grupos de informações e 25 unidades de informação para descrição e representação de obras de arte, considerados mínimos pela autora, para os museus brasileiros. Na fig.1, representação em Unified Modeling Language (UML) do esquema,  vemos os 9 grupos de informações na linha central e no “OBJETO” localizado acima de todos—e por onde todos os outros grupos de informações convergem—, os dois elementos de baixo são as subunidades de informação da unidade de informação “CRIAÇÃO”, os grupos de informações listados no centro são: “CLASSIFICACAO”, “TITULO”, “MEDIDA”, “CRIACAO”, “MATERIAL_TECNICA”, “LOCALIZACAO”, “ASSUNTO” E “REFERENCIA”. Cada grupo de informação possui um conjunto de unidades de informações, à esquerda de cada grupo está listado o tipo de informação da unidade: string para texto, number para números, e array para listas. As conexões com dois traços cruzados ( || ) são referentes a presença obrigatória de ao menos um registro, as com um traço e uma chave ( |{ ) representam uma ou mais entradas.

{{mermaid:SILVA-Camila-2020.md}}

## 4.1.1.2 - Object ID (1997)

O Object ID é um padrão de documentação para descrever coleções de itens arqueológicos, culturais e artísticos (OBJECT ID, 1997). Foi criado com o objetivo de identificar o patrimônio cultural para evitar roubos e contrabandos e, por isso, é promovido por diversas agências governamentais como FBI, Scotland Yard, Interpol, e organizações como World Customs Organization (WCO) e The United Nations Educational, Scientific and Cultural Organization (UNESCO) (OBJECT ID, 1997).

O Object ID define 9 (nove) categorias de informações e 4 (quatro) passos para a documentação. As categorias são:

1. Type of object - qual o tipo do objeto? (pintura, gravura, escultura, etc);
2. Materials and techniques - de que materiais o objeto é feito? Como ele foi feito?
3. Measurement - qual o tamanho e/ou o peso do objeto?
4. Inscriptions and markings - existem marcas de identificação, números ou inscrições no objeto?
5. Distinguishing features - alguma característica física especial que ajude a identificar? (danos, reparos, defeitos de fabricação, etc);
6. Title - o objeto tem um título pelo qual é conhecido?
7. Subject - o que está sendo representado no objeto?
8. Date or period - quando o objeto foi feito?
9. Maker - quem produziu o objeto?

Os quatro passos do Object ID para a documentação são:

1. Tirar fotografias do objeto;
2. Identificar as 9 categorias de informações acima;
3. Escrever uma descrição, incluindo informações adicionais; e
4. Armazenar a documentação em local seguro.

Na reunião do Grupo de Trabalho - DocumentandO Museu IberoamericaNO (DOMINO) do CIDOC-ICOM realizada no dia 22 de maio de 2022, como parte das atividades da Conferência CIDOC Tallinn 2021, foi defendido pelos integrantes que o Object ID seja o padrão mínimo adotado por um museu para sua documentação, devido a sua simplicidade e reconhecimento por autoridades mundiais. O DOMINO tem como objetivo disseminar o trabalho do CIDOC para as comunidades dos idiomas português e espanhol, e servir como uma ponte linguística para troca de conhecimento especializado (DOMINO, 2018).

## 4.1.1.3 - Linked Art (2021)

O padrão de metadados Linked Art do Grupo de Trabalho Linked Art do CIDOC-ICOM, foi desenvolvido com objetivo de ser utilizado por aplicações para descrever o patrimônio cultural, com foco em obras de arte e atividades de museu (LINKED ART, 2018). O modelo utiliza: o CIDOC Conceptual Reference Model (CRM) como base, dado seu paradigma baseado em eventos; os vocabulários do Getty como fontes principais de identificação de terminologia em domínio específico; e seu formato de expressão é o JSON-LD, utilizado como uma das tecnologias da Web Semântica, temas discutidos mais à frente.

O modelo expõe uma Application Programming Interface (API) com 10 (dez) endpoints ou entidades:

1. _Digital Objects_ - imagens, serviços e outros objetos digitais;
2. _Events_ - eventos e outras atividades não específicas que estão relacionadas, mas não são parte de outras entidades;
3. _Groups_ - grupos e organizações;
4. _People_ - pessoas;
5. _Physical Objects_ - coisas físicas, incluindo obras de arte, edifícios ou outras arquiteturas, livros, partes de objetos, entre outros;
6. _Places_ - lugares geográficos;
7. _Provenance Activities_ - os vários eventos que ocorreram durante a história do objeto;
8. _Sets_ - conjuntos, incluindo Collections e conjuntos de objetos usados em exposições;
9. _Textual Works_ - textos que merecem descrição como entidades distintas, como o conteúdo de um livro ou artigo; e
10. _Visual Works_ - imagens que merecem descrição como entidades distintas, como as imagens de uma pintura ou desenho.

Cada endpoint contém uma série de propriedades para sua descrição e estabelecimento de relações entre as entidades.

## 4.1.1.4 - _Standard Procedures for Collections Recording Used in Museums_ (SPECTRUM)

O SPECTRUM define 21 (vinte e um) procedimentos para a gestão museológica, sendo 9 (nove) deles considerados principais e mínimos para que um museu do Reino Unido seja acreditado à Collections Trust, organização britânica com atividade internacional que tem como objetivo definir padrões de documentação para museus ou organizações que possuam acervos museológicos. Os procedimentos principais são aqueles que a maioria dos museus vão utilizar na maioria do tempo, e consistem em:

**Entrada de objetos**
:   Define o procedimento de entrada de qualquer objeto no acervo do museu, incluindo aquisição, doação, empréstimos, etc.

**Aquisição e adesão**
:   Define o procedimento de adesão do objeto à coleção do museu. Representa a intenção do corpo governante do museu de adquirir o objeto e torná-lo parte do acervo.

**Localização e controle de movimentação**
:   Define o procedimento de controle de movimentação de objetos do museu, incluindo empréstimos, saídas temporárias, recolhimento para restauração, mudança de posição em exposições temporárias, etc.

**Inventário**
:   Define o procedimento de inventário do acervo do museu, incluindo a contagem, a identificação, classificação, descrição, documentação, avaliação, conservação, restauração, preservação, manutenção, segurança, proteção, etc.

**Catalogação**
:   Define o procedimento de catalogação, atividade rotineira de um gesto de coleções, que consiste em registrar informações sobre um objeto, incluindo sua identificação, descrição, localização, história, etc.

**Saída do objeto**
:   Define o procedimento de saída de objetos do acervo do museu, incluindo empréstimos, saídas temporárias, doações, etc.

**Entrada de empréstimos** (objetos de outra organização ou pessoa que são emprestados temporariamente para o museu em questão)
:   Define o procedimento de entrada de empréstimos, incluindo a documentação, a identificação, a classificação, a descrição, a avaliação, a conservação, a restauração, a preservação, a manutenção, a segurança, a proteção, etc.

**Saída de empréstimos** (objetos do museu que são emprestados temporariamente para fora)
:   Define o procedimento de saída de empréstimos, incluindo a documentação, a identificação, a classificação, a descrição, a avaliação, a conservação, a restauração, a preservação, a manutenção, a segurança, a proteção, etc.

**Planejamento da documentação**
:   Define o procedimento de planejamento de projetos de documentação, consiste no planejamento de melhorias, atualizações, e avaliar formas de monitorar o progresso da documentação.

Além destes, o SPECTRUM também define os seguintes procedimentos:

**Uso de coleções**
:   Define o procedimento adotado pelo museu para o uso de suas coleções, incluindo imagens e outros objetos digitais, exposições, publicações, etc.

**Verificação de condição e avaliação técnica**
:  Define o procedimento de verificação de condição e avaliação técnica de objetos do acervo do museu, como é um procedimento secundário, se torna uma consequência de outros procedimentos.

**Conservação e restauração**
:   Define o procedimento de conservação e restauração de objetos do acervo do museu, como pequenos reparos, limpeza, etc.

**Valoração**
:  Define o procedimento de valoração de objetos do acervo do museu, incluindo a avaliação de objetos para fins de seguros, doações, empréstimos, etc.

**Seguro e indenizações**
