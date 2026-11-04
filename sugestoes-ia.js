/* Conteúdo de IA da biblioteca (ILUSTRATIVO, criado a partir dos resumos e títulos; não faz parte dos projetos).
   - sugestoes: simulações "Como a IA pode ajudar" (dados fictícios); motores em ia.js:
     regressao | classificacao | mapa (tempo, sobreposicao, acesso) | agrupamento | texto.
   - leapspace: perguntas curtas por projeto (pt/en) que abrem o LeapSpace (Elsevier, via CAPES) já preenchido.
     tipos: panorama | evidencias | ia | especialistas | financiamento.
   Depois de editar, rode:  node verificar.js */
window.PPGEAN_SUGESTOES_IA = {
 "sugestoes": [
  {
   "id": "2025-d-caroline-vaz-cendron",
   "motor": "mapa",
   "titulo": "IA para prever a sobreposição planta–polinizador no futuro",
   "ideia": "O projeto já prevê o MaxEnt, um método de aprendizado de máquina. A IA poderia combiná-lo com outros algoritmos, num ensemble, para prever as áreas adequadas à planta e ao polinizador nos cenários atual e futuros, medindo onde a sobreposição se mantém ou se perde.",
   "tecnica": "MaxEnt em ensemble com Random Forest e boosting",
   "beneficio": "Mapas de onde e com quanto aquecimento a interação tende a se perder, com incerteza estimada, para priorizar municípios e ações de conservação.",
   "modo": "sobreposicao",
   "controle": {
    "rotulo": "Aquecimento em relação ao clima atual",
    "unidade": "°C",
    "min": 0,
    "max": 4,
    "passo": 0.5,
    "valor": 0
   },
   "especies": {
    "a": "Planta",
    "b": "Polinizador"
   },
   "indicador": "de sobreposição entre planta e polinizador"
  },
  {
   "id": "2025-d-ketlin-schneider",
   "motor": "agrupamento",
   "titulo": "IA para agrupar leveduras autóctones por perfil fermentativo",
   "ideia": "A IA poderia agrupar os isolados das safras 2026 e 2027 por características fenotípicas, como produção de etanol e tolerância a ele, cruzar os grupos com a identificação molecular (Sanger) e indicar quais linhagens levar à microvinificação, como inóculo único ou em fermentação sequencial.",
   "tecnica": "Agrupamento não supervisionado (k-means)",
   "beneficio": "Triar os isolados de forma rápida e objetiva, levando à microvinificação só os mais promissores para reduzir o teor alcoólico.",
   "item": "isolado de levedura",
   "eixos": {
    "x": "Etanol produzido (% v/v)",
    "y": "Tolerância ao etanol (% v/v)"
   },
   "grupos": [
    {
     "nome": "Baixo etanol, sensíveis"
    },
    {
     "nome": "Perfil intermediário"
    },
    {
     "nome": "Alto etanol, tolerantes"
    }
   ]
  },
  {
   "id": "2025-d-leonardo-ribeiro",
   "motor": "regressao",
   "titulo": "IA para prever o enraizamento de miniestacas de erva-mate",
   "ideia": "A IA poderia aprender com as avaliações aos 60, 120 e 180 dias de cada clone e protocolo (AIB, cinetina, ácido giberélico e bioestimulantes) para prever o enraizamento de novas combinações e apontar os genótipos mais promissores para a seleção.",
   "tecnica": "Rede neural artificial (ANN)",
   "beneficio": "Testar menos combinações no viveiro, poupar miniestacas e acelerar a seleção de clones que enraízam bem e se adaptam ao Planalto Serrano Catarinense.",
   "entradas": [
    {
     "rotulo": "Dose de ácido indolbutírico (AIB)",
     "unidade": "mg/L",
     "min": 0,
     "max": 6000,
     "passo": 500,
     "valor": 2000,
     "peso": 0.7
    },
    {
     "rotulo": "Tempo após o plantio das miniestacas",
     "unidade": "dias",
     "min": 60,
     "max": 180,
     "passo": 30,
     "valor": 120,
     "peso": 0.4
    }
   ],
   "saida": {
    "rotulo": "Enraizamento previsto",
    "unidade": "% das miniestacas",
    "min": 0,
    "max": 80,
    "decimais": 0
   },
   "forma": "sigmoide"
  },
  {
   "id": "2025-m-andressa-aparecida-bortoli",
   "motor": "agrupamento",
   "titulo": "IA para revelar perfis de multifuncionalidade da floresta",
   "ideia": "A IA poderia agrupar as 80 subunidades de 200 m² do Parque Estadual Rio Canoas pelos serviços medidos (diversidade, micro-habitats, dispersão de sementes por animais e carbono), revelando perfis de multifuncionalidade e comparando-os aos estágios sucessionais.",
   "tecnica": "Agrupamento não supervisionado (k-means)",
   "beneficio": "Identificar, sem classificação prévia, os trechos de floresta que entregam vários serviços ao mesmo tempo, apoiando a avaliação do valor de conservação.",
   "item": "subunidade amostral",
   "eixos": {
    "x": "Carbono acima do solo (t C/ha)",
    "y": "Riqueza arbórea (nº de espécies)"
   },
   "grupos": [
    {
     "nome": "Baixa oferta de serviços"
    },
    {
     "nome": "Oferta intermediária"
    },
    {
     "nome": "Alta multifuncionalidade"
    }
   ]
  },
  {
   "id": "2025-m-eduarda-martins-da-silva",
   "motor": "regressao",
   "titulo": "Rede neural para prever a severidade do míldio pelo clima",
   "ideia": "A IA poderia complementar o modelo bioeconômico: treinada com séries diárias de temperatura, umidade e chuva e com registros da doença, estimaria a severidade do míldio a partir da previsão do tempo e indicaria quando a aplicação de fungicida compensa.",
   "tecnica": "Rede neural recorrente (LSTM) com séries climáticas",
   "beneficio": "Antecipar o risco de míldio e pulverizar só quando necessário, reduzindo custos e o uso excessivo de fungicidas no vinhedo.",
   "entradas": [
    {
     "rotulo": "Umidade relativa média",
     "unidade": "%",
     "min": 60,
     "max": 100,
     "passo": 1,
     "valor": 82,
     "peso": 0.8
    },
    {
     "rotulo": "Chuva acumulada na semana",
     "unidade": "mm",
     "min": 0,
     "max": 150,
     "passo": 5,
     "valor": 40,
     "peso": 0.5
    },
    {
     "rotulo": "Temperatura média",
     "unidade": "°C",
     "min": 12,
     "max": 26,
     "passo": 0.5,
     "valor": 19,
     "peso": 0.3
    }
   ],
   "saida": {
    "rotulo": "Severidade prevista do míldio",
    "unidade": "% da área foliar",
    "min": 0,
    "max": 100,
    "decimais": 0
   },
   "forma": "sigmoide"
  },
  {
   "id": "2025-m-fabrielle-paixao-dos-reis",
   "motor": "classificacao",
   "titulo": "Visão computacional para contar colêmbolos e ácaros",
   "ideia": "A IA poderia reconhecer e contar colêmbolos e ácaros em fotos do material extraído nos funis de Berlese-Tullgren, agilizando a triagem das amostras de cada sistema de uso do solo e gerando contagens de abundância para definir a Faixa de Operação Normal (NOR) e comparar os sistemas manejados.",
   "tecnica": "Rede neural convolucional (CNN)",
   "beneficio": "Triagem mais rápida e padronizada das amostras de todos os sistemas de uso do solo, com conferência humana apenas nos casos de baixa confiança.",
   "amostra": "foto de um organismo extraído no funil de Berlese-Tullgren",
   "classes": [
    {
     "nome": "Colêmbolo",
     "forma": "colembolo"
    },
    {
     "nome": "Ácaro",
     "forma": "acaro"
    }
   ]
  },
  {
   "id": "2025-m-gustavo-bachmann",
   "motor": "regressao",
   "titulo": "Aprendizado de máquina para prever agrotóxicos no pólen",
   "ideia": "O projeto já prevê IA na identificação do pólen ao microscópio. Um modelo de aprendizado de máquina poderia ainda usar as métricas da paisagem num raio de 3 km, extraídas das imagens de satélite, para prever quantos agrotóxicos o pólen de cada meliponário tende a conter.",
   "tecnica": "Random Forest com métricas de paisagem",
   "beneficio": "Apontar os meliponários de maior risco para priorizar as análises de resíduos e estimar a exposição em áreas do Alto Vale do Itajaí ainda não amostradas.",
   "entradas": [
    {
     "rotulo": "Área de lavouras no raio de 3 km",
     "unidade": "%",
     "min": 5,
     "max": 80,
     "passo": 5,
     "valor": 30,
     "peso": 0.85
    },
    {
     "rotulo": "Distância até a lavoura mais próxima",
     "unidade": "m",
     "min": 0,
     "max": 1000,
     "passo": 50,
     "valor": 300,
     "peso": -0.5
    }
   ],
   "saida": {
    "rotulo": "Agrotóxicos detectados no pólen",
    "unidade": "compostos por amostra",
    "min": 0,
    "max": 8,
    "decimais": 1
   },
   "forma": "linear"
  },
  {
   "id": "2025-m-italo-gabriel-torri",
   "motor": "regressao",
   "titulo": "Modelo de IA para projetar o carbono do solo na regeneração",
   "ideia": "A IA poderia aprender com as 18 unidades amostrais (estágio, argila, densidade e química do solo) e, se cada estágio receber uma idade aproximada, prever o acúmulo de carbono nos primeiros 40 cm: quanto as áreas degradadas ou invadidas por pínus ainda podem estocar até virarem floresta madura.",
   "tecnica": "Gradient boosting (XGBoost)",
   "beneficio": "Estimar o carbono do solo de novas áreas com menos trincheiras e análises, e prever o ganho de carbono esperado com a regeneração da floresta.",
   "entradas": [
    {
     "rotulo": "Idade aproximada da regeneração",
     "unidade": "anos",
     "min": 0,
     "max": 80,
     "passo": 5,
     "valor": 20,
     "peso": 0.8
    },
    {
     "rotulo": "Teor de argila",
     "unidade": "%",
     "min": 20,
     "max": 70,
     "passo": 5,
     "valor": 45,
     "peso": 0.4
    }
   ],
   "saida": {
    "rotulo": "Estoque de carbono nos primeiros 40 cm do solo",
    "unidade": "t C/ha",
    "min": 50,
    "max": 170,
    "decimais": 0
   },
   "forma": "saturacao"
  },
  {
   "id": "2025-m-julia-elizabeth-proenca",
   "motor": "regressao",
   "titulo": "Aprendizado de máquina para prever a produção de pinhas",
   "ideia": "Como complemento à inferência multimodelo, a IA poderia aprender com as árvores fêmeas medidas (DAP, altura, copa e distância aos competidores) e prever quantas pinhas cada araucária tende a produzir nos diferentes ambientes de Santa Catarina.",
   "tecnica": "Random Forest com importância das variáveis",
   "beneficio": "Estimar a safra de pinhão de um fragmento a partir de medições simples de campo, apoiando o manejo sustentável e a renda das comunidades locais.",
   "entradas": [
    {
     "rotulo": "Diâmetro à altura do peito (DAP)",
     "unidade": "cm",
     "min": 20,
     "max": 100,
     "passo": 5,
     "valor": 45,
     "peso": 0.8
    },
    {
     "rotulo": "Distância ao competidor mais próximo",
     "unidade": "m",
     "min": 1,
     "max": 15,
     "passo": 0.5,
     "valor": 5,
     "peso": 0.4
    }
   ],
   "saida": {
    "rotulo": "Produção prevista de pinhas",
    "unidade": "pinhas por árvore",
    "min": 0,
    "max": 80,
    "decimais": 0
   },
   "forma": "saturacao"
  },
  {
   "id": "2025-m-maiara-de-liz-granemann",
   "motor": "texto",
   "titulo": "Mineração de textos nos documentos da extensão rural",
   "ideia": "A IA poderia ler em lote os documentos institucionais da revisão sistemática, marcando instituições, ações extensionistas e menções às florestas nativas, situando cada registro na linha do tempo e sugerindo temas e lacunas para a análise temática, sempre conferidos na leitura qualitativa.",
   "tecnica": "Processamento de linguagem natural e modelagem de tópicos",
   "beneficio": "Varredura rápida de grandes acervos, com cada menção rastreável até o documento de origem, deixando mais tempo para a interpretação e as estratégias.",
   "trecho": "Exemplo fictício: Relatório anual do escritório municipal de extensão rural. Neste ano, a equipe promoveu cursos e visitas técnicas voltados à produção de milho e leite. Agricultores pediram orientação sobre o manejo da mata nativa e da erva-mate, mas não havia técnico florestal para atendê-los. Recomenda-se incluir os remanescentes florestais no plano do próximo ano.",
   "tipos": [
    "Instituição",
    "Ação extensionista",
    "Produção agropecuária",
    "Componente florestal"
   ],
   "entidades": [
    {
     "termo": "escritório municipal de extensão rural",
     "tipo": "Instituição"
    },
    {
     "termo": "cursos",
     "tipo": "Ação extensionista"
    },
    {
     "termo": "visitas técnicas",
     "tipo": "Ação extensionista"
    },
    {
     "termo": "milho",
     "tipo": "Produção agropecuária"
    },
    {
     "termo": "leite",
     "tipo": "Produção agropecuária"
    },
    {
     "termo": "mata nativa",
     "tipo": "Componente florestal"
    },
    {
     "termo": "erva-mate",
     "tipo": "Componente florestal"
    },
    {
     "termo": "remanescentes florestais",
     "tipo": "Componente florestal"
    }
   ],
   "temas": [
    {
     "nome": "Extensão e assistência técnica",
     "peso": 0.4
    },
    {
     "nome": "Florestas nativas",
     "peso": 0.35
    },
    {
     "nome": "Produção agropecuária",
     "peso": 0.25
    }
   ]
  },
  {
   "id": "2025-m-michele-fernanda-cardoso",
   "motor": "mapa",
   "titulo": "Classificação por IA da regeneração em áreas embargadas",
   "ideia": "A IA poderia aprender, com os índices de vegetação (NDVI, SAVI, EVI, NDRE e GNDVI) das áreas com 3, 5 e 10 anos de embargo e dos fragmentos adjacentes de referência, a classificar cada pixel das imagens PlanetScope por estágio de regeneração, apontando onde a vegetação não está voltando.",
   "tecnica": "Random Forest sobre índices de vegetação (PlanetScope)",
   "beneficio": "Acompanhar muitas áreas embargadas a cada nova imagem e direcionar as vistorias de campo para onde a regeneração não avança.",
   "modo": "tempo",
   "controle": {
    "rotulo": "Tempo desde o embargo",
    "unidade": "anos",
    "min": 0,
    "max": 10,
    "passo": 1,
    "valor": 3
   },
   "camada": {
    "rotulo": "Estágio de regeneração estimado",
    "baixo": "Sem regeneração",
    "alto": "Similar ao fragmento vizinho"
   },
   "efeito": "recupera",
   "indicador": "da área embargada em regeneração"
  },
  {
   "id": "2025-m-nayara-alves-dos-santos",
   "motor": "classificacao",
   "titulo": "Visão computacional para reconhecer espécies pelas folhas",
   "ideia": "A IA poderia reconhecer pela foto das folhas a erva-mate, a espinheira-santa e a casca-d’anta nas unidades amostrais, agilizando o registro dos indivíduos no inventário e permitindo que extrativistas locais também contribuam com fotos pelo celular, unindo saberes locais e dados de campo.",
   "tecnica": "Rede neural convolucional (CNN) para classificar imagens de folhas",
   "beneficio": "Inventário mais ágil, com cada indivíduo registrado por foto, e a chance de ampliar a amostragem com fotos de extrativistas, sempre com conferência humana.",
   "amostra": "foto de folha de um indivíduo nas unidades amostrais",
   "classes": [
    {
     "nome": "Erva-mate",
     "forma": "folha-oval"
    },
    {
     "nome": "Espinheira-santa",
     "forma": "folha-espinhosa"
    },
    {
     "nome": "Casca-d’anta",
     "forma": "folha-lanceolada"
    }
   ]
  },
  {
   "id": "2025-m-roberta-abgai-schmidt-colaco",
   "motor": "agrupamento",
   "titulo": "IA para agrupar pontos de coleta pela saúde do solo",
   "ideia": "A IA poderia agrupar os pontos de coleta pela fauna edáfica (morfotipos de colêmbolos, gêneros de enquitreídeos) e pelos dados dos sensores de umidade e temperatura do solo, verificando se os grupos que ela forma sozinha coincidem com os estágios de regeneração inicial, intermediário e avançado.",
   "tecnica": "Agrupamento não supervisionado (k-means)",
   "beneficio": "Testar de forma objetiva se colêmbolos e enquitreídeos distinguem os níveis de regeneração, agilizando o monitoramento da restauração.",
   "item": "ponto de coleta",
   "eixos": {
    "x": "Umidade do solo (%)",
    "y": "Colêmbolos (indivíduos/amostra)"
   },
   "grupos": [
    {
     "nome": "Mais seco, menos colêmbolos"
    },
    {
     "nome": "Condição intermediária"
    },
    {
     "nome": "Mais úmido, mais colêmbolos"
    }
   ]
  },
  {
   "id": "2025-m-sarah-kormann",
   "motor": "classificacao",
   "titulo": "Visão computacional para identificar a macrofauna do solo",
   "ideia": "A IA poderia reconhecer, em fotos dos organismos coletados nas amostragens sazonais, as minhocas e os demais grupos da macrofauna, agilizando as contagens nos quatro sistemas de uso do solo. A identificação das minhocas até espécie, nativas ou exóticas, seguiria com especialistas.",
   "tecnica": "Rede neural convolucional (CNN) com aprendizado por transferência",
   "beneficio": "Contagens rápidas e padronizadas a cada coleta sazonal, liberando tempo dos especialistas para identificar as minhocas até espécie.",
   "amostra": "foto de um organismo da macrofauna coletado na amostra de solo",
   "classes": [
    {
     "nome": "Minhoca",
     "forma": "minhoca"
    },
    {
     "nome": "Formiga",
     "forma": "formiga"
    },
    {
     "nome": "Besouro",
     "forma": "besouro"
    },
    {
     "nome": "Aranha",
     "forma": "aranha"
    }
   ]
  },
  {
   "id": "2025-m-tathiana-cristina-doin-sonda",
   "motor": "mapa",
   "titulo": "Visão computacional para mapear o verde perto das escolas",
   "ideia": "A IA poderia segmentar imagens de satélite de Curitibanos para mapear a vegetação nos pátios escolares e nas áreas verdes públicas, agilizando o diagnóstico físico e o levantamento previstos e mostrando quais escolas têm natureza a uma distância caminhável.",
   "tecnica": "Segmentação de imagens com rede neural (U-Net)",
   "beneficio": "Um diagnóstico rápido e atualizável de todas as escolas do município, indicando onde requalificar pátios ou ampliar o acesso a áreas verdes.",
   "modo": "acesso",
   "controle": {
    "rotulo": "Distância a pé da escola",
    "unidade": "m",
    "min": 100,
    "max": 1000,
    "passo": 50,
    "valor": 300
   },
   "camada": {
    "rotulo": "Vegetação detectada pela IA",
    "baixo": "Área construída",
    "alto": "Área verde"
   },
   "marcadores": "Escolas",
   "indicador": "das escolas com área verde nesse raio"
  },
  {
   "id": "2026-d-angelo-barbosa-da-silva",
   "motor": "regressao",
   "titulo": "IA para prever a reprodução de minhocas expostas a agrotóxicos",
   "ideia": "A IA poderia aprender com os ensaios de P. corethrurus, A. gracilis, D. annae e Fimoscolex sp. e com dados de espécies-padrão internacionais para prever curvas dose-resposta e a CE50 (concentração que reduz a reprodução à metade) de cada espécie, inclusive para agrotóxicos ainda não testados nelas.",
   "tecnica": "Aprendizado de máquina para extrapolar a CE50 entre espécies",
   "beneficio": "Estimar a CE50 de cada espécie com menos ensaios e organismos, apoiando a padronização de testes ecotoxicológicos para solos subtropicais.",
   "entradas": [
    {
     "rotulo": "Concentração do agrotóxico no solo",
     "unidade": "mg/kg",
     "min": 0,
     "max": 100,
     "passo": 1,
     "valor": 40,
     "peso": 0.9
    }
   ],
   "saida": {
    "rotulo": "Redução da reprodução",
    "unidade": "%",
    "min": 0,
    "max": 100,
    "decimais": 0
   },
   "forma": "sigmoide"
  },
  {
   "id": "2026-d-guilherme-alves-ramos",
   "motor": "regressao",
   "titulo": "IA para prever a produção de coprólitos sob mudanças climáticas",
   "ideia": "Pensando na futura incorporação ao modelo FORESEE, a IA poderia aprender, com os ensaios das quatro espécies em Nitossolo e Latossolo, como temperatura, umidade e matéria orgânica alteram a produção de coprólitos (os excrementos das minhocas), gerando parâmetros contínuos e com incerteza.",
   "tecnica": "Regressão por processo gaussiano (com incerteza)",
   "beneficio": "Estimar parâmetros, com a respectiva incerteza, também para condições não testadas, alimentando o FORESEE em cenários climáticos sem multiplicar os ensaios.",
   "entradas": [
    {
     "rotulo": "Umidade do solo",
     "unidade": "%",
     "min": 10,
     "max": 45,
     "passo": 1,
     "valor": 28,
     "peso": 0.8
    },
    {
     "rotulo": "Temperatura",
     "unidade": "°C",
     "min": 12,
     "max": 28,
     "passo": 1,
     "valor": 20,
     "peso": 0.45
    }
   ],
   "saida": {
    "rotulo": "Produção de coprólitos",
    "unidade": "g/minhoca/dia",
    "min": 0,
    "max": 3,
    "decimais": 2
   },
   "forma": "sigmoide"
  },
  {
   "id": "2026-d-gustavo-henrique-mozzer-regazolli",
   "motor": "regressao",
   "titulo": "Aprendizado de máquina para prever o enraizamento da feijoa",
   "ideia": "O projeto já prevê aprendizado de máquina: o modelo poderia combinar auxinas endógenas, compostos fenólicos e o enraizamento dos genitores para prever a competência rizogênica (capacidade de formar raízes) de cada genótipo de F. sellowiana, apoiando a seleção precoce.",
   "tecnica": "Random Forest (aprendizado de máquina)",
   "beneficio": "Triar genótipos promissores antes de longos testes de enraizamento e produção, acelerando o melhoramento e a conservação da espécie.",
   "entradas": [
    {
     "rotulo": "Auxina endógena (AIA)",
     "unidade": "ng/g MF",
     "min": 10,
     "max": 150,
     "passo": 5,
     "valor": 50,
     "peso": 0.75
    },
    {
     "rotulo": "Enraizamento médio dos genitores",
     "unidade": "%",
     "min": 0,
     "max": 100,
     "passo": 5,
     "valor": 40,
     "peso": 0.5
    }
   ],
   "saida": {
    "rotulo": "Enraizamento previsto",
    "unidade": "%",
    "min": 0,
    "max": 100,
    "decimais": 0
   },
   "forma": "sigmoide"
  },
  {
   "id": "2026-d-marilise-franca-da-rocha",
   "motor": "regressao",
   "titulo": "IA para prever a citotoxicidade do extrato de brácteas",
   "ideia": "A IA poderia relacionar o método de extração e os constituintes das brácteas da araucária à resposta de células tumorais de mama, pulmão, próstata e colorretal, prevendo a CI50 (concentração que reduz à metade as células viáveis) e indicando o extrato mais promissor antes dos testes em peixe-zebra.",
   "tecnica": "Rede neural (perceptron multicamadas)",
   "beneficio": "Priorizar extratos e concentrações antes dos ensaios, reduzindo testes in vitro e o uso de embriões de peixe-zebra.",
   "entradas": [
    {
     "rotulo": "Concentração do extrato",
     "unidade": "µg/mL",
     "min": 0,
     "max": 500,
     "passo": 10,
     "valor": 150,
     "peso": 0.9
    },
    {
     "rotulo": "Tempo de exposição",
     "unidade": "h",
     "min": 24,
     "max": 72,
     "passo": 12,
     "valor": 48,
     "peso": 0.35
    }
   ],
   "saida": {
    "rotulo": "Redução da viabilidade celular",
    "unidade": "%",
    "min": 0,
    "max": 100,
    "decimais": 0
   },
   "forma": "sigmoide"
  },
  {
   "id": "2026-d-nadia-da-silva",
   "motor": "regressao",
   "titulo": "IA para prever a restauração em agroflorestas com erva-mate",
   "ideia": "A IA poderia unir as coletas sazonais às avaliações anteriores nas mesmas áreas para prever a trajetória dos arranjos adensado, sombreado e diversificado, estimando quando solo, fauna edáfica e vegetação se aproximariam da floresta nativa de referência.",
   "tecnica": "Gradient boosting (XGBoost)",
   "beneficio": "Antecipar quais arranjos tendem a recuperar solo e fauna mais rápido, orientando a restauração produtiva em clima frio no Sul do Brasil.",
   "entradas": [
    {
     "rotulo": "Tempo desde a implantação",
     "unidade": "anos",
     "min": 0,
     "max": 25,
     "passo": 1,
     "valor": 8,
     "peso": 0.8
    },
    {
     "rotulo": "Aporte de serapilheira",
     "unidade": "t/ha/ano",
     "min": 1,
     "max": 10,
     "passo": 0.5,
     "valor": 4.5,
     "peso": 0.45
    },
    {
     "rotulo": "Cobertura do dossel",
     "unidade": "%",
     "min": 10,
     "max": 100,
     "passo": 5,
     "valor": 60,
     "peso": 0.35
    }
   ],
   "saida": {
    "rotulo": "Semelhança com a floresta nativa",
    "unidade": "%",
    "min": 0,
    "max": 100,
    "decimais": 0
   },
   "forma": "saturacao"
  },
  {
   "id": "2026-m-ana-claudia-miozzo",
   "motor": "regressao",
   "titulo": "IA para prever a riqueza de abelhas nativas pela paisagem",
   "ideia": "Estudos com abelhas em paisagens fragmentadas costumam relacionar a cobertura florestal e o isolamento dos fragmentos à riqueza de espécies. A IA poderia aprender essas relações com dados de Euglossini e Meliponini e indicar se há um limiar de cobertura abaixo do qual as comunidades se empobrecem.",
   "tecnica": "Boosted regression trees (BRT) com métricas de paisagem",
   "beneficio": "Indicar quanta floresta a paisagem precisa manter para conservar as abelhas nativas e a polinização, orientando onde restaurar ou conectar fragmentos.",
   "entradas": [
    {
     "rotulo": "Cobertura florestal na paisagem",
     "unidade": "%",
     "min": 0,
     "max": 100,
     "passo": 5,
     "valor": 40,
     "peso": 0.8
    },
    {
     "rotulo": "Distância ao fragmento florestal mais próximo",
     "unidade": "m",
     "min": 0,
     "max": 1000,
     "passo": 50,
     "valor": 200,
     "peso": -0.4
    }
   ],
   "saida": {
    "rotulo": "Riqueza prevista de abelhas nativas",
    "unidade": "espécies",
    "min": 0,
    "max": 20,
    "decimais": 0
   },
   "forma": "sigmoide"
  },
  {
   "id": "2026-m-caroline-moraes",
   "motor": "mapa",
   "titulo": "IA para mapear a regeneração no entorno do reservatório",
   "ideia": "No entorno de reservatórios, a regeneração costuma variar com a distância da margem e as oscilações do nível da água. A IA poderia classificar cada pixel de séries de imagens de satélite por estágio da vegetação, mostrando onde e em que ritmo a floresta volta e onde ela não avança.",
   "tecnica": "Random Forest em séries anuais de imagens Landsat e Sentinel-2",
   "beneficio": "Medir o ritmo da regeneração em toda a área, ano a ano, e apontar os trechos onde ela estagna e a restauração ativa pode ser necessária.",
   "modo": "tempo",
   "controle": {
    "rotulo": "Tempo desde o início da regeneração",
    "unidade": "anos",
    "min": 0,
    "max": 20,
    "passo": 1,
    "valor": 10
   },
   "camada": {
    "rotulo": "Estágio da vegetação classificado pela IA",
    "baixo": "Sem vegetação lenhosa",
    "alto": "Floresta"
   },
   "efeito": "recupera",
   "indicador": "da área de influência já coberta por floresta"
  },
  {
   "id": "2026-m-emanuelle-veronica-panisson",
   "motor": "regressao",
   "titulo": "IA para prever o efeito de bioinsumos no crescimento de mudas",
   "ideia": "Estudos com bioinsumos costumam comparar produtos e doses, acompanhando a altura e o diâmetro das mudas ao longo do tempo. A IA poderia aprender com essas medições como produto e dose afetam o crescimento das espécies nativas e prever o ganho de combinações ainda não testadas.",
   "tecnica": "Random Forest com espécie, bioinsumo e dose como preditores",
   "beneficio": "Testar menos combinações e indicar a menor dose que traz quase todo o ganho, produzindo mudas mais vigorosas para a restauração ecológica.",
   "entradas": [
    {
     "rotulo": "Dose do bioinsumo em relação à recomendada",
     "unidade": "%",
     "min": 0,
     "max": 200,
     "passo": 25,
     "valor": 100,
     "peso": 0.85
    }
   ],
   "saida": {
    "rotulo": "Ganho de altura em relação às mudas sem bioinsumo",
    "unidade": "%",
    "min": 0,
    "max": 40,
    "decimais": 0
   },
   "forma": "saturacao"
  },
  {
   "id": "2026-m-esther-escarrone-pereira",
   "motor": "agrupamento",
   "titulo": "IA para revelar perfis do sistema tradicional do pinhão",
   "ideia": "Estudos sobre sistemas agrícolas tradicionais costumam combinar entrevistas e levantamentos da vegetação. A IA poderia agrupar as propriedades por esses dados, como a participação do pinhão na renda e a cobertura florestal, revelando perfis e se mais renda do pinhão acompanha mais floresta em pé.",
   "tecnica": "Agrupamento não supervisionado (k-means) para tipologia de propriedades",
   "beneficio": "Uma tipologia objetiva das propriedades, que ajuda a entender quando o pinhão favorece a floresta em pé e a orientar o apoio ao sistema tradicional.",
   "item": "propriedade rural",
   "eixos": {
    "x": "Participação do pinhão na renda (%)",
    "y": "Cobertura florestal (% da área)"
   },
   "grupos": [
    {
     "nome": "Menos pinhão, menos floresta"
    },
    {
     "nome": "Perfil intermediário"
    },
    {
     "nome": "Mais pinhão, mais floresta"
    }
   ]
  },
  {
   "id": "2026-m-frank-marcelo-da-silva-araujo",
   "motor": "regressao",
   "titulo": "IA para prever a regeneração da araucária pela oferta de pinhão",
   "ideia": "Em propriedades rurais, parte do pinhão costuma ser colhida e parte fica para a fauna e a regeneração. A IA poderia combinar a produção estimada, a colheita (se registrada) e a regeneração de cada propriedade para prever quantos regenerantes de araucária surgem conforme o pinhão deixado na área.",
   "tecnica": "Gradient boosting com regressão de Poisson (dados de contagem)",
   "beneficio": "Estimar quanto pinhão deixar na área para manter a regeneração da araucária, conciliando a renda da colheita com a conservação nas propriedades.",
   "entradas": [
    {
     "rotulo": "Pinhão deixado na área a cada safra",
     "unidade": "kg/ha",
     "min": 0,
     "max": 300,
     "passo": 25,
     "valor": 75,
     "peso": 0.8
    }
   ],
   "saida": {
    "rotulo": "Densidade prevista de regenerantes de araucária",
    "unidade": "indivíduos/ha",
    "min": 0,
    "max": 600,
    "decimais": 0
   },
   "forma": "saturacao"
  },
  {
   "id": "2026-m-gabriel-ansiliero",
   "motor": "regressao",
   "titulo": "IA para prever a reprodução da pérola-da-terra pela temperatura",
   "ideia": "Estudos sobre o efeito da temperatura em insetos costumam medir a duração do ciclo e a reprodução em diferentes temperaturas. A IA poderia aprender essa curva de resposta da pérola-da-terra e, aplicada a séries de temperatura do solo, prever épocas e regiões de maior risco nos vinhedos.",
   "tecnica": "Regressão por processo gaussiano com séries de temperatura do solo",
   "beneficio": "Antecipar épocas e regiões de maior reprodução da praga, apoiando a escolha de porta-enxertos tolerantes e o momento do manejo nos vinhedos.",
   "entradas": [
    {
     "rotulo": "Temperatura média",
     "unidade": "°C",
     "min": 12,
     "max": 26,
     "passo": 1,
     "valor": 20,
     "peso": 0.9
    }
   ],
   "saida": {
    "rotulo": "Fecundidade prevista",
    "unidade": "ovos por fêmea",
    "min": 0,
    "max": 150,
    "decimais": 0
   },
   "forma": "sigmoide"
  },
  {
   "id": "2026-m-jucemara-de-oliveira-prestes",
   "motor": "regressao",
   "titulo": "IA para prever a produção de dálias em cada época de plantio",
   "ideia": "Em regiões de altitude, a época de plantio costuma definir quanto calor a cultura acumula e quantas geadas enfrenta. A IA poderia relacionar o clima de cada época à produção de hastes de dália e, com séries climáticas de vários anos, prever quais datas de plantio tendem a produzir mais.",
   "tecnica": "Gradient boosting (XGBoost) com dados meteorológicos de cada época",
   "beneficio": "Escolher datas de plantio com maior produção esperada e menor risco de geada, e escalonar os plantios para ofertar hastes por mais tempo.",
   "entradas": [
    {
     "rotulo": "Soma térmica acumulada no ciclo",
     "unidade": "°C dia",
     "min": 800,
     "max": 2400,
     "passo": 100,
     "valor": 1200,
     "peso": 0.8
    },
    {
     "rotulo": "Dias com geada durante o ciclo",
     "unidade": "dias",
     "min": 0,
     "max": 10,
     "passo": 1,
     "valor": 3,
     "peso": -0.6
    }
   ],
   "saida": {
    "rotulo": "Produção prevista de hastes comerciais",
    "unidade": "hastes por planta",
    "min": 0,
    "max": 20,
    "decimais": 1
   },
   "forma": "saturacao"
  },
  {
   "id": "2026-m-luiza-franco-de-souza",
   "motor": "regressao",
   "titulo": "IA para prever o ¹⁵N do solo a partir de espectros",
   "ideia": "O espectro do solo reflete a composição da matéria orgânica e a argila, que costumam se relacionar com o ¹⁵N. A IA poderia aprender essas relações com amostras também analisadas em laboratório e prever o ¹⁵N de novas amostras só pelo espectro, testando se supera a regressão PLS, o método clássico.",
   "tecnica": "Rede neural convolucional 1D sobre os espectros, comparada à regressão PLS",
   "beneficio": "Analisar muito mais amostras de solo ao custo de uma leitura espectral, reservando as análises isotópicas para calibrar e conferir o modelo.",
   "entradas": [
    {
     "rotulo": "Relação C/N estimada pelo espectro",
     "unidade": "g C/g N",
     "min": 8,
     "max": 20,
     "passo": 1,
     "valor": 12,
     "peso": -0.8
    },
    {
     "rotulo": "Teor de argila estimado pelo espectro",
     "unidade": "%",
     "min": 10,
     "max": 70,
     "passo": 5,
     "valor": 40,
     "peso": 0.35
    }
   ],
   "saida": {
    "rotulo": "δ¹⁵N previsto do solo",
    "unidade": "‰",
    "min": 0,
    "max": 12,
    "decimais": 1
   },
   "forma": "linear"
  },
  {
   "id": "2026-m-paula-tonatto-carlos-pereira",
   "motor": "classificacao",
   "titulo": "Visão computacional para contar alterações celulares",
   "ideia": "Em ensaios com plantas bioindicadoras, alterações como micronúcleos e pontes cromossômicas costumam ser contadas uma a uma ao microscópio. A IA poderia triar milhares de células por lâmina, apoiando a avaliação do potencial citogenotóxico e mutagênico do antibiótico enrofloxacina.",
   "tecnica": "Rede neural convolucional (CNN) em imagens de microscopia",
   "beneficio": "Mais células analisadas por lâmina, em menos tempo e com critério uniforme, reduzindo o cansaço e a variação entre avaliadores.",
   "amostra": "imagem de microscopia de uma célula da planta bioindicadora",
   "classes": [
    {
     "nome": "Célula normal",
     "forma": "celula-normal"
    },
    {
     "nome": "Com micronúcleo",
     "forma": "celula-micronucleo"
    },
    {
     "nome": "Ponte cromossômica",
     "forma": "celula-ponte"
    }
   ]
  },
  {
   "id": "2026-m-renzo-sebastian-huerta-jimenez",
   "motor": "regressao",
   "titulo": "IA para estimar a fixação de nitrogênio pelo espectro da folha",
   "ideia": "O ¹⁵N foliar, usado para estimar a fixação biológica, costuma ser medido por espectrometria de massas, de custo alto. A IA poderia aprender com folhas já analisadas a prever o ¹⁵N pelo espectro óptico e, comparando-o ao de plantas não fixadoras, estimar quanto do nitrogênio da planta veio do ar.",
   "tecnica": "Random Forest sobre espectros foliares, com importância das bandas",
   "beneficio": "Estimar a fixação biológica em muito mais plantas, com leituras rápidas e baratas, usando as análises isotópicas só para calibrar o modelo.",
   "entradas": [
    {
     "rotulo": "δ¹⁵N da folha estimado pelo espectro",
     "unidade": "‰",
     "min": -2,
     "max": 6,
     "passo": 0.5,
     "valor": 1,
     "peso": -0.85
    },
    {
     "rotulo": "δ¹⁵N de planta não fixadora (referência)",
     "unidade": "‰",
     "min": 2,
     "max": 10,
     "passo": 0.5,
     "valor": 6,
     "peso": 0.45
    }
   ],
   "saida": {
    "rotulo": "Fixação biológica prevista",
    "unidade": "% do N da planta",
    "min": 0,
    "max": 100,
    "decimais": 0
   },
   "forma": "linear"
  },
  {
   "id": "2026-m-vitoria-cozer",
   "motor": "mapa",
   "titulo": "IA para mapear a resiliência e a resistência da floresta",
   "ideia": "Muitos estudos de resiliência florestal medem por satélite quanto o vigor do dossel cai num evento extremo, como uma estiagem (resistência), e quão rápido ele volta (resiliência). A IA poderia mapear essas respostas e estimar o peso de cada fator biótico, abiótico e antropogênico.",
   "tecnica": "Gradient boosting (XGBoost) com SHAP sobre séries de imagens de satélite",
   "beneficio": "Mostrar em que trechos a Floresta Ombrófila Mista é mais vulnerável e quais fatores mais pesam, orientando onde priorizar a conservação e a restauração.",
   "modo": "tempo",
   "controle": {
    "rotulo": "Tempo após o evento extremo",
    "unidade": "meses",
    "min": 0,
    "max": 24,
    "passo": 2,
    "valor": 12
   },
   "camada": {
    "rotulo": "Recuperação do dossel prevista pela IA",
    "baixo": "Dossel estressado",
    "alto": "Dossel recuperado"
   },
   "efeito": "recupera",
   "indicador": "da área com o dossel já recuperado"
  }
 ],
 "leapspace": {
  "2025-d-caroline-vaz-cendron": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre como as mudanças climáticas alteram a sobreposição espacial de espécies que interagem?",
    "en": "What are the main research themes on how climate change alters the spatial overlap of interacting species?"
   },
   {
    "tipo": "evidencias",
    "pt": "As mudanças climáticas devem reduzir a sobreposição espacial entre plantas e polinizadores, ou entre pragas e seus inimigos naturais?",
    "en": "Is climate change projected to reduce the spatial overlap between plants and pollinators, or between pests and their natural enemies?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais pesquisadores e grupos são referência hoje em modelar como o clima futuro altera a coocorrência de espécies que interagem?",
    "en": "Who are the leading researchers and groups currently modeling how future climate alters the co-occurrence of interacting species?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo no Brasil sobre como as mudanças climáticas podem comprometer a polinização e outras interações bióticas?",
    "en": "Who could help fund a study in Brazil on how climate change may disrupt pollination and other biotic interactions?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram ensembles de MaxEnt, Random Forest e boosting para projetar a sobreposição planta–polinizador com as mudanças climáticas?",
    "en": "Which studies have used ensembles of MaxEnt, Random Forest and boosting to project plant–pollinator range overlap under climate change?"
   }
  ],
  "2025-d-ketlin-schneider": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre leveduras autóctones e terroir microbiano em vinhedos de altitude?",
    "en": "What are the main research themes on indigenous wine yeasts and microbial terroir in high-altitude vineyards?"
   },
   {
    "tipo": "evidencias",
    "pt": "Como leveduras autóctones em fermentação sequencial com Saccharomyces cerevisiae afetam o teor alcoólico e o perfil volátil do vinho?",
    "en": "How do indigenous yeasts in sequential fermentation with Saccharomyces cerevisiae affect wine alcohol content and volatile profile?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais autores e grupos de pesquisa trabalham hoje com leveduras autóctones do vinho e terroir microbiano?",
    "en": "Who are the authors and research groups working on indigenous wine yeasts and microbial terroir today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre leveduras autóctones para reduzir o teor alcoólico dos vinhos de altitude de Santa Catarina?",
    "en": "Who could help fund a study on indigenous yeasts to lower the alcohol content of Santa Catarina's high-altitude wines?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram agrupamento k-means de perfis fermentativos na seleção de leveduras autóctones para vinhos com menor teor alcoólico?",
    "en": "Which studies have used k-means clustering of fermentation profiles to select indigenous yeasts for lower-alcohol wines?"
   }
  ],
  "2025-d-leonardo-ribeiro": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa em propagação clonal e melhoramento genético da erva-mate (Ilex paraguariensis)?",
    "en": "What are the main research themes in clonal propagation and genetic improvement of yerba mate (Ilex paraguariensis)?"
   },
   {
    "tipo": "evidencias",
    "pt": "Como a interação genótipo-ambiente afeta o enraizamento adventício de miniestacas e a sobrevivência de matrizes de erva-mate?",
    "en": "How does genotype-by-environment interaction affect adventitious rooting of mini-cuttings and stock plant survival in yerba mate?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais pesquisadores e grupos trabalham hoje com melhoramento genético e propagação vegetativa da erva-mate?",
    "en": "Which researchers and groups are working on yerba mate breeding and vegetative propagation today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre a seleção de clones de erva-mate com alta capacidade de enraizamento e produtividade no Sul do Brasil?",
    "en": "Who could help fund a study on selecting yerba mate clones with high rooting ability and productivity in southern Brazil?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos já usaram redes neurais artificiais para prever o enraizamento de estacas ou miniestacas tratadas com reguladores de crescimento?",
    "en": "Which studies have used artificial neural networks to predict the rooting of cuttings or mini-cuttings treated with growth regulators?"
   }
  ],
  "2025-m-andressa-aparecida-bortoli": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre serviços ecossistêmicos e multifuncionalidade das florestas com araucária no sul do Brasil?",
    "en": "What are the main research themes on ecosystem services and multifunctionality of Araucaria forests in southern Brazil?"
   },
   {
    "tipo": "evidencias",
    "pt": "Como diversidade taxonômica, micro-habitats arbóreos, zoocoria e carbono acima do solo variam entre estágios sucessionais da Floresta com Araucária?",
    "en": "How do taxonomic diversity, tree-related microhabitats, zoochory and aboveground carbon vary across successional stages of Araucaria forest?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais pesquisadores e grupos são referência hoje no estudo de serviços ecossistêmicos e multifuncionalidade das florestas com araucária?",
    "en": "Who are the leading researchers and groups studying ecosystem services and multifunctionality of Araucaria forests today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre o valor de conservação e os serviços ecossistêmicos das florestas com araucária no sul do Brasil?",
    "en": "Who could help fund a study on the conservation value and ecosystem services of Araucaria forests in southern Brazil?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram k-means para agrupar parcelas florestais por serviços ecossistêmicos e revelar perfis de multifuncionalidade?",
    "en": "Which studies have used k-means clustering to group forest plots by ecosystem services and reveal multifunctionality profiles?"
   }
  ],
  "2025-m-eduarda-martins-da-silva": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa na modelagem das epidemias de míldio da videira (Plasmopara viticola) e das perdas de produtividade?",
    "en": "What are the main research themes in modeling grapevine downy mildew (Plasmopara viticola) epidemics and yield losses?"
   },
   {
    "tipo": "evidencias",
    "pt": "Modelos de apoio à decisão baseados no clima reduzem o uso de fungicidas contra o míldio da videira sem perder produtividade nem margem bruta?",
    "en": "Do weather-based decision support models reduce fungicide use against grapevine downy mildew without lowering yield or gross margin?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais autores e grupos de pesquisa trabalham hoje com modelagem e previsão do míldio da videira?",
    "en": "Who are the authors and research groups working on grapevine downy mildew modeling and forecasting today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo bioeconômico das estratégias de controle do míldio em vinhedos do sul do Brasil?",
    "en": "Who could help fund a bioeconomic study of downy mildew control strategies in southern Brazilian vineyards?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram redes neurais LSTM com séries climáticas para prever a severidade do míldio da videira?",
    "en": "Which studies have used LSTM neural networks with weather time series to predict grapevine downy mildew severity?"
   }
  ],
  "2025-m-fabrielle-paixao-dos-reis": [
   {
    "tipo": "panorama",
    "pt": "O que se sabe hoje sobre a faixa de operação normal (NOR) de colêmbolos e ácaros em diferentes usos do solo?",
    "en": "What is currently known about the normal operating range (NOR) of soil Collembola and mites across land uses?"
   },
   {
    "tipo": "evidencias",
    "pt": "Como o plantio direto, a pastagem e o preparo convencional afetam a abundância e a diversidade de colêmbolos e ácaros em relação à vegetação nativa?",
    "en": "How do no-till, pasture and conventional tillage affect Collembola and mite abundance and diversity compared with native vegetation?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais pesquisadores e grupos estudam hoje colêmbolos e ácaros edáficos em diferentes sistemas de uso do solo?",
    "en": "Which researchers and groups are studying soil Collembola and mites across land-use systems today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre colêmbolos e ácaros edáficos como bioindicadores do uso do solo no Sul do Brasil?",
    "en": "Who could help fund a study on soil Collembola and mites as bioindicators of land use in southern Brazil?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos já usaram redes neurais convolucionais para identificar e contar colêmbolos e ácaros do solo em imagens?",
    "en": "Which studies have used convolutional neural networks to identify and count soil Collembola and mites from images?"
   }
  ],
  "2025-m-gustavo-bachmann": [
   {
    "tipo": "panorama",
    "en": "What are the main research themes on pesticide residues in pollen collected by stingless bees in agricultural landscapes?",
    "pt": "Quais são os principais temas de pesquisa sobre resíduos de agrotóxicos no pólen coletado por abelhas sem ferrão em paisagens agrícolas?"
   },
   {
    "tipo": "evidencias",
    "en": "How does agricultural land use around stingless bee colonies affect the amount and diversity of pesticide residues in their pollen?",
    "pt": "Como o uso agrícola do solo no entorno das colônias de abelhas sem ferrão afeta a quantidade e a diversidade de agrotóxicos no pólen?"
   },
   {
    "tipo": "especialistas",
    "en": "Which authors and research groups are studying pesticide exposure in stingless bees such as Melipona quadrifasciata today?",
    "pt": "Quais autores e grupos de pesquisa estudam hoje a exposição de abelhas sem ferrão, como Melipona quadrifasciata, a agrotóxicos?"
   },
   {
    "tipo": "financiamento",
    "en": "Who could help fund a study on pesticide contamination of stingless bee pollen in agricultural landscapes of southern Brazil?",
    "pt": "Quem poderia financiar um estudo sobre a contaminação do pólen de abelhas sem ferrão por agrotóxicos em paisagens agrícolas do Sul do Brasil?"
   },
   {
    "tipo": "ia",
    "en": "Which studies have used Random Forest and landscape metrics to predict pesticide residues in pollen collected by bees?",
    "pt": "Quais estudos usaram Random Forest e métricas de paisagem para prever resíduos de agrotóxicos no pólen coletado por abelhas?"
   }
  ],
  "2025-m-italo-gabriel-torri": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre estoques de carbono do solo na regeneração da Floresta Ombrófila Mista?",
    "en": "What are the main research themes on soil carbon stocks during regeneration of Mixed Ombrophilous (Araucaria) Forest?"
   },
   {
    "tipo": "evidencias",
    "pt": "Como os estoques de carbono orgânico do solo mudam durante a regeneração florestal após pastagem ou invasão de Pinus em florestas com araucária?",
    "en": "How do soil organic carbon stocks change during forest regeneration after pasture or Pinus invasion in Araucaria forests?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais pesquisadores e grupos são referência hoje no estudo do carbono do solo em florestas com araucária em regeneração?",
    "en": "Who are the leading researchers and groups studying soil carbon in regenerating Araucaria forests today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre o estoque de carbono do solo em florestas com araucária em regeneração no sul do Brasil?",
    "en": "Who could help fund a study on soil carbon storage in regenerating Araucaria forests of southern Brazil?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram gradient boosting (XGBoost) para prever estoques de carbono do solo a partir de atributos do solo e do estágio de regeneração?",
    "en": "Which studies have used gradient boosting (XGBoost) to predict soil organic carbon stocks from soil properties and regeneration stage?"
   }
  ],
  "2025-m-julia-elizabeth-proenca": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre morfometria das árvores e produção de pinhão em Araucaria angustifolia?",
    "en": "What are the main research themes on tree morphometry and seed (pinhão) production in Araucaria angustifolia?"
   },
   {
    "tipo": "evidencias",
    "pt": "Como o DAP, as dimensões da copa, a competição e o clima afetam a produção de pinhas em árvores fêmeas de Araucaria angustifolia?",
    "en": "How do DBH, crown dimensions, competition and climate affect cone production in female Araucaria angustifolia trees?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais autores e grupos de pesquisa trabalham hoje com alometria e produção de pinhão de Araucaria angustifolia?",
    "en": "Who are the authors and research groups working on Araucaria angustifolia allometry and seed (pinhão) production today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre o manejo sustentável de Araucaria angustifolia para a produção de pinhão em Santa Catarina?",
    "en": "Who could help fund a study on sustainable management of Araucaria angustifolia for pinhão production in Santa Catarina?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram Random Forest para prever a produção de pinhas de Araucaria angustifolia com dados de DAP, copa e competição?",
    "en": "Which studies have used Random Forest to predict cone production of Araucaria angustifolia from DBH, crown and competition data?"
   }
  ],
  "2025-m-maiara-de-liz-granemann": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa em extensão florestal para a conservação e o manejo sustentável de florestas nativas?",
    "en": "What are the main research themes in forestry extension for the conservation and sustainable management of native forests?"
   },
   {
    "tipo": "evidencias",
    "pt": "Como a extensão rural, ou a falta dela, influencia o uso e a conservação de remanescentes de florestas nativas?",
    "en": "How does rural extension, or its absence, influence the use and conservation of native forest remnants?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais pesquisadores e grupos estudam hoje a extensão florestal e o manejo de florestas nativas no Brasil?",
    "en": "Which researchers and groups are studying forestry extension and native forest management in Brazil today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre extensão florestal para a conservação de florestas nativas e o desenvolvimento rural em Santa Catarina?",
    "en": "Who could help fund a study on forestry extension for native forest conservation and rural development in Santa Catarina?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos já usaram modelagem de tópicos e processamento de linguagem natural para analisar documentos de política florestal ou extensão rural?",
    "en": "Which studies have used topic modeling and natural language processing to analyze forest policy or rural extension documents?"
   }
  ],
  "2025-m-michele-fernanda-cardoso": [
   {
    "tipo": "panorama",
    "en": "What are the main research themes in satellite monitoring of forest restoration in areas embargoed for deforestation in Brazil?",
    "pt": "Quais são os principais temas de pesquisa no monitoramento por satélite da restauração florestal em áreas embargadas por desmatamento no Brasil?"
   },
   {
    "tipo": "evidencias",
    "en": "How well do NDVI, SAVI, EVI, NDRE and GNDVI from PlanetScope imagery distinguish secondary forests of different regeneration ages?",
    "pt": "Com que precisão os índices NDVI, SAVI, EVI, NDRE e GNDVI de imagens PlanetScope distinguem florestas secundárias de diferentes idades?"
   },
   {
    "tipo": "especialistas",
    "en": "Which authors and research groups are working on remote sensing of forest restoration in Brazil's Atlantic Forest today?",
    "pt": "Quais autores e grupos de pesquisa trabalham hoje com sensoriamento remoto da restauração florestal na Mata Atlântica?"
   },
   {
    "tipo": "financiamento",
    "en": "Who could help fund a study using satellite imagery to monitor restoration in deforestation-embargoed areas of southern Brazil?",
    "pt": "Quem poderia financiar um estudo que use imagens de satélite para monitorar a restauração de áreas embargadas por desmatamento no Sul do Brasil?"
   },
   {
    "tipo": "ia",
    "en": "Which studies have used Random Forest on PlanetScope vegetation indices to classify forest regeneration stages?",
    "pt": "Quais estudos usaram Random Forest com índices de vegetação do PlanetScope para classificar estágios de regeneração florestal?"
   }
  ],
  "2025-m-nayara-alves-dos-santos": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre produtos florestais não madeireiros em agroflorestas tradicionais com araucária no sul do Brasil?",
    "en": "What are the main research themes on non-timber forest products in traditional Araucaria agroforests of southern Brazil?"
   },
   {
    "tipo": "evidencias",
    "pt": "Quais modelos alométricos estimam melhor a biomassa foliar de Ilex paraguariensis e Monteverdia ilicifolia com base em DAP, altura e número de ramos?",
    "en": "Which allometric models best estimate leaf biomass of Ilex paraguariensis and Monteverdia ilicifolia from DBH, height and branch number?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais pesquisadores e grupos são referência hoje no estudo de produtos florestais não madeireiros em agroflorestas com araucária?",
    "en": "Who are the leading researchers and groups studying non-timber forest products in Araucaria agroforests today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre o manejo sustentável de produtos florestais não madeireiros em agroflorestas tradicionais com araucária?",
    "en": "Who could help fund a study on the sustainable management of non-timber forest products in traditional Araucaria agroforests?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram redes neurais convolucionais para identificar erva-mate e outras espécies nativas por fotos de folhas tiradas com o celular?",
    "en": "Which studies have used convolutional neural networks to identify yerba mate and other native species from smartphone leaf photos?"
   }
  ],
  "2025-m-roberta-abgai-schmidt-colaco": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre colêmbolos e enquitreídeos como bioindicadores da saúde do solo na restauração da Mata Atlântica?",
    "en": "What are the main research themes on Collembola and Enchytraeidae as soil health bioindicators in Atlantic Forest restoration?"
   },
   {
    "tipo": "evidencias",
    "pt": "Como colêmbolos e enquitreídeos respondem ao estágio sucessional e ao microclima do solo na Mata Atlântica em regeneração?",
    "en": "How do Collembola and Enchytraeidae respond to successional stage and soil microclimate in regenerating Atlantic Forest?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais autores e grupos de pesquisa estudam hoje colêmbolos e enquitreídeos como bioindicadores do solo na restauração florestal?",
    "en": "Who are the authors and research groups studying Collembola and Enchytraeidae as soil bioindicators in forest restoration today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre a fauna edáfica como bioindicadora no monitoramento da restauração da Mata Atlântica em Santa Catarina?",
    "en": "Who could help fund a study on soil fauna as a bioindicator for monitoring Atlantic Forest restoration in Santa Catarina?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram agrupamento k-means com dados de fauna edáfica e microclima do solo para distinguir estágios de regeneração florestal?",
    "en": "Which studies have used k-means clustering of soil fauna and microclimate data to distinguish forest regeneration stages?"
   }
  ],
  "2025-m-sarah-kormann": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre a macrofauna edáfica como indicadora da saúde do solo, incluindo a faixa normal de operação (NOR)?",
    "en": "What are the main research themes on soil macrofauna as an indicator of soil health, including the normal operating range (NOR)?"
   },
   {
    "tipo": "evidencias",
    "pt": "Como o plantio direto, o cultivo convencional e a pastagem afetam espécies nativas e exóticas de minhocas em relação à vegetação nativa?",
    "en": "How do no-till, conventional tillage and pasture affect native and exotic earthworm species compared with native vegetation?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais pesquisadores e grupos estudam hoje minhocas nativas e exóticas em solos brasileiros?",
    "en": "Which researchers and groups are studying native and exotic earthworms in Brazilian soils today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre a macrofauna edáfica e as minhocas como indicadoras da saúde do solo no Sul do Brasil?",
    "en": "Who could help fund a study on soil macrofauna and earthworms as indicators of soil health in southern Brazil?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos já usaram redes neurais convolucionais com aprendizado por transferência para identificar e contar a macrofauna do solo em imagens?",
    "en": "Which studies have used convolutional neural networks with transfer learning to identify and count soil macrofauna from images?"
   }
  ],
  "2025-m-tathiana-cristina-doin-sonda": [
   {
    "tipo": "panorama",
    "en": "What are the main research themes on green schoolyards and children's connection with nature in early childhood education?",
    "pt": "Quais são os principais temas de pesquisa sobre pátios escolares verdes e a conexão das crianças com a natureza na educação infantil?"
   },
   {
    "tipo": "evidencias",
    "en": "How does daily contact with nature in schoolyards affect young children's well-being and learning?",
    "pt": "Como o contato diário com a natureza no pátio da escola afeta o bem-estar e a aprendizagem de crianças pequenas?"
   },
   {
    "tipo": "especialistas",
    "en": "Which authors and research groups are studying children's connection with nature and green schoolyards today?",
    "pt": "Quais autores e grupos de pesquisa estudam hoje a conexão das crianças com a natureza e os pátios escolares verdes?"
   },
   {
    "tipo": "financiamento",
    "en": "Who could help fund a study on using schoolyards and urban green spaces to reconnect children with nature in Brazil?",
    "pt": "Quem poderia financiar um estudo sobre o uso de pátios escolares e áreas verdes urbanas para reaproximar as crianças da natureza no Brasil?"
   },
   {
    "tipo": "ia",
    "en": "Which studies have used U-Net segmentation of satellite imagery to map vegetation in schoolyards and green spaces near schools?",
    "pt": "Quais estudos usaram segmentação de imagens de satélite com U-Net para mapear a vegetação de pátios escolares e áreas verdes próximas às escolas?"
   }
  ],
  "2026-d-angelo-barbosa-da-silva": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre espécies alternativas de minhocas para ensaios ecotoxicológicos em solos tropicais e subtropicais?",
    "en": "What are the main research themes on alternative earthworm species for ecotoxicity tests in tropical and subtropical soils?"
   },
   {
    "tipo": "evidencias",
    "pt": "Como a sensibilidade de Pontoscolex corethrurus e Amynthas gracilis a agrotóxicos se compara à das espécies-padrão do gênero Eisenia?",
    "en": "How does the sensitivity of Pontoscolex corethrurus and Amynthas gracilis to pesticides compare with that of standard Eisenia species?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais pesquisadores e grupos realizam hoje ensaios ecotoxicológicos com espécies de minhocas tropicais e subtropicais?",
    "en": "Which researchers and groups are running ecotoxicity tests with tropical and subtropical earthworm species today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo de validação de ensaios ecotoxicológicos com minhocas para solos subtropicais do Brasil?",
    "en": "Who could help fund a study validating earthworm ecotoxicity tests for subtropical soils in Brazil?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos já usaram aprendizado de máquina para extrapolar a CE50 de agrotóxicos entre espécies de minhocas?",
    "en": "Which studies have used machine learning to extrapolate pesticide EC50 values across earthworm species?"
   }
  ],
  "2026-d-guilherme-alves-ramos": [
   {
    "tipo": "panorama",
    "en": "What are the main research themes on adapting pesticide risk assessment for earthworms to tropical and subtropical conditions?",
    "pt": "Quais são os principais temas de pesquisa sobre a adaptação da avaliação de risco de agrotóxicos para minhocas às condições tropicais e subtropicais?"
   },
   {
    "tipo": "evidencias",
    "en": "How do temperature, soil moisture and organic matter affect cast production and burrowing in Pontoscolex corethrurus and other earthworms?",
    "pt": "Como temperatura, umidade e matéria orgânica do solo afetam a produção de coprólitos e a escavação de Pontoscolex corethrurus e outras minhocas?"
   },
   {
    "tipo": "especialistas",
    "en": "Which authors and research groups are working on mechanistic modeling of pesticide risk to earthworms today?",
    "pt": "Quais autores e grupos de pesquisa trabalham hoje com modelagem mecanística do risco de agrotóxicos para minhocas?"
   },
   {
    "tipo": "financiamento",
    "en": "Who could help fund a study of earthworms from Brazilian soils to improve pesticide risk assessment under climate change?",
    "pt": "Quem poderia financiar um estudo com minhocas de solos brasileiros para aprimorar a avaliação de risco de agrotóxicos sob mudanças climáticas?"
   },
   {
    "tipo": "ia",
    "en": "Which studies have used Gaussian process regression to predict earthworm cast production from temperature and soil moisture?",
    "pt": "Quais estudos usaram regressão por processo gaussiano para prever a produção de coprólitos de minhocas a partir da temperatura e da umidade do solo?"
   }
  ],
  "2026-d-gustavo-henrique-mozzer-regazolli": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre propagação vegetativa e enraizamento adventício da goiabeira-serrana (Acca sellowiana)?",
    "en": "What are the main research themes on vegetative propagation and adventitious rooting of feijoa (Acca sellowiana)?"
   },
   {
    "tipo": "evidencias",
    "pt": "Como auxinas endógenas e compostos fenólicos se relacionam com o enraizamento adventício de genótipos de goiabeira-serrana (Acca sellowiana)?",
    "en": "How do endogenous auxins and phenolic compounds relate to adventitious rooting in feijoa (Acca sellowiana) genotypes?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais pesquisadores e grupos são referência hoje no melhoramento e na propagação vegetativa da goiabeira-serrana (Acca sellowiana)?",
    "en": "Who are the leading researchers and groups working on feijoa (Acca sellowiana) breeding and vegetative propagation today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo no Brasil sobre a seleção de genótipos de goiabeira-serrana para produção de frutos e capacidade de enraizamento?",
    "en": "Who could help fund a study in Brazil on selecting feijoa (Acca sellowiana) genotypes for fruit yield and rooting ability?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram Random Forest para prever a capacidade de enraizamento de genótipos de plantas a partir de auxinas e compostos fenólicos?",
    "en": "Which studies have used Random Forest to predict the rooting ability of plant genotypes from auxins and phenolic compounds?"
   }
  ],
  "2026-d-marilise-franca-da-rocha": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre os compostos bioativos e o potencial antitumoral das brácteas de Araucaria angustifolia?",
    "en": "What are the main research themes on the bioactive compounds and antitumor potential of Araucaria angustifolia bracts?"
   },
   {
    "tipo": "evidencias",
    "pt": "Extratos de brácteas de Araucaria angustifolia têm citotoxicidade seletiva contra linhagens tumorais de mama, pulmão, próstata e colorretal?",
    "en": "Do Araucaria angustifolia bract extracts show selective cytotoxicity against breast, lung, prostate and colorectal cancer cell lines?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais autores e grupos de pesquisa estudam hoje os compostos bioativos das brácteas de Araucaria angustifolia?",
    "en": "Who are the authors and research groups studying bioactive compounds from Araucaria angustifolia bracts today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre o aproveitamento das brácteas de Araucaria angustifolia como possível fonte de compostos antitumorais?",
    "en": "Who could help fund a study on reusing Araucaria angustifolia bracts as a potential source of antitumor compounds?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram redes neurais perceptron multicamadas para prever a CI50 de extratos vegetais em células tumorais a partir de sua composição?",
    "en": "Which studies have used multilayer perceptron networks to predict the IC50 of plant extracts against cancer cells from their composition?"
   }
  ],
  "2026-d-nadia-da-silva": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre sistemas agroflorestais com erva-mate na restauração produtiva da Mata Atlântica?",
    "en": "What are the main research themes on yerba mate agroforestry systems for productive restoration in the Atlantic Forest?"
   },
   {
    "tipo": "evidencias",
    "pt": "Como os sistemas agroflorestais com erva-mate se comparam à restauração passiva na recuperação da qualidade do solo e da fauna edáfica?",
    "en": "How do yerba mate agroforestry systems compare with passive restoration in recovering soil quality and soil fauna?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais pesquisadores e grupos estudam hoje sistemas agroflorestais para restauração ecológica na Mata Atlântica?",
    "en": "Which researchers and groups are studying agroforestry systems for ecological restoration in the Atlantic Forest today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre restauração produtiva com agroflorestas de erva-mate nas regiões de clima frio do Sul do Brasil?",
    "en": "Who could help fund a study on productive restoration with yerba mate agroforestry in the cold-climate regions of southern Brazil?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos já usaram gradient boosting (XGBoost) para prever a recuperação do solo, da fauna edáfica e da vegetação na restauração ecológica?",
    "en": "Which studies have used gradient boosting (XGBoost) to predict the recovery of soil, soil fauna and vegetation in ecological restoration?"
   }
  ],
  "2026-m-ana-claudia-miozzo": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre abelhas Euglossini e Meliponini em paisagens fragmentadas?",
    "en": "What are the main research themes on orchid bees (Euglossini) and stingless bees (Meliponini) in fragmented landscapes?"
   },
   {
    "tipo": "evidencias",
    "pt": "Como a composição da paisagem e a fragmentação do habitat afetam a riqueza e a abundância de abelhas-das-orquídeas e de abelhas sem ferrão?",
    "en": "How do landscape composition and habitat fragmentation affect the richness and abundance of orchid bees and stingless bees?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais autores e grupos de pesquisa estudam hoje os efeitos da paisagem sobre comunidades de abelhas-das-orquídeas e abelhas sem ferrão?",
    "en": "Which authors and research groups are studying landscape effects on orchid bee and stingless bee communities today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre como paisagens fragmentadas moldam comunidades de abelhas nativas Euglossini e Meliponini no Brasil?",
    "en": "Who could help fund a study on how fragmented landscapes shape native orchid bee and stingless bee communities in Brazil?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram boosted regression trees para relacionar a cobertura florestal à riqueza de abelhas Euglossini e Meliponini?",
    "en": "Which studies have used boosted regression trees to relate forest cover to the species richness of Euglossini and Meliponini bees?"
   }
  ],
  "2026-m-caroline-moraes": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre como os reservatórios de hidrelétricas influenciam a dinâmica da regeneração natural?",
    "en": "What are the main research themes on how hydroelectric reservoirs influence the dynamics of natural regeneration?"
   },
   {
    "tipo": "evidencias",
    "pt": "Como os reservatórios de hidrelétricas afetam o recrutamento, a mortalidade e a composição de espécies da regeneração natural no entorno?",
    "en": "How do hydroelectric reservoirs affect recruitment, mortality and species composition of natural regeneration in surrounding areas?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais pesquisadores e grupos são referência hoje no estudo da regeneração natural no entorno de reservatórios de hidrelétricas?",
    "en": "Who are the leading researchers and groups studying natural regeneration around hydroelectric reservoirs today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo no Brasil sobre a regeneração natural em áreas sob influência de reservatórios de hidrelétricas?",
    "en": "Who could help fund a study in Brazil on natural regeneration in areas influenced by hydroelectric reservoirs?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram Random Forest em séries de imagens de satélite para mapear a regeneração natural no entorno de reservatórios de hidrelétricas?",
    "en": "Which studies have used Random Forest on satellite image time series to map natural regeneration around hydropower reservoirs?"
   }
  ],
  "2026-m-emanuelle-veronica-panisson": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre bioinsumos para mudas nativas na restauração da Mata Atlântica?",
    "en": "What are the main research themes on bio-inputs for native seedlings in Atlantic Forest restoration?"
   },
   {
    "tipo": "evidencias",
    "pt": "Como os bioinsumos afetam o crescimento e o desenvolvimento de mudas de espécies nativas da Mata Atlântica usadas na restauração ecológica?",
    "en": "How do bio-inputs affect the growth and development of seedlings of native Atlantic Forest species used in ecological restoration?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais autores e grupos de pesquisa estudam hoje bioinsumos para mudas nativas na restauração da Mata Atlântica?",
    "en": "Who are the authors and research groups studying bio-inputs for native seedlings in Atlantic Forest restoration today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre o efeito de bioinsumos em mudas nativas da Mata Atlântica para restauração ecológica?",
    "en": "Who could help fund a study on the effect of bio-inputs on native Atlantic Forest seedlings for ecological restoration?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram Random Forest para prever o efeito de bioinsumos no crescimento de mudas de espécies nativas da Mata Atlântica?",
    "en": "Which studies have used Random Forest to predict the effect of bio-inputs on the growth of native Atlantic Forest seedlings?"
   }
  ],
  "2026-m-esther-escarrone-pereira": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre sistemas agrícolas tradicionais do pinhão e a conservação da Floresta com Araucária?",
    "en": "What are the main research themes on traditional pinhão agricultural systems and the conservation of Araucaria forests?"
   },
   {
    "tipo": "evidencias",
    "pt": "Que evidências relacionam os sistemas tradicionais do pinhão à conservação da araucária e da Floresta Ombrófila Mista?",
    "en": "What evidence links traditional pinhão systems to the conservation of Araucaria angustifolia and the Mixed Ombrophilous Forest?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais pesquisadores e grupos estudam hoje o pinhão e a conservação da araucária (Araucaria angustifolia)?",
    "en": "Which researchers and groups are studying pinhão and the conservation of Araucaria angustifolia today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre sistemas tradicionais do pinhão e a conservação da Floresta Ombrófila Mista?",
    "en": "Who could help fund a study on traditional pinhão systems and the conservation of the Mixed Ombrophilous Forest?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram k-means para criar tipologias de propriedades com coleta de pinhão e relacioná-las à conservação de florestas com araucária?",
    "en": "Which studies have used k-means clustering to build typologies of farms that harvest Araucaria seeds (pinhão) and relate them to forest conservation?"
   }
  ],
  "2026-m-frank-marcelo-da-silva-araujo": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre a produção de pinhão e a regeneração natural de Araucaria angustifolia?",
    "en": "What are the main research themes on pinhão production and natural regeneration of Araucaria angustifolia?"
   },
   {
    "tipo": "evidencias",
    "pt": "Como a produção e a coleta de pinhão afetam a regeneração natural de Araucaria angustifolia em propriedades rurais?",
    "en": "How do pinhão production and harvesting affect the natural regeneration of Araucaria angustifolia on rural properties?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais autores e grupos de pesquisa estudam hoje a produção de pinhão e a regeneração natural de Araucaria angustifolia?",
    "en": "Which authors and research groups are studying pinhão production and natural regeneration of Araucaria angustifolia today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre a safra de pinhão e a regeneração da araucária em propriedades rurais da serra catarinense?",
    "en": "Who could help fund a study on pinhão yield and Araucaria angustifolia regeneration on rural properties in the Santa Catarina highlands?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram gradient boosting ou modelos de contagem para relacionar a colheita de pinhão à regeneração natural da araucária?",
    "en": "Which studies have used gradient boosting or count models to relate Araucaria angustifolia seed harvesting to its natural regeneration?"
   }
  ],
  "2026-m-gabriel-ansiliero": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre a pérola-da-terra (Eurhizococcus brasiliensis) como praga da videira?",
    "en": "What are the main research themes on the Brazilian ground pearl (Eurhizococcus brasiliensis) as a grapevine pest?"
   },
   {
    "tipo": "evidencias",
    "pt": "Quais porta-enxertos de videira toleram Eurhizococcus brasiliensis e como a temperatura afeta seu ciclo biológico e sua reprodução?",
    "en": "Which grapevine rootstocks tolerate Eurhizococcus brasiliensis, and how does temperature affect its life cycle and reproduction?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais pesquisadores e grupos são referência hoje no estudo da pérola-da-terra (Eurhizococcus brasiliensis) em vinhedos?",
    "en": "Who are the leading researchers and groups studying the Brazilian ground pearl (Eurhizococcus brasiliensis) in vineyards today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre porta-enxertos de videira tolerantes à pérola-da-terra (Eurhizococcus brasiliensis)?",
    "en": "Who could help fund a study on grapevine rootstocks tolerant to the Brazilian ground pearl (Eurhizococcus brasiliensis)?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram processos gaussianos para modelar o efeito da temperatura na reprodução de cochonilhas, como a pérola-da-terra?",
    "en": "Which studies have used Gaussian processes to model temperature effects on the reproduction of scale insects such as Eurhizococcus brasiliensis?"
   }
  ],
  "2026-m-jucemara-de-oliveira-prestes": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa na produção de dálias de corte (Dahlia spp.), sobretudo em regiões de altitude?",
    "en": "What are the main research themes in cut dahlia (Dahlia spp.) production, especially in high-altitude regions?"
   },
   {
    "tipo": "evidencias",
    "pt": "Como a época de plantio afeta o florescimento e a produção de hastes de dálias de corte cultivadas em regiões de altitude?",
    "en": "How does planting date affect flowering and stem yield of cut dahlias grown in high-altitude regions?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais autores e grupos de pesquisa trabalham hoje com a produção de dálias de corte (Dahlia spp.)?",
    "en": "Who are the authors and research groups working on cut dahlia (Dahlia spp.) production today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre a produção de dálias de corte em regiões de altitude do sul do Brasil?",
    "en": "Who could help fund a study on cut dahlia production in high-altitude regions of southern Brazil?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram XGBoost com dados meteorológicos para prever a produção de dálias ou outras flores de corte por época de plantio?",
    "en": "Which studies have used XGBoost with weather data to predict dahlia or other cut-flower yield across planting dates?"
   }
  ],
  "2026-m-luiza-franco-de-souza": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa em espectroscopia de solos agrícolas para predizer o nitrogênio e seu isótopo estável 15N?",
    "en": "What are the main research themes in spectroscopy of agricultural soils for predicting nitrogen and its stable isotope 15N?"
   },
   {
    "tipo": "evidencias",
    "pt": "Qual é a acurácia da espectroscopia na predição de nitrogênio-15 (15N) em solos agrícolas?",
    "en": "How accurately can spectroscopy predict nitrogen-15 (15N) in agricultural soils?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais pesquisadores e grupos usam hoje a espectroscopia para predizer isótopos de nitrogênio no solo?",
    "en": "Which researchers and groups are using spectroscopy to predict nitrogen isotopes in soil today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre a predição de nitrogênio-15 (15N) em solos agrícolas por espectroscopia?",
    "en": "Who could help fund a study on predicting nitrogen-15 (15N) in agricultural soils with spectroscopy?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram redes neurais convolucionais 1D em espectros de solo para prever o 15N em solos agrícolas?",
    "en": "Which studies have used one-dimensional convolutional neural networks on soil spectra to predict 15N in agricultural soils?"
   }
  ],
  "2026-m-paula-tonatto-carlos-pereira": [
   {
    "tipo": "panorama",
    "en": "What are the main research themes on the cytogenotoxic and mutagenic effects of enrofloxacin and other fluoroquinolones in plants?",
    "pt": "Quais são os principais temas de pesquisa sobre os efeitos citogenotóxicos e mutagênicos da enrofloxacina e de outras fluoroquinolonas em plantas?"
   },
   {
    "tipo": "evidencias",
    "en": "How does enrofloxacin exposure affect the mitotic index, chromosomal aberrations and micronuclei in bioindicator plants?",
    "pt": "Como a exposição à enrofloxacina afeta o índice mitótico, as aberrações cromossômicas e os micronúcleos em plantas bioindicadoras?"
   },
   {
    "tipo": "especialistas",
    "en": "Which authors and research groups are studying the genotoxicity of veterinary antibiotics such as enrofloxacin in plants today?",
    "pt": "Quais autores e grupos de pesquisa estudam hoje a genotoxicidade de antibióticos veterinários, como a enrofloxacina, em plantas?"
   },
   {
    "tipo": "financiamento",
    "en": "Who could help fund a study on the genetic damage that veterinary antibiotics such as enrofloxacin may cause in plants?",
    "pt": "Quem poderia financiar um estudo sobre os danos genéticos que antibióticos veterinários, como a enrofloxacina, podem causar em plantas?"
   },
   {
    "tipo": "ia",
    "en": "Which studies have used convolutional neural networks to detect micronuclei and chromosomal bridges in plant cell microscopy images?",
    "pt": "Quais estudos usaram redes neurais convolucionais para detectar micronúcleos e pontes cromossômicas em imagens de microscopia de células vegetais?"
   }
  ],
  "2026-m-renzo-sebastian-huerta-jimenez": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre espectroscopia óptica aplicada à estimativa da fixação biológica de nitrogênio?",
    "en": "What are the main research themes on optical spectroscopy applied to estimating biological nitrogen fixation?"
   },
   {
    "tipo": "evidencias",
    "pt": "Com que precisão a espectroscopia óptica prevê o ¹⁵N foliar para estimativas de fixação biológica de nitrogênio?",
    "en": "How accurately can optical spectroscopy predict leaf ¹⁵N for estimating biological nitrogen fixation?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais pesquisadores e grupos são referência hoje no uso da espectroscopia óptica para estimar o ¹⁵N foliar ou a fixação biológica de nitrogênio?",
    "en": "Who are the leading researchers and groups using optical spectroscopy to estimate leaf ¹⁵N or biological nitrogen fixation today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo no Brasil sobre a estimativa da fixação biológica de nitrogênio por espectroscopia óptica?",
    "en": "Who could help fund a study in Brazil on estimating biological nitrogen fixation with optical spectroscopy?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram Random Forest em espectros foliares para prever o ¹⁵N foliar e estimar a fixação biológica de nitrogênio?",
    "en": "Which studies have used Random Forest on leaf spectra to predict leaf ¹⁵N and estimate biological nitrogen fixation?"
   }
  ],
  "2026-m-vitoria-cozer": [
   {
    "tipo": "panorama",
    "pt": "Quais são os principais temas de pesquisa sobre a resiliência e a resistência da Floresta Ombrófila Mista (Floresta com Araucária)?",
    "en": "What are the main research themes on the resilience and resistance of Araucaria Forest (Mixed Ombrophilous Forest)?"
   },
   {
    "tipo": "evidencias",
    "pt": "Quais fatores bióticos, abióticos e antropogênicos mais afetam a forma como a Floresta Ombrófila Mista resiste a distúrbios e se recupera?",
    "en": "Which biotic, abiotic and anthropogenic factors most influence how Araucaria Forest resists and recovers from disturbance?"
   },
   {
    "tipo": "especialistas",
    "pt": "Quais autores e grupos de pesquisa estudam hoje a resiliência e a resistência da Floresta Ombrófila Mista?",
    "en": "Who are the authors and research groups studying the resilience and resistance of Araucaria Forest today?"
   },
   {
    "tipo": "financiamento",
    "pt": "Quem poderia financiar um estudo sobre como fatores naturais e humanos afetam a resiliência da Floresta Ombrófila Mista em Santa Catarina?",
    "en": "Who could help fund a study on how natural and human factors affect the resilience of Araucaria Forest in Santa Catarina?"
   },
   {
    "tipo": "ia",
    "pt": "Quais estudos usaram XGBoost e SHAP em séries de imagens de satélite para identificar os fatores da resistência e da resiliência de florestas à seca?",
    "en": "Which studies have used XGBoost and SHAP on satellite time series to identify the drivers of forest resistance and resilience to drought?"
   }
  ]
 }
};
