ARG APP_NAME=auth

FROM node:18-alpine AS builder
ARG APP_NAME

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @erp/${APP_NAME} run build

FROM node:18-alpine AS production
ARG APP_NAME

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
COPY --from=builder /usr/src/app/apps/${APP_NAME}/dist ./apps/${APP_NAME}/dist

RUN pnpm install --prod --filter @erp/${APP_NAME} --frozen-lockfile

EXPOSE 4000

CMD ["node", "apps/${APP_NAME}/dist/main.js"]
