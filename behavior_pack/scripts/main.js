/**
 * TagValhalla - 生物信息记录系统
 * 主入口文件
 */

import { world, system, Entity, Player, ItemStack } from '@minecraft/server';
import { MobDataManager } from './mobDataManager.js';
import { NametagHandler } from './nametagHandler.js';
import { EventHandler } from './eventHandler.js';

class TagValhalla {
    constructor() {
        this.mobDataManager = new MobDataManager();
        this.nametagHandler = new NametagHandler();
        this.eventHandler = new EventHandler(this.mobDataManager, this.nametagHandler);
        
        this.init();
    }

    init() {
        console.log('TagValhalla 插件已加载');
        
        // 注册事件监听器
        this.eventHandler.registerEvents();
        
        // 启动定时任务
        this.startPeriodicTasks();
        
        // 显示使用提示
        system.runTimeout(() => {
            console.log('=== TagValhalla 使用说明 ===');
            console.log('1. 用名牌为生物命名，它们将被系统记录');
            console.log('2. 生物死亡时会掉落包含详细信息的名牌');
            console.log('3. 右键使用信息名牌查看生物的生存记录');
            console.log('4. 与生物互动(喂食/抚摸)可增加好感度');
        }, 60); // 3秒后显示使用提示
    }

    startPeriodicTasks() {
        // 每秒更新一次生物生存时间
        system.runInterval(() => {
            this.mobDataManager.updateMobLifetime();
        }, 20); // 20 ticks = 1 second
        
        // 每5秒保存一次数据
        system.runInterval(() => {
            this.mobDataManager.saveData();
        }, 100); // 100 ticks = 5 seconds
    }
}

// 启动插件
new TagValhalla();
