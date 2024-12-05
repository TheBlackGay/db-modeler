#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}开始重启前端服务...${NC}"

# 获取项目根目录
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FRONTEND_DIR="$PROJECT_DIR/frontend"
LOGS_DIR="$PROJECT_DIR/logs"

# 创建日志目录
mkdir -p "$LOGS_DIR"

# 生成带时间戳的日志文件名
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FRONTEND_LOG="$LOGS_DIR/frontend_$TIMESTAMP.log"

# 创建最新日志的软链接
ln -sf "$FRONTEND_LOG" "$LOGS_DIR/frontend_latest.log"

# 函数：实时显示日志
tail_log() {
    local log_file=$1
    local max_wait=$2
    local start_time=$(date +%s)
    
    # 等待日志文件创建
    while [ ! -f "$log_file" ]; do
        if [ $(($(date +%s) - start_time)) -gt $max_wait ]; then
            echo -e "${RED}等待日志文件超时: $log_file${NC}"
            return 1
        fi
        sleep 1
    done
    
    # 实时显示日志
    tail -f "$log_file" &
    echo $!
}

# 函数：停止日志显示
stop_tail() {
    local pid=$1
    if [ ! -z "$pid" ]; then
        kill $pid 2>/dev/null
    fi
}

# 函数：杀死指定端口的进程
kill_port() {
    local port=$1
    local pid=$(lsof -t -i:"$port" 2>/dev/null)
    if [ ! -z "$pid" ]; then
        echo -e "${YELLOW}正在终止端口 $port 上的进程 (PID: $pid)${NC}"
        kill -9 $pid 2>/dev/null
        echo -e "${GREEN}端口 $port 已清理${NC}"
    else
        echo -e "${GREEN}端口 $port 没有运行中的进程${NC}"
    fi
}

# 清理前端端口
echo -e "${YELLOW}停止现有前端服务...${NC}"
kill_port 3001

# 等待进程完全终止
sleep 2

# 启动前端服务
echo -e "${YELLOW}启动前端服务...${NC}"
cd "$FRONTEND_DIR" || exit 1

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}安装前端依赖...${NC}"
    pnpm install
fi

# 启动前端服务并开始显示日志
echo -e "${YELLOW}正在启动前端服务...${NC}"
VITE_NO_STDIN=true pnpm run dev > "$FRONTEND_LOG" 2>&1 &
FRONTEND_PID=$!

# 记录前端 PID
echo $FRONTEND_PID > "$FRONTEND_DIR/.pid"

echo -e "${GREEN}前端服务已启动 (PID: $FRONTEND_PID)${NC}"
echo -e "${GREEN}前端日志: $FRONTEND_LOG${NC}"

# 开始实时显示前端日志
FRONTEND_TAIL_PID=$(tail_log "$FRONTEND_LOG" 10)

# 等待前端服务启动
sleep 15  # 给前端更多启动时间

# 检查前端服务是否成功启动
MAX_RETRIES=6
RETRY_COUNT=0
FRONTEND_STARTED=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s "http://localhost:3001" > /dev/null; then
        FRONTEND_STARTED=true
        break
    fi
    echo -e "${YELLOW}等待前端服务启动... (尝试 $((RETRY_COUNT + 1))/$MAX_RETRIES)${NC}"
    sleep 5
    RETRY_COUNT=$((RETRY_COUNT + 1))
done

if [ "$FRONTEND_STARTED" = false ]; then
    echo -e "${RED}前端服务启动失败，请检查日志: $FRONTEND_LOG${NC}"
    stop_tail $FRONTEND_TAIL_PID
    tail -n 20 "$FRONTEND_LOG"
    exit 1
fi

# 停止显示前端日志
stop_tail $FRONTEND_TAIL_PID

echo -e "${GREEN}前端服务已成功启动！${NC}"
echo -e "${GREEN}服务地址: http://localhost:3001${NC}"
echo -e "${GREEN}最新日志: $LOGS_DIR/frontend_latest.log${NC}"

# 等待用户按任意键退出
read -n 1 -s -r -p "按任意键退出..."
echo
