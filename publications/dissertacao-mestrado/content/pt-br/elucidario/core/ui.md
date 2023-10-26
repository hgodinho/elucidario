A UI do Elucidário.art importa as definições de design do pacote `@elucidario/pkg-design-system` e as implementa em páginas administrativas para a gestão do plugin. Suas rotas de administração foram definidas de acordo com as entidades definidas no `@elucidario/pkg-mdorim`, e estão estruturadas da seguinte forma:

- `/opcoes` - Opções do plugin (Option);
- `/procedimentos` - Procedimentos realizados em um item da coleção (Procedure);
- `/entidades` - Entidades, essa rota é uma rota de nível superior, e possui sub-rotas para cada tipo de entidade:
- `/entidades/conceitos` - Conceitos (Concept);
- `/entidades/digitais` - Objetos digitais (DigitalObject);
- `/entidades/eventos` - Eventos (Event/Activity);
- `/entidades/agentes` - Agentes (Person/Group);
- `/entidades/objetos` - Objetos, itens da coleção (Object);
- `/entidades/locais` - Locais (Place);
- `/entidades/procedencias` - Procedências (Provenance);
- `/entidades/conjuntos` - Conjuntos (Set);
- `/entidades/textos` - Textos (TextualWork);
- `/entidades/visuais` - Objetos visuais (VisualWork);
- `/mapeamentos` - Mapeamentos entre modelos de dados (Mapping e PropMap);
- `/historico` - Histórico de alterações realizadas no plugin (History e HistoryEvent).

Com exceção da rota `/opcoes`, para cada uma delas foi definido dois tipos de páginas: uma de arquivo, responsável por listar todas as entidades equivalentes, e que permite a criação de filtros, buscas e ordenação; e uma para cada entidade, que possui dois contextos, um de leitura e outro de edição.

Para a rota `/opcoes` foi definida apenas uma página organizada por abas, que permite o ajuste das configurações do Elucidário.art.
