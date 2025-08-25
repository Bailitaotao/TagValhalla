#!/bin/bash

# TagValhalla 部署脚本 - 简化版
# 用于将addon快速部署到Minecraft测试环境

echo "🎮 TagValhalla 部署脚本"
echo "======================="

# 检测操作系统
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    MINECRAFT_DIR="$HOME/Library/Application Support/minecraft"
    echo "检测到 macOS 系统"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    MINECRAFT_DIR="$LOCALAPPDATA/Packages/Microsoft.MinecraftUWP_8wekyb3d8bbwe/LocalState/games/com.mojang"
    echo "检测到 Windows 系统"
else
    echo "❌ 不支持的操作系统: $OSTYPE"
    exit 1
fi

# 检查Minecraft目录是否存在
if [ ! -d "$MINECRAFT_DIR" ]; then
    echo "❌ 未找到Minecraft目录: $MINECRAFT_DIR"
    echo "请确保已安装Minecraft基岩版"
    exit 1
fi

echo "✅ 找到Minecraft目录: $MINECRAFT_DIR"

# 创建目标目录
BEHAVIOR_TARGET="$MINECRAFT_DIR/behavior_packs/TagValhalla_BP"
RESOURCE_TARGET="$MINECRAFT_DIR/resource_packs/TagValhalla_RP"

echo "📁 创建目标目录..."
mkdir -p "$BEHAVIOR_TARGET"
mkdir -p "$RESOURCE_TARGET"

# 复制文件
echo "📋 复制行为包..."
cp -r ./behavior_pack/* "$BEHAVIOR_TARGET/"

echo "📋 复制资源包..."
cp -r ./resource_pack/* "$RESOURCE_TARGET/"

echo "✅ 部署完成！"
echo ""
echo "🎯 下一步操作："
echo "1. 启动Minecraft基岩版"
echo "2. 创建新世界或编辑现有世界"
echo "3. ⚠️  重要：在设置中启用实验性功能："
echo "   - ✅ Beta APIs"
echo "   - ✅ Script API"
echo "4. 在行为包标签页激活 'TagValhalla BP'"
echo "5. 在资源包标签页激活 'TagValhalla RP'"
echo ""
echo "🧪 快速测试："
echo "1. /summon cow ~~~"
echo "2. 用名牌给牛命名"
echo "3. 杀死牛查看掉落的信息名牌"
echo "4. 右键使用名牌查看详细信息"
echo ""
echo "🎉 享受使用！"
