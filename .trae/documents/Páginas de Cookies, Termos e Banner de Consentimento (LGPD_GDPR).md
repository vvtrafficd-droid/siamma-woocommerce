## Contexto do Projeto
- Next.js com App Router (`app/`), Tailwind, componentes UI estilo shadcn.
- Rotas de páginas informativas: `app/(infoPage)/[slug]/page.tsx` usando `lib/pages.ts`.
- Slugs já suportados: `privacy` e `terms`. Página de cookies ainda não existe.
- Layout global: `app/layout.tsx`. Local ideal para inserir o banner de consentimento.

## O que será entregue
1. Páginas completas em PT-BR: Cookies, Termos de Uso, Política de Privacidade.
2. Conteúdo jurídico claro e estruturado com seções (definições, bases legais, direitos do titular, uso de cookies, categorias, retenção, contato).
3. Banner de consentimento LGPD/GDPR com controles de categorias (Necessários, Preferências, Estatística, Marketing) e links para as políticas.
4. Link de “Preferências de Cookies” no rodapé para reabrir e alterar consentimentos.

## Implementação Técnica
### 1) Páginas e Conteúdo
- Adicionar `cookies` em `lib/pages.ts` com `title` e `description`.
- Criar `lib/policyContent.tsx` exportando um mapa `{slug: ReactNode}` com conteúdo rico em PT-BR para `privacy`, `terms`, `cookies`.
- Atualizar `app/(infoPage)/[slug]/page.tsx` para renderizar o `content` de `policyContent` se existir; fallback para `description`.
- Estruturar conteúdo com headings (`h2`, `h3`), listas e parágrafos, usando classes Tailwind para tipografia consistente.

### 2) Banner de Consentimento
- Criar `components/CookieConsent.tsx` (`use client`) com:
  - Estado por categoria: `necessary` (travado como true), `preferences`, `statistics`, `marketing`.
  - Armazenamento de preferências em `localStorage` e cookie `cookie_consent` (JSON) com data/hora.
  - Ações: “Aceitar todos”, “Recusar”, “Personalizar” (expande painel para toggles), “Salvar preferências”.
  - Apenas cookies não essenciais podem ser habilitados após consentimento.
  - Links para `/cookies` e `/privacy`.
- Inserir `<CookieConsent />` em `app/layout.tsx` abaixo do `<Footer />` ou imediatamente após o conteúdo principal, garantindo exibição global.
- Disponibilizar um pequeno botão/ligação “Preferências de Cookies” no `Footer` para reabrir o painel a qualquer momento.

### 3) Rodapé
- Atualizar `components/Footer.tsx` para links reais:
  - `href="/privacy"` (Política de Privacidade)
  - `href="/terms"` (Termos de Uso)
  - `href="/cookies"` (Política de Cookies)
  - Adicionar link “Preferências de Cookies” que chama o painel do banner.

### 4) Conformidade LGPD/GDPR
- Categorias claras, opt-in explícito para não essenciais.
- Registro de data/hora do consentimento.
- Possibilidade de alteração a qualquer momento.
- Padrão: bloquear não essenciais até consentimento.
- Preparar `onConsentChange` callback para, no futuro, integrar com scripts de analytics/ads apenas após consentimento.

## SEO e UX
- Manter `generateMetadata` da rota dinâmica; títulos e descrições consistentes em `lib/pages.ts`.
- Breadcrumb preservado. Tipografia e espaçamento seguindo Tailwind.
- Acessibilidade: focável, navegação por teclado, rótulos claros, contraste adequado.

## Arquivos a tocar
- `lib/pages.ts` (adicionar `cookies`).
- `lib/policyContent.tsx` (novo, com conteúdo das três páginas).
- `app/(infoPage)/[slug]/page.tsx` (renderizar conteúdo por slug).
- `components/CookieConsent.tsx` (novo banner).
- `components/Footer.tsx` (links e acionador de preferências).
- `app/layout.tsx` (inclusão do banner).

## Critérios de Aceite
- As três páginas abrem em `/privacy`, `/terms`, `/cookies` com conteúdo completo em PT-BR.
- Banner aparece para usuários sem consentimento; salva preferências e respeita estado em reload.
- Link no rodapé reabre painel de preferências.
- Nenhum cookie não essencial é habilitado sem consentimento.

## Próximo Passo
- Após a sua confirmação, implemento as mudanças, testo o fluxo, e deixo pronto para revisão visual e texto jurídico.