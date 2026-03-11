# Deploy na Vercel

## 1) Variaveis de ambiente
Configure no projeto Vercel (Settings -> Environment Variables):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Use os mesmos valores do projeto Supabase em producao.

## 2) Build e runtime
Este projeto foi configurado para:

- usar `npm ci` na instalacao
- usar `npm run build` no build
- exigir Node `>=20.9.0`

A Vercel ja atende Node moderno por padrao. Se necessario, fixe Node 20+ nas configuracoes do projeto.

## 3) Imagens otimizadas
O `next/image` esta ativo e otimizado, com suporte a imagens remotas do Supabase Storage em:

- `https://*.supabase.co/storage/v1/object/public/**`

## 4) SSR
A home esta configurada para renderizacao server-side dinamica:

- `app/page.tsx` com `export const dynamic = "force-dynamic"`

## 5) Storage no Supabase
No Supabase, execute `supabase/schema.sql` para garantir:

- bucket `site-assets`
- policies de leitura/escrita para uploads do painel

Pastas de upload usadas:

- `hero/`
- `news/`
- `products/`
- `sponsors/`
- `matches/`
