# ---- deps: install with pnpm, cached on lockfile ----
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- build: compile the standalone Next.js server ----
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable pnpm
ENV NEXT_TELEMETRY_DISABLED=1
# NEXT_PUBLIC_* values are inlined by `pnpm build`, so they must arrive as build args.
ARG NEXT_PUBLIC_SITE_URL=https://jmistry.com
ARG NEXT_PUBLIC_FORMSPREE_ID=xwvgkeda
ARG NEXT_PUBLIC_UMAMI_SRC
ARG NEXT_PUBLIC_UMAMI_WEBSITE_ID
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_FORMSPREE_ID=$NEXT_PUBLIC_FORMSPREE_ID
ENV NEXT_PUBLIC_UMAMI_SRC=$NEXT_PUBLIC_UMAMI_SRC
ENV NEXT_PUBLIC_UMAMI_WEBSITE_ID=$NEXT_PUBLIC_UMAMI_WEBSITE_ID
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# ---- run: minimal runtime image, non-root ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

USER node
EXPOSE 3000
CMD ["node", "server.js"]
