# Alfa Hair — Site do salão

Site institucional mobile-first, leve (sem frameworks JS) e fácil de manter.

**Stack:** HTML5 semântico · Tailwind CSS 3 (build via CLI, CSS final ~25 KB) · JavaScript vanilla em módulos ES.

## Estrutura

```
index.html              Página única com todas as seções
data/services.json      ⭐ Lista de serviços, preços, duração e categorias
js/config.js            ⭐ Número do WhatsApp e mensagens padrão
js/app.js               Ponto de entrada (menu, banner, carrossel, serviços)
js/modules/services.js  Renderiza abas e cards a partir do JSON
js/modules/whatsapp.js  Monta os links wa.me com texto pré-formatado
js/modules/gallery.js   Carrossel Antes/Depois (CSS scroll-snap)
styles/input.css        Fonte do Tailwind (componentes .btn, .section…)
styles/output.css       CSS gerado — é o arquivo usado pelo site
tailwind.config.js      Cores da marca e fontes
assets/img/             Imagens (placeholders SVG — substitua pelas fotos reais)
```

## Manutenção do dia a dia

| Quero alterar…                     | Onde                                                    |
|------------------------------------|---------------------------------------------------------|
| Preço, duração, descrição, serviço | `data/services.json` (não precisa rebuildar o CSS)      |
| Nova categoria                     | Adicione em `categories` e use o `id` nos serviços      |
| Número do WhatsApp / mensagens     | `js/config.js` (+ `href` de fallback em `index.html`)   |
| Endereço, horários, redes, mapa    | `index.html` (barra do topo, rodapé e JSON-LD)          |
| Equipe, galeria, depoimentos       | `index.html` — duplique um `<li>` e troque o conteúdo   |

Campos de um serviço:

```json
{
  "id": "corte-feminino",
  "category": "cabelo",
  "name": "Corte Feminino",
  "description": "Corte personalizado com lavagem e escova.",
  "duration": 60,          // minutos → exibido como "1h"
  "price": 90,             // exibido como "R$ 90"
  "priceFrom": true        // true → "A partir de R$ 90"
}
```

O botão **Agendar** de cada card abre:
`https://wa.me/<numero>?text=Olá! Gostaria de agendar o serviço: <Nome do serviço>`

### Imagens
Substitua os SVGs em `assets/img/` por fotos reais em **WebP/AVIF** (~600×750 na galeria, 400×500 na equipe) mantendo `width`, `height` e `loading="lazy"` para evitar layout shift.

## Desenvolvimento

```bash
npm install
npm run dev     # recompila o CSS ao salvar
npm run build   # CSS minificado para produção
npm run serve   # servidor local em http://localhost:8080
```

> O `fetch` do JSON exige servidor HTTP — abrir o `index.html` direto (`file://`) não carrega os serviços.
> Só é preciso rodar `npm run build` ao mudar classes Tailwind no HTML/JS; o `styles/output.css` já vem versionado.

Hospedagem: qualquer host estático (GitHub Pages, Netlify, Vercel, Hostinger…). Basta publicar a pasta sem `node_modules`.
