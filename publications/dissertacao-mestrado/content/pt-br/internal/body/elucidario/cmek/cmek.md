## 6.3 O Elucidário.art na Casa Museu Ema Klabin

A implementação do Elucidário.art na Casa Museu Ema Klabin se deu, em um primeiro momento, em caráter de teste. Foram selecionados 20 itens da base de dados Museológica do museu com o critério de terem passado por processo de digitalização recentemente e que representasse diferentes tipos de objetos e níveis de documentação na coleção. Apresentamos a seguir um recorte da BD para demonstração dos itens selecionados:

{{table:internal/body/elucidario/cmek/selecionadas-museologico.json}}

Outros campos do museológico foram omitidos neste quadro por questão de espaço, mas abordaremos casos específicos, como o metadado DescriçãoConservação que, em alguns casos, possui diferentes tipos de informação e que não seguem nenhum padrão estipulado. Por exemplo, o item M-1568 - Traje Feminino (Cheongsam), possui a seguinte descrição de conservação:

> set/2017: gola descosturando; desgaste generalizado dos fios nas mangas; manchas.
>
> 2021: Peça restaurada - Júlio Moraes
>
> 16/11/21: Peça Higienizada por Ivonete Pina e Sophia Donadelli. Foi aplicado vaporizador com água mineral e foram removidas sujidades com trincha, pinça e fita crepe.

Enquanto o item M-0303 - Figura de Bom Pastor possui a seguinte descrição de conservação:

> 26/mar/2014: Cabeça apresenta trincas de ressecamento, abrasão no nariz e escurecimento na policromia; resíduo de adesivo entre figura e coluna na face posterior; abrasão de contato e perdas de policromia. A base em madeira octogonal apresenta perdas de policromia e perda de suporte e trinca, parte aparentemente colada, na face anterior à direita. Ressecada, escurecimento e sujidade. Instável; leve espaço entre marfim e madeira. (Parecer de Cristina Lara Corrêa - Rede de Museus de Arte Sacra - Sisem SP).
>
> 03/jul/97: coluna com detalhes pouco legíveis; duas ovelhas da coluna com patas faltantes; ovelha lascada na cabeça; arremate faltante na parte anterior da base; pedestal lascado no fundo externo com muitas perdas na policromia e na madeira; figura instável, com movimento.
>
> 12/04/2021 - higienização mecânica

De um único campo conseguimos extrair diferentes tipos de informação, como a data do procedimento, o nome do profissional responsável e, em alguns casos, o procedimento detalhado.

Outro campo que apresenta diferentes tipos de informação é o campo Observações, que é utilizado para registrar informações diversas sem uma estruturação definida, como no caso da M-0117 - Caixa decorativa, que possui registrado o nome anterior, procedência, parecer técnico e exposições:

> Nome anterior ID/91: cofre relicário; Datação ID 91: séc. XIII. Ver documentação de compra da peça.
>
> Adquirido como: "coffret em prata vermeille, com pedras preciosas e medalhões de cristal, de origem austro-húngara, do final do século XVII" (A-0470)
>
> O Prof. Dr. Rainer Kahsnitz afirma: "...pelo seu conjunto de formato e esmalte azul, similar aos cofres relicários de Limoges do Séc. XIII e XIV. (...) Cofres deste tipo da Idade Média normalmente não apresentam pequenas colunas ou placas de cristal. O excesso híbrido das formas de ornamento indica que se trata de obra histórica do Século XIX." (PFC, 2001).
>
> Participou da exposição ReviraVolta - 24/09 a 16/12/2022

Ou no caso do item M-0166 - Sacra de Parede, que possui registrado as inscrições em latim na peça, juntamente com sua tradução e um comentário sobre a inscrição:

