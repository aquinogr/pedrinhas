# Recomeço — Casa da Galeria e Casa do Pátio

Estudo preliminar iniciado em 30/10/2026, com revisão de compatibilidade em 31/10/2026, refeito após a crítica aos projetos anteriores. Não reutilizar a geometria de `MODELOS REVISADOS` como base para estas casas. O acervo de móveis foi reaproveitado, mas a implantação, os quartos, banheiros, escadas, aberturas e coberturas foram redesenhados.

## Arquivos de trabalho

Endereço do projeto: https://casas-de-campo-12x35.geraldoreisaquino.chatgpt.site — acesso privado preservado. A apresentação nova fica na entrada principal e em `/recomeco.html`. Os arquivos finais desta revisão ficam em `CODEX - PLANTAS/RECOMECO`; os arquivos antigos foram preservados, não são a base geométrica das novas casas.

- `gerar.py`: fonte geométrica em metros. Gera `projetos.json`, `edicula.sh3d` e `patio.sh3d`, com cópias para o site.
- `revisar.py`: verificações independentes com Shapely, instalado apenas em `.deps` nesta pasta.
- `revisao.json`: resultados da última execução, com escopo explícito. Um resultado positivo não equivale à aprovação arquitetônica, legal ou estrutural.
- `inspecionar.cjs`: abre o site local no Chrome com Playwright, verifica o carregamento, captura exterior/térreo/superior e as quatro plantas, e verifica largura de tela de 390 px.
- `casas-novas-offline.html`: apresentação única, com dados, bibliotecas e modelos 3D incorporados. Abrir diretamente no navegador; para baixar SH3D, manter os dois arquivos nesta pasta.
- `../site-propostas/dist/recomeco.html` e `../site-propostas/dist/assets/recomeco/app.js`: apresentação e visualizador. O site usa a mesma geometria que o gerador, não uma imagem inventada por IA.
- `sweethome-edicula.png` e `sweethome-patio.png`: registros finais de conferência no aplicativo. Não confundir essas capturas com renderizações fotorrealistas. `sweethome-revisao.png` é um registro intermediário, não a entrega.
- `ValidateRoof.java`, `java-validation.log`: teste dos onze modelos de cobertura com o próprio leitor OBJ do Sweet Home 3D; `InspectHome.java` confere a leitura XML e os limites dos objetos.
- `auditoria-detalhes.py` e `auditoria-detalhes.json`: giro completo das portas, espaço frontal das bacias, folga de 75 cm atrás das cadeiras, contagem de assentos, janelas externas, pilares e sobreposição de móveis. O programa termina com erro se um desses testes falhar.

## Programa e decisões

As duas alternativas têm **cinco suítes**: três térreas e duas no superior. Os banheiros dos quartos menores são acessados pelo vestíbulo privativo da própria suíte. Não há banheiro compartilhado entre quartos nesta revisão. A master tem banheiro e closet com entradas independentes pelo quarto. O escritório e a master dão para a varanda frontal.

**Casa da Galeria / edícula.** Estar e cozinha ficam na frente, gourmet em seguida. A lavanderia e o depósito foram transferidos para a faixa frontal direita; a entrada social permanece diretamente no estar. As três suítes térreas ficam na lateral, ligadas pela galeria coberta. A piscina lateral termina 1,20 m antes do quiosque de 4,00 × 4,10 m. A mesa externa tem 2,50 × 1,05 m e oito assentos. Apoio e lavabo ficam no fundo, com parede externa na linha de 35 m e jardim entre o quiosque e esse anexo. O lavabo abre para o acesso lateral direito, sem obrigar passagem junto à churrasqueira. O gourmet interno tem dez lugares e 29,75 m² livres, ligeiramente abaixo da referência de 30 m².

**Casa do Pátio.** Duas suítes térreas ficam na frente e a terceira na ala direita; a escada fica à esquerda. O estar abre para o pátio descoberto e segue para a cozinha/gourmet. Piscina e quiosque ficam lado a lado, com faixa de 1,20 m entre a água e o limite do pavilhão. A mesa externa tem 2,60 × 1,05 m, oito assentos e fica separada das bancadas. Lavanderia de 4,08 m² e depósito de 2,64 m² ficam atrás da mesa; apoio e lavabo ocupam a faixa final do lote. Um percurso pela lateral da piscina dá acesso ao apoio e ao anteparo do lavabo. A janela do lavabo abre para o corredor lateral, não para o vizinho de fundo. O gourmet interno tem dez lugares.

Em ambas: piscina de 2,50 × 5,00 m (12,50 m² de água), quiosque coberto, lavabo acessível sem entrar na casa e três vagas de 2,50 × 5,00 m. A profundidade desejada de 1,40 m é indicação do programa, ainda sem projeto estrutural/hidráulico da piscina. O visualizador representa superfície, borda e acesso por escada inox; não simula uma escavação construtiva nem certifica acesso universal. A escada inox substitui os antigos blocos que pareciam flutuar sobre a água.

### Revisão solicitada em 31/10 — divisa, janelas e mobiliário

- **Fundos, não lateral:** escolhi concentrar ambos os anexos na divisa posterior para preservar o acesso lateral contínuo. As paredes cegas são novas paredes próprias, dentro do lote; não se pressupõe que o muro do vizinho suporte cargas.
- A cobertura desses anexos sobe na direção dos fundos e drena para a frente, dentro do terreno. Não há beiral projetado sobre o vizinho. Estrutura, impermeabilização e calhas ainda precisam de projeto específico.
- A churrasqueira ficou no lado interno do apoio, com sua borda posterior a 1,55 m da divisa. Essa distância **não prova** atendimento ao art. 151: o enquadramento do uso como gerador de incômodo precisa ser avaliado, inclusive fumaça e ruído.
- Todas as janelas têm folhas de giro **para fora**, mostradas abertas em 30°. Folhas menores e limitador de abertura evitam invadir os percursos verificados. A área nominal dos vãos não equivale à ventilação efetiva; o fabricante, a área útil de ventilação e a segurança de manutenção ainda precisam de definição. Não retirar os limitadores sem revisar a circulação externa.
- A TV do estar do pátio passou para a parede interior, fora da janela. No Sweet Home, as novas janelas são conjuntos geométricos de marco e folhas abertas, não as janelas antigas do catálogo com sentido de giro ambíguo. O vidro nativo é esquemático.
- A varanda superior tem pilares previstos nos quatro cantos e um apoio frontal intermediário, além da viga frontal. A distribuição aparece nas plantas, no 3D web e no SH3D; não substitui cálculo de estrutura ou fundações.
- Os guarda-corpos da varanda receberam preenchimento vertical; os da escada receberam barras adicionais. Não são certificados quanto a cargas ou normas técnicas.
- Mesas e cadeiras foram dimensionadas de forma coerente entre planta e modelo. O teste confere oito lugares no quiosque, dez no gourmet e 75 cm livres atrás de cada cadeira, sem afirmar passagem confortável simultânea com cadeira puxada.
- Banheiros têm bacias voltadas para a área de uso e 60 cm frontais livres no ensaio geométrico. Na Galeria e na suíte superior menor, as portas de banho abrem para o vestíbulo privativo. Nos três banhos térreos do Pátio, abrem para dentro do banho, sem colidir com as peças, evitando conflito com a porta de entrada da suíte. A auditoria também verifica sobreposição dos giros de duas portas. Armários dos quartos são previstos com portas de correr; os quartos compactos tiveram as camas reposicionadas.

## Escada: conta, chegada e proteção

- Desnível entre pisos acabados: 3,15 m.
- 18 espelhos de 17,5 cm; dois lances de 9 espelhos com 8 pisos de 28 cm em cada lance.
- Blondel: 2 × 17,5 + 28 = 63 cm.
- Lances de 1,10 m úteis, separação central de 25 cm e patamar de 1,10 m.
- Desenvolvimento: 8 × 0,28 + 1,10 = 3,34 m. Vão previsto: 2,45 × 3,50 m.
- A chegada superior abre para hall comum, sem parede transversal. Uma faixa de piso de 7,5 cm fecha a junta entre laje e chegada.
- Há proteção transversal sobre o início do lance inferior, deixando aberto o desembarque do lance superior. Os corrimãos acompanham os lances no visualizador. No SH3D, os montantes e segmentos de corrimão são objetos simplificados.

Não inserir uma viga atravessando esse vazio. A altura livre de referência foi preservada pela abertura integral e pelo pé-direito superior nominal de 2,95 m; dimensionamento estrutural, espessuras definitivas, altura livre ao longo de cada piso, corrimãos e guarda-corpos devem ser conferidos no executivo. O corte do site é **desenvolvido**, isto é, abre os dois lances em uma mesma representação; não é um corte reto comum.

## Coberturas

A cobertura agora está definida por volume e coordenadas, com superfícies inclinadas e fechamento das laterais. A verificação procura falta de cobertura, invasão do pátio e sobreposição no mesmo nível.

- Edícula: duas águas no bloco principal (inclinação geométrica de aproximadamente 32%); laje impermeabilizada com caimento de 1,5% sobre a extensão da suíte superior; planos metálicos sugeridos para a ala térrea e o quiosque.
- Pátio: planos de uma água, em níveis diferentes. O pátio central permanece aberto ao céu e seu jardim não recebe laje de piso.
- O 3D web inclui calhas esquemáticas e condutores, inclusive nas duas águas da cobertura principal da edícula. Nos encontros com volumes mais altos, prever rufos e contrarrufos. Os encontros entre telhados adjacentes precisam de calha dimensionada; as imagens não substituem um projeto de drenagem.
- Inclinações finais, telhas, isolamento, fixação contra vento, drenagem, extravasores, acesso para manutenção e solução estrutural dependem de fabricante e projeto executivo.

## Áreas

O programa calcula a união dos polígonos de piso e paredes, evitando somar duas vezes paredes e sobreposições. No superior, desconta o vazio útil da escada. Os valores não são uma medição municipal certificada.

| Medida | Galeria | Pátio |
|---|---:|---:|
| Terreno | 420,00 m² | 420,00 m² |
| Térreo coberto | 205,57 m² | 211,58 m² |
| Superior, descontado o vazio | 101,33 m² | 101,85 m² |
| Total geométrico | 306,90 m² | 313,43 m² |
| Projeção / ocupação de estudo | 205,57 m² / 48,9% | 211,58 m² / 50,4% |
| Solo natural calculado | 135,31 m² / 32,2% | 126,84 m² / 30,2% |

**Premissa essencial do solo natural:** o estacionamento tem duas faixas concretadas de 40 cm × 4,15 m por vaga e grama sobre solo entre elas. Só a área real de grama foi computada como natural. Não foi considerado concreto drenante como 100% permeável. Toda projeção das coberturas, inclusive beirais, água da piscina, bordas e percursos pavimentados foi excluída. Se as vagas forem integralmente concretadas, os percentuais cairão e o projeto terá de ser ajustado. A aceitação municipal desses trechos como solo natural e o desempenho do solo sujeito a veículos precisam de confirmação. **O pátio tem margem de apenas 0,84 m² sobre os 126 m² de referência:** não aumentar calçadas ou bases impermeáveis sem recalcular. Mudanças de implantação legal também exigirão novo cálculo.

Os acessos exteriores laterais têm 1,10 m (edícula) e 1,20 m (pátio). O trecho atrás dos carros é mais estreito, com 0,90 m. A revisão de colisão das rotas usa uma faixa de 60 cm e não certifica acessibilidade. Usar dimensões reais dos veículos e estudar manobras, portões e circulação acessível na etapa seguinte.

