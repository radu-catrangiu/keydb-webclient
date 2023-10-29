
FROM node:18-slim AS builder

LABEL Developer="Radu-Ovidiu Catrangiu"

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

FROM node:18-slim AS final

WORKDIR /app

COPY --from=builder /app/build build/

COPY --from=builder /app/node_modules node_modules/

COPY package.json .

EXPOSE 3000

ENV NODE_ENV=production

ENTRYPOINT [ "node" ]

CMD ["build"]