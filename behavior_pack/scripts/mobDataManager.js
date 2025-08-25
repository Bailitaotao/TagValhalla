/**
 * 生物数据管理器
 * 负责存储和管理生物的各种信息
 */

import { world, Entity } from '@minecraft/server';

export class MobDataManager {
    constructor() {
        this.mobData = new Map(); // 存储生物数据
        this.playerData = new Map(); // 存储玩家数据
        this.loadData();
    }

    /**
     * 获取生物数据结构
     */
    createMobData(entity) {
        if (!entity) return null;
        
        try {
            const healthComponent = entity.getComponent('minecraft:health');
            const dimension = entity.dimension;
            const location = entity.location;
            
            return {
                id: entity.id || 'unknown',
                typeId: entity.typeId || 'unknown',
                name: entity.nameTag || '',
                spawnTime: Date.now(),
                lifetime: 0,
                killCount: {
                    players: 0,
                    mobs: 0,
                    specific: {} // 具体击杀类型统计
                },
                affection: 0, // 好感度
                interactions: {
                    fed: 0, // 喂食次数
                    petted: 0, // 抚摸次数
                    healed: 0 // 治疗次数
                },
                location: {
                    dimension: dimension ? dimension.id : 'unknown',
                    x: location ? Math.floor(location.x) : 0,
                    y: location ? Math.floor(location.y) : 0,
                    z: location ? Math.floor(location.z) : 0
                },
                health: {
                    max: healthComponent ? healthComponent.maxValue : 20,
                    current: healthComponent ? healthComponent.currentValue : 20
                },
                owner: null, // 如果是宠物，记录主人
                isNamed: !!entity.nameTag,
                achievements: [], // 成就列表
                customData: {} // 自定义数据
            };
        } catch (error) {
            console.error('创建生物数据失败:', error);
            return null;
        }
    }

    /**
     * 注册新生物
     */
    registerMob(entity) {
        if (!entity || !entity.id) return false;
        
        try {
            if (!this.mobData.has(entity.id)) {
                const mobData = this.createMobData(entity);
                if (mobData) {
                    this.mobData.set(entity.id, mobData);
                    return true;
                }
            }
        } catch (error) {
            console.error('注册生物失败:', error);
        }
        return false;
    }

    /**
     * 获取生物数据
     */
    getMobData(entityId) {
        return this.mobData.get(entityId);
    }

    /**
     * 更新生物生存时间
     */
    updateMobLifetime() {
        const currentTime = Date.now();
        for (const [entityId, data] of this.mobData) {
            data.lifetime = Math.floor((currentTime - data.spawnTime) / 1000); // 秒
        }
    }

    /**
     * 记录击杀事件
     */
    recordKill(killerEntityId, victimTypeId) {
        const killerData = this.mobData.get(killerEntityId);
        if (killerData) {
            if (victimTypeId.includes('player')) {
                killerData.killCount.players++;
            } else {
                killerData.killCount.mobs++;
            }
            
            if (!killerData.killCount.specific[victimTypeId]) {
                killerData.killCount.specific[victimTypeId] = 0;
            }
            killerData.killCount.specific[victimTypeId]++;
        }
    }

    /**
     * 更新好感度
     */
    updateAffection(entityId, amount) {
        const data = this.mobData.get(entityId);
        if (data) {
            data.affection += amount;
            data.affection = Math.max(0, Math.min(100, data.affection)); // 限制在0-100之间
        }
    }

    /**
     * 记录互动
     */
    recordInteraction(entityId, type) {
        const data = this.mobData.get(entityId);
        if (data && data.interactions[type] !== undefined) {
            data.interactions[type]++;
        }
    }

    /**
     * 移除生物数据
     */
    removeMobData(entityId) {
        return this.mobData.delete(entityId);
    }

    /**
     * 保存数据到世界存储
     */
    saveData() {
        try {
            const dataToSave = {
                mobData: Object.fromEntries(this.mobData),
                playerData: Object.fromEntries(this.playerData),
                lastSaved: Date.now()
            };
            
            world.setDynamicProperty('tagvalhalla:data', JSON.stringify(dataToSave));
        } catch (error) {
            console.error('保存数据失败:', error);
        }
    }

    /**
     * 从世界存储加载数据
     */
    loadData() {
        try {
            const savedData = world.getDynamicProperty('tagvalhalla:data');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.mobData = new Map(Object.entries(data.mobData || {}));
                this.playerData = new Map(Object.entries(data.playerData || {}));
            }
        } catch (error) {
            console.error('加载数据失败:', error);
        }
    }

    /**
     * 获取格式化的生物信息文本
     */
    getFormattedMobInfo(entityId) {
        const data = this.getMobData(entityId);
        if (!data) return null;

        const hours = Math.floor(data.lifetime / 3600);
        const minutes = Math.floor((data.lifetime % 3600) / 60);
        const seconds = data.lifetime % 60;

        return [
            `§e=== ${data.name || '未命名生物'} ===§r`,
            `§7类型: §f${data.typeId.replace('minecraft:', '')}`,
            `§7生存时间: §f${hours}时${minutes}分${seconds}秒`,
            `§7好感度: §f${data.affection}/100`,
            `§7击杀统计: §f玩家${data.killCount.players} | 生物${data.killCount.mobs}`,
            `§7互动次数: §f喂食${data.interactions.fed} | 抚摸${data.interactions.petted}`,
            `§7生成位置: §f${data.location.dimension} (${data.location.x}, ${data.location.y}, ${data.location.z})`,
            `§7当前血量: §f${data.health.current}/${data.health.max}`,
            data.owner ? `§7主人: §f${data.owner}` : '',
            `§8记录时间: ${new Date(data.spawnTime).toLocaleString()}`
        ].filter(line => line).join('\n');
    }
}