> Sobre a inscrição:
> MARCI TVLLI CICERONIS - Marco Túlio Cícero - De Divinatione / Da Adivinhação
>
> Trecho original:
> *Negat enim sine furore Democritus quemquam poetam magnum esse posse, (quod idem dicit Plato.)*
>
> Tradução: Demócrito nega que tivesse havido qualquer grande poeta isento de loucura; (o mesmo afirma Platão).
>
> "Que a genialidade e a loucura possuem um lado pelo qual se encontram, e até se confundem, já foi observado com freqüência, e mesmo o entusiasmo artístico já foi denominado uma espécie de loucura: amabilis insania lhe chamou Horácio (Odisséia). Platão o exprimiu, no mito da caverna abordado mais acima (De Republica, 7), dizendo: Aqueles que, no exterior da caverna, enxergaram a verdadeira luz do sol e os objetos verdadeiramente existentes (as idéias), não conseguem mais enxergar na caverna, pois seus olhos se desacostumaram da escuridão, não conseguem mais reconhecer bem as silhuetas, e por seus enganos são motivos de zombaria por parte dos outros, que nunca se afastaram desta caverna e destas silhuetas. Também no Fedro ele afirma que sem uma certa loucura não existiria nenhum legítimo poeta, que qualquer um que conhece as idéias eternas nas coisas transitórias apareceria como louco. Também Cícero declara: Negat enim, sine furore, Democritus, quemquam poëtam magnum esse posse; quod idem dicit Plato (De Divinatione, 1, 37).( Demócrito nega que tivesse havido qualquer grande poeta isento de loucura; o mesmo afirma Platão) E finalmente diz Alexander Pope: Great wits to madness sure are near allied,And thin partitions do their bounds divide.( O grande espírito à loucura por certo é bem aliado, e estreitas divisões mantêm suas áreas em separado). Autor: Arthur Schopenhauer Tradução: Wolfgang Leo Maar, agosto 2001. (PFC 2007)"

Para estabelecer uma base para os testes e futuramente realizar a migração da BD Museológica para o Elucidário.art, estabelecemos um mapeamento entre os campos da BD Museológica e Mdorim, que pode ser visto no quadro a seguir:

{{count:chart;legend=Mapeamento entre a BD Museológica da Casa Museu Ema Klabin para o Mdorim.}}

{{embed:internal/body/elucidario/cmek/mapeamento.html}}

Fonte: Elaborado pelo autor.

O mapeamento utiliza as entidades Mapping e PropMap definidas no Mdorim da seguinte forma:

{{count:figure;legend=Exemplo de mapeamento dos campos NomeTítulo e LocalizaçãoOriginal para o Mdorim utilizando as entidades Mapping e PropMap.}}

{{code:internal/body/elucidario/cmek/mapping.json}}

Fonte: Elaborado pelo autor.

A partir deste mapeamento montamos os 20 itens no Elucidário.art, para os campos que aparecem utilizando mais de uma coluna no quadro anterior utilizamos as Estruturas Compartilhadas (EC) e Endpoints de Entidades (EE) descritas na seção 4, por exemplo: os metadados no museológico DescriçãoTécnicos, NomeTítulo e NúmeroTombo do item "M-0693 - Mesa de jogos com toucador" podem ser descritos utilizando o Mdorim/Linked Art da seguinte forma:

{{count:figure;legend=Exemplo do item M-0693 mapeado para o Mdorim/Linked Art.}}

{{code:internal/body/elucidario/cmek/m0693.json}}

Fonte: Elaborado pelo autor.

Além dos 20 itens criados, também precisamos criar outras entidades no Elucidário.art para dar conta de todos os níveis de descrição, por exemplo no caso da LocalizaçãoAtual e LocalizaçãoOriginal que descrevem localizações dentro da casa museu, ou no caso da Origem que também descreve uma localização, mas neste caso geográfica. Para estes casos criamos entidades `Places` que descrevem cada uma dessas localizações. Também foram criadas entidades `Person` como no caso da Tarsila do Amaral e Lasar Segall e `Group` como no caso do *Apollo Studios of New York* para descrever os autores e colaboradores dos itens, e entidades `Concept` para descrever os conceitos utilizados nos metadados.
