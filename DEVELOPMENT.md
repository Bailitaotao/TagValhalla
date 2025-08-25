# TagValhalla 开发说明

## 开发环境设置

### 1. 前置要求
- Node.js (推荐版本 16+)
- Minecraft基岩版
- VS Code (推荐)
- Bridge. v2 或其他基岩版开发工具

### 2. 项目初始化
```bash
cd /Users/tim/Projects/Code/TagValhalla
npm init -y
npm install --save-dev @types/minecraft__server@latest
```

### 3. VS Code配置
在项目根目录创建 `.vscode/settings.json`:
```json
{
  "typescript.preferences.includePackageJsonAutoImports": "off",
  "typescript.suggest.autoImports": false,
  "files.associations": {
    "*.mcfunction": "plaintext",
    "*.json": "jsonc"
  }
}
```

## 开发流程

### 1. 脚本开发
- 所有JavaScript文件位于 `behavior_pack/scripts/` 目录
- 使用ES6模块语法
- 遵循Minecraft Script API规范

### 2. 测试流程
1. 将behavior_pack和resource_pack复制到测试世界
2. 启用实验性功能
3. 在创意模式下测试各项功能
4. 使用命令行工具查看控制台输出

### 3. 调试技巧
- 使用 `console.log()` 输出调试信息
- 利用 `/scriptevent` 命令触发自定义事件
- 检查动态属性存储情况

## 功能实现计划

### 第一阶段 - 核心功能
- [x] 基础项目结构
- [ ] 生物数据记录系统
- [ ] 名牌掉落机制
- [ ] 基础信息显示

### 第二阶段 - 增强功能  
- [ ] 好感度系统
- [ ] 击杀统计
- [ ] 互动记录
- [ ] 成就系统

### 第三阶段 - 高级功能
- [ ] 数据导出
- [ ] 自定义配置
- [ ] 多语言支持
- [ ] 性能优化

## 注意事项

1. **UUID生成**: 记得为正式版本生成唯一的UUID
2. **性能考虑**: 大量生物时注意内存使用
3. **兼容性**: 确保与其他addon的兼容性
4. **数据备份**: 实现数据的定期备份机制

## 常用命令

```bash
# 快速测试
/reload

# 清理数据
/scriptevent tagvalhalla:clear_data

# 显示统计
/scriptevent tagvalhalla:show_stats
```
