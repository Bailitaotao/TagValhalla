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
