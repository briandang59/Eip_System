# 使用 Node.js 18 Alpine 作為基礎映像
FROM node:18-alpine AS base

# 設定工作目錄
WORKDIR /app

# 設定時區為 Asia/Ho_Chi_Minh
ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 安裝 pnpm
RUN npm install -g pnpm

# 複製 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安裝依賴
RUN pnpm install --frozen-lockfile

# 複製所有源碼
COPY . .

# 建構階段
FROM base AS builder

# 設定環境變數
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1


# 建構應用程式
RUN pnpm run build:clean

# 生產階段
FROM node:18-alpine AS runner

# 設定工作目錄
WORKDIR /app

# 設定時區為 Asia/Ho_Chi_Minh
ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# 安裝 pnpm
RUN npm install -g pnpm

# 設定環境變數
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 建立非 root 用戶
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 複製建構結果
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 設定權限
RUN chown -R nextjs:nodejs /app
USER nextjs

# 暴露端口
EXPOSE 3000

# 設定容器主機名
ENV HOSTNAME "0.0.0.0"

# 啟動應用程式
CMD ["pnpm", "start"] 