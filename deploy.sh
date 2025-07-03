#!/bin/bash
set -e

# 找出當前活躍的 upstream 和閒置的顏色
ACTIVE_UPSTREAM=$(grep "proxy_pass http://" /path/to/your/project/nginx/default.conf | awk -F'//' '{print $2}' | sed 's/;//')

if [ "$ACTIVE_UPSTREAM" == "blue_upstream" ]; then
  INACTIVE_COLOR="green"
  ACTIVE_COLOR="blue"
else
  INACTIVE_COLOR="blue"
  ACTIVE_COLOR="green"
fi

echo "當前活躍服務: $ACTIVE_COLOR"
echo "將要部署到: $INACTIVE_COLOR"

# 建立並啟動閒置容器
echo "正在建立新版本 $INACTIVE_COLOR..."
docker compose up -d --no-deps --build $INACTIVE_COLOR

# 等待新容器健康檢查通過
echo "等待 $INACTIVE_COLOR 服務健康..."
while [ "$(docker inspect -f {{.State.Health.Status}} eip-ui-${INACTIVE_COLOR})" != "healthy" ]; do
    echo -n "."
    sleep 3
done
echo ""
echo "$INACTIVE_COLOR 服務已準備就緒！"

# 切換 Nginx 流量
echo "正在切換流量至 $INACTIVE_COLOR..."
sed -i "s/proxy_pass http:\/\/$ACTIVE_UPSTREAM;/proxy_pass http:\/\/${INACTIVE_COLOR}_upstream;/" /path/to/your/project/nginx/default.conf

# 重新載入 Nginx 設定
docker compose exec nginx nginx -s reload
echo "流量已成功切換！"

# 停止舊的容器 (可選，也可以保留作為快速回滾)
echo "正在停止舊的 $ACTIVE_COLOR 服務..."
docker compose stop $ACTIVE_COLOR

echo "部署完成！"
