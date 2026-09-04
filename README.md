# Eleven Imobiliária

Site estático e modular da Eleven Imobiliária. O projeto não precisa instalar dependências e pode ser editado diretamente no VS Code.

## Abrir no VS Code

1. Abra esta pasta no VS Code.
2. Instale a extensão **Live Server**.
3. Clique com o botão direito em `dist/index.html`.
4. Selecione **Open with Live Server**.

O Live Server é necessário porque o JavaScript está dividido em módulos ES.

## Estrutura

```text
dist/
├── index.html                    Página de imóveis
├── desenvolvimento-imobiliario/ Página de desenvolvimento
├── quem-somos/                   Página institucional
├── empresas-parceiras/           Links das empresas parceiras
├── empresas-do-grupo/            Redirecionamento da URL antiga
├── servicos/                     Página de serviços
├── atualidades/                  Notícias, projetos e comunicados
├── styles.css                   Estilos gerais e identidade visual
├── css/
│   ├── filters.css              Busca, filtros e responsividade dos filtros
│   └── pages.css                Estilos compartilhados das páginas internas
├── assets/                      Logo e imagens dos imóveis
└── js/
    ├── app.js                   Inicialização e eventos da página
    ├── page.js                  Navegação e footer das páginas internas
    ├── config/
    │   └── filters.js           Opções, subcategorias e campos dinâmicos
    ├── data/
    │   └── properties.js        Cadastro demonstrativo dos imóveis
    └── modules/
        ├── filter-engine.js     Regras de busca e filtragem
        ├── property-ui.js       Cards e modal de detalhes
        └── social-ui.js         Ícones e links das redes sociais
```

## Adicionar ou editar imóveis

Edite `dist/js/data/properties.js`. Cada imóvel possui localização, finalidade, preço, área, due diligence, filtros especiais e características específicas do seu tipo.

Para adicionar fotos, coloque os arquivos em `dist/assets` e inclua os caminhos no campo `gallery` do imóvel. A primeira imagem da lista será usada como capa do card:

```js
gallery: [
  "./assets/casa-01-fachada.jpg",
  "./assets/casa-01-sala.jpg",
  "./assets/casa-01-piscina.jpg"
]
```

Os links do Instagram, Facebook, YouTube e WhatsApp ficam em `dist/js/config/site.js`. Preencha a propriedade `url` de cada rede para ativar seu ícone no footer. Nesse mesmo arquivo, preencha as URLs de MP7, ARBOR, Leaf Studios e Edição em `partnerLinks` para ativar os cards da página **Empresas Parceiras**. As imagens de fundo ficam em `dist/assets/partners`.

Os cards são inteiramente clicáveis e abrem o modal de detalhes. A lateral exibe somente a foto de capa. Abaixo das informações existe um minicarrossel; ao clicar na capa ou em uma miniatura, a galeria abre em tela cheia com setas, contador e todas as fotos. Os espaços de **Tour virtual** e **Planta do imóvel** usam os valores `specials.virtualTour` e `specials.floorPlan` de cada cadastro para indicar se o material está disponível.

Os quatro quadros de **Experiências e materiais** abrem arquivos ou links em outra aba. Preencha em cada imóvel os campos `materials.virtualTour`, `materials.floorPlan`, `materials.technicalSheet` e `materials.pointCloud`. É possível usar caminhos para PDF, imagem, apresentação ou uma URL externa.

A área de perfil e cadastro é demonstrativa nesta versão estática: ela valida os campos, mas não envia nem armazena dados ou senhas. Para contas reais será necessário conectar autenticação e banco de dados.

## Adicionar páginas no futuro

Crie uma pasta dentro de `dist`, por exemplo:

```text
dist/sobre/index.html
dist/contato/index.html
dist/imovel/index.html
```

As novas páginas institucionais podem reutilizar `styles.css`, `css/pages.css` e `js/page.js`. Mantenha os dados dos imóveis centralizados em `js/data/properties.js` para evitar informações duplicadas.

O cabeçalho atual possui links para **Imóveis**, **Desenvolvimento Imobiliário**, **Quem Somos**, **Empresas Parceiras**, **Serviços** e **Atualidades**. Para criar outra página institucional, copie uma das pastas existentes, atualize título, conteúdo e o estado `aria-current="page"` do menu.

## Filtros disponíveis

- Comprar ou alugar
- Busca por bairro, cidade, condomínio ou código
- Região, tipo e subcategoria
- Seletor conjunto de dormitórios, suítes e vagas
- Faixa de preço e área útil
- Tour virtual, planta, permuta e acessibilidade
- Características de condomínio, casa, comercial e galpão, exibidas automaticamente conforme o tipo escolhido
