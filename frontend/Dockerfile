FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# next/image serializes its allowed media origin into the standalone build.
ARG PROPERTY_MEDIA_URL
ENV PROPERTY_MEDIA_URL=$PROPERTY_MEDIA_URL
# PROPERTY_SOURCE / PROPERTY_API_URL / PROPERTY_API_KEY are runtime settings.
# Keep the server API key out of build arguments and image layers.

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
