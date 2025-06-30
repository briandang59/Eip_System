# Docker 部署指南

## 前置需求

- Docker
- Docker Compose

## 快速啟動

### 1. 建構並啟動容器

```bash
# 建構映像並啟動服務
docker-compose up -d --build

# 查看容器狀態
docker-compose ps

# 查看日誌
docker-compose logs -f eip-ui-v2
```

### 2. 訪問應用程式

啟動後，可以通過以下網址訪問：
- **http://localhost** (端口 80)
- **http://your-server-ip** (如果部署在遠端伺服器)

### 3. 健康檢查

檢查應用程式健康狀態：
```bash
curl http://localhost/api/health
```

## 管理指令

### 停止服務
```bash
docker-compose down
```

### 重新啟動服務
```bash
docker-compose restart
```

### 查看容器日誌
```bash
# 即時查看日誌
docker-compose logs -f eip-ui-v2

# 查看最近的日誌
docker-compose logs --tail=100 eip-ui-v2
```

### 進入容器
```bash
docker-compose exec eip-ui-v2 sh
```

### 更新應用程式
```bash
# 停止服務
docker-compose down

# 重新建構並啟動
docker-compose up -d --build
```

## 配置說明

### 端口映射
- 容器內部端口：3000
- 主機端口：80
- 外部訪問：http://localhost

### 時區設定
- 時區：Asia/Ho_Chi_Minh (越南時區)
- 容器內時間會自動同步

### 重啟策略
- `restart: always` - 容器會自動重啟
- 系統重啟後會自動啟動服務

### 健康檢查
- 每 30 秒檢查一次
- 檢查端點：/api/health
- 超時時間：10 秒
- 重試次數：3 次

## 故障排除

### 1. 端口被佔用
如果 80 端口被佔用，可以修改 `docker-compose.yml`：
```yaml
ports:
  - "8080:3000"  # 改為使用 8080 端口
```

### 2. 建構失敗
```bash
# 清理 Docker 快取
docker system prune -a

# 重新建構
docker-compose build --no-cache
```

### 3. 權限問題
```bash
# 確保 Docker 有足夠權限
sudo chown -R $USER:$USER .
```

### 4. 記憶體不足
如果建構時記憶體不足，可以增加 Docker 記憶體限制或使用 swap。

## 生產環境建議

1. **使用反向代理**：建議使用 Nginx 作為反向代理
2. **SSL 憑證**：配置 HTTPS 憑證
3. **監控**：設置容器監控和日誌收集
4. **備份**：定期備份重要資料
5. **安全**：定期更新基礎映像和依賴

## 環境變數

可以在 `docker-compose.yml` 中添加環境變數：

```yaml
environment:
  - NODE_ENV=production
  - TZ=Asia/Ho_Chi_Minh
  - NEXT_TELEMETRY_DISABLED=1
  - DATABASE_URL=your_database_url
  - API_BASE_URL=your_api_url
``` 