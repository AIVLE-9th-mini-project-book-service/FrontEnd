#!/bin/bash
echo "=== 배포 시작 ==="

# 1. 기존 파일 정리
echo "[1/3] 기존 파일 정리..."
rm -rf /var/www/html/*
mkdir -p /var/www/html

# 2. 권한 설정
echo "[2/3] 권한 설정..."
chown -R ec2-user:ec2-user /var/www/html/
chmod -R 755 /var/www/html/

# 3. Nginx 재시작
echo "[3/3] Nginx 재시작..."
systemctl enable nginx
systemctl restart nginx

# 4. 상태 확인
if systemctl is-active --quiet nginx; then
    echo "=== 배포 완료 ==="
    exit 0
else
    echo "=== Nginx 실행 실패 ==="
    systemctl status nginx
    exit 1
fi
