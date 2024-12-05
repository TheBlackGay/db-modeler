#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}开始重启后端服务...${NC}"

# 获取项目根目录
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$PROJECT_DIR"
LOGS_DIR="$PROJECT_DIR/logs"

# 创建日志目录
mkdir -p "$LOGS_DIR"

# 生成带时间戳的日志文件名
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKEND_LOG="$LOGS_DIR/backend_$TIMESTAMP.log"

# 创建最新日志的软链接
ln -sf "$BACKEND_LOG" "$LOGS_DIR/backend_latest.log"

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

# 清理后端端口
echo -e "${YELLOW}停止现有后端服务...${NC}"
kill_port 5001

# 等待进程完全终止
sleep 2

# 启动后端服务
echo -e "${YELLOW}启动后端服务...${NC}"
cd "$BACKEND_DIR"

# 检查是否安装了依赖
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}安装后端依赖...${NC}"
    pnpm install
fi

# 启动后端服务并开始显示日志
pnpm run dev > "$BACKEND_LOG" 2>&1 & 
BACKEND_PID=$!
echo -e "${GREEN}后端服务已启动 (PID: $BACKEND_PID)${NC}"
echo -e "${GREEN}后端日志: $BACKEND_LOG${NC}"

# 记录后端 PID
echo $BACKEND_PID > "$BACKEND_DIR/.pid"

# 开始实时显示后端日志
BACKEND_TAIL_PID=$(tail_log "$BACKEND_LOG" 10)

# 等待后端服务启动
sleep 5

# 检查后端服务是否成功启动
if ! curl -s "http://localhost:5001/api/v1/health" > /dev/null; then
    echo -e "${RED}后端服务启动失败，请检查日志: $BACKEND_LOG${NC}"
    stop_tail $BACKEND_TAIL_PID
    tail -n 20 "$BACKEND_LOG"
    exit 1
fi

# 停止显示后端日志
stop_tail $BACKEND_TAIL_PID

echo -e "${GREEN}后端服务已成功启动！${NC}"
echo -e "${GREEN}服务地址: http://localhost:5001${NC}"
echo -e "${GREEN}最新日志: $LOGS_DIR/backend_latest.log${NC}"

# 等待用户按任意键退出
read -n 1 -s -r -p "按任意键退出..."
echo
