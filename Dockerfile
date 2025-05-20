FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* ./
COPY . .

RUN pnpm install --frozen-lockfile
RUN turbo run build

EXPOSE 3000
CMD ["node", "apps/gateway/dist/main.js"] 