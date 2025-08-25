/**
 * 事件处理器
 * 负责监听和处理各种游戏事件
 */

import { world, system, Entity, Player } from '@minecraft/server';

export class EventHandler {
    constructor(mobDataManager, nametagHandler) {
        this.mobDataManager = mobDataManager;
        this.nametagHandler = nametagHandler;
    }

    /**
     * 注册所有事件监听器
     */
    registerEvents() {
        this.registerSpawnEvents();
        this.registerDeathEvents();
        this.registerInteractionEvents();
        this.registerItemEvents();
        this.registerPlayerEvents();
    }

    /**
     * 注册生物生成事件
     */
    registerSpawnEvents() {
        world.afterEvents.entitySpawn.subscribe((event) => {
            const entity = event.entity;
            
            // 只处理生物实体，排除物品、经验球等
            if (this.isMobEntity(entity)) {
                // 延迟注册，确保实体完全加载
                system.runTimeout(() => {
                    this.mobDataManager.registerMob(entity);
                    console.log(`注册新生物: ${entity.typeId} (ID: ${entity.id})`);
                }, 1);
            }
        });
    }

    /**
     * 注册死亡事件
     */
    registerDeathEvents() {
        world.afterEvents.entityDie.subscribe((event) => {
            const deadEntity = event.deadEntity;
            const damageSource = event.damageSource;
            
            // 如果死亡的是被记录的生物
            if (this.isMobEntity(deadEntity)) {
                const mobData = this.mobDataManager.getMobData(deadEntity.id);
                if (mobData) {
                    // 创建信息名牌
                    const infoNametag = this.nametagHandler.createInfoNametag(mobData);
                    
                    if (infoNametag) {
                        // 在死亡位置掉落名牌
                        this.dropNametagAtLocation(deadEntity, infoNametag);
                        console.log(`${deadEntity.typeId} 死亡，掉落信息名牌`);
                    }
                    
                    // 记录击杀者信息
                    if (damageSource.damagingEntity) {
                        this.handleKillEvent(damageSource.damagingEntity, deadEntity);
                    }
                    
                    // 清理生物数据
                    this.mobDataManager.removeMobData(deadEntity.id);
                }
            }
            
            // 如果击杀者是被记录的生物，更新其击杀统计
            if (damageSource.damagingEntity && this.isMobEntity(damageSource.damagingEntity)) {
                this.mobDataManager.recordKill(damageSource.damagingEntity.id, deadEntity.typeId);
            }
        });
    }

    /**
     * 注册互动事件
     */
    registerInteractionEvents() {
        world.afterEvents.playerInteractWithEntity.subscribe((event) => {
            const player = event.player;
            const entity = event.target;
            const item = event.itemStack;
            
            if (this.isMobEntity(entity)) {
                const mobData = this.mobDataManager.getMobData(entity.id);
                if (mobData) {
                    // 根据使用的物品判断互动类型
                    if (item) {
                        if (this.isFoodItem(item)) {
                            this.mobDataManager.recordInteraction(entity.id, 'fed');
                            this.mobDataManager.updateAffection(entity.id, 5);
                        } else if (this.isHealingItem(item)) {
                            this.mobDataManager.recordInteraction(entity.id, 'healed');
                            this.mobDataManager.updateAffection(entity.id, 10);
                        }
                    } else {
                        // 空手互动视为抚摸
                        this.mobDataManager.recordInteraction(entity.id, 'petted');
                        this.mobDataManager.updateAffection(entity.id, 2);
                    }
                    
                    // 设置主人（针对可驯服生物）
                    if (this.isTameableEntity(entity) && !mobData.owner) {
                        mobData.owner = player.name;
                    }
                }
            }
        });
    }

    /**
     * 注册物品使用事件
     */
    registerItemEvents() {
        world.afterEvents.itemUse.subscribe((event) => {
            const player = event.source;
            const item = event.itemStack;
            
            // 如果使用的是信息名牌，显示详细信息
            if (this.nametagHandler.isInfoNametag(item)) {
                const detailedInfo = this.nametagHandler.getDetailedInfo(item);
                if (detailedInfo) {
                    player.sendMessage(detailedInfo);
                }
            }
        });
    }

    /**
     * 注册玩家事件
     */
    registerPlayerEvents() {
        world.afterEvents.playerJoin.subscribe((event) => {
            const player = event.player;
            console.log(`玩家 ${player.name} 加入游戏`);
        });

        world.afterEvents.playerLeave.subscribe((event) => {
            const player = event.player;
            console.log(`玩家 ${player.name} 离开游戏`);
        });
    }

    /**
     * 处理击杀事件
     */
    handleKillEvent(killer, victim) {
        if (killer instanceof Player) {
            // 玩家击杀记录可以后续扩展
            console.log(`玩家 ${killer.name} 击杀了 ${victim.typeId}`);
        }
    }

    /**
     * 在指定位置掉落名牌
     */
    dropNametagAtLocation(entity, nametag) {
        try {
            const location = entity.location;
            const dimension = entity.dimension;
            
            // 创建物品实体
            dimension.spawnItem(nametag, location);
        } catch (error) {
            console.error('掉落名牌失败:', error);
        }
    }

    /**
     * 判断是否是生物实体
     */
    isMobEntity(entity) {
        if (!entity || !entity.typeId) return false;
        
        // 排除玩家、物品实体、经验球等
        const excludedTypes = [
            'minecraft:player',
            'minecraft:item',
            'minecraft:xp_orb',
            'minecraft:arrow',
            'minecraft:fishing_hook',
            'minecraft:ender_pearl',
            'minecraft:fireball',
            'minecraft:lightning_bolt'
        ];
        
        return !excludedTypes.includes(entity.typeId) && 
               !entity.typeId.includes('projectile') &&
               !entity.typeId.includes('item');
    }

    /**
     * 判断是否是食物物品
     */
    isFoodItem(item) {
        const foodItems = [
            'minecraft:wheat',
            'minecraft:carrot',
            'minecraft:potato',
            'minecraft:beetroot',
            'minecraft:apple',
            'minecraft:bread',
            'minecraft:cooked_beef',
            'minecraft:cooked_porkchop',
            'minecraft:cooked_chicken',
            'minecraft:cooked_fish',
            'minecraft:bone',
            'minecraft:rotten_flesh'
        ];
        
        return foodItems.includes(item.typeId);
    }

    /**
     * 判断是否是治疗物品
     */
    isHealingItem(item) {
        const healingItems = [
            'minecraft:golden_apple',
            'minecraft:enchanted_golden_apple',
            'minecraft:potion',
            'minecraft:splash_potion'
        ];
        
        return healingItems.includes(item.typeId);
    }

    /**
     * 判断是否是可驯服实体
     */
    isTameableEntity(entity) {
        const tameableTypes = [
            'minecraft:wolf',
            'minecraft:cat',
            'minecraft:parrot',
            'minecraft:horse',
            'minecraft:donkey',
            'minecraft:mule',
            'minecraft:llama'
        ];
        
        return tameableTypes.includes(entity.typeId);
    }
}