## Pesquisa anterior ao desenho

1. [ProjetEEE / MME — Inércia térmica para resfriamento](https://projeteee.mme.gov.br/estrategia/inercia-termica-para-resfriamento/): massa térmica depende de controle do sol e de ventilação; não foi prometido resfriamento automático pela piscina.
2. [ProjetEEE / MME — Tipos de proteção solar](https://projeteee.mme.gov.br/implementacao/tipos-de-protecao-solar/): proteção externa, vegetação e elementos vazados. A fonte foi encontrada na busca; o acesso direto apresentou timeout.
3. [LabEEE / UFSC — Arquitetura e clima](https://labeee.ufsc.br/sites/default/files/documents/APOSTILA_DialagoEE_ZB.pdf): referência de ventilação seletiva, sombra e envoltória. Classificação histórica não comprova o enquadramento normativo atual do lote.
4. [Casa Planos / Rede Arquitetos, Sobral](https://www.archdaily.com.br/br/970962/casa-planos-rede-arquitetos): descrição dos arquitetos, usada para pensar pátios, privacidade e venezianas no semiárido.
5. [Casas MBV2 / Rede Arquitetos, publicação e entrevista dos autores](https://mdc.arq.br/2023/12/24/casas-e-edificio-misto-em-sobral/): quartos associados a vazios e esquadrias recuadas.
6. [Guia interativo de eficiência energética — GIZ / SindusCon / MME](https://www.gov.br/cidades/pt-br/acesso-a-informacao/acoes-e-programas/habitacao/arquivos/9-_guia-de-eficiencia-energetica.pdf): projeto integrado e desempenho da envoltória.

As aplicações às duas casas são decisões de concepção baseadas nessas referências; não foram feitas simulações térmicas, aerodinâmicas ou solares horárias. Frente 115°, fundos 295°, vento SE e localização foram mantidos como dados do briefing. As laterais também recebem insolação sazonal; não se deve presumir ausência permanente de sol em uma delas.

## Petrolina: o que foi e o que não foi confirmado

O `.md` original menciona parâmetros de 2006. Eles não foram tratados como prova de lei vigente. A consulta identificou a [republicação da LC 034/2022 no Diário Oficial de Petrolina de 31/05/2022](https://doem.org.br/pe/petrolina/diarios/previsualizar/XVrk7eNw) e o uso dessa lei em documento oficial de 2026. A LC possui anexos próprios para núcleos urbanos e parâmetros de ocupação; não basta citar genericamente “Anexo II”.

Foi baixada e lida a republicação oficial, edição 2.960, páginas 44–47 do PDF, disponível localmente em `Petrolina-LC034-republicacao-2022.pdf` (arquivo de referência, não enviado ao site). Art. 141: os afastamentos dependem de zona e número de pavimentos, com Anexo 13-A. Arts. 146 e 147: há hipóteses de afastamentos laterais e de fundo nulos nas Zonas de Adensamento Intensivo/Moderado e de Transição 01. Art. 148: a Zona de Transição 02 exige, para até dois pavimentos, frente de 10 m e laterais/fundos de 3 m. Logo, **não é correto afirmar que colar apoio/lavabo é permitido em qualquer lote de Petrolina**.

Art. 150 trata da altura de construções coladas às divisas. Art. 151 restringe a implantação junto às divisas para usos geradores de ruído ou incômodo. Art. 152 exige afastamento para fachadas com aberturas e veda aberturas voltadas ao outro lote na parede de divisa. O anexo proposto tem parede de fundo cega e todas as aberturas voltadas para espaços internos ao lote; isso não elimina as demais exigências.

Não foi obtida uma consolidação oficial integral com todas as alterações nem a vinculação cadastral deste lote à zona aplicável. Assim, **o anexo nos fundos é uma hipótese expressamente condicionada à confirmação municipal e do condomínio**, não autorização para obra. Se o lote for ZT02, por exemplo, será necessário rever também a implantação principal, não só o anexo. Frente de 5 m, laterais de 1,50 m e 30% de solo natural são critérios preliminares do briefing. O fundo de 1,50 m foi substituído nesta alternativa pela hipótese solicitada de anexo cego na divisa; o restante da casa mantém o envelope de estudo original. Confirmar ainda APP/proximidade do São Francisco, Código de Obras, altura, ocupação e vagas. A regra antiga de uma vaga por 150 m² produziria três vagas para estes totais, mas sua aplicação vigente não está certificada.

## Revisão realizada e correções durante o trabalho

Foi feita uma segunda leitura independente e uma auditoria geométrica que encontrou e corrigiu:

- Móveis junto às portas dos banheiros, escritório e acessos sociais.
- Caminho que cruzava a mesa do gourmet e caminho que cruzava a mesa do quiosque.
- Porta espelhada que abria para o corredor; as entradas dos vestíbulos agora abrem para dentro, com dobradiça no extremo que libera a passagem ao quarto.
- Aproximação estreita da escada da casa do pátio.
- Fresta na chegada superior e falta de proteção transversal na borda da laje.
- Coberturas que se sobrepunham, pequena faixa de parede sem cobertura e laterais abertas nos planos inclinados.
- Laje de piso desenhada sobre o jardim do pátio.
- Entrada da edícula que obrigava a atravessar a cozinha para chegar ao estar; foi criada entrada social direta.
- Divergências entre nome de circulação e ligação física de algumas portas.
- Incompatibilidade das coberturas no leitor OBJ nativo: faltava uma quebra de linha após o último índice da última face. Corrigida; o ensaio atual percorre automaticamente os onze volumes.
- Arcos gigantes das janelas herdados do catálogo anterior: os eixos e a largura da folha estavam em centímetros, mas o SH3D requer frações normalizadas. Corrigidos e incluídos nos testes de regressão.
- Coberturas encobrindo a planta térrea: agora ficam nos níveis próprios `Cobertura térrea` e `Cobertura superior`. O arquivo abre no nível `Térreo`, com escala e origem definidas.

As verificações positivas abrangem geometria e funcionamento do visualizador. Não garantem que não exista outra falha; o estudo precisa de desenvolvimento por profissional habilitado para obra.

## Sweet Home 3D e acervos

Os SH3D são arquivos ZIP/XML nativos, com bibliotecas compatíveis incorporadas. Foram acrescentados modelos OBJ próprios das coberturas; paredes são recortadas de fato, em vez de apenas receber um símbolo de porta. Portas são representadas abertas para inspeção; passagens sem folha continuam distintas de portas. O web usa os modelos da Poly Haven e carros Scopia do acervo anterior; o SH3D usa as peças originais compatíveis do catálogo local.

No arquivo nativo também foram incluídos terreno, percursos, pilares esquemáticos do quiosque/galeria/varanda e guarda-corpo nas três bordas livres da varanda. Os pilares não representam cálculo estrutural. Para inspecionar o interior em 3D, ocultar os níveis de cobertura no aplicativo; no site basta selecionar `Térreo aberto` ou `Superior aberto`.

Ver os créditos detalhados em `../MODELOS REVISADOS/CREDITOS-ACERVO-3D.md` e em `../../CASA 3/creditos-modelos.txt`. Poly Haven: CC0; carros Scopia: CC BY 3.0, redimensionados. Não atribuir autoria destes móveis à IA.

A edição Microsoft Store apresentou oferta de assinatura. Para a conferência foi obtido o [JAR gratuito 7.5, ligado pela página oficial](https://www.sweethome3d.com/download/), em `SweetHome3D-7.5.jar`. SHA-256 conferido com SourceForge: `1a0f025a0b4d2956098469114fa9e12b994819699c683dfda2d6854d8d829590`. O runtime OpenJDK existente foi copiado para `runtime-openjdk` para executar o JAR localmente. Não foi iniciada assinatura nem teste pago. Essas ferramentas ficam somente nesta pasta e não são publicadas no site.

## Como continuar

1. Ler `../../CASA 3/PROMPT-CASA-PEDRINHAS.md` e este memorial. Preservar todos os originais fora de `CODEX - PLANTAS`.
2. Alterar a geometria em `gerar.py`, não apenas a imagem ou o HTML. Coordenadas em metros, rua em y=0, parede de 15 cm, pisos em z=0 e z=3,15 m.
3. Executar `python -X utf8 gerar.py`, `python -X utf8 revisar.py` e `python -X utf8 auditoria-detalhes.py`. Corrigir qualquer falha antes de entregar. Não reduzir os critérios dos testes para ocultar uma colisão. `refinar_lazer()` prevalece sobre as disposições iniciais das funções-base; `detail()` gera folhas externas e pilares compartilhados com as apresentações.
4. Servir `../site-propostas/dist` localmente e executar `node inspecionar.cjs`. Inspecionar as quatro plantas, as três camadas de cada casa e vistas da escada/piscina. A checagem de celular é uma emulação de viewport, não ensaio num aparelho físico.
5. Executar `python -X utf8 empacotar.py` para atualizar HTML offline, memorial publicado e entrada principal. Testar também o offline com rede bloqueada.
6. Abrir os SH3D no Sweet Home e conferir a compatibilidade visual dos modelos, especialmente coberturas e escadas. A planilha de áreas do site usa métricas próprias e não depende da área bruta exibida automaticamente pelo Sweet Home.
7. Publicar no mesmo projeto Sites `appgprj_6ae4cb3cf41881918b09ab1232689a62`, preservando a audiência privada existente e seguindo a habilidade Sites. Nunca salvar tokens no projeto.

Próximas etapas de arquitetura: estudo completo de insolação, vãos úteis de ventilação com portas dos quartos fechadas, esquadrias, ventilação dos vestíbulos, instalações hidrossanitárias e descidas entre pavimentos, prumadas, estrutura, estanqueidade, sistema de cobertura, acessibilidade, piscina e licenciamento. A varanda, o pátio e os beirais são estratégias previstas, não desempenho medido.

### Conferência nativa reproduzível

Dentro desta pasta, executar o JAR com o runtime local e o argumento `-open edicula.sh3d` (ou `-open patio.sh3d`). A classe `ValidateRoof.java` pode ser executada em modo de arquivo-fonte Java 11 com classpath `SweetHome3D-7.5.jar;java-diagnostic/*` e opção `-Dj3d.rend=noop`; fornecer os dois SH3D como argumentos. As bibliotecas de `java-diagnostic` foram extraídas do próprio JAR oficial. Não usar `-Djava.awt.headless=true` nesse teste, pois Java 3D inicializa componentes gráficos mesmo sem janela. Não retirar a quebra de linha final dos OBJ.

### Resultado dos ensaios

- Auditoria geométrica: as duas casas sem falhas nos critérios automatizados descritos em `revisao.json`.
- Auditoria de detalhes: ambos os projetos passaram nos critérios descritos no relatório próprio; áreas nominais de janelas foram comparadas ao briefing, sem certificação de ventilação efetiva.
- Leitor OBJ do aplicativo: onze coberturas carregadas, sem erro de formato.
- Navegador: ambas as casas e seus três modos de exibição; acervo carregado; sem erro JavaScript detectado; sem transbordamento horizontal em viewport de 390 px.
- HTML offline: mesmos testes com requisições HTTP/HTTPS bloqueadas.

Esses ensaios não equivalem a aprovação de arquitetura, estrutura, segurança contra incêndio, acessibilidade ou legislação. A apresentação é uma maquete de estudo navegável com mobiliário texturizado, não uma fotografia nem um projeto executivo.
