FROM node:20-bookworm-slim AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json ./

RUN corepack enable
RUN corepack prepare pnpm@latest --activate
RUN pnpm install

# Rebuild the source code only when needed
FROM base AS builder

ARG NEXT_PUBLIC_BASE_URL

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_PUBLIC_BASE_URL $NEXT_PUBLIC_BASE_URL
RUN npm run build

# Production image, copy all the files and run next
FROM nginx:1.25-bookworm AS runner

# Copy the nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to replace the default nginx contents.
COPY --from=builder /app/out /usr/share/nginx/html