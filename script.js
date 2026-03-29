// ========================
// 第一部分：从第一个代码文件移植的健壮存储逻辑
// ========================

/**
 * 数据存储管理类 - 完全移植自第一个代码文件
 * 特点：完善的异常处理、容量管理、数据完整性检查
 */
class ChatDataManager {
    constructor() {
        // 存储键名定义
        this.SELF_INFO_KEY = 'seven_and_wish_self_info';
        this.OTHER_INFO_KEY = 'seven_and_wish_other_info';
        this.MESSAGES_KEY = 'seven_and_wish_messages';
        this.PHRASES_KEY = 'seven_and_wish_phrases';
        this.STICKERS_KEY = 'seven_and_wish_stickers';
        this.SEND_SETTINGS_KEY = 'seven_and_wish_send_settings';
        this.APPEARANCE_KEY = 'seven_and_wish_appearance';
        this.BACKGROUND_KEY = 'seven_and_wish_background';
        this.TAROT_KEY = 'seven_and_wish_tarot_settings';
        this.COMMUNICATION_KEY = 'seven_and_wish_communication';
        this.DRAWN_CARDS_KEY = 'seven_and_wish_drawn_cards';
        this.LOVE_DAYS_KEY = 'seven_and_wish_love_days';
        this.READ_NO_REPLY_KEY = 'seven_and_wish_read_no_reply';
        this.TODAY_DATE_KEY = 'seven_and_wish_today_date';
        this.MUSIC_SETTINGS_KEY = 'seven_and_wish_music_settings';
        // 新增群聊设置存储键
        this.GROUP_SETTINGS_KEY = 'seven_and_wish_group_settings';
        // 新增拍一拍设置存储键
        this.POKE_SETTINGS_KEY = 'seven_and_wish_poke_settings';
        // 新增随机变化设置存储键
        this.RANDOM_SETTINGS_KEY = 'seven_and_wish_random_settings';
        
        // 版本控制
        this.DATA_VERSION_KEY = 'seven_and_wish_data_version';
        this.DATA_VERSION = '2.0'; // 第二个文件的版本
        
        // 最大消息数量限制（防止数据过大）
        this.MAX_MESSAGES = 500;
        
        // 初始化数据
        this.initData();
    }
    
    /**
     * 初始化数据 - 只在完全没有数据时创建默认数据
     * 不会覆盖已有数据
     */
    initData() {
        // 检查是否需要初始化默认数据
        const hasAnyData = localStorage.getItem(this.SELF_INFO_KEY) !== null ||
                          localStorage.getItem(this.OTHER_INFO_KEY) !== null ||
                          localStorage.getItem(this.MESSAGES_KEY) !== null;
        
        if (!hasAnyData) {
            console.log('首次运行，创建默认数据');
            this.createDefaultData();
        }
        
        // 确保版本信息存在
        if (!localStorage.getItem(this.DATA_VERSION_KEY)) {
            localStorage.setItem(this.DATA_VERSION_KEY, this.DATA_VERSION);
        }
    }
    
    /**
     * 创建默认数据 - 只在第一次运行时调用
     */
    createDefaultData() {
        // 默认自己信息
        this.setStoredData(this.SELF_INFO_KEY, {
            nickname: '我',
            avatar: null,
            status: '在线'
        });
        
        // 默认对方信息
        this.setStoredData(this.OTHER_INFO_KEY, {
            nickname: '对方',
            avatar: null,
            status: '在DR',
            mood: 85
        });
        
        // 默认发送设置
        this.setStoredData(this.SEND_SETTINGS_KEY, {
            stickerRatio: 50,
            phraseRatio: 50,
            maxMessageCount: 3,
            autoSendFrequency: 600000,
            minReplyDelay: 1.5,
            maxReplyDelay: 3.5
        });
        
        // 默认外观设置
        this.setStoredData(this.APPEARANCE_KEY, {
            appTitle: '齐司礼',
            appSubtitle: 'DR传讯',
            loveStartDate: new Date(2024, 0, 1).toISOString()
        });
        
        // 默认背景设置
        this.setStoredData(this.BACKGROUND_KEY, {
            backgroundImage: null,
            opacity: 100
        });
        
        // 默认塔罗牌设置
        this.setStoredData(this.TAROT_KEY, {
            enabled: false,
            drawCount: 1,
            customPhrases: []
        });
        
        // 默认通信设置
        this.setStoredData(this.COMMUNICATION_KEY, {
            autoAcceptCalls: true,
            autoAcceptVideos: true,
            todayCalls: 0,
            todayVideos: 0,
            totalCallTime: 0,
            totalVideoTime: 0,
            todayIncomingCalls: 0,
            activeCallSettings: {
                enabled: true,
                overallFrequency: 30,
                callPreference: 50,
                presetMode: 'custom',
                minInterval: 15,
                maxInterval: 45,
                respectBusyStatus: true,
                timeSensitivity: true,
                adaptToActivity: true
            }
        });
        
        // 默认群聊设置
        this.setStoredData(this.GROUP_SETTINGS_KEY, {
            enabled: false,
            showAvatar: true,
            showName: true,
            members: []
        });
        
        // 默认音乐设置 - 支持URL歌曲
        this.setStoredData(this.MUSIC_SETTINGS_KEY, {
            musicList: [],          // 同时存储本地文件和URL歌曲
            autoPlayMusic: true,
            musicFrequency: 30,
            playMode: 'random'
        });

        // 默认拍一拍设置
        this.setStoredData(this.POKE_SETTINGS_KEY, {
            enabled: true,
            frequency: 50,
            phrases: ["拍了拍你", "拍了拍我的肩膀", "拍了拍我的脑袋", "戳了戳我", "轻轻碰了碰我", "摸了摸我的头", "捏了捏我的脸"]
        });
        
        // 默认随机变化设置
        this.setStoredData(this.RANDOM_SETTINGS_KEY, {
            minValue: 2,
            minUnit: 1,
            maxValue: 4,
            maxUnit: 3600
        });
        
        // 默认回复词条
        this.setStoredData(this.PHRASES_KEY, [
            "好的，明白了",
            "这很有趣",
            "继续聊吧",
            "让我想想",
            "很有意思的观点",
            "我不太确定",
            "可以详细说说吗",
            "我同意",
            "这是个好问题",
            "谢谢分享"
        ]);
        
        // 默认消息（只有一条欢迎消息）
        this.setStoredData(this.MESSAGES_KEY, [{
            id: Date.now(),
            text: "你好！欢迎使用私密聊天。点击右上角的齿轮图标可以管理表情包和回复词条。",
            sender: "other",
            time: this.getFormattedTime(Date.now()),
            read: true
        }]);
        
        // 空的表情包
        this.setStoredData(this.STICKERS_KEY, []);
        
        // 已抽取塔罗牌记录
        this.setStoredData(this.DRAWN_CARDS_KEY, []);
        
        // 恋爱天数
        this.setStoredData(this.LOVE_DAYS_KEY, 1);
        
        // 已读不回记录
        this.setStoredData(this.READ_NO_REPLY_KEY, []);
        
        // 今日日期
        this.setStoredData(this.TODAY_DATE_KEY, new Date().toDateString());
        
        // 保存版本
        localStorage.setItem(this.DATA_VERSION_KEY, this.DATA_VERSION);
    }
    
    /**
     * 生成唯一消息ID
     */
    generateMessageId() {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    /**
     * 获取格式化时间
     */
    getFormattedTime(timestamp) {
        const date = new Date(timestamp);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }
    
    /**
     * 安全地从localStorage读取数据
     */
    getStoredData(key) {
        try {
            const data = localStorage.getItem(key);
            if (!data) return null;
            
            // 尝试解析JSON
            try {
                return JSON.parse(data);
            } catch (e) {
                // 如果不是JSON，直接返回字符串
                return data;
            }
        } catch (e) {
            console.error(`读取本地存储失败 [${key}]:`, e);
            return null;
        }
    }
    
    /**
     * 安全地保存数据到localStorage
     * 包含容量检查和自动清理机制
     */
    setStoredData(key, data) {
        try {
            // 估算数据大小（粗略）
            const dataStr = typeof data === 'object' ? JSON.stringify(data) : String(data);
            
            // 如果数据过大（超过4.5MB），尝试清理或拒绝
            if (dataStr.length > 4.5 * 1024 * 1024) {
                console.warn(`数据过大 (${(dataStr.length/1024/1024).toFixed(2)}MB)，尝试压缩...`);
                
                // 如果是背景图片或头像等base64数据，可能太大
                if (key.includes('background') || key.includes('avatar') || key.includes('sticker') || key.includes('music')) {
                    // 对于图片数据，限制大小
                    console.warn('图片数据过大，跳过保存');
                    return false;
                }
            }
            
            // 尝试保存
            if (typeof data === 'object') {
                localStorage.setItem(key, JSON.stringify(data));
            } else {
                localStorage.setItem(key, data);
            }
            
            return true;
            
        } catch (e) {
            console.error(`保存到本地存储失败 [${key}]:`, e);
            
            // 如果是配额超限错误
            if (e.name === 'QuotaExceededError') {
                console.warn('存储空间不足，尝试清理旧数据...');
                this.clearOldData();
                
                // 清理后重试一次
                try {
                    if (typeof data === 'object') {
                        localStorage.setItem(key, JSON.stringify(data));
                    } else {
                        localStorage.setItem(key, data);
                    }
                    console.log('重试保存成功');
                    return true;
                } catch (e2) {
                    console.error('重试保存仍然失败:', e2);
                    return false;
                }
            }
            
            return false;
        }
    }
    
    /**
     * 清理旧数据 - 只在空间不足时调用
     */
    clearOldData() {
        try {
            // 获取所有相关的存储键
            const allKeys = Object.keys(localStorage);
            const relevantKeys = allKeys.filter(key => 
                key.includes('seven_and_wish_') && 
                !key.includes(this.SELF_INFO_KEY) && 
                !key.includes(this.OTHER_INFO_KEY) &&
                !key.includes(this.MESSAGES_KEY)
            );
            
            // 按重要性排序并删除不重要的数据
            const priorityOrder = [
                this.DRAWN_CARDS_KEY,      // 塔罗牌记录（可以重置）
                this.READ_NO_REPLY_KEY,    // 已读不回记录（可以重置）
                this.TODAY_DATE_KEY,       // 今日日期（可以重置）
                this.LOVE_DAYS_KEY,        // 恋爱天数（可以重新计算）
                this.STICKERS_KEY,         // 表情包（占用空间大，优先清理）
                this.MUSIC_SETTINGS_KEY,   // 音乐文件（占用空间大）
            ];
            
            // 先清理优先级低的
            for (const key of priorityOrder) {
                if (localStorage.getItem(key)) {
                    localStorage.removeItem(key);
                    console.log(`已清理旧数据: ${key}`);
                    break; // 一次只清理一个，避免删除过多
                }
            }
        } catch (e) {
            console.error('清理旧数据失败:', e);
        }
    }
    
    // ========================
    // 各个数据模块的存取方法
    // ========================
    
    // ---- 用户信息 ----
    getSelfInfo() {
        return this.getStoredData(this.SELF_INFO_KEY) || {
            nickname: '我',
            avatar: null,
            status: '在线'
        };
    }
    
    saveSelfInfo(data) {
        return this.setStoredData(this.SELF_INFO_KEY, data);
    }
    
    getOtherInfo() {
        return this.getStoredData(this.OTHER_INFO_KEY) || {
            nickname: '对方',
            avatar: null,
            status: '在DR',
            mood: 85
        };
    }
    
    saveOtherInfo(data) {
        return this.setStoredData(this.OTHER_INFO_KEY, data);
    }
    
    // ---- 消息记录 ----
    getMessages() {
        return this.getStoredData(this.MESSAGES_KEY) || [];
    }
    
    saveMessage(message) {
        const messages = this.getMessages();
        messages.push(message);
        
        // 限制消息数量
        if (messages.length > this.MAX_MESSAGES) {
            const removedCount = messages.length - this.MAX_MESSAGES;
            messages.splice(0, removedCount);
        }
        
        return this.setStoredData(this.MESSAGES_KEY, messages);
    }
    
    saveAllMessages(messages) {
        // 限制消息数量
        if (messages.length > this.MAX_MESSAGES) {
            messages = messages.slice(-this.MAX_MESSAGES);
        }
        return this.setStoredData(this.MESSAGES_KEY, messages);
    }
    
    deleteMessage(messageId) {
        const messages = this.getMessages();
        const filtered = messages.filter(msg => msg.id !== messageId);
        
        if (filtered.length < messages.length) {
            return this.setStoredData(this.MESSAGES_KEY, filtered);
        }
        return false;
    }
    
    getMessageById(messageId) {
        const messages = this.getMessages();
        return messages.find(msg => msg.id === messageId) || null;
    }
    
    // ---- 回复词条 ----
    getPhrases() {
        return this.getStoredData(this.PHRASES_KEY) || [];
    }
    
    savePhrases(phrases) {
        return this.setStoredData(this.PHRASES_KEY, phrases);
    }
    
    // ---- 表情包 ----
    getStickers() {
        return this.getStoredData(this.STICKERS_KEY) || [];
    }
    
    saveStickers(stickers) {
        return this.setStoredData(this.STICKERS_KEY, stickers);
    }
    
    // ---- 发送设置 ----
    getSendSettings() {
        return this.getStoredData(this.SEND_SETTINGS_KEY) || {
            stickerRatio: 50,
            phraseRatio: 50,
            maxMessageCount: 3,
            autoSendFrequency: 600000,
            minReplyDelay: 1.5,
            maxReplyDelay: 3.5
        };
    }
    
    saveSendSettings(settings) {
        return this.setStoredData(this.SEND_SETTINGS_KEY, settings);
    }
    
    // ---- 外观设置 ----
    getAppearanceSettings() {
        const data = this.getStoredData(this.APPEARANCE_KEY);
        if (data && data.loveStartDate) {
            // 恢复Date对象
            data.loveStartDate = new Date(data.loveStartDate);
        }
        return data || {
            appTitle: '齐司礼',
            appSubtitle: 'DR传讯',
            loveStartDate: new Date(2024, 0, 1)
        };
    }
    
    saveAppearanceSettings(settings) {
        // 保存时把Date转成ISO字符串
        const dataToSave = {
            ...settings,
            loveStartDate: settings.loveStartDate instanceof Date 
                ? settings.loveStartDate.toISOString() 
                : settings.loveStartDate
        };
        return this.setStoredData(this.APPEARANCE_KEY, dataToSave);
    }
    
    // ---- 背景设置 ----
    getBackgroundSettings() {
        return this.getStoredData(this.BACKGROUND_KEY) || {
            backgroundImage: null,
            opacity: 100
        };
    }
    
    saveBackgroundSettings(settings) {
        return this.setStoredData(this.BACKGROUND_KEY, settings);
    }
    
    // ---- 塔罗牌设置 ----
    getTarotSettings() {
        return this.getStoredData(this.TAROT_KEY) || {
            enabled: false,
            drawCount: 1,
            customPhrases: []
        };
    }
    
    saveTarotSettings(settings) {
        return this.setStoredData(this.TAROT_KEY, settings);
    }
    
    // ---- 已抽取塔罗牌记录（Set） ----
    getDrawnCards() {
        const cards = this.getStoredData(this.DRAWN_CARDS_KEY) || [];
        // 从数组恢复为Set
        return new Set(cards);
    }
    
    saveDrawnCards(cardSet) {
        // 将Set转换为数组存储
        const cardsArray = Array.from(cardSet);
        return this.setStoredData(this.DRAWN_CARDS_KEY, cardsArray);
    }
    
    // ---- 通信设置 ----
    getCommunicationSettings() {
        return this.getStoredData(this.COMMUNICATION_KEY) || {
            autoAcceptCalls: true,
            autoAcceptVideos: true,
            todayCalls: 0,
            todayVideos: 0,
            totalCallTime: 0,
            totalVideoTime: 0,
            todayIncomingCalls: 0,
            activeCallSettings: {
                enabled: true,
                overallFrequency: 30,
                callPreference: 50,
                presetMode: 'custom',
                minInterval: 15,
                maxInterval: 45,
                respectBusyStatus: true,
                timeSensitivity: true,
                adaptToActivity: true
            }
        };
    }
    
    saveCommunicationSettings(settings) {
        return this.setStoredData(this.COMMUNICATION_KEY, settings);
    }
    
    // ---- 群聊设置 ----
    getGroupSettings() {
        return this.getStoredData(this.GROUP_SETTINGS_KEY) || {
            enabled: false,
            showAvatar: true,
            showName: true,
            members: []
        };
    }
    
    saveGroupSettings(settings) {
        return this.setStoredData(this.GROUP_SETTINGS_KEY, settings);
    }
    
    // ---- 音乐设置 ----
    getMusicSettings() {
        return this.getStoredData(this.MUSIC_SETTINGS_KEY) || {
            musicList: [],
            autoPlayMusic: true,
            musicFrequency: 30,
            playMode: 'random'
        };
    }
    
    saveMusicSettings(settings) {
        return this.setStoredData(this.MUSIC_SETTINGS_KEY, settings);
    }
    
    // ---- 拍一拍设置 ----
    getPokeSettings() {
        return this.getStoredData(this.POKE_SETTINGS_KEY) || {
            enabled: true,
            frequency: 20,
            phrases: ["拍了拍你", "拍了拍我的肩膀", "拍了拍我的脑袋", "戳了戳我", "轻轻碰了碰我"]
        };
    }
    
    savePokeSettings(settings) {
        return this.setStoredData(this.POKE_SETTINGS_KEY, settings);
    }
    
    // ---- 随机变化设置 ----
    getRandomSettings() {
        return this.getStoredData(this.RANDOM_SETTINGS_KEY) || {
            minValue: 2,
            minUnit: 1,
            maxValue: 4,
            maxUnit: 3600
        };
    }
    
    saveRandomSettings(settings) {
        return this.setStoredData(this.RANDOM_SETTINGS_KEY, settings);
    }
    
    // ---- 恋爱天数 ----
    getLoveDays() {
        return this.getStoredData(this.LOVE_DAYS_KEY) || 1;
    }
    
    saveLoveDays(days) {
        return this.setStoredData(this.LOVE_DAYS_KEY, days);
    }
    
    // ---- 已读不回记录 ----
    getReadNoReplyIds() {
        return this.getStoredData(this.READ_NO_REPLY_KEY) || [];
    }
    
    saveReadNoReplyIds(ids) {
        return this.setStoredData(this.READ_NO_REPLY_KEY, ids);
    }
    
    // ---- 今日日期 ----
    getTodayDate() {
        return this.getStoredData(this.TODAY_DATE_KEY) || new Date().toDateString();
    }
    
    saveTodayDate(dateStr) {
        return this.setStoredData(this.TODAY_DATE_KEY, dateStr);
    }
    
    /**
     * 清除所有数据（用于重置功能）
     */
    clearAllData() {
        try {
            // 获取所有相关键
            const keysToRemove = Object.keys(localStorage).filter(key => 
                key.includes('seven_and_wish_')
            );
            
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
            });
            
            // 重新创建默认数据
            this.createDefaultData();
            
            return true;
        } catch (e) {
            console.error('清除所有数据失败:', e);
            return false;
        }
    }
}

// ========================
// 第二部分：应用主类 - 整合存储逻辑，修正通话记录时间格式
// ========================

class ChatApp {
    constructor() {
        // 初始化数据管理器
        this.dataManager = new ChatDataManager();
        
        // 应用数据
        this.appData = {
            selfInfo: null,
            otherInfo: null,
            messages: null,
            responsePhrases: null,
            stickers: null,
            sendSettings: null,
            appearanceSettings: null,
            backgroundSettings: null,
            tarotSettings: null,
            communicationSettings: null,
            groupSettings: null,
            musicSettings: null,
            drawnCards: null,
            loveDays: null,
            readNoReplyMessageIds: null,
            todayDate: null,
            // 新增拍一拍设置
            pokeSettings: null,
            pokeTimer: null,
            // 新增随机变化设置
            randomSettings: null,
            
            // 运行时状态
            isTyping: false,
            waitingForReply: false,
            quotedMessage: null,
            activeCall: null,
            activeVideo: null,
            callTimer: null,
            callStartTime: null,
            activeMessageActions: null,
            statusTimer: null,
            moodTimer: null,
            autoSendTimer: null,
            activeCallTimer: null,
            musicTimer: null,
            activeMusicPlayer: null,
            musicAudio: null,
            isMusicPlaying: false,
            currentPlayingMusic: null,
            musicCurrentTime: 0,
            editingUserType: null,
            editingGroupMemberIndex: -1,  // 当前编辑的群成员索引
            otherStatusTimer: null // 新增：对方状态随机变化定时器
        };
        
        // 常量定义
        this.DEFAULT_TAROT_CARDS = [
            "愚人 正位", "愚人 逆位", "魔术师 正位", "魔术师 逆位",
            "女祭司 正位", "女祭司 逆位", "女皇 正位", "女皇 逆位",
            "皇帝 正位", "皇帝 逆位", "教皇 正位", "教皇 逆位",
            "恋人 正位", "恋人 逆位", "战车 正位", "战车 逆位",
            "力量 正位", "力量 逆位", "隐士 正位", "隐士 逆位",
            "命运之轮 正位", "命运之轮 逆位", "正义 正位", "正义 逆位",
            "倒吊人 正位", "倒吊人 逆位", "死神 正位", "死神 逆位",
            "节制 正位", "节制 逆位", "恶魔 正位", "恶魔 逆位",
            "高塔 正位", "高塔 逆位", "星星 正位", "星星 逆位",
            "月亮 正位", "月亮 逆位", "太阳 正位", "太阳 逆位",
            "审判 正位", "审判 逆位", "世界 正位", "世界 逆位",
            "权杖一 正位", "权杖一 逆位", "权杖二 正位", "权杖二 逆位",
            "权杖三 正位", "权杖三 逆位", "权杖四 正位", "权杖四 逆位",
            "权杖五 正位", "权杖五 逆位", "权杖六 正位", "权杖六 逆位",
            "权杖七 正位", "权杖七 逆位", "权杖八 正位", "权杖八 逆位",
            "权杖九 正位", "权杖九 逆位", "权杖十 正位", "权杖十 逆位",
            "权杖侍从 正位", "权杖侍从 逆位", "权杖骑士 正位", "权杖骑士 逆位",
            "权杖皇后 正位", "权杖皇后 逆位", "权杖国王 正位", "权杖国王 逆位",
            "圣杯一 正位", "圣杯一 逆位", "圣杯二 正位", "圣杯二 逆位",
            "圣杯三 正位", "圣杯三 逆位", "圣杯四 正位", "圣杯四 逆位",
            "圣杯五 正位", "圣杯五 逆位", "圣杯六 正位", "圣杯六 逆位",
            "圣杯七 正位", "圣杯七 逆位", "圣杯八 正位", "圣杯八 逆位",
            "圣杯九 正位", "圣杯九 逆位", "圣杯十 正位", "圣杯十 逆位",
            "圣杯侍从 正位", "圣杯侍从 逆位", "圣杯骑士 正位", "圣杯骑士 逆位",
            "圣杯皇后 正位", "圣杯皇后 逆位", "圣杯国王 正位", "圣杯国王 逆位",
            "宝剑一 正位", "宝剑一 逆位", "宝剑二 正位", "宝剑二 逆位",
            "宝剑三 正位", "宝剑三 逆位", "宝剑四 正位", "宝剑四 逆位",
            "宝剑五 正位", "宝剑五 逆位", "宝剑六 正位", "宝剑六 逆位",
            "宝剑七 正位", "宝剑七 逆位", "宝剑八 正位", "宝剑八 逆位",
            "宝剑九 正位", "宝剑九 逆位", "宝剑十 正位", "宝剑十 逆位",
            "宝剑侍从 正位", "宝剑侍从 逆位", "宝剑骑士 正位", "宝剑骑士 逆位",
            "宝剑皇后 正位", "宝剑皇后 逆位", "宝剑国王 正位", "宝剑国王 逆位",
            "星币一 正位", "星币一 逆位", "星币二 正位", "星币二 逆位",
            "星币三 正位", "星币三 逆位", "星币四 正位", "星币四 逆位",
            "星币五 正位", "星币五 逆位", "星币六 正位", "星币六 逆位",
            "星币七 正位", "星币七 逆位", "星币八 正位", "星币八 逆位",
            "星币九 正位", "星币九 逆位", "星币十 正位", "星币十 逆位",
            "星币侍从 正位", "星币侍从 逆位", "星币骑士 正位", "星币骑士 逆位",
            "星币皇后 正位", "星币皇后 逆位", "星币国王 正位", "星币国王 逆位"
        ];
        
        this.PRESET_MODES = {
            quiet: { name: '安静模式', overallFrequency: 10, callPreference: 30, minInterval: 45, maxInterval: 120 },
            daily: { name: '日常模式', overallFrequency: 30, callPreference: 50, minInterval: 20, maxInterval: 60 },
            intimate: { name: '亲密模式', overallFrequency: 50, callPreference: 70, minInterval: 10, maxInterval: 30 },
            custom: { name: '自定义' }
        };
        
        // 状态选项
        this.statusOptions = [
            { text: '在DR', class: 'dr', color: '#2196f3' },
            { text: '在CR', class: 'cr', color: '#9c27b0' },
            { text: '在线', class: 'online', color: '#4caf50' },
            { text: '在忙', class: 'busy', color: '#ff9800' },
            { text: '在我身边', class: 'nearby', color: '#ff5722' }
        ];
        
        // 状态切换时间
        this.statusChangeTimes = [120, 300, 600, 900, 1800, 2700, 3600, 5400, 7200];
        
        // 启动应用
        this.init();
    }
    
    /**
     * 从localStorage加载所有数据
     */
    loadAllData() {
        console.log('从本地存储加载数据...');
        
        // 加载用户信息
        this.appData.selfInfo = this.dataManager.getSelfInfo();
        this.appData.otherInfo = this.dataManager.getOtherInfo();
        
        // 加载消息记录
        this.appData.messages = this.dataManager.getMessages();
        
        // 加载回复词条
        this.appData.responsePhrases = this.dataManager.getPhrases();
        
        // 加载表情包
        this.appData.stickers = this.dataManager.getStickers();
        
        // 加载发送设置
        this.appData.sendSettings = this.dataManager.getSendSettings();
        
        // 加载外观设置
        this.appData.appearanceSettings = this.dataManager.getAppearanceSettings();
        
        // 加载背景设置
        this.appData.backgroundSettings = this.dataManager.getBackgroundSettings();
        
        // 加载塔罗牌设置
        this.appData.tarotSettings = this.dataManager.getTarotSettings();
        
        // 加载通信设置
        this.appData.communicationSettings = this.dataManager.getCommunicationSettings();
        
        // 加载群聊设置
        this.appData.groupSettings = this.dataManager.getGroupSettings();
        
        // 加载音乐设置
        this.appData.musicSettings = this.dataManager.getMusicSettings();
        
        // 加载拍一拍设置
        this.appData.pokeSettings = this.dataManager.getPokeSettings();
        
        // 加载随机变化设置
        this.appData.randomSettings = this.dataManager.getRandomSettings();
        
        // 加载已抽取塔罗牌记录（Set）
        this.appData.drawnCards = this.dataManager.getDrawnCards();
        
        // 加载恋爱天数
        this.appData.loveDays = this.dataManager.getLoveDays();
        
        // 加载已读不回记录
        this.appData.readNoReplyMessageIds = this.dataManager.getReadNoReplyIds();
        
        // 加载今日日期
        this.appData.todayDate = this.dataManager.getTodayDate();
        
        // 检查是否需要重置每日统计
        this.checkResetDailyStats();
        
        // 计算恋爱天数
        this.calculateLoveDays();
        
        console.log('数据加载完成:', {
            消息数量: this.appData.messages.length,
            表情包数量: this.appData.stickers.length,
            词条数量: this.appData.responsePhrases.length,
            群聊成员: this.appData.groupSettings?.members?.length || 0
        });
    }
    
    /**
     * 为所有没有 groupMember 的对方消息分配一个固定的群成员（新增）
     */
    migrateMessagesForGroup() {
        const groupSettings = this.appData.groupSettings;
        if (!groupSettings?.enabled || !groupSettings.members?.length) return;

        let changed = false;
        this.appData.messages.forEach(msg => {
            if (msg.sender === 'other' && !msg.groupMember) {
                const randomIndex = Math.floor(Math.random() * groupSettings.members.length);
                const member = groupSettings.members[randomIndex];
                msg.groupMember = {
                    name: member.name,
                    avatar: member.avatar || null
                };
                changed = true;
            }
        });
        if (changed) {
            this.saveAllData();
        }
    }
    
    /**
     * 保存所有数据到localStorage
     */
    saveAllData() {
        // 保存用户信息
        this.dataManager.saveSelfInfo(this.appData.selfInfo);
        this.dataManager.saveOtherInfo(this.appData.otherInfo);
        
        // 保存消息记录
        this.dataManager.saveAllMessages(this.appData.messages);
        
        // 保存回复词条
        this.dataManager.savePhrases(this.appData.responsePhrases);
        
        // 保存表情包
        this.dataManager.saveStickers(this.appData.stickers);
        
        // 保存发送设置
        this.dataManager.saveSendSettings(this.appData.sendSettings);
        
        // 保存外观设置
        this.dataManager.saveAppearanceSettings(this.appData.appearanceSettings);
        
        // 保存背景设置
        this.dataManager.saveBackgroundSettings(this.appData.backgroundSettings);
        
        // 保存塔罗牌设置
        this.dataManager.saveTarotSettings(this.appData.tarotSettings);
        
        // 保存通信设置
        this.dataManager.saveCommunicationSettings(this.appData.communicationSettings);
        
        // 保存群聊设置
        this.dataManager.saveGroupSettings(this.appData.groupSettings);
        
        // 保存音乐设置
        this.dataManager.saveMusicSettings(this.appData.musicSettings);
        
        // 保存拍一拍设置
        this.dataManager.savePokeSettings(this.appData.pokeSettings);
        
        // 保存随机变化设置
        this.dataManager.saveRandomSettings(this.appData.randomSettings);
        
        // 保存已抽取塔罗牌记录
        this.dataManager.saveDrawnCards(this.appData.drawnCards);
        
        // 保存恋爱天数
        this.dataManager.saveLoveDays(this.appData.loveDays);
        
        // 保存已读不回记录
        this.dataManager.saveReadNoReplyIds(this.appData.readNoReplyMessageIds);
        
        // 保存今日日期
        this.dataManager.saveTodayDate(this.appData.todayDate);
    }
    
    /**
     * 检查是否需要重置每日统计
     */
    checkResetDailyStats() {
        const currentDate = new Date().toDateString();
        if (this.appData.todayDate !== currentDate) {
            // 新的一天，重置每日统计
            this.appData.communicationSettings.todayCalls = 0;
            this.appData.communicationSettings.todayVideos = 0;
            this.appData.communicationSettings.todayIncomingCalls = 0;
            this.appData.todayDate = currentDate;
            console.log('已重置每日通话统计');
        }
    }
    
    /**
     * 计算恋爱天数
     */
    calculateLoveDays() {
        const today = new Date();
        const startDate = this.appData.appearanceSettings.loveStartDate;
        
        if (startDate && startDate instanceof Date) {
            const timeDiff = today.getTime() - startDate.getTime();
            this.appData.loveDays = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;
            if (this.appData.loveDays < 1) this.appData.loveDays = 1;
        }
    }
    
    /**
     * 初始化应用
     */
    init() {
        console.log('初始化应用...');
        
        // 1. 加载所有数据
        this.loadAllData();
        
        // 新增：迁移旧消息，为每条对方消息分配固定群成员
        this.migrateMessagesForGroup();
        
        // 2. 打开页面时将所有对方发送的消息标记为已读
        this.markOtherMessagesAsRead();
        
        // 3. 渲染所有UI
        this.renderAllUI();
        
        // 4. 启动所有定时器
        this.startAllTimers();
        
        // 5. 启动对方状态随机变化
        this.startOtherStatusRandomChanges();
        
        // 6. 设置事件监听器
        this.setupEventListeners();
        
        // 7. 显示加载成功通知
        this.showNotification('聊天记录已加载');
        
        // 8. 自动保存定时器（每30秒）
        setInterval(() => {
            this.saveAllData();
        }, 30000);
        
        // 9. 页面关闭前保存
        window.addEventListener('beforeunload', () => {
            this.saveAllData();
        });
        
        // 10. 页面可见性变化时保存
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.saveAllData();
            }
        });
        
        // 11. 恢复夜间模式状态
        const savedNightMode = localStorage.getItem('night_mode_enabled');
        if (savedNightMode === 'true') {
            document.documentElement.classList.add('night-mode');
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                const icon = themeToggle.querySelector('i');
                if (icon) icon.textContent = 'light_mode';
            }
            document.body.style.backgroundColor = '#0a0a0a';
            document.documentElement.style.backgroundColor = '#0a0a0a';
            const bgContainer = document.getElementById('backgroundContainer');
            if (bgContainer && bgContainer.style.backgroundImage) {
                bgContainer.style.filter = 'brightness(0.15) contrast(1.2)';
            }
        }
    }
    
    /**
     * 将所有对方发送的消息标记为已读
     */
    markOtherMessagesAsRead() {
        if (this.appData.messages) {
            this.appData.messages.forEach(msg => {
                if (msg.sender === 'other') {
                    msg.read = true;
                }
            });
        }
    }
    
    /**
     * 渲染所有UI
     */
    renderAllUI() {
        this.renderMessages();
        this.renderStickerPreview();
        this.renderPhrasesTextarea();
        this.renderTarotUI();
        this.renderBackgroundUI();
        this.renderUserInfo();
        this.renderAppearance();
        this.renderCommunicationStats();
        this.renderGroupUI();
        this.initSendSettingsUI();
        this.initAppearanceSettingsUI();
        this.initCommunicationSettingsUI();
        this.initActiveCallSettingsUI();
        this.initMusicSettingsUI();
        this.renderPokeUI(); // 新增拍一拍UI
        this.renderRandomUI(); // 新增随机变化UI
        
        this.updateStickerCount();
        this.updatePhraseCount();
        this.updateTarotPhraseCount();
    }
    
    // ========================
    // UI 渲染方法
    // ========================
    
    renderMessages() {
        const messagesArea = document.getElementById('messagesArea');
        if (!messagesArea) return;
        
        messagesArea.innerHTML = '';
        
        // 添加"对方正在输入"指示器
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            messagesArea.appendChild(typingIndicator);
            typingIndicator.classList.toggle('active', this.appData.isTyping);
        }
        
        // 如果没有消息，显示提示
        if (!this.appData.messages || this.appData.messages.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'message other';
            emptyMessage.innerHTML = `
                还没有聊天记录，开始聊天吧！
                <div class="message-time">
                    <span>${this.getCurrentTime()}</span>
                </div>
            `;
            messagesArea.appendChild(emptyMessage);
        } else {
            // 渲染所有消息
            this.appData.messages.forEach(msg => {
                const messageContainer = document.createElement('div');
                messageContainer.className = `message-container ${msg.sender}`;
                
                // 头像
                const messageAvatar = document.createElement('div');
                messageAvatar.className = 'message-avatar';
                
                // 确定头像和名称来源（修改后的群聊固定逻辑）
                let avatarToShow = null;
                let nameToShow = null;
                
                if (msg.sender === 'self') {
                    avatarToShow = this.appData.selfInfo?.avatar;
                    nameToShow = this.appData.selfInfo?.nickname;
                } else { // other
                    // 如果群聊开启且消息有 groupMember，使用群成员信息
                    if (this.appData.groupSettings?.enabled && msg.groupMember) {
                        avatarToShow = msg.groupMember.avatar;
                        nameToShow = msg.groupMember.name;
                    } else {
                        avatarToShow = this.appData.otherInfo?.avatar;
                        nameToShow = this.appData.otherInfo?.nickname;
                    }
                }
                
                if (avatarToShow) {
                    messageAvatar.innerHTML = `<img src="${avatarToShow}" alt="${nameToShow || ''}">`;
                } else {
                    messageAvatar.innerHTML = `<span></span>`;
                }
                
                // 消息内容
                const messageContent = document.createElement('div');
                messageContent.className = 'message-content';
                
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.sender}`;
                
                // 检查是否为拍一拍消息
                const isPokeMessage = msg.type === 'poke';
                
                // 创建消息操作菜单 (拍一拍不创建)
                let messageActions = null;
                if (!isPokeMessage) {
                    messageActions = document.createElement('div');
                    messageActions.className = 'message-actions';
                    messageActions.innerHTML = `
                        <button class="message-action-btn quote" data-id="${msg.id}">引用</button>
                        <button class="message-action-btn delete" data-id="${msg.id}">删除</button>
                        ${msg.sender === 'self' ? '<button class="message-action-btn recall" data-id="' + msg.id + '">撤回</button>' : ''}
                    `;
                }
                
                // 添加点击事件用于显示操作菜单 (拍一拍消息不添加)
                if (!isPokeMessage) {
                    messageDiv.addEventListener('click', (e) => {
                        e.stopPropagation();
                        
                        if (this.appData.activeMessageActions && this.appData.activeMessageActions !== messageActions) {
                            this.appData.activeMessageActions.style.display = 'none';
                        }
                        
                        if (messageActions.style.display === 'flex') {
                            messageActions.style.display = 'none';
                            this.appData.activeMessageActions = null;
                        } else {
                            messageActions.style.display = 'flex';
                            this.appData.activeMessageActions = messageActions;
                        }
                    });
                }
                
                // 检查消息类型
                const isCallMessage = msg.type === 'call' || msg.type === 'video';
                const isTarotMessage = msg.isTarot;
                const isMusicMessage = msg.type === 'music';
                
                if (isCallMessage) {
                    messageDiv.classList.add(`${msg.type}-message`);
                } else if (isTarotMessage) {
                    messageDiv.classList.add('tarot-message');
                } else if (isMusicMessage) {
                    messageDiv.classList.add('call-message');
                } else if (isPokeMessage) {
                    messageDiv.classList.add('poke-message');
                }
                
                // 检查是否为已读不回消息
                const isReadNoReply = msg.id && this.appData.readNoReplyMessageIds && 
                                      this.appData.readNoReplyMessageIds.includes(msg.id);
                
                // 如果有引用消息，显示引用
                let quotedContent = '';
                if (msg.quotedMessage) {
                    const quoted = msg.quotedMessage;
                    quotedContent = `
                        <div class="quoted-message" data-id="${quoted.id}">
                            ${quoted.isSticker ? 
                              `<img src="${quoted.stickerData}" alt="表情包" style="max-height:20px;">` : 
                              quoted.text || ''}
                        </div>
                    `;
                }
                
                // 塔罗牌消息添加图标
                let tarotIcon = '';
                if (isTarotMessage) tarotIcon = '🔮 ';
                if (isMusicMessage) tarotIcon = '🎵 ';
                
                // 群聊模式下显示发送者名称（固定，不再随机）- 拍一拍不需要
                let senderNameHTML = '';
                if (!isPokeMessage && msg.sender === 'other' && this.appData.groupSettings?.enabled && this.appData.groupSettings.showName) {
                    if (msg.groupMember) {
                        senderNameHTML = `<div style="font-size:0.7rem; color:var(--accent); margin-bottom:2px;">${msg.groupMember.name}</div>`;
                    } else {
                        senderNameHTML = `<div style="font-size:0.7rem; color:var(--accent); margin-bottom:2px;">${this.appData.otherInfo?.nickname || '对方'}</div>`;
                    }
                }
                
                // 根据不同消息类型构建内容
                if (msg.isSticker && msg.stickerData) {
                    messageDiv.innerHTML = `
                        ${senderNameHTML}
                        ${quotedContent}
                        <img src="${msg.stickerData}" alt="表情包" style="max-width: 100px; border-radius: 6px;">
                        <div class="message-time">
                            <span>${msg.time || ''}</span>
                            <span class="message-status">
                                <span class="status-check ${msg.read ? 'double' : 'single'}">${msg.read ? '✓✓' : '✓'}</span>
                                <span>${msg.read ? '已读' : '未读'}</span>
                                ${isReadNoReply ? '<span class="read-no-reply">👀 已读不回</span>' : ''}
                            </span>
                        </div>
                    `;
                } else if (isCallMessage) {
                    messageDiv.innerHTML = `
                        ${senderNameHTML}
                        <div style="display:flex; align-items:center; gap:8px;">
                            <i class="material-icons" style="font-size:1.2rem;">${msg.type === 'call' ? 'call' : 'videocam'}</i>
                            <div>
                                <div style="font-weight:500;">${msg.title || (msg.type === 'call' ? '语音通话' : '视频通话')}</div>
                                <div style="font-size:0.8rem;">${msg.duration || ''}</div>
                            </div>
                        </div>
                        <div class="message-time">
                            <span>${msg.time || ''}</span>
                            <span class="message-status"><span class="status-check double">✓✓</span><span>已读</span></span>
                        </div>
                    `;
                } else if (isPokeMessage) {
                    // 拍一拍消息：只显示文本，没有时间、状态、操作菜单
                    messageDiv.innerHTML = `${msg.text || ''}`;
                } else {
                    // 普通文本消息
                    messageDiv.innerHTML = `
                        ${senderNameHTML}
                        ${quotedContent}
                        ${tarotIcon}${msg.text || ''}
                        <div class="message-time">
                            <span>${msg.time || ''}</span>
                            <span class="message-status">
                                <span class="status-check ${msg.read ? 'double' : 'single'}">${msg.read ? '✓✓' : '✓'}</span>
                                <span>${msg.read ? '已读' : '未读'}</span>
                                ${isReadNoReply ? '<span class="read-no-reply">👀 已读不回</span>' : ''}
                            </span>
                        </div>
                    `;
                }
                
                messageContent.appendChild(messageDiv);
                if (messageActions) {
                    messageContent.appendChild(messageActions);
                }
                messageContainer.appendChild(messageAvatar);
                messageContainer.appendChild(messageContent);
                messagesArea.appendChild(messageContainer);
                
                // 为操作菜单按钮添加事件监听器
                if (messageActions) {
                    const quoteBtn = messageActions.querySelector('.message-action-btn.quote');
                    if (quoteBtn) {
                        quoteBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.quoteMessage(msg);
                            messageActions.style.display = 'none';
                            this.appData.activeMessageActions = null;
                        });
                    }
                    
                    const deleteBtn = messageActions.querySelector('.message-action-btn.delete');
                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.deleteMessage(msg.id);
                            messageActions.style.display = 'none';
                            this.appData.activeMessageActions = null;
                        });
                    }
                    
                    const recallBtn = messageActions.querySelector('.message-action-btn.recall');
                    if (recallBtn) {
                        recallBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.recallMessage(msg.id);
                            messageActions.style.display = 'none';
                            this.appData.activeMessageActions = null;
                        });
                    }
                }
            });
        }
        
        // 滚动到底部
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }
    
    renderStickerPreview() {
        const stickerPreview = document.getElementById('stickerPreview');
        if (!stickerPreview) return;
        
        stickerPreview.innerHTML = '';
        
        // 添加已有的表情包
        if (this.appData.stickers) {
            this.appData.stickers.forEach(sticker => {
                const stickerItem = document.createElement('div');
                stickerItem.className = 'sticker-item';
                stickerItem.innerHTML = `
                    <img src="${sticker.data}" alt="表情包">
                    <button class="delete-sticker" data-id="${sticker.id}">×</button>
                `;
                
                stickerItem.querySelector('.delete-sticker').addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = sticker.id;
                    this.appData.stickers = this.appData.stickers.filter(s => s.id !== id);
                    this.renderStickerPreview();
                    this.saveAllData();
                    this.showNotification('表情包已删除');
                });
                
                stickerPreview.appendChild(stickerItem);
            });
        }
        
        // 添加添加按钮
        const addButton = document.createElement('div');
        addButton.className = 'sticker-item';
        addButton.id = 'addStickerPlaceholder';
        addButton.innerHTML = '<div class="sticker-placeholder">+</div>';
        addButton.addEventListener('click', () => document.getElementById('stickerUpload')?.click());
        stickerPreview.appendChild(addButton);
        
        this.updateStickerCount();
    }
    
    renderPhrasesTextarea() {
        const textarea = document.getElementById('phrasesTextarea');
        if (textarea && this.appData.responsePhrases) {
            textarea.value = this.appData.responsePhrases.join('\n');
            this.updatePhraseCount();
        }
    }
    
    renderTarotUI() {
        const tarotModeToggle = document.getElementById('tarotModeToggle');
        if (tarotModeToggle) {
            tarotModeToggle.checked = this.appData.tarotSettings?.enabled || false;
        }
        
        const tarotCountValue = document.getElementById('tarotCountValue');
        if (tarotCountValue) {
            tarotCountValue.textContent = this.appData.tarotSettings?.drawCount || 1;
        }
        
        const tarotNumberSelector = document.getElementById('tarotNumberSelector');
        if (tarotNumberSelector) {
            tarotNumberSelector.innerHTML = '';
            for (let i = 1; i <= 15; i++) {
                const numberDiv = document.createElement('div');
                numberDiv.className = `tarot-number ${i === (this.appData.tarotSettings?.drawCount || 1) ? 'active' : ''}`;
                numberDiv.textContent = i;
                numberDiv.dataset.number = i;
                numberDiv.addEventListener('click', () => this.selectTarotNumber(i));
                tarotNumberSelector.appendChild(numberDiv);
            }
        }
        
        const tarotTextarea = document.getElementById('tarotTextarea');
        if (tarotTextarea && this.appData.tarotSettings?.customPhrases) {
            tarotTextarea.value = this.appData.tarotSettings.customPhrases.join('\n');
        }
        
        this.updateTarotPhraseCount();
        this.updateTarotStatus();
    }
    
    renderBackgroundUI() {
        this.updateBackgroundPreview();
        
        const slider = document.getElementById('backgroundOpacitySlider');
        const value = document.getElementById('backgroundOpacityValue');
        if (slider && value && this.appData.backgroundSettings) {
            slider.value = this.appData.backgroundSettings.opacity || 100;
            value.textContent = `${this.appData.backgroundSettings.opacity || 100}%`;
        }
        
        this.applyBackgroundSettings();
    }
    
    renderUserInfo() {
        // 自己
        const selfAvatar = document.getElementById('selfAvatar');
        if (selfAvatar) {
            if (this.appData.selfInfo?.avatar) {
                selfAvatar.innerHTML = `<img src="${this.appData.selfInfo.avatar}" alt="${this.appData.selfInfo.nickname}">`;
            } else {
                selfAvatar.innerHTML = `<span></span>`;
            }
        }
        
        const selfNickname = document.getElementById('selfNickname');
        if (selfNickname) {
            selfNickname.textContent = this.appData.selfInfo?.nickname || '我';
        }
        
        const selfStatusText = document.getElementById('selfStatusText');
        if (selfStatusText) {
            selfStatusText.textContent = this.appData.selfInfo?.status || '在线';
        }
        
        // 对方
        const otherAvatar = document.getElementById('otherAvatar');
        if (otherAvatar) {
            if (this.appData.otherInfo?.avatar) {
                otherAvatar.innerHTML = `<img src="${this.appData.otherInfo.avatar}" alt="${this.appData.otherInfo.nickname}">`;
            } else {
                otherAvatar.innerHTML = `<span></span>`;
            }
        }
        
        const otherNickname = document.getElementById('otherNickname');
        if (otherNickname) {
            otherNickname.textContent = this.appData.otherInfo?.nickname || '对方';
        }
        
        const otherStatusText = document.getElementById('otherStatusText');
        if (otherStatusText) {
            otherStatusText.textContent = this.appData.otherInfo?.status || '在DR';
        }
        
        const otherMoodValue = document.getElementById('otherMoodValue');
        if (otherMoodValue) {
            otherMoodValue.textContent = `${this.appData.otherInfo?.mood || 85}`;
        }
        
        this.updateOtherStatusIndicator();
        // 新增：更新位置和心情颜色
        this.updateOtherLocationUI(this.appData.otherInfo?.status || '在DR');
        this.updateOtherMoodUI(this.appData.otherInfo?.mood || 85);
    }
    
    renderAppearance() {
        const appTitle = document.getElementById('appTitle');
        if (appTitle) {
            appTitle.textContent = this.appData.appearanceSettings?.appTitle || '齐司礼';
        }
        
        const appSubtitle = document.getElementById('appSubtitle');
        if (appSubtitle) {
            appSubtitle.textContent = this.appData.appearanceSettings?.appSubtitle || 'DR传讯';
        }
        
        const loveDaysCount = document.getElementById('loveDaysCount');
        if (loveDaysCount) {
            loveDaysCount.textContent = `恋爱第 ${this.appData.loveDays || 1} 天`;
        }
    }
    
    renderCommunicationStats() {
        const todayCalls = document.getElementById('todayCalls');
        if (todayCalls) {
            todayCalls.textContent = this.appData.communicationSettings?.todayCalls || 0;
        }
        
        const totalCallTime = document.getElementById('totalCallTime');
        if (totalCallTime) {
            totalCallTime.textContent = this.appData.communicationSettings?.totalCallTime || 0;
        }
        
        const todayVideos = document.getElementById('todayVideos');
        if (todayVideos) {
            todayVideos.textContent = this.appData.communicationSettings?.todayVideos || 0;
        }
        
        const totalVideoTime = document.getElementById('totalVideoTime');
        if (totalVideoTime) {
            totalVideoTime.textContent = this.appData.communicationSettings?.totalVideoTime || 0;
        }
        
        const todayIncomingCalls = document.getElementById('todayIncomingCalls');
        if (todayIncomingCalls) {
            todayIncomingCalls.textContent = this.appData.communicationSettings?.todayIncomingCalls || 0;
        }
    }
    
    /**
     * 渲染群聊UI
     */
    renderGroupUI() {
        const groupModeToggle = document.getElementById('groupModeToggle');
        if (groupModeToggle) {
            groupModeToggle.checked = this.appData.groupSettings?.enabled || false;
        }
        
        const showAvatar = document.getElementById('groupShowAvatar');
        if (showAvatar) {
            showAvatar.checked = this.appData.groupSettings?.showAvatar !== false;
        }
        
        const showName = document.getElementById('groupShowName');
        if (showName) {
            showName.checked = this.appData.groupSettings?.showName !== false;
        }
        
        const memberList = document.getElementById('groupMemberList');
        if (memberList) {
            memberList.innerHTML = '';
            const members = this.appData.groupSettings?.members || [];
            if (members.length === 0) {
                memberList.innerHTML = '<div style="text-align:center; color:#888; padding:10px;">暂无群成员，点击添加</div>';
            } else {
                members.forEach((member, index) => {
                    const item = document.createElement('div');
                    item.className = 'group-member-item';
                    item.innerHTML = `
                        <div class="group-member-avatar">
                            ${member.avatar ? `<img src="${member.avatar}" alt="${member.name}">` : '<span></span>'}
                        </div>
                        <div class="group-member-info">
                            <div class="group-member-name">${member.name}</div>
                        </div>
                        <div class="group-member-actions">
                            <button class="group-member-edit" data-index="${index}">编辑</button>
                            <button class="group-member-delete" data-index="${index}">删除</button>
                        </div>
                    `;
                    
                    item.querySelector('.group-member-edit').addEventListener('click', () => this.openGroupMemberEditModal(index));
                    item.querySelector('.group-member-delete').addEventListener('click', () => this.deleteGroupMember(index));
                    
                    memberList.appendChild(item);
                });
            }
        }
    }
    
    /**
     * 打开群成员编辑弹窗
     */
    openGroupMemberEditModal(index) {
        const modal = document.getElementById('groupMemberEditModal');
        const title = document.getElementById('groupMemberEditTitle');
        const nameInput = document.getElementById('groupMemberNameInput');
        const avatarPreview = document.getElementById('groupMemberAvatarPreview');
        
        if (!modal || !nameInput || !avatarPreview) return;
        
        this.appData.editingGroupMemberIndex = index;
        
        if (index === -1) {
            // 新增
            title.textContent = '添加成员';
            nameInput.value = '';
            avatarPreview.innerHTML = '<span style="font-size:2rem;">+</span>';
            avatarPreview.style.background = 'rgba(255,255,255,0.2)';
        } else {
            // 编辑
            const member = this.appData.groupSettings.members[index];
            title.textContent = '编辑成员';
            nameInput.value = member.name;
            if (member.avatar) {
                avatarPreview.innerHTML = `<img src="${member.avatar}" style="width:100%; height:100%; object-fit:cover;">`;
                avatarPreview.style.background = 'transparent';
            } else {
                avatarPreview.innerHTML = '<span style="font-size:2rem;">+</span>';
                avatarPreview.style.background = 'rgba(255,255,255,0.2)';
            }
        }
        
        modal.style.display = 'block';
        
        // 点击头像上传
        avatarPreview.onclick = () => {
            document.getElementById('groupMemberAvatarUpload').click();
        };
    }
    
    /**
     * 关闭群成员编辑弹窗
     */
    closeGroupMemberEditModal() {
        document.getElementById('groupMemberEditModal').style.display = 'none';
    }
    
    /**
     * 保存群成员编辑
     */
    saveGroupMemberEdit() {
        const nameInput = document.getElementById('groupMemberNameInput');
        const name = nameInput.value.trim();
        if (!name) {
            this.showNotification('请输入成员昵称');
            return;
        }
        
        const avatarPreview = document.getElementById('groupMemberAvatarPreview');
        const avatarImg = avatarPreview.querySelector('img');
        const avatar = avatarImg ? avatarImg.src : null;
        
        if (this.appData.editingGroupMemberIndex === -1) {
            // 新增
            if (!this.appData.groupSettings) this.appData.groupSettings = { enabled: false, showAvatar: true, showName: true, members: [] };
            if (!this.appData.groupSettings.members) this.appData.groupSettings.members = [];
            this.appData.groupSettings.members.push({ name, avatar });
        } else {
            // 编辑
            const member = this.appData.groupSettings.members[this.appData.editingGroupMemberIndex];
            member.name = name;
            if (avatar) member.avatar = avatar;
        }
        
        this.saveAllData();
        this.renderGroupUI();
        this.closeGroupMemberEditModal();
        this.showNotification('群成员已保存');
    }
    
    /**
     * 删除群成员
     */
    deleteGroupMember(index) {
        if (confirm('确定删除该成员吗？')) {
            const members = [...(this.appData.groupSettings?.members || [])];
            members.splice(index, 1);
            this.appData.groupSettings.members = members;
            this.saveAllData();
            this.renderGroupUI();
            this.showNotification('成员已删除');
        }
    }
    
    /**
     * 处理群成员头像上传 - 修改为使用压缩
     */
    handleGroupMemberAvatarUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // 使用 compressImage 压缩头像，限制 200x200，质量 0.7
        this.compressImage(file, { maxWidth: 200, maxHeight: 200, quality: 0.7 })
            .then(compressedDataUrl => {
                const avatarPreview = document.getElementById('groupMemberAvatarPreview');
                avatarPreview.innerHTML = `<img src="${compressedDataUrl}" style="width:100%; height:100%; object-fit:cover;">`;
                avatarPreview.style.background = 'transparent';
            })
            .catch(err => {
                console.error('头像压缩失败', err);
                this.showNotification('头像处理失败，请重试');
            });
    }
    
    initSendSettingsUI() {
        const stickerRatioSlider = document.getElementById('stickerRatioSlider');
        const phraseRatioSlider = document.getElementById('phraseRatioSlider');
        const stickerRatioValue = document.getElementById('stickerRatioValue');
        const phraseRatioValue = document.getElementById('phraseRatioValue');
        const maxMessageCount = document.getElementById('maxMessageCount');
        const autoSendFrequency = document.getElementById('autoSendFrequency');
        
        if (stickerRatioSlider && this.appData.sendSettings) {
            stickerRatioSlider.value = this.appData.sendSettings.stickerRatio || 50;
        }
        if (phraseRatioSlider && this.appData.sendSettings) {
            phraseRatioSlider.value = this.appData.sendSettings.phraseRatio || 50;
        }
        if (stickerRatioValue && this.appData.sendSettings) {
            stickerRatioValue.textContent = `${this.appData.sendSettings.stickerRatio || 50}%`;
        }
        if (phraseRatioValue && this.appData.sendSettings) {
            phraseRatioValue.textContent = `${this.appData.sendSettings.phraseRatio || 50}%`;
        }
        if (maxMessageCount && this.appData.sendSettings) {
            maxMessageCount.value = this.appData.sendSettings.maxMessageCount || 3;
        }
        if (autoSendFrequency && this.appData.sendSettings) {
            autoSendFrequency.value = this.appData.sendSettings.autoSendFrequency || 600000;
        }
        
        // 新增：最短/最长延迟滑块初始化
        const minDelaySlider = document.getElementById('minDelaySlider');
        const maxDelaySlider = document.getElementById('maxDelaySlider');
        const minDelayValue = document.getElementById('minDelayValue');
        const maxDelayValue = document.getElementById('maxDelayValue');

        if (minDelaySlider && this.appData.sendSettings) {
            minDelaySlider.value = this.appData.sendSettings.minReplyDelay || 1.5;
        }
        if (maxDelaySlider && this.appData.sendSettings) {
            maxDelaySlider.value = this.appData.sendSettings.maxReplyDelay || 3.5;
        }
        if (minDelayValue && this.appData.sendSettings) {
            minDelayValue.textContent = `${(this.appData.sendSettings.minReplyDelay || 1.5).toFixed(1)}秒`;
        }
        if (maxDelayValue && this.appData.sendSettings) {
            maxDelayValue.textContent = `${(this.appData.sendSettings.maxReplyDelay || 3.5).toFixed(1)}秒`;
        }
    }
    
    initAppearanceSettingsUI() {
        const appTitleInput = document.getElementById('appTitleInput');
        const appSubtitleInput = document.getElementById('appSubtitleInput');
        const loveYear = document.getElementById('loveYear');
        const loveMonth = document.getElementById('loveMonth');
        const loveDay = document.getElementById('loveDay');
        
        if (appTitleInput && this.appData.appearanceSettings) {
            appTitleInput.value = this.appData.appearanceSettings.appTitle || '齐司礼';
        }
        if (appSubtitleInput && this.appData.appearanceSettings) {
            appSubtitleInput.value = this.appData.appearanceSettings.appSubtitle || 'DR传讯';
        }
        
        if (this.appData.appearanceSettings?.loveStartDate) {
            const date = new Date(this.appData.appearanceSettings.loveStartDate);
            if (loveYear) loveYear.value = date.getFullYear();
            if (loveMonth) loveMonth.value = date.getMonth() + 1;
            if (loveDay) loveDay.value = date.getDate();
        }
    }
    
    initCommunicationSettingsUI() {
        const autoAcceptCalls = document.getElementById('autoAcceptCalls');
        const autoAcceptVideos = document.getElementById('autoAcceptVideos');
        
        if (autoAcceptCalls && this.appData.communicationSettings) {
            autoAcceptCalls.checked = this.appData.communicationSettings.autoAcceptCalls !== false;
        }
        if (autoAcceptVideos && this.appData.communicationSettings) {
            autoAcceptVideos.checked = this.appData.communicationSettings.autoAcceptVideos !== false;
        }
    }
    
    initActiveCallSettingsUI() {
        const overallFrequencySlider = document.getElementById('overallFrequencySlider');
        const callPreferenceSlider = document.getElementById('callPreferenceSlider');
        
        if (overallFrequencySlider && this.appData.communicationSettings?.activeCallSettings) {
            overallFrequencySlider.value = this.appData.communicationSettings.activeCallSettings.overallFrequency || 30;
            this.updateOverallFrequencyDisplay();
        }
        
        if (callPreferenceSlider && this.appData.communicationSettings?.activeCallSettings) {
            callPreferenceSlider.value = this.appData.communicationSettings.activeCallSettings.callPreference || 50;
            this.updateCallPreferenceDisplay();
        }
        
        this.updateActiveCallPreview();
        this.updatePresetButtons();
    }
    
    updateOtherStatusIndicator() {
        const indicator = document.getElementById('otherStatusIndicator');
        if (!indicator) return;
        
        indicator.className = 'status-indicator';
        
        const status = this.statusOptions.find(s => s.text === this.appData.otherInfo?.status);
        if (status) {
            indicator.classList.add(status.class);
            indicator.style.backgroundColor = status.color;
        }
    }
    
    updateStickerCount() {
        const countEl = document.getElementById('stickerCount');
        if (countEl) {
            countEl.textContent = this.appData.stickers?.length || 0;
        }
    }
    
    updatePhraseCount() {
        const textarea = document.getElementById('phrasesTextarea');
        const countEl = document.getElementById('phraseCount');
        
        if (textarea && countEl) {
            const text = textarea.value.trim();
            if (!text) {
                countEl.textContent = '0';
                return;
            }
            
            const phrases = text.split('\n')
                .map(p => p.trim())
                .filter(p => p.length > 0);
            countEl.textContent = phrases.length;
        }
    }
    
    updateTarotPhraseCount() {
        const countEl = document.getElementById('tarotPhraseCount');
        if (countEl && this.appData.tarotSettings) {
            countEl.textContent = this.appData.tarotSettings.customPhrases?.length || 0;
        }
    }
    
    updateTarotStatus() {
        const statusEl = document.getElementById('tarotStatus');
        if (!statusEl) return;
        
        const enabled = this.appData.tarotSettings?.enabled || false;
        const drawCount = this.appData.tarotSettings?.drawCount || 1;
        const count = this.appData.tarotSettings?.customPhrases?.length || 0;
        
        if (enabled) {
            statusEl.innerHTML = `
                <strong>塔罗牌梦占模式已开启 🔮</strong><br>
                对方将抽取 <strong>${drawCount}</strong> 张塔罗牌字卡进行回复<br>
                塔罗牌字卡库: <strong>${count}</strong> 张
            `;
            statusEl.style.background = 'var(--tarot-bg)';
            statusEl.style.color = 'var(--tarot-text)';
            statusEl.style.borderLeft = '3px solid var(--tarot-text)';
        } else {
            statusEl.innerHTML = `<strong>塔罗牌梦占模式已关闭</strong><br>对方使用普通词条和表情包回复`;
            statusEl.style.background = 'rgba(255, 255, 255, 0.7)';
            statusEl.style.color = 'var(--text)';
            statusEl.style.borderLeft = '3px solid #ccc';
        }
    }
    
    updateBackgroundPreview() {
        const preview = document.getElementById('backgroundPreview');
        if (!preview) return;
        
        if (this.appData.backgroundSettings?.backgroundImage) {
            preview.innerHTML = `<img src="${this.appData.backgroundSettings.backgroundImage}" alt="背景预览">`;
            preview.style.backgroundImage = `url(${this.appData.backgroundSettings.backgroundImage})`;
            preview.style.backgroundSize = 'cover';
            preview.style.backgroundPosition = 'center';
        } else {
            preview.innerHTML = `
                <div class="empty">
                    <i class="material-icons">wallpaper</i>
                    <span>默认背景</span>
                </div>
            `;
        }
    }
    
    applyBackgroundSettings() {
        const container = document.getElementById('backgroundContainer');
        if (!container) return;
        
        if (this.appData.backgroundSettings?.backgroundImage) {
            container.style.backgroundImage = `url(${this.appData.backgroundSettings.backgroundImage})`;
            container.style.backgroundColor = 'transparent';
            container.style.opacity = (this.appData.backgroundSettings.opacity / 100).toString();
        } else {
            container.style.backgroundImage = 'none';
            container.style.backgroundColor = '';
            container.style.opacity = '1';
        }
    }
    
    updateOverallFrequencyDisplay() {
        const value = this.appData.communicationSettings?.activeCallSettings?.overallFrequency || 30;
        const el = document.getElementById('overallFrequencyValue');
        if (el) el.textContent = `${value}%`;
    }
    
    updateCallPreferenceDisplay() {
        const value = this.appData.communicationSettings?.activeCallSettings?.callPreference || 50;
        const el = document.getElementById('callPreferenceValue');
        if (el) {
            const callPercent = value;
            const videoPercent = 100 - value;
            el.textContent = `电话 ${callPercent}% / 视频 ${videoPercent}%`;
        }
    }
    
    updateActiveCallPreview() {
        const settings = this.appData.communicationSettings?.activeCallSettings;
        if (!settings) return;
        
        const frequency = settings.overallFrequency || 30;
        
        let frequencyDesc = '';
        if (frequency === 0) frequencyDesc = '关闭';
        else if (frequency <= 15) frequencyDesc = '很低';
        else if (frequency <= 30) frequencyDesc = '较低';
        else if (frequency <= 50) frequencyDesc = '中等';
        else if (frequency <= 75) frequencyDesc = '较高';
        else frequencyDesc = '很高';
        
        const previewFrequency = document.getElementById('previewFrequency');
        if (previewFrequency) previewFrequency.textContent = `${frequencyDesc} (${frequency}%)`;
        
        let dailyCalls = 0;
        if (frequency === 0) dailyCalls = 0;
        else if (frequency <= 15) dailyCalls = Math.floor(Math.random() * 2) + 1;
        else if (frequency <= 30) dailyCalls = Math.floor(Math.random() * 3) + 2;
        else if (frequency <= 50) dailyCalls = Math.floor(Math.random() * 4) + 3;
        else if (frequency <= 75) dailyCalls = Math.floor(Math.random() * 5) + 4;
        else dailyCalls = Math.floor(Math.random() * 6) + 5;
        
        const previewDaily = document.getElementById('previewDaily');
        if (previewDaily) previewDaily.textContent = frequency === 0 ? '无呼叫' : `${dailyCalls}次呼叫`;
    }
    
    updatePresetButtons() {
        const preset = this.appData.communicationSettings?.activeCallSettings?.presetMode || 'custom';
        const buttons = document.querySelectorAll('.preset-btn');
        
        buttons.forEach(btn => {
            const btnPreset = btn.getAttribute('data-preset');
            btn.classList.toggle('active', btnPreset === preset);
        });
    }
    
    // ========================
    // 定时器管理
    // ========================
    
    startAllTimers() {
        // 移除心情变化定时器
        // this.startMoodChanging();
        this.startAutoSending();
        this.startActiveCallScheduler();
        this.startMusicScheduler();
        this.startPokeScheduler(); // 新增拍一拍定时器
    }
    
    startMoodChanging() {
        // 这个方法不再使用，保留为空方法避免错误
    }
    
    startAutoSending() {
        if (this.appData.autoSendTimer) clearInterval(this.appData.autoSendTimer);
        
        const frequency = this.appData.sendSettings?.autoSendFrequency || 600000;
        if (frequency > 0) {
            this.appData.autoSendTimer = setInterval(() => {
                if (Math.random() > 0.5) {
                    this.autoSendMessage();
                }
            }, frequency);
        }
    }
    
    startActiveCallScheduler() {
        if (this.appData.activeCallTimer) clearInterval(this.appData.activeCallTimer);
        
        const settings = this.appData.communicationSettings?.activeCallSettings;
        if (!settings || !settings.enabled || settings.overallFrequency <= 0) return;
        
        const baseInterval = 60000;
        const checkInterval = baseInterval * (100 / Math.max(settings.overallFrequency, 10));
        
        this.appData.activeCallTimer = setInterval(() => {
            const adjustedProbability = this.calculateAdjustedCallProbability();
            if (Math.random() * 100 < adjustedProbability) {
                const callType = this.determineCallType();
                this.simulateIncomingCall(callType);
            }
        }, checkInterval);
    }
    
    calculateAdjustedCallProbability() {
        const settings = this.appData.communicationSettings?.activeCallSettings;
        if (!settings) return 0;
        
        let baseProbability = settings.overallFrequency || 30;
        
        if (settings.respectBusyStatus && this.appData.otherInfo?.status === '在忙') {
            baseProbability *= 0.3;
        }
        
        if (settings.timeSensitivity) {
            const hour = new Date().getHours();
            if (hour >= 22 || hour < 9) {
                baseProbability *= 0.4;
                if (settings.callPreference > 50) baseProbability *= 0.5;
            } else if (hour >= 9 && hour < 12) {
                baseProbability *= 1.2;
            } else if (hour >= 18 && hour < 22) {
                baseProbability *= 1.3;
            }
        }
        
        return Math.max(0, Math.min(100, baseProbability));
    }
    
    determineCallType() {
        const callPref = this.appData.communicationSettings?.activeCallSettings?.callPreference || 50;
        return Math.random() * 100 < callPref ? 'call' : 'video';
    }
    
    simulateIncomingCall(type) {
        if (this.appData.activeCall || this.appData.activeVideo) return;
        
        if (this.appData.communicationSettings) {
            this.appData.communicationSettings.todayIncomingCalls = (this.appData.communicationSettings.todayIncomingCalls || 0) + 1;
            this.renderCommunicationStats();
            this.saveAllData();
        }
        
        if (type === 'call') {
            this.createCallWindow('incoming');
            this.showNotification('对方来电');
        } else {
            this.createVideoWindow('incoming');
            this.showNotification('对方发起视频通话');
        }
    }
    
    // ========================
    // 消息操作
    // ========================
    
    sendMessage() {
        const input = document.getElementById('messageInput');
        if (!input) return;
        
        const text = input.value.trim();
        if (!text && !this.appData.quotedMessage) return;
        
        const userMessage = {
            id: this.dataManager.generateMessageId(),
            text: text,
            sender: 'self',
            time: this.getCurrentTime(),
            read: false,
            quotedMessage: this.appData.quotedMessage ? {...this.appData.quotedMessage} : null
        };
        
        this.appData.messages.push(userMessage);
        this.renderMessages();
        
        input.value = '';
        this.appData.quotedMessage = null;
        input.placeholder = '输入消息...';
        
        this.saveAllData();
        
        const willReply = Math.random() > 0.2;
        if (willReply) {
            this.appData.waitingForReply = true;
            this.startTypingIndicator();
            
            const minDelay = (this.appData.sendSettings?.minReplyDelay || 1.5) * 1000;
            const maxDelay = (this.appData.sendSettings?.maxReplyDelay || 3.5) * 1000;
            const delay = minDelay + Math.random() * (maxDelay - minDelay);
            
            setTimeout(() => {
                if (this.appData.tarotSettings?.enabled && this.appData.tarotSettings.customPhrases?.length > 0) {
                    this.generateTarotReply('reply');
                } else {
                    this.generateReply(userMessage.id);
                }
            }, delay);
        } else {
            this.appData.waitingForReply = false;
            
            setTimeout(() => {
                this.markSelfMessagesAsRead();
                
                if (userMessage.id) {
                    if (!this.appData.readNoReplyMessageIds) this.appData.readNoReplyMessageIds = [];
                    this.appData.readNoReplyMessageIds.push(userMessage.id);
                }
                
                this.renderMessages();
                this.showNotification('对方已读不回');
                this.saveAllData();
            }, 1000 + Math.random() * 3000);
        }
    }
    
    getCurrentTime() {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    }
    
    startTypingIndicator() {
        this.appData.isTyping = true;
        this.renderMessages();
    }
    
    stopTypingIndicator() {
        this.appData.isTyping = false;
        this.renderMessages();
    }
    
    markSelfMessagesAsRead() {
        if (this.appData.messages) {
            this.appData.messages.forEach(msg => {
                if (msg.sender === 'self') {
                    msg.read = true;
                }
            });
        }
    }
    
    generateReply(messageId) {
        this.stopTypingIndicator();
        this.markSelfMessagesAsRead();
        
        if (messageId && this.appData.readNoReplyMessageIds) {
            const index = this.appData.readNoReplyMessageIds.indexOf(messageId);
            if (index > -1) this.appData.readNoReplyMessageIds.splice(index, 1);
        }
        
        const messageCount = Math.floor(Math.random() * (this.appData.sendSettings?.maxMessageCount || 3)) + 1;
        const totalRatio = (this.appData.sendSettings?.stickerRatio || 50) + (this.appData.sendSettings?.phraseRatio || 50);
        const stickerProbability = (this.appData.sendSettings?.stickerRatio || 50) / totalRatio;
        
        const messagesToSend = [];
        
        for (let i = 0; i < messageCount; i++) {
            const isSticker = Math.random() < stickerProbability && this.appData.stickers?.length > 0;
            
            if (isSticker) {
                const randomSticker = this.appData.stickers[Math.floor(Math.random() * this.appData.stickers.length)];
                messagesToSend.push({ type: 'sticker', data: randomSticker.data });
            } else {
                const randomPhrase = this.appData.responsePhrases[Math.floor(Math.random() * this.appData.responsePhrases.length)];
                messagesToSend.push({ type: 'text', data: randomPhrase });
            }
        }
        
        // 新增：为第一条消息随机选择一个群成员（如果群聊开启）
        let firstGroupMember = null;
        if (this.appData.groupSettings?.enabled && this.appData.groupSettings.members?.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.appData.groupSettings.members.length);
            const member = this.appData.groupSettings.members[randomIndex];
            firstGroupMember = {
                name: member.name,
                avatar: member.avatar || null
            };
        }
        
        const firstMsg = messagesToSend[0];
        const firstMessage = {
            id: this.dataManager.generateMessageId(),
            isSticker: firstMsg.type === 'sticker',
            [firstMsg.type === 'sticker' ? 'stickerData' : 'text']: firstMsg.data,
            sender: 'other',
            time: this.getCurrentTime(),
            read: true,
            groupMember: firstGroupMember  // 新增固定成员
        };
        
        if (Math.random() < 0.4) {
            const recentUserMessages = this.appData.messages
                .filter(msg => msg.sender === 'self')
                .slice(-3);
            
            if (recentUserMessages.length > 0) {
                const randomUserMessage = recentUserMessages[Math.floor(Math.random() * recentUserMessages.length)];
                firstMessage.quotedMessage = {
                    id: randomUserMessage.id,
                    text: randomUserMessage.text || '',
                    isSticker: randomUserMessage.isSticker || false,
                    stickerData: randomUserMessage.stickerData || null,
                    sender: randomUserMessage.sender,
                    time: randomUserMessage.time
                };
            }
        }
        
        this.appData.messages.push(firstMessage);
        this.renderMessages();
        
        if (messagesToSend.length > 1) {
            for (let i = 1; i < messagesToSend.length; i++) {
                // 每条后续消息也随机选择群成员（如果需要，可以改为沿用第一条，这里选择独立随机）
                let nextGroupMember = null;
                if (this.appData.groupSettings?.enabled && this.appData.groupSettings.members?.length > 0) {
                    const randomIdx = Math.floor(Math.random() * this.appData.groupSettings.members.length);
                    const mem = this.appData.groupSettings.members[randomIdx];
                    nextGroupMember = { name: mem.name, avatar: mem.avatar || null };
                }
                
                setTimeout(() => {
                    const msg = messagesToSend[i];
                    const additionalMessage = {
                        id: this.dataManager.generateMessageId(),
                        isSticker: msg.type === 'sticker',
                        [msg.type === 'sticker' ? 'stickerData' : 'text']: msg.data,
                        sender: 'other',
                        time: this.getCurrentTime(),
                        read: true,
                        groupMember: nextGroupMember  // 独立成员
                    };
                    
                    this.appData.messages.push(additionalMessage);
                    this.renderMessages();
                    
                    if (i === messagesToSend.length - 1) {
                        const stickerCount = messagesToSend.filter(m => m.type === 'sticker').length;
                        const textCount = messagesToSend.filter(m => m.type === 'text').length;
                        let notificationText = `对方回复了${messagesToSend.length}条消息`;
                        if (stickerCount > 0 && textCount > 0) {
                            notificationText += `（${textCount}条文字，${stickerCount}个表情包）`;
                        } else if (stickerCount > 0) {
                            notificationText += `（${stickerCount}个表情包）`;
                        }
                        this.showNotification(notificationText);
                    }
                }, (i * 800) + Math.random() * 500);
            }
        } else {
            const msgType = messagesToSend[0].type === 'sticker' ? '一个表情包' : '1条消息';
            this.showNotification(`对方回复了${msgType}`);
        }
        
        this.appData.waitingForReply = false;
        this.saveAllData();
    }
    
    generateTarotReply(source) {
        if (!this.appData.tarotSettings?.enabled || !this.appData.tarotSettings.customPhrases?.length) {
            if (source === 'reply') {
                this.generateReply();
            } else {
                this.autoSendMessage();
            }
            return;
        }
        
        const drawCount = Math.min(this.appData.tarotSettings.drawCount || 1, this.appData.tarotSettings.customPhrases.length);
        let availablePhrases = [...this.appData.tarotSettings.customPhrases];
        
        // 应用同牌正逆位不重复规则
        availablePhrases = availablePhrases.filter(phrase => {
            const parsed = this.parseTarotCard(phrase);
            return this.canDrawCard(parsed);
        });
        
        if (availablePhrases.length === 0) {
            this.appData.drawnCards = new Set();
            availablePhrases = [...this.appData.tarotSettings.customPhrases];
        }
        
        const finalDrawCount = Math.min(drawCount, availablePhrases.length);
        const selectedPhrases = [];
        
        for (let i = 0; i < finalDrawCount && availablePhrases.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availablePhrases.length);
            selectedPhrases.push(availablePhrases[randomIndex]);
            
            const parsed = this.parseTarotCard(availablePhrases[randomIndex]);
            if (parsed.cardName) {
                this.appData.drawnCards.add(parsed.cardName);
            }
            
            availablePhrases.splice(randomIndex, 1);
        }
        
        this.sendTarotMessages(selectedPhrases, source);
    }
    
    parseTarotCard(phrase) {
        const trimmed = phrase.trim();
        
        const patterns = [
            /^([^正逆位]+)(正位|逆位)$/,
            /^(正位|逆位)[·\-](.+)$/,
            /^(正位|逆位)[\-](.+)$/,
            /^(.+)[\-]\s*(正位|逆位)$/,
            /^(.+)\s*[\(（](正位|逆位)[\)）]$/
        ];
        
        for (const pattern of patterns) {
            const match = trimmed.match(pattern);
            if (match) {
                let cardName = '', position = '';
                
                if (pattern.toString().includes('[^正逆位]+')) {
                    cardName = match[1].trim();
                    position = match[2].trim();
                } else if (pattern.toString().includes('^(正位|逆位)')) {
                    position = match[1].trim();
                    cardName = match[2].trim();
                } else {
                    cardName = match[1].trim();
                    position = match[2].trim();
                }
                
                cardName = cardName.replace(/^[·\-]\s*|\s*[·\-]$/g, '').trim();
                
                return { original: trimmed, cardName, position, isValid: true };
            }
        }
        
        return { original: trimmed, cardName: trimmed, position: '', isValid: false };
    }
    
    canDrawCard(parsedCard) {
        if (!parsedCard.isValid || !parsedCard.cardName) return true;
        return !this.appData.drawnCards?.has(parsedCard.cardName);
    }
    
    sendTarotMessages(selectedPhrases, source) {
        // 新增：为第一条塔罗消息选择群成员
        let firstGroupMember = null;
        if (this.appData.groupSettings?.enabled && this.appData.groupSettings.members?.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.appData.groupSettings.members.length);
            const member = this.appData.groupSettings.members[randomIndex];
            firstGroupMember = {
                name: member.name,
                avatar: member.avatar || null
            };
        }
        
        const firstMessage = {
            id: this.dataManager.generateMessageId(),
            text: selectedPhrases[0],
            sender: 'other',
            time: this.getCurrentTime(),
            read: true,
            isTarot: true,
            groupMember: firstGroupMember  // 新增固定成员
        };
        
        if (Math.random() < 0.25) {
            const recentUserMessages = this.appData.messages
                .filter(msg => msg.sender === 'self')
                .slice(-3);
            
            if (recentUserMessages.length > 0) {
                const randomUserMessage = recentUserMessages[Math.floor(Math.random() * recentUserMessages.length)];
                firstMessage.quotedMessage = {
                    id: randomUserMessage.id,
                    text: randomUserMessage.text || '',
                    isSticker: randomUserMessage.isSticker || false,
                    stickerData: randomUserMessage.stickerData || null,
                    sender: randomUserMessage.sender,
                    time: randomUserMessage.time
                };
            }
        }
        
        this.appData.messages.push(firstMessage);
        this.renderMessages();
        
        if (selectedPhrases.length > 1) {
            for (let i = 1; i < selectedPhrases.length; i++) {
                // 每条后续消息随机选择群成员
                let nextGroupMember = null;
                if (this.appData.groupSettings?.enabled && this.appData.groupSettings.members?.length > 0) {
                    const randomIdx = Math.floor(Math.random() * this.appData.groupSettings.members.length);
                    const mem = this.appData.groupSettings.members[randomIdx];
                    nextGroupMember = { name: mem.name, avatar: mem.avatar || null };
                }
                
                setTimeout(() => {
                    const additionalMessage = {
                        id: this.dataManager.generateMessageId(),
                        text: selectedPhrases[i],
                        sender: 'other',
                        time: this.getCurrentTime(),
                        read: true,
                        isTarot: true,
                        groupMember: nextGroupMember
                    };
                    
                    this.appData.messages.push(additionalMessage);
                    this.renderMessages();
                }, (i * 1000) + Math.random() * 500);
            }
        }
        
        const notificationText = source === 'auto' ? 
            `对方主动抽取了${selectedPhrases.length}张塔罗牌 🔮` : 
            `对方回复了${selectedPhrases.length}张塔罗牌 🔮`;
        
        this.showNotification(notificationText);
        this.saveAllData();
    }
    
    autoSendMessage() {
        this.appData.isTyping = true;
        this.renderMessages();
        
        const minDelay = (this.appData.sendSettings?.minReplyDelay || 1.5) * 1000;
        const maxDelay = (this.appData.sendSettings?.maxReplyDelay || 3.5) * 1000;
        const delay = minDelay + Math.random() * (maxDelay - minDelay);
        
        setTimeout(() => {
            this.appData.isTyping = false;
            
            if (this.appData.tarotSettings?.enabled && this.appData.tarotSettings.customPhrases?.length > 0) {
                this.generateTarotReply('auto');
            } else {
                const messageCount = Math.floor(Math.random() * 3) + 1;
                const totalRatio = (this.appData.sendSettings?.stickerRatio || 50) + (this.appData.sendSettings?.phraseRatio || 50);
                const stickerProbability = (this.appData.sendSettings?.stickerRatio || 50) / totalRatio;
                
                const messagesToSend = [];
                
                for (let i = 0; i < messageCount; i++) {
                    const isSticker = Math.random() < stickerProbability && this.appData.stickers?.length > 0;
                    
                    if (isSticker) {
                        const randomSticker = this.appData.stickers[Math.floor(Math.random() * this.appData.stickers.length)];
                        messagesToSend.push({ type: 'sticker', data: randomSticker.data });
                    } else {
                        const randomPhrase = this.appData.responsePhrases[Math.floor(Math.random() * this.appData.responsePhrases.length)];
                        messagesToSend.push({ type: 'text', data: randomPhrase });
                    }
                }
                
                // 为第一条消息选择群成员
                let firstGroupMember = null;
                if (this.appData.groupSettings?.enabled && this.appData.groupSettings.members?.length > 0) {
                    const randomIndex = Math.floor(Math.random() * this.appData.groupSettings.members.length);
                    const member = this.appData.groupSettings.members[randomIndex];
                    firstGroupMember = {
                        name: member.name,
                        avatar: member.avatar || null
                    };
                }
                
                const firstMsg = messagesToSend[0];
                const firstMessage = {
                    id: this.dataManager.generateMessageId(),
                    isSticker: firstMsg.type === 'sticker',
                    [firstMsg.type === 'sticker' ? 'stickerData' : 'text']: firstMsg.data,
                    sender: 'other',
                    time: this.getCurrentTime(),
                    read: true,
                    groupMember: firstGroupMember
                };
                
                if (Math.random() < 0.2) {
                    const recentUserMessages = this.appData.messages
                        .filter(msg => msg.sender === 'self')
                        .slice(-3);
                    
                    if (recentUserMessages.length > 0) {
                        const randomUserMessage = recentUserMessages[Math.floor(Math.random() * recentUserMessages.length)];
                        firstMessage.quotedMessage = {
                            id: randomUserMessage.id,
                            text: randomUserMessage.text || '',
                            isSticker: randomUserMessage.isSticker || false,
                            stickerData: randomUserMessage.stickerData || null,
                            sender: randomUserMessage.sender,
                            time: randomUserMessage.time
                        };
                    }
                }
                
                this.appData.messages.push(firstMessage);
                this.renderMessages();
                
                if (messagesToSend.length > 1) {
                    for (let i = 1; i < messagesToSend.length; i++) {
                        // 后续消息随机选择成员
                        let nextGroupMember = null;
                        if (this.appData.groupSettings?.enabled && this.appData.groupSettings.members?.length > 0) {
                            const randomIdx = Math.floor(Math.random() * this.appData.groupSettings.members.length);
                            const mem = this.appData.groupSettings.members[randomIdx];
                            nextGroupMember = { name: mem.name, avatar: mem.avatar || null };
                        }
                        
                        setTimeout(() => {
                            const msg = messagesToSend[i];
                            const additionalMessage = {
                                id: this.dataManager.generateMessageId(),
                                isSticker: msg.type === 'sticker',
                                [msg.type === 'sticker' ? 'stickerData' : 'text']: msg.data,
                                sender: 'other',
                                time: this.getCurrentTime(),
                                read: true,
                                groupMember: nextGroupMember
                            };
                            
                            this.appData.messages.push(additionalMessage);
                            this.renderMessages();
                        }, (i * 800) + Math.random() * 500);
                    }
                }
                
                this.showNotification('对方主动发送了消息');
                this.saveAllData();
            }
        }, delay);
    }
    
    quoteMessage(message) {
        if (!message) return;
        
        this.appData.quotedMessage = {
            id: message.id,
            text: message.text || '',
            isSticker: message.isSticker || false,
            stickerData: message.stickerData || null,
            sender: message.sender,
            time: message.time
        };
        
        let quoteText = '';
        if (message.isSticker) {
            quoteText = '[表情包]';
        } else if (message.text) {
            quoteText = message.text.length > 30 ? message.text.substring(0, 30) + '...' : message.text;
        }
        
        const input = document.getElementById('messageInput');
        if (input) {
            input.placeholder = `回复 "${quoteText}"...`;
            input.focus();
        }
        
        this.showNotification('已引用消息，输入回复内容后发送');
    }
    
    deleteMessage(messageId) {
        if (!messageId) return;
        
        const initialLength = this.appData.messages.length;
        this.appData.messages = this.appData.messages.filter(msg => msg.id !== messageId);
        
        if (this.appData.readNoReplyMessageIds) {
            const index = this.appData.readNoReplyMessageIds.indexOf(messageId);
            if (index > -1) this.appData.readNoReplyMessageIds.splice(index, 1);
        }
        
        if (this.appData.messages.length < initialLength) {
            this.renderMessages();
            this.saveAllData();
            this.showNotification('消息已删除');
        }
    }
    
    recallMessage(messageId) {
        if (!messageId) return;
        
        const messageIndex = this.appData.messages.findIndex(msg => msg.id === messageId);
        if (messageIndex === -1) return;
        
        const message = this.appData.messages[messageIndex];
        
        if (message.sender !== 'self') {
            this.showNotification('只能撤回自己发送的消息');
            return;
        }
        
        this.appData.messages[messageIndex].recalled = true;
        this.appData.messages[messageIndex].text = '[已撤回]';
        this.appData.messages[messageIndex].isSticker = false;
        this.appData.messages[messageIndex].stickerData = null;
        
        this.renderMessages();
        this.saveAllData();
        this.showNotification('消息已撤回');
    }
    
    // ========================
    // 设置操作
    // ========================
    
    selectTarotNumber(number) {
        if (!this.appData.tarotSettings) this.appData.tarotSettings = { enabled: false, drawCount: 1, customPhrases: [] };
        this.appData.tarotSettings.drawCount = number;
        
        const tarotCountValue = document.getElementById('tarotCountValue');
        if (tarotCountValue) tarotCountValue.textContent = number;
        
        document.querySelectorAll('.tarot-number').forEach(el => {
            el.classList.remove('active');
            if (parseInt(el.dataset.number) === number) {
                el.classList.add('active');
            }
        });
        
        this.saveAllData();
        this.showNotification(`塔罗牌抽取数量设置为: ${number}`);
    }
    
    saveTarotSettings() {
        const textarea = document.getElementById('tarotTextarea');
        if (!textarea) return;
        
        const text = textarea.value.trim();
        const phrases = text.split('\n')
            .map(p => p.trim())
            .filter(p => p.length > 0);
        
        if (!this.appData.tarotSettings) {
            this.appData.tarotSettings = { enabled: false, drawCount: 1, customPhrases: [] };
        }
        
        this.appData.tarotSettings.customPhrases = phrases;
        this.appData.drawnCards = new Set();
        
        this.updateTarotPhraseCount();
        this.updateTarotStatus();
        
        this.showNotification(`已保存 ${phrases.length} 张塔罗牌字卡`);
        this.saveAllData();
    }
    
    loadDefaultTarotCards() {
        if (!this.appData.tarotSettings) {
            this.appData.tarotSettings = { enabled: false, drawCount: 1, customPhrases: [] };
        }
        
        this.appData.tarotSettings.customPhrases = [...this.DEFAULT_TAROT_CARDS];
        
        const textarea = document.getElementById('tarotTextarea');
        if (textarea) textarea.value = this.DEFAULT_TAROT_CARDS.join('\n');
        
        this.updateTarotPhraseCount();
        this.updateTarotStatus();
        this.showNotification('已加载78张默认塔罗牌');
        
        this.appData.drawnCards = new Set();
        this.saveAllData();
    }
    
    clearTarotCards() {
        if (confirm('确定要清空所有塔罗牌字卡吗？')) {
            if (!this.appData.tarotSettings) {
                this.appData.tarotSettings = { enabled: false, drawCount: 1, customPhrases: [] };
            }
            
            this.appData.tarotSettings.customPhrases = [];
            
            const textarea = document.getElementById('tarotTextarea');
            if (textarea) textarea.value = '';
            
            this.updateTarotPhraseCount();
            this.updateTarotStatus();
            this.showNotification('已清空塔罗牌字卡');
            
            this.appData.drawnCards = new Set();
            this.saveAllData();
        }
    }
    
    savePhrases() {
        const textarea = document.getElementById('phrasesTextarea');
        if (!textarea) return;
        
        const text = textarea.value.trim();
        if (!text) {
            this.showNotification('请输入至少一个词条');
            return;
        }
        
        const phrases = text.split('\n')
            .map(p => p.trim())
            .filter(p => p.length > 0);
        
        if (phrases.length === 0) {
            this.showNotification('请输入有效的词条');
            return;
        }
        
        this.appData.responsePhrases = phrases;
        this.updatePhraseCount();
        this.saveAllData();
        this.showNotification(`已保存 ${phrases.length} 个词条`);
    }
    
    saveAppearanceSettings() {
        const appTitleInput = document.getElementById('appTitleInput');
        const appSubtitleInput = document.getElementById('appSubtitleInput');
        const loveYear = document.getElementById('loveYear');
        const loveMonth = document.getElementById('loveMonth');
        const loveDay = document.getElementById('loveDay');
        
        if (!this.appData.appearanceSettings) {
            this.appData.appearanceSettings = {
                appTitle: '齐司礼',
                appSubtitle: 'DR传讯',
                loveStartDate: new Date(2024, 0, 1)
            };
        }
        
        if (appTitleInput) this.appData.appearanceSettings.appTitle = appTitleInput.value || '齐司礼';
        if (appSubtitleInput) this.appData.appearanceSettings.appSubtitle = appSubtitleInput.value || 'DR传讯';
        
        if (loveYear && loveMonth && loveDay) {
            const year = parseInt(loveYear.value) || 2024;
            const month = parseInt(loveMonth.value) - 1 || 0;
            const day = parseInt(loveDay.value) || 1;
            this.appData.appearanceSettings.loveStartDate = new Date(year, month, day);
        }
        
        this.calculateLoveDays();
        this.renderAppearance();
        this.saveAllData();
        this.showNotification('外观设置已保存');
    }
    
    saveBackgroundSettings() {
        const slider = document.getElementById('backgroundOpacitySlider');
        if (slider && this.appData.backgroundSettings) {
            this.appData.backgroundSettings.opacity = parseInt(slider.value);
        }
        
        this.saveAllData();
        this.showNotification('背景设置已保存');
    }
    
    saveCommunicationSettings() {
        const autoAcceptCalls = document.getElementById('autoAcceptCalls');
        const autoAcceptVideos = document.getElementById('autoAcceptVideos');
        
        if (!this.appData.communicationSettings) {
            this.appData.communicationSettings = {
                autoAcceptCalls: true,
                autoAcceptVideos: true,
                todayCalls: 0,
                todayVideos: 0,
                totalCallTime: 0,
                totalVideoTime: 0,
                todayIncomingCalls: 0,
                activeCallSettings: {
                    enabled: true,
                    overallFrequency: 30,
                    callPreference: 50,
                    presetMode: 'custom',
                    minInterval: 15,
                    maxInterval: 45,
                    respectBusyStatus: true,
                    timeSensitivity: true,
                    adaptToActivity: true
                }
            };
        }
        
        if (autoAcceptCalls) this.appData.communicationSettings.autoAcceptCalls = autoAcceptCalls.checked;
        if (autoAcceptVideos) this.appData.communicationSettings.autoAcceptVideos = autoAcceptVideos.checked;
        
        this.saveAllData();
        this.showNotification('通话设置已保存');
    }
    
    /**
     * 保存群聊设置
     */
    saveGroupSettings() {
        const groupModeToggle = document.getElementById('groupModeToggle');
        const showAvatar = document.getElementById('groupShowAvatar');
        const showName = document.getElementById('groupShowName');
        
        if (!this.appData.groupSettings) {
            this.appData.groupSettings = { enabled: false, showAvatar: true, showName: true, members: [] };
        }
        
        if (groupModeToggle) this.appData.groupSettings.enabled = groupModeToggle.checked;
        if (showAvatar) this.appData.groupSettings.showAvatar = showAvatar.checked;
        if (showName) this.appData.groupSettings.showName = showName.checked;
        
        // 如果开启群聊模式，为现有对方消息补充 groupMember（如果缺失）
        if (this.appData.groupSettings.enabled) {
            this.migrateMessagesForGroup();
        }
        
        this.saveAllData();
        this.renderMessages(); // 刷新消息显示
        this.showNotification('群聊设置已保存');
    }
    
    // ========================
    // UI操作
    // ========================
    
    openSettings() {
        const panel = document.getElementById('settingsPanel');
        const overlay = document.getElementById('settingsOverlay');
        
        if (panel) panel.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeSettingsPanel() {
        const panel = document.getElementById('settingsPanel');
        const overlay = document.getElementById('settingsOverlay');
        
        if (panel) panel.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    switchTab(tabId) {
        if (!document.getElementById('settingsPanel')?.classList.contains('active')) {
            this.openSettings();
        }
        
        // 高亮左侧标签
        const tabButtons = document.querySelectorAll('.settings-tabs-vertical .tab-button');
        tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });
        
        // 滚动到对应模块
        const targetSection = document.getElementById(`section-${tabId}`);
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // ========================
    // 通话功能 - 修正时间格式
    // ========================
    
    createCallWindow(type) {
        const existing = document.querySelector('.call-window');
        if (existing) existing.remove();
        
        const callWindow = document.createElement('div');
        callWindow.className = 'call-window';
        callWindow.style.left = '50px';
        callWindow.style.top = '50px';
        
        const avatarContent = this.appData.otherInfo?.avatar ? 
            `<img src="${this.appData.otherInfo.avatar}" alt="${this.appData.otherInfo.nickname}">` : 
            `<span></span>`;
        
        callWindow.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <i class="material-icons">call</i>
                    <span>语音通话</span>
                </div>
                <div class="window-controls">
                    <button class="window-btn" id="minimizeCall">−</button>
                    <button class="window-btn" id="closeCall">×</button>
                </div>
            </div>
            <div class="window-content">
                <div class="call-avatar">
                    ${avatarContent}
                </div>
                <div class="calling-text">${type === 'outgoing' ? '等待对方接听...' : '对方来电...'}</div>
                ${type === 'incoming' ? `
                    <div class="call-buttons">
                        <button class="accept-btn" id="acceptCall">
                            <i class="material-icons">call</i>
                            接听
                        </button>
                        <button class="reject-btn" id="rejectCall">
                            <i class="material-icons">call_end</i>
                            拒绝
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        
        document.body.appendChild(callWindow);
        this.appData.activeCall = callWindow;
        
        this.makeWindowDraggable(callWindow);
        
        if (type === 'incoming') {
            callWindow.querySelector('#acceptCall')?.addEventListener('click', () => this.answerCall());
            callWindow.querySelector('#rejectCall')?.addEventListener('click', () => this.rejectCall());
        }
        
        callWindow.querySelector('#closeCall')?.addEventListener('click', () => this.endCall());
        callWindow.querySelector('#minimizeCall')?.addEventListener('click', () => {
            callWindow.style.display = callWindow.style.display === 'none' ? 'flex' : 'none';
        });
        
        if (type === 'incoming' && this.appData.communicationSettings?.autoAcceptCalls) {
            setTimeout(() => {
                if (this.appData.activeCall === callWindow) this.answerCall();
            }, 2000);
        }
    }
    
    createVideoWindow(type) {
        const existing = document.querySelector('.video-window');
        if (existing) existing.remove();
        
        const videoWindow = document.createElement('div');
        videoWindow.className = 'video-window';
        videoWindow.style.left = '100px';
        videoWindow.style.top = '100px';
        
        const avatarContent = this.appData.otherInfo?.avatar ? 
            `<img src="${this.appData.otherInfo.avatar}" alt="${this.appData.otherInfo.nickname}">` : 
            `<span></span>`;
        
        videoWindow.innerHTML = `
            <div class="window-header">
                <div class="window-title">
                    <i class="material-icons">videocam</i>
                    <span>视频通话</span>
                </div>
                <div class="window-controls">
                    <button class="window-btn" id="minimizeVideo">−</button>
                    <button class="window-btn" id="closeVideo">×</button>
                </div>
            </div>
            <div class="window-content">
                <div class="video-avatar">
                    ${avatarContent}
                </div>
                <div class="calling-text">${type === 'outgoing' ? '等待对方接听...' : '对方视频邀请...'}</div>
                ${type === 'incoming' ? `
                    <div class="call-buttons">
                        <button class="accept-btn" id="acceptVideo">
                            <i class="material-icons">videocam</i>
                            接听
                        </button>
                        <button class="reject-btn" id="rejectVideo">
                            <i class="material-icons">call_end</i>
                            拒绝
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
        
        document.body.appendChild(videoWindow);
        this.appData.activeVideo = videoWindow;
        
        this.makeWindowDraggable(videoWindow);
        
        if (type === 'incoming') {
            videoWindow.querySelector('#acceptVideo')?.addEventListener('click', () => this.answerVideo());
            videoWindow.querySelector('#rejectVideo')?.addEventListener('click', () => this.rejectVideo());
        }
        
        videoWindow.querySelector('#closeVideo')?.addEventListener('click', () => this.endVideo());
        videoWindow.querySelector('#minimizeVideo')?.addEventListener('click', () => {
    this.toggleVideoMinimizeMode(videoWindow);
});
        
        if (type === 'incoming' && this.appData.communicationSettings?.autoAcceptVideos) {
            setTimeout(() => {
                if (this.appData.activeVideo === videoWindow) this.answerVideo();
            }, 2000);
        }
    }
    
    makeWindowDraggable(windowElement) {
        let isDragging = false;
        let offsetX, offsetY;
        
        const header = windowElement.querySelector('.window-header');
        
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-btn')) return;
            
            isDragging = true;
            const rect = windowElement.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            windowElement.classList.add('active');
            windowElement.style.transition = 'none';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const maxX = window.innerWidth - windowElement.offsetWidth;
            const maxY = window.innerHeight - windowElement.offsetHeight;
            
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            
            x = Math.max(0, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));
            
            windowElement.style.left = `${x}px`;
            windowElement.style.top = `${y}px`;
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            windowElement.classList.remove('active');
            windowElement.style.transition = '';
        });
        
        header.addEventListener('touchstart', (e) => {
            if (e.target.closest('.window-btn')) return;
            
            e.preventDefault();
            const touch = e.touches[0];
            isDragging = true;
            const rect = windowElement.getBoundingClientRect();
            offsetX = touch.clientX - rect.left;
            offsetY = touch.clientY - rect.top;
            windowElement.classList.add('active');
            windowElement.style.transition = 'none';
        }, { passive: false });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const touch = e.touches[0];
            
            const maxX = window.innerWidth - windowElement.offsetWidth;
            const maxY = window.innerHeight - windowElement.offsetHeight;
            
            let x = touch.clientX - offsetX;
            let y = touch.clientY - offsetY;
            
            x = Math.max(0, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));
            
            windowElement.style.left = `${x}px`;
            windowElement.style.top = `${y}px`;
        }, { passive: false });
        
        document.addEventListener('touchend', () => {
            isDragging = false;
            windowElement.classList.remove('active');
            windowElement.style.transition = '';
        });
        
        document.addEventListener('touchcancel', () => {
            isDragging = false;
            windowElement.classList.remove('active');
            windowElement.style.transition = '';
        });
    }
    
    answerCall() {
        if (!this.appData.activeCall) return;
        
        const content = this.appData.activeCall.querySelector('.window-content');
        if (!content) return;
        
        content.innerHTML = `
            <div class="call-avatar">
                ${this.appData.otherInfo?.avatar ? 
                  `<img src="${this.appData.otherInfo.avatar}" alt="${this.appData.otherInfo.nickname}">` : 
                  `<span></span>`}
            </div>
            <div class="in-call-text">正在通话中...</div>
            <div class="call-timer" id="callTimer">00:00:00</div>
            <div class="call-buttons">
                <button class="end-btn" id="endCall">
                    <i class="material-icons">call_end</i>
                    挂断
                </button>
            </div>
        `;
        
        content.querySelector('#endCall')?.addEventListener('click', () => this.endCall());
        
        this.appData.callStartTime = new Date();
        this.startCallTimer('callTimer');
    }
    
    /**
 * 切换视频通话窗口的迷你模式
 */
toggleVideoMinimizeMode(videoWindow) {
    const isMinimized = videoWindow.classList.contains('minimized');
    
    if (isMinimized) {
        // 恢复原始大小
        videoWindow.classList.remove('minimized');
        videoWindow.style.width = '';
        videoWindow.style.height = '';
        videoWindow.style.borderRadius = '12px';
        
        // 恢复原始内容
        const content = videoWindow.querySelector('.window-content');
        if (content) {
            // 保存通话状态
            const isInCall = videoWindow.classList.contains('in-call');
            if (isInCall) {
                this.restoreVideoCallContent(videoWindow);
            } else {
                this.restoreVideoWaitingContent(videoWindow);
            }
        }
    } else {
        // 进入迷你模式
        videoWindow.classList.add('minimized');
        videoWindow.style.width = '180px';
        videoWindow.style.height = '60px';
        videoWindow.style.borderRadius = '30px';
        
        // 保存当前内容并替换为迷你模式内容
        const content = videoWindow.querySelector('.window-content');
        const isInCall = videoWindow.classList.contains('in-call');
        const callTimerText = videoWindow.querySelector('#videoTimer')?.textContent;
        
        // 获取对方头像
        const avatarSrc = this.appData.otherInfo?.avatar || null;
        
        content.innerHTML = `
            <div class="mini-mode-container">
                <div class="mini-avatar">
                    ${avatarSrc ? `<img src="${avatarSrc}" alt="对方头像">` : '<span></span>'}
                </div>
                <div class="mini-info">
                    <div class="mini-status ${isInCall ? 'calling' : 'waiting'}">
                        ${isInCall ? '通话中...' : '等待接听...'}
                    </div>
                    ${isInCall ? `<div class="mini-timer" id="miniVideoTimer">${callTimerText || '00:00:00'}</div>` : ''}
                </div>
                <div class="mini-controls">
                    <button class="mini-expand-btn" id="expandVideoBtn" title="展开">
                        <i class="material-icons">open_in_full</i>
                    </button>
                </div>
            </div>
        `;
        
        // 绑定展开按钮事件
        const expandBtn = content.querySelector('#expandVideoBtn');
        if (expandBtn) {
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleVideoMinimizeMode(videoWindow);
            });
        }
        
        // 如果正在通话中，重新启动迷你模式的计时器更新
        if (isInCall && this.appData.callStartTime) {
            this.startMiniVideoTimer(videoWindow);
        }
    }
}

/**
 * 恢复视频通话等待接听状态的内容
 */
restoreVideoWaitingContent(videoWindow) {
    const content = videoWindow.querySelector('.window-content');
    const avatarSrc = this.appData.otherInfo?.avatar || null;
    
    content.innerHTML = `
        <div class="video-avatar">
            ${avatarSrc ? `<img src="${avatarSrc}" alt="对方头像">` : '<span></span>'}
        </div>
        <div class="calling-text">等待对方接听...</div>
        <div class="call-buttons">
            <button class="end-btn" id="endVideo">
                <i class="material-icons">call_end</i>
                挂断
            </button>
        </div>
    `;
    
    content.querySelector('#endVideo')?.addEventListener('click', () => this.endVideo());
}

/**
 * 恢复视频通话中的内容
 */
restoreVideoCallContent(videoWindow) {
    const content = videoWindow.querySelector('.window-content');
    const avatarSrc = this.appData.otherInfo?.avatar || null;
    const currentTimer = videoWindow.querySelector('#miniVideoTimer')?.textContent || '00:00:00';
    
    content.innerHTML = `
        <div class="video-avatar">
            ${avatarSrc ? `<img src="${avatarSrc}" alt="对方头像">` : '<span></span>'}
        </div>
        <div class="in-call-text">正在视频通话中...</div>
        <div class="call-timer" id="videoTimer">${currentTimer}</div>
        <div class="call-buttons">
            <button class="end-btn" id="endVideo">
                <i class="material-icons">call_end</i>
                挂断
            </button>
        </div>
    `;
    
    content.querySelector('#endVideo')?.addEventListener('click', () => this.endVideo());
    
    // 重新启动计时器更新
    if (this.appData.callStartTime) {
        this.startCallTimer('videoTimer');
    }
}

/**
 * 启动迷你模式的计时器更新
 */
startMiniVideoTimer(videoWindow) {
    if (this.appData.miniTimer) {
        clearInterval(this.appData.miniTimer);
    }
    
    let seconds = Math.floor((new Date() - this.appData.callStartTime) / 1000);
    
    this.appData.miniTimer = setInterval(() => {
        if (!videoWindow.parentNode || !videoWindow.classList.contains('minimized')) {
            clearInterval(this.appData.miniTimer);
            return;
        }
        
        seconds++;
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        const timerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        const miniTimer = videoWindow.querySelector('#miniVideoTimer');
        if (miniTimer) {
            miniTimer.textContent = timerText;
        }
    }, 1000);
}

        
    
    rejectCall() {
        if (!this.appData.activeCall) return;
        
        const callMessage = {
            id: this.dataManager.generateMessageId(),
            type: 'call',
            title: '已拒绝语音通话',
            sender: 'other',
            time: this.getCurrentTime(),
            read: true
        };
        
        this.appData.messages.push(callMessage);
        this.renderMessages();
        
        this.appData.activeCall.remove();
        this.appData.activeCall = null;
        this.showNotification('已拒绝通话');
        this.saveAllData();
    }
    
    rejectVideo() {
        if (!this.appData.activeVideo) return;
        
        const videoMessage = {
            id: this.dataManager.generateMessageId(),
            type: 'video',
            title: '已拒绝视频通话',
            sender: 'other',
            time: this.getCurrentTime(),
            read: true
        };
        
        this.appData.messages.push(videoMessage);
        this.renderMessages();
        
        this.appData.activeVideo.remove();
        this.appData.activeVideo = null;
        this.showNotification('已拒绝视频通话');
        this.saveAllData();
    }
    
    endCall() {
        if (!this.appData.activeCall) return;
        
        const endTime = new Date();
        const durationMs = endTime - this.appData.callStartTime;
        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
        const durationText = hours > 0 ? `${hours}小时${minutes}分${seconds}秒` : (minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`);
        
        if (this.appData.communicationSettings) {
            const totalMinutes = hours * 60 + minutes + (seconds > 0 ? 1 : 0);
            this.appData.communicationSettings.totalCallTime = (this.appData.communicationSettings.totalCallTime || 0) + totalMinutes;
        }
        
        const callMessage = {
            id: this.dataManager.generateMessageId(),
            type: 'call',
            title: '语音通话',
            duration: durationText,
            sender: 'self',
            time: this.getCurrentTime(),
            read: true
        };
        
        this.appData.messages.push(callMessage);
        this.renderMessages();
        
        this.appData.activeCall.remove();
        this.appData.activeCall = null;
        
        clearInterval(this.appData.callTimer);
        
        this.showNotification(`通话结束，时长: ${durationText}`);
        this.renderCommunicationStats();
        this.saveAllData();
    }
    
    endVideo() {
    if (!this.appData.activeVideo) return;
    
    // 清理迷你模式定时器
    if (this.appData.miniTimer) {
        clearInterval(this.appData.miniTimer);
        this.appData.miniTimer = null;
    }
    
    const endTime = new Date();
    const durationMs = endTime - this.appData.callStartTime;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    const durationText = hours > 0 ? `${hours}小时${minutes}分${seconds}秒` : (minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`);
    
    if (this.appData.communicationSettings) {
        const totalMinutes = hours * 60 + minutes + (seconds > 0 ? 1 : 0);
        this.appData.communicationSettings.totalVideoTime = (this.appData.communicationSettings.totalVideoTime || 0) + totalMinutes;
    }
    
    const videoMessage = {
        id: this.dataManager.generateMessageId(),
        type: 'video',
        title: '视频通话',
        duration: durationText,
        sender: 'self',
        time: this.getCurrentTime(),
        read: true
    };
    
    this.appData.messages.push(videoMessage);
    this.renderMessages();
    
    this.appData.activeVideo.remove();
    this.appData.activeVideo = null;
    
    clearInterval(this.appData.callTimer);
    
    this.showNotification(`视频通话结束，时长: ${durationText}`);
    this.renderCommunicationStats();
    this.saveAllData();
}
    
    startCall() {
        if (this.appData.activeCall) {
            this.showNotification('当前已有通话进行中');
            return;
        }
        
        this.createCallWindow('outgoing');
        
        if (this.appData.communicationSettings) {
            this.appData.communicationSettings.todayCalls = (this.appData.communicationSettings.todayCalls || 0) + 1;
            this.renderCommunicationStats();
            this.saveAllData();
        }
        
        setTimeout(() => {
            if (this.appData.activeCall) this.answerCall();
        }, 5000 + Math.random() * 5000);
    }
    
    startVideo() {
        if (this.appData.activeVideo) {
            this.showNotification('当前已有视频通话进行中');
            return;
        }
        
        this.createVideoWindow('outgoing');
        
        if (this.appData.communicationSettings) {
            this.appData.communicationSettings.todayVideos = (this.appData.communicationSettings.todayVideos || 0) + 1;
            this.renderCommunicationStats();
            this.saveAllData();
        }
        
        setTimeout(() => {
            if (this.appData.activeVideo) this.answerVideo();
        }, 5000 + Math.random() * 5000);
    }
    
    startCallTimer(timerId) {
        clearInterval(this.appData.callTimer);
        
        let seconds = 0;
        this.appData.callTimer = setInterval(() => {
            seconds++;
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            const timerText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            
            const timer = document.getElementById(timerId);
            if (timer) timer.textContent = timerText;
        }, 1000);
    }
    
    // ========================
    // 图片处理
    // ========================
    
    handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        this.compressImage(file, { maxWidth: 300, maxHeight: 300, quality: 0.7 })
            .then(compressedDataUrl => {
                const imageMessage = {
                    id: this.dataManager.generateMessageId(),
                    isSticker: true,
                    stickerData: compressedDataUrl,
                    sender: 'self',
                    time: this.getCurrentTime(),
                    read: false,
                    quotedMessage: this.appData.quotedMessage ? {...this.appData.quotedMessage} : null
                };
                
                this.appData.messages.push(imageMessage);
                this.renderMessages();
                
                this.appData.quotedMessage = null;
                const input = document.getElementById('messageInput');
                if (input) input.placeholder = '输入消息...';
                
                this.saveAllData();
                
                const willReply = Math.random() > 0.3;
                if (willReply) {
                    this.appData.waitingForReply = true;
                    this.startTypingIndicator();
                    
                    const minDelay = (this.appData.sendSettings?.minReplyDelay || 1.5) * 1000;
                    const maxDelay = (this.appData.sendSettings?.maxReplyDelay || 3.5) * 1000;
                    const delay = minDelay + Math.random() * (maxDelay - minDelay);
                    
                    setTimeout(() => {
                        if (this.appData.tarotSettings?.enabled && this.appData.tarotSettings.customPhrases?.length > 0) {
                            this.generateTarotReply('reply');
                        } else {
                            this.generateReply(imageMessage.id);
                        }
                    }, delay);
                } else {
                    this.appData.waitingForReply = false;
                    
                    setTimeout(() => {
                        this.markSelfMessagesAsRead();
                        
                        if (imageMessage.id) {
                            if (!this.appData.readNoReplyMessageIds) this.appData.readNoReplyMessageIds = [];
                            this.appData.readNoReplyMessageIds.push(imageMessage.id);
                        }
                        
                        this.renderMessages();
                        this.showNotification('对方已读不回');
                        this.saveAllData();
                    }, 1000 + Math.random() * 3000);
                }
            });
        
        e.target.value = '';
    }
    
    handleStickerUpload(e) {
        const files = e.target.files;
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            this.compressImage(file, { maxWidth: 200, maxHeight: 200, quality: 0.6 })
                .then(compressedDataUrl => {
                    const stickerData = {
                        id: Date.now() + i,
                        data: compressedDataUrl,
                        name: file.name
                    };
                    
                    if (!this.appData.stickers) this.appData.stickers = [];
                    this.appData.stickers.push(stickerData);
                    
                    this.renderStickerPreview();
                    this.saveAllData();
                    this.showNotification(`已添加表情包: ${file.name}`);
                });
        }
        
        e.target.value = '';
    }
    
    handleBackgroundUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // 直接读取原图，不压缩
        const reader = new FileReader();
        reader.onload = (e) => {
            if (!this.appData.backgroundSettings) {
                this.appData.backgroundSettings = { backgroundImage: null, opacity: 100 };
            }
            
            this.appData.backgroundSettings.backgroundImage = e.target.result;
            
            this.updateBackgroundPreview();
            this.applyBackgroundSettings();
            this.saveAllData();
            this.showNotification('背景图片已上传');
        };
        reader.readAsDataURL(file);
        
        e.target.value = '';
    }
    
    compressImage(file, options) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    if (width > height) {
                        if (width > options.maxWidth) {
                            height = Math.round(height * options.maxWidth / width);
                            width = options.maxWidth;
                        }
                    } else {
                        if (height > options.maxHeight) {
                            width = Math.round(width * options.maxHeight / height);
                            height = options.maxHeight;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', options.quality);
                    resolve(compressedDataUrl);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }
    
    removeBackground() {
        if (this.appData.backgroundSettings) {
            this.appData.backgroundSettings.backgroundImage = null;
            this.appData.backgroundSettings.opacity = 100;
        }
        
        const slider = document.getElementById('backgroundOpacitySlider');
        const value = document.getElementById('backgroundOpacityValue');
        
        if (slider) slider.value = 100;
        if (value) value.textContent = '100%';
        
        this.updateBackgroundPreview();
        this.applyBackgroundSettings();
        this.saveAllData();
        this.showNotification('已恢复默认背景');
    }
    
    // ========================
    // 用户信息编辑
    // ========================
    
    openUserEditModal(userType) {
        this.appData.editingUserType = userType;
        const userInfo = userType === 'self' ? this.appData.selfInfo : this.appData.otherInfo;
        
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) {
            modalTitle.textContent = userType === 'self' ? '编辑我的信息' : '编辑对方信息';
        }
        
        const modalNicknameInput = document.getElementById('modalNicknameInput');
        if (modalNicknameInput) {
            modalNicknameInput.value = userInfo?.nickname || '';
        }
        
        const avatarPreview = document.getElementById('avatarPreview');
        if (avatarPreview) {
            avatarPreview.innerHTML = '';
            if (userInfo?.avatar) {
                avatarPreview.innerHTML = `<img src="${userInfo.avatar}" alt="${userInfo.nickname}">`;
            } else {
                avatarPreview.innerHTML = `<span></span>`;
            }
        }
        
        const modal = document.getElementById('userModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeUserEditModal() {
        const modal = document.getElementById('userModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
        this.appData.editingUserType = null;
    }
    
    saveUserInfo() {
        const userType = this.appData.editingUserType;
        if (!userType) return;
        
        const userInfo = userType === 'self' ? this.appData.selfInfo : this.appData.otherInfo;
        if (!userInfo) return;
        
        const modalNicknameInput = document.getElementById('modalNicknameInput');
        if (modalNicknameInput && modalNicknameInput.value.trim()) {
            userInfo.nickname = modalNicknameInput.value.trim();
        }
        
        this.renderUserInfo();
        this.renderMessages();
        this.saveAllData();
        
        this.showNotification(`${userType === 'self' ? '我的' : '对方'}信息已更新`);
        this.closeUserEditModal();
    }
    
    handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const userType = this.appData.editingUserType;
        if (!userType) return;
        
        const userInfo = userType === 'self' ? this.appData.selfInfo : this.appData.otherInfo;
        if (!userInfo) return;
        
        this.compressImage(file, { maxWidth: 200, maxHeight: 200, quality: 0.7 })
            .then(compressedDataUrl => {
                userInfo.avatar = compressedDataUrl;
                
                const avatarPreview = document.getElementById('avatarPreview');
                if (avatarPreview) {
                    avatarPreview.innerHTML = `<img src="${userInfo.avatar}" alt="${userInfo.nickname}">`;
                }
                
                this.showNotification('头像已更新');
                this.saveAllData();
            });
        
        e.target.value = '';
    }
    
    // ========================
    // 主动呼叫设置
    // ========================
    
    updateOverallFrequency() {
        const slider = document.getElementById('overallFrequencySlider');
        if (!slider) return;
        
        const value = parseInt(slider.value);
        
        if (!this.appData.communicationSettings) {
            this.appData.communicationSettings = { activeCallSettings: {} };
        }
        if (!this.appData.communicationSettings.activeCallSettings) {
            this.appData.communicationSettings.activeCallSettings = {};
        }
        
        this.appData.communicationSettings.activeCallSettings.overallFrequency = value;
        this.appData.communicationSettings.activeCallSettings.enabled = value > 0;
        this.appData.communicationSettings.activeCallSettings.presetMode = 'custom';
        
        this.updateOverallFrequencyDisplay();
        this.updatePresetButtons();
        this.updateActiveCallPreview();
        
        this.restartActiveCallScheduler();
        this.saveAllData();
    }
    
    updateCallPreference() {
        const slider = document.getElementById('callPreferenceSlider');
        if (!slider) return;
        
        const value = parseInt(slider.value);
        
        if (!this.appData.communicationSettings) {
            this.appData.communicationSettings = { activeCallSettings: {} };
        }
        if (!this.appData.communicationSettings.activeCallSettings) {
            this.appData.communicationSettings.activeCallSettings = {};
        }
        
        this.appData.communicationSettings.activeCallSettings.callPreference = value;
        this.appData.communicationSettings.activeCallSettings.presetMode = 'custom';
        
        this.updateCallPreferenceDisplay();
        this.updatePresetButtons();
        this.updateActiveCallPreview();
        
        this.saveAllData();
    }
    
    applyPresetMode(preset) {
        if (!this.PRESET_MODES[preset]) return;
        
        const presetConfig = this.PRESET_MODES[preset];
        
        if (!this.appData.communicationSettings) {
            this.appData.communicationSettings = { activeCallSettings: {} };
        }
        if (!this.appData.communicationSettings.activeCallSettings) {
            this.appData.communicationSettings.activeCallSettings = {};
        }
        
        this.appData.communicationSettings.activeCallSettings.overallFrequency = presetConfig.overallFrequency || 30;
        this.appData.communicationSettings.activeCallSettings.callPreference = presetConfig.callPreference || 50;
        this.appData.communicationSettings.activeCallSettings.presetMode = preset;
        
        if (presetConfig.minInterval !== undefined) {
            this.appData.communicationSettings.activeCallSettings.minInterval = presetConfig.minInterval;
        }
        if (presetConfig.maxInterval !== undefined) {
            this.appData.communicationSettings.activeCallSettings.maxInterval = presetConfig.maxInterval;
        }
        
        const freqSlider = document.getElementById('overallFrequencySlider');
        const prefSlider = document.getElementById('callPreferenceSlider');
        
        if (freqSlider) freqSlider.value = this.appData.communicationSettings.activeCallSettings.overallFrequency;
        if (prefSlider) prefSlider.value = this.appData.communicationSettings.activeCallSettings.callPreference;
        
        this.updateOverallFrequencyDisplay();
        this.updateCallPreferenceDisplay();
        this.updatePresetButtons();
        this.updateActiveCallPreview();
        
        this.restartActiveCallScheduler();
        this.showNotification(`已切换到${presetConfig.name}`);
        this.saveAllData();
    }
    
    restartActiveCallScheduler() {
        if (this.appData.activeCallTimer) {
            clearInterval(this.appData.activeCallTimer);
        }
        this.startActiveCallScheduler();
    }
    
    // ========================
    // 云导入导出 (已移除，但方法保留以防被调用)
    // ========================
    // (这些方法保留但不再被监听)
    
    importCloudData() { /* 已移除 */ }
    clearCloudTextarea() { /* 已移除 */ }
    handleCloudFileUpload() { /* 已移除 */ }

    /**
     * 导出聊天记录（仅消息）
     */
    exportChatHistory(format = 'json') {
        const exportData = {
            messages: this.appData.messages,
            exportDate: new Date().toISOString()
        };
        const jsonStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat_history_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showNotification('聊天记录已导出');
    }

    /**
     * 导出全部数据（全部备份）
     */
    exportAllData() {
        // 只提取需要持久化的数据，避免混入运行时对象（如 Audio、DOM 元素等）
        const persistentData = {
            selfInfo: this.appData.selfInfo,
            otherInfo: this.appData.otherInfo,
            messages: this.appData.messages,
            responsePhrases: this.appData.responsePhrases,
            stickers: this.appData.stickers,
            sendSettings: this.appData.sendSettings,
            appearanceSettings: this.appData.appearanceSettings,
            backgroundSettings: this.appData.backgroundSettings,
            tarotSettings: this.appData.tarotSettings,
            communicationSettings: this.appData.communicationSettings,
            groupSettings: this.appData.groupSettings,
            musicSettings: this.appData.musicSettings,
            pokeSettings: this.appData.pokeSettings, // 新增拍一拍设置
            randomSettings: this.appData.randomSettings, // 新增随机变化设置
            drawnCards: Array.from(this.appData.drawnCards || []),
            loveDays: this.appData.loveDays,
            readNoReplyMessageIds: this.appData.readNoReplyMessageIds,
            todayDate: this.appData.todayDate
        };

        const backupData = {
            type: 'full-backup',
            exportDate: new Date().toISOString(),
            appData: persistentData
        };

        const jsonStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dream_lover_backup_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showNotification('全部备份已导出');
    }
    
    // ========================
    // 数据管理功能
    // ========================
    
    initDataManagement() {
        // 导出聊天记录 (在数据管理中我们仍保留这个功能，所以需要绑定)
        const exportChatBtn = document.getElementById('exportChatBtn');
        if (exportChatBtn) {
            exportChatBtn.addEventListener('click', () => this.exportChatHistory('json'));
        }
        
        // 导入聊天记录
        const importChatBtn = document.getElementById('importChatBtn');
        const dataImportInput = document.getElementById('dataImportInput');
        if (importChatBtn && dataImportInput) {
            importChatBtn.addEventListener('click', () => dataImportInput.click());
            dataImportInput.addEventListener('change', (e) => {
                if (e.target.files[0]) {
                    this.importChatHistory(e.target.files[0]);
                    e.target.value = '';
                }
            });
        }
        
        // 全部备份导出
        const exportAllBtn = document.getElementById('exportAllSettingsBtn');
        if (exportAllBtn) {
            exportAllBtn.addEventListener('click', () => this.exportAllData());
        }
        
        // 全部备份导入
        const importAllBtn = document.getElementById('importAllSettingsBtn');
        if (importAllBtn) {
            importAllBtn.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        try {
                            const backup = JSON.parse(ev.target.result);
                            if (backup.type !== 'full-backup' && !backup.appData) {
                                throw new Error('不是有效的全部备份文件');
                            }
                            if (!confirm('导入全部备份将覆盖所有当前数据，确定继续吗？')) return;
                            
                            // 处理导入逻辑
                            if (backup.appData) {
                                if (backup.appData.selfInfo) this.appData.selfInfo = backup.appData.selfInfo;
                                if (backup.appData.otherInfo) this.appData.otherInfo = backup.appData.otherInfo;
                                if (backup.appData.messages) this.appData.messages = backup.appData.messages;
                                if (backup.appData.responsePhrases) this.appData.responsePhrases = backup.appData.responsePhrases;
                                if (backup.appData.stickers) this.appData.stickers = backup.appData.stickers;
                                if (backup.appData.sendSettings) this.appData.sendSettings = backup.appData.sendSettings;
                                if (backup.appData.appearanceSettings) {
                                    this.appData.appearanceSettings = backup.appData.appearanceSettings;
                                    if (this.appData.appearanceSettings.loveStartDate) {
                                        this.appData.appearanceSettings.loveStartDate = new Date(this.appData.appearanceSettings.loveStartDate);
                                    }
                                }
                                if (backup.appData.backgroundSettings) this.appData.backgroundSettings = backup.appData.backgroundSettings;
                                if (backup.appData.tarotSettings) this.appData.tarotSettings = backup.appData.tarotSettings;
                                if (backup.appData.communicationSettings) this.appData.communicationSettings = backup.appData.communicationSettings;
                                if (backup.appData.groupSettings) this.appData.groupSettings = backup.appData.groupSettings;
                                if (backup.appData.musicSettings) this.appData.musicSettings = backup.appData.musicSettings;
                                if (backup.appData.pokeSettings) this.appData.pokeSettings = backup.appData.pokeSettings;
                                if (backup.appData.randomSettings) this.appData.randomSettings = backup.appData.randomSettings;
                                if (backup.appData.loveDays) this.appData.loveDays = backup.appData.loveDays;
                                if (backup.appData.readNoReplyMessageIds) this.appData.readNoReplyMessageIds = backup.appData.readNoReplyMessageIds;
                                if (backup.appData.drawnCards && Array.isArray(backup.appData.drawnCards)) {
                                    this.appData.drawnCards = new Set(backup.appData.drawnCards);
                                }
                            }
                            
                            this.renderAllUI();
                            this.saveAllData();
                            this.showNotification('全部备份恢复成功，即将刷新页面', 'success');
                            setTimeout(() => location.reload(), 1500);
                        } catch(e) {
                            this.showNotification('文件格式错误：' + e.message, 'error');
                        }
                    };
                    reader.readAsText(file);
                };
                document.body.appendChild(input);
                input.click();
                document.body.removeChild(input);
            });
        }
        
        // 清空当前会话
        const clearChatBtn = document.getElementById('clearChatBtn');
        if (clearChatBtn) {
            clearChatBtn.addEventListener('click', () => {
                if (confirm("确定要清空当前会话的所有聊天记录吗？此操作不可恢复")) {
                    this.appData.messages = [];
                    this.saveAllData();
                    this.renderMessages();
                    this.showNotification('聊天记录已清空', 'success');
                    this.closeSettingsPanel();
                }
            });
        }
        
        // 重置所有数据
        const resetAllBtn = document.getElementById('resetAllDataBtn');
        if (resetAllBtn) {
            resetAllBtn.addEventListener('click', () => {
                if (confirm("【高危操作】确定要重置所有会话和设置吗？此操作将清除所有本地数据且无法恢复！")) {
                    this.dataManager.clearAllData();
                    this.loadAllData();
                    this.renderAllUI();
                    this.showNotification('所有数据已重置，页面即将刷新', 'info');
                    setTimeout(() => location.reload(), 2000);
                }
            });
        }
    }
    
    importChatHistory(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (!importedData.messages || !Array.isArray(importedData.messages)) throw new Error('无效的聊天记录文件');
                if (this.appData.messages.length > 0 && !confirm('导入将覆盖当前会话的聊天记录，确定继续吗？')) return;

                this.appData.messages = importedData.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
                if (importedData.settings) Object.assign(this.appData, importedData.settings);
                
                this.saveAllData();
                this.renderMessages();
                this.showNotification(`成功导入 ${this.appData.messages.length} 条消息`, 'success');
                this.closeSettingsPanel();
            } catch (error) {
                console.error('导入失败:', error);
                this.showNotification('文件格式错误或已损坏', 'error');
            }
        };
        reader.onerror = () => this.showNotification('文件读取失败', 'error');
        reader.readAsText(file);
    }
    
    // ========================
    // 清除所有数据 (已实现)
    // ========================
    clearAllData() {
        if (confirm('确定要清除所有数据吗？这将删除所有聊天记录、设置和表情包，且不可恢复。')) {
            this.dataManager.clearAllData();
            this.loadAllData();
            this.renderAllUI();
            this.showNotification('所有数据已清除，已恢复默认设置');
            this.closeSettingsPanel();
        }
    }
    
    // ========================
    // 事件监听设置 (已移除云导入、导出记录、关于的相关监听器，新增用户信息编辑监听)
    // ========================
    
    setupEventListeners() {
        // 发送消息
        const sendBtn = document.getElementById('sendButton');
        if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());
        
        const input = document.getElementById('messageInput');
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        }
        
        // 继续按钮
        const continueBtn = document.getElementById('continueButton');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => this.requestContinueMessages());
        }
        
        // 图片上传
        const uploadBtn = document.getElementById('uploadImageButton');
        const imageUpload = document.getElementById('imageUpload');
        if (uploadBtn && imageUpload) {
            uploadBtn.addEventListener('click', () => imageUpload.click());
            imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        }
        
        // 设置面板
        const settingsToggle = document.getElementById('settingsToggle');
        if (settingsToggle) {
            settingsToggle.addEventListener('click', () => this.openSettings());
        }
        
        // 夜间模式切换
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.documentElement.classList.toggle('night-mode');
                const icon = themeToggle.querySelector('i');
                if (icon) icon.textContent = document.documentElement.classList.contains('night-mode') ? 'light_mode' : 'dark_mode';
                
                const isNightMode = document.documentElement.classList.contains('night-mode');
                localStorage.setItem('night_mode_enabled', isNightMode ? 'true' : 'false');
                
                if (isNightMode) {
                    document.body.style.backgroundColor = '#0a0a0a';
                    document.documentElement.style.backgroundColor = '#0a0a0a';
                    const bgContainer = document.getElementById('backgroundContainer');
                    if (bgContainer && bgContainer.style.backgroundImage) {
                        bgContainer.style.filter = 'brightness(0.15) contrast(1.2)';
                    }
                } else {
                    document.body.style.backgroundColor = '';
                    document.documentElement.style.backgroundColor = '';
                    const bgContainer = document.getElementById('backgroundContainer');
                    if (bgContainer) bgContainer.style.filter = '';
                }
            });
        }
        
        const overlay = document.getElementById('settingsOverlay');
        if (overlay) overlay.addEventListener('click', () => this.closeSettingsPanel());
        
        const closeSettings = document.getElementById('closeSettings');
        if (closeSettings) closeSettings.addEventListener('click', () => this.closeSettingsPanel());
        
        // 表情包
        const addStickerBtn = document.getElementById('addStickerBtn');
        const stickerUpload = document.getElementById('stickerUpload');
        if (addStickerBtn && stickerUpload) {
            addStickerBtn.addEventListener('click', () => stickerUpload.click());
            stickerUpload.addEventListener('change', (e) => this.handleStickerUpload(e));
        }
        
        // 词条保存
        const savePhrasesBtn = document.getElementById('savePhrasesBtn');
        if (savePhrasesBtn) savePhrasesBtn.addEventListener('click', () => this.savePhrases());
        
        // 塔罗牌
        const tarotModeToggle = document.getElementById('tarotModeToggle');
        if (tarotModeToggle) {
            tarotModeToggle.addEventListener('change', () => {
                if (!this.appData.tarotSettings) this.appData.tarotSettings = { enabled: false, drawCount: 1, customPhrases: [] };
                this.appData.tarotSettings.enabled = tarotModeToggle.checked;
                this.updateTarotStatus();
                this.saveAllData();
                this.showNotification(`塔罗牌模式 ${this.appData.tarotSettings.enabled ? '开启' : '关闭'}`);
            });
        }
        
        const saveTarotBtn = document.getElementById('saveTarotBtn');
        if (saveTarotBtn) saveTarotBtn.addEventListener('click', () => this.saveTarotSettings());
        
        const loadDefaultTarotBtn = document.getElementById('loadDefaultTarotBtn');
        if (loadDefaultTarotBtn) loadDefaultTarotBtn.addEventListener('click', () => this.loadDefaultTarotCards());
        
        const clearTarotBtn = document.getElementById('clearTarotBtn');
        if (clearTarotBtn) clearTarotBtn.addEventListener('click', () => this.clearTarotCards());
        
        // 背景
        const uploadBackgroundOption = document.getElementById('uploadBackgroundOption');
        const backgroundUpload = document.getElementById('backgroundUpload');
        if (uploadBackgroundOption && backgroundUpload) {
            uploadBackgroundOption.addEventListener('click', () => backgroundUpload.click());
            backgroundUpload.addEventListener('change', (e) => this.handleBackgroundUpload(e));
        }
        
        const removeBackgroundBtn = document.getElementById('removeBackgroundBtn');
        if (removeBackgroundBtn) removeBackgroundBtn.addEventListener('click', () => this.removeBackground());
        
        const bgOpacitySlider = document.getElementById('backgroundOpacitySlider');
        if (bgOpacitySlider) {
            bgOpacitySlider.addEventListener('input', (e) => {
                const value = e.target.value;
                const display = document.getElementById('backgroundOpacityValue');
                if (display) display.textContent = `${value}%`;
                if (this.appData.backgroundSettings) {
                    this.appData.backgroundSettings.opacity = parseInt(value);
                    this.applyBackgroundSettings();
                }
            });
        }
        
        const saveBackgroundBtn = document.getElementById('saveBackgroundBtn');
        if (saveBackgroundBtn) saveBackgroundBtn.addEventListener('click', () => this.saveBackgroundSettings());
        
        // 标签页切换
        const tabButtons = document.querySelectorAll('.settings-tabs-vertical .tab-button');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
        
        // 发送设置
        const stickerRatioSlider = document.getElementById('stickerRatioSlider');
        if (stickerRatioSlider) {
            stickerRatioSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                const display = document.getElementById('stickerRatioValue');
                if (display) display.textContent = `${value}%`;
                
                if (!this.appData.sendSettings) this.appData.sendSettings = { stickerRatio: 50, phraseRatio: 50, maxMessageCount: 3, autoSendFrequency: 600000 };
                this.appData.sendSettings.stickerRatio = value;
                this.appData.sendSettings.phraseRatio = 100 - value;
                
                const phraseSlider = document.getElementById('phraseRatioSlider');
                const phraseDisplay = document.getElementById('phraseRatioValue');
                if (phraseSlider) phraseSlider.value = 100 - value;
                if (phraseDisplay) phraseDisplay.textContent = `${100 - value}%`;
                
                this.saveAllData();
            });
        }
        
        const phraseRatioSlider = document.getElementById('phraseRatioSlider');
        if (phraseRatioSlider) {
            phraseRatioSlider.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                const display = document.getElementById('phraseRatioValue');
                if (display) display.textContent = `${value}%`;
                
                if (!this.appData.sendSettings) this.appData.sendSettings = { stickerRatio: 50, phraseRatio: 50, maxMessageCount: 3, autoSendFrequency: 600000 };
                this.appData.sendSettings.phraseRatio = value;
                this.appData.sendSettings.stickerRatio = 100 - value;
                
                const stickerSlider = document.getElementById('stickerRatioSlider');
                const stickerDisplay = document.getElementById('stickerRatioValue');
                if (stickerSlider) stickerSlider.value = 100 - value;
                if (stickerDisplay) stickerDisplay.textContent = `${100 - value}%`;
                
                this.saveAllData();
            });
        }
        
        const maxMessageCount = document.getElementById('maxMessageCount');
        if (maxMessageCount) {
            maxMessageCount.addEventListener('change', (e) => {
                if (!this.appData.sendSettings) this.appData.sendSettings = { stickerRatio: 50, phraseRatio: 50, maxMessageCount: 3, autoSendFrequency: 600000 };
                this.appData.sendSettings.maxMessageCount = parseInt(e.target.value);
                this.saveAllData();
            });
        }
        
        const autoSendFrequency = document.getElementById('autoSendFrequency');
        if (autoSendFrequency) {
            autoSendFrequency.addEventListener('change', (e) => {
                if (!this.appData.sendSettings) this.appData.sendSettings = { stickerRatio: 50, phraseRatio: 50, maxMessageCount: 3, autoSendFrequency: 600000 };
                this.appData.sendSettings.autoSendFrequency = parseInt(e.target.value);
                this.restartAutoSending();
                this.saveAllData();
            });
        }
        
        // 新增：最短等待时间滑块
        const minDelaySlider = document.getElementById('minDelaySlider');
        if (minDelaySlider) {
            minDelaySlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                const display = document.getElementById('minDelayValue');
                if (display) display.textContent = `${val.toFixed(1)}秒`;
                
                if (!this.appData.sendSettings) this.appData.sendSettings = {};
                this.appData.sendSettings.minReplyDelay = val;
                
                // 如果最小值超过最大值，自动同步最大值
                if (this.appData.sendSettings.maxReplyDelay < val) {
                    this.appData.sendSettings.maxReplyDelay = val;
                    const maxSlider = document.getElementById('maxDelaySlider');
                    const maxDisplay = document.getElementById('maxDelayValue');
                    if (maxSlider) maxSlider.value = val;
                    if (maxDisplay) maxDisplay.textContent = `${val.toFixed(1)}秒`;
                }
                
                this.saveAllData();
            });
        }

        // 新增：最长等待时间滑块
        const maxDelaySlider = document.getElementById('maxDelaySlider');
        if (maxDelaySlider) {
            maxDelaySlider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                const display = document.getElementById('maxDelayValue');
                if (display) display.textContent = `${val.toFixed(1)}秒`;
                
                if (!this.appData.sendSettings) this.appData.sendSettings = {};
                this.appData.sendSettings.maxReplyDelay = val;
                
                // 如果最大值小于最小值，自动同步最小值
                if (this.appData.sendSettings.minReplyDelay > val) {
                    this.appData.sendSettings.minReplyDelay = val;
                    const minSlider = document.getElementById('minDelaySlider');
                    const minDisplay = document.getElementById('minDelayValue');
                    if (minSlider) minSlider.value = val;
                    if (minDisplay) minDisplay.textContent = `${val.toFixed(1)}秒`;
                }
                
                this.saveAllData();
            });
        }
        
        // 外观设置
        const saveAppearanceBtn = document.getElementById('saveAppearanceBtn');
        if (saveAppearanceBtn) saveAppearanceBtn.addEventListener('click', () => this.saveAppearanceSettings());
        
        // 恋爱天数点击
        const loveDays = document.getElementById('loveDays');
        if (loveDays) loveDays.addEventListener('click', () => this.switchTab('appearance'));
        
        // 通信设置
        const startCallButton = document.getElementById('startCallButton');
        if (startCallButton) startCallButton.addEventListener('click', () => this.startCall());
        
        const startVideoButton = document.getElementById('startVideoButton');
        if (startVideoButton) startVideoButton.addEventListener('click', () => this.startVideo());
        
        const autoAcceptCalls = document.getElementById('autoAcceptCalls');
        if (autoAcceptCalls) {
            autoAcceptCalls.addEventListener('change', (e) => {
                if (!this.appData.communicationSettings) this.appData.communicationSettings = { autoAcceptCalls: true };
                this.appData.communicationSettings.autoAcceptCalls = e.target.checked;
                this.saveAllData();
            });
        }
        
        const autoAcceptVideos = document.getElementById('autoAcceptVideos');
        if (autoAcceptVideos) {
            autoAcceptVideos.addEventListener('change', (e) => {
                if (!this.appData.communicationSettings) this.appData.communicationSettings = { autoAcceptVideos: true };
                this.appData.communicationSettings.autoAcceptVideos = e.target.checked;
                this.saveAllData();
            });
        }
        
        const saveCommunicationBtn = document.getElementById('saveCommunicationBtn');
        if (saveCommunicationBtn) saveCommunicationBtn.addEventListener('click', () => this.saveCommunicationSettings());
        
        // 主动呼叫设置
        const overallFreqSlider = document.getElementById('overallFrequencySlider');
        if (overallFreqSlider) overallFreqSlider.addEventListener('input', () => this.updateOverallFrequency());
        
        const callPrefSlider = document.getElementById('callPreferenceSlider');
        if (callPrefSlider) callPrefSlider.addEventListener('input', () => this.updateCallPreference());
        
        const presetBtns = document.querySelectorAll('.preset-btn');
        presetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.currentTarget.getAttribute('data-preset');
                this.applyPresetMode(preset);
            });
        });
        
        // 群聊
        const groupModeToggle = document.getElementById('groupModeToggle');
        if (groupModeToggle) {
            groupModeToggle.addEventListener('change', () => {
                if (!this.appData.groupSettings) this.appData.groupSettings = { enabled: false, showAvatar: true, showName: true, members: [] };
                this.appData.groupSettings.enabled = groupModeToggle.checked;
                if (this.appData.groupSettings.enabled) {
                    this.migrateMessagesForGroup();
                }
                this.saveAllData();
                this.renderMessages();
            });
        }
        
        const showAvatar = document.getElementById('groupShowAvatar');
        if (showAvatar) {
            showAvatar.addEventListener('change', () => {
                if (this.appData.groupSettings) this.appData.groupSettings.showAvatar = showAvatar.checked;
                this.saveAllData();
            });
        }
        
        const showName = document.getElementById('groupShowName');
        if (showName) {
            showName.addEventListener('change', () => {
                if (this.appData.groupSettings) this.appData.groupSettings.showName = showName.checked;
                this.saveAllData();
            });
        }
        
        const addGroupMemberBtn = document.getElementById('addGroupMemberBtn');
        if (addGroupMemberBtn) addGroupMemberBtn.addEventListener('click', () => this.openGroupMemberEditModal(-1));
        
        const saveGroupSettingsBtn = document.getElementById('saveGroupSettingsBtn');
        if (saveGroupSettingsBtn) saveGroupSettingsBtn.addEventListener('click', () => this.saveGroupSettings());
        
        // 群成员编辑弹窗
        const groupMemberAvatarUpload = document.getElementById('groupMemberAvatarUpload');
        if (groupMemberAvatarUpload) {
            groupMemberAvatarUpload.addEventListener('change', (e) => this.handleGroupMemberAvatarUpload(e));
        }
        
        const cancelGroupMemberEdit = document.getElementById('cancelGroupMemberEdit');
        if (cancelGroupMemberEdit) {
            cancelGroupMemberEdit.addEventListener('click', () => this.closeGroupMemberEditModal());
        }
        
        const saveGroupMemberEdit = document.getElementById('saveGroupMemberEdit');
        if (saveGroupMemberEdit) {
            saveGroupMemberEdit.addEventListener('click', () => this.saveGroupMemberEdit());
        }
        
        // 音乐
        const musicUploadArea = document.getElementById('musicUploadArea');
        const musicUpload = document.getElementById('musicUpload');
        if (musicUploadArea && musicUpload) {
            musicUploadArea.addEventListener('click', () => musicUpload.click());
            musicUpload.addEventListener('change', (e) => this.handleMusicUpload(e));
        }
        
        // 新增：URL歌曲添加按钮
        const addMusicUrlBtn = document.getElementById('addMusicUrlBtn');
        if (addMusicUrlBtn) {
            addMusicUrlBtn.addEventListener('click', () => this.addMusicByUrl());
        }

        

        // 新增：回车键支持（在URL输入框按回车添加）
        const musicUrlInput = document.getElementById('musicUrlInput');
        if (musicUrlInput) {
            musicUrlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addMusicByUrl();
                }
            });
        }

        const musicUrlNameInput = document.getElementById('musicUrlNameInput');
        if (musicUrlNameInput) {
            musicUrlNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addMusicByUrl();
                }
            });
        }
        
        const musicFrequencySlider = document.getElementById('musicFrequencySlider');
        if (musicFrequencySlider) {
            musicFrequencySlider.addEventListener('input', (e) => {
                const value = document.getElementById('musicFrequencyValue');
                if (value) value.textContent = `${e.target.value}%`;
            });
        }
        
        const saveMusicSettingsBtn = document.getElementById('saveMusicSettingsBtn');
        if (saveMusicSettingsBtn) saveMusicSettingsBtn.addEventListener('click', () => this.saveMusicSettings());

        // ===== 新增：拍一拍设置监听 =====
        const savePokeBtn = document.getElementById('savePokeSettingsBtn');
        if (savePokeBtn) {
            savePokeBtn.addEventListener('click', () => this.savePokeSettings());
        }

        const pokeFreqSlider = document.getElementById('pokeFrequencySlider');
        const pokeFreqValue = document.getElementById('pokeFrequencyValue');
        if (pokeFreqSlider && pokeFreqValue) {
            pokeFreqSlider.addEventListener('input', (e) => {
                pokeFreqValue.textContent = `${e.target.value}%`;
            });
        }

        const pokeTextarea = document.getElementById('pokePhrasesTextarea');
        if (pokeTextarea) {
            pokeTextarea.addEventListener('input', () => this.updatePokePhraseCount());
        }
        
        // ===== 新增：随机变化设置监听 =====
        this.setupRandomSettingsListeners();
        
        // 数据管理初始化
        this.initDataManagement();
        
        // 点击其他地方关闭消息操作菜单
        document.addEventListener('click', (e) => {
            if (this.appData.activeMessageActions && 
                !this.appData.activeMessageActions.contains(e.target) &&
                !e.target.closest('.message')) {
                this.appData.activeMessageActions.style.display = 'none';
                this.appData.activeMessageActions = null;
            }
        });

        // ========== 新增：用户信息编辑事件监听 ==========
        // 点击自己头像区域编辑
        const selfUserInfo = document.getElementById('selfUserInfo');
        if (selfUserInfo) {
            selfUserInfo.addEventListener('click', () => this.openUserEditModal('self'));
        }

        // 点击对方头像区域编辑
        const otherUserInfo = document.getElementById('otherUserInfo');
        if (otherUserInfo) {
            otherUserInfo.addEventListener('click', () => this.openUserEditModal('other'));
        }

        // 模态框内上传头像按钮
        const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
        const avatarUpload = document.getElementById('modalAvatarUpload');
        if (uploadAvatarBtn && avatarUpload) {
            uploadAvatarBtn.addEventListener('click', () => avatarUpload.click());
            avatarUpload.addEventListener('change', (e) => this.handleAvatarUpload(e));
        }

        // 取消按钮
        const cancelEditBtn = document.getElementById('cancelEditBtn');
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', () => this.closeUserEditModal());
        }

        // 保存按钮
        const saveUserInfoBtn = document.getElementById('saveUserInfoBtn');
        if (saveUserInfoBtn) {
            saveUserInfoBtn.addEventListener('click', () => this.saveUserInfo());
        }

        // ========== 新增：初始化表情包选择器 ==========
        this.initStickerPicker();
    }
    
    restartAutoSending() {
        if (this.appData.autoSendTimer) clearInterval(this.appData.autoSendTimer);
        this.startAutoSending();
    }
    
    requestContinueMessages() {
        this.appData.isTyping = true;
        this.renderMessages();
        
        const minDelay = (this.appData.sendSettings?.minReplyDelay || 1.5) * 1000;
        const maxDelay = (this.appData.sendSettings?.maxReplyDelay || 3.5) * 1000;
        const delay = minDelay + Math.random() * (maxDelay - minDelay);
        
        setTimeout(() => {
            this.appData.isTyping = false;
            if (this.appData.tarotSettings?.enabled && this.appData.tarotSettings.customPhrases?.length > 0) {
                this.generateTarotReply('continue');
                this.showNotification(`对方抽取了塔罗牌进行占卜 🔮`);
            } else {
                this.autoSendMessage();
            }
        }, delay);
    }
    
    // ========================
    // 音乐播放器功能 - 已修改支持URL歌曲
    // ========================
    
    initMusicSettingsUI() {
        const musicFrequencySlider = document.getElementById('musicFrequencySlider');
        const musicFrequencyValue = document.getElementById('musicFrequencyValue');
        const autoPlayMusic = document.getElementById('autoPlayMusic');
        const playModeRadios = document.querySelectorAll('input[name="musicPlayMode"]');
        
        if (!this.appData.musicSettings) this.appData.musicSettings = { musicList: [] };
        
        if (musicFrequencySlider && this.appData.musicSettings) {
            musicFrequencySlider.value = this.appData.musicSettings.musicFrequency || 30;
        }
        if (musicFrequencyValue && this.appData.musicSettings) {
            musicFrequencyValue.textContent = `${this.appData.musicSettings.musicFrequency || 30}%`;
        }
        if (autoPlayMusic && this.appData.musicSettings) {
            autoPlayMusic.checked = this.appData.musicSettings.autoPlayMusic !== false;
        }
        playModeRadios.forEach(radio => {
            radio.checked = radio.value === (this.appData.musicSettings.playMode || 'random');
        });
        
        this.renderMusicList();
    }
    
    renderMusicList() {
        const musicListEl = document.getElementById('musicList');
        if (!musicListEl) return;
        if (!this.appData.musicSettings) this.appData.musicSettings = { musicList: [] };
        
        const musicList = this.appData.musicSettings.musicList || [];
        
        if (musicList.length === 0) {
            musicListEl.innerHTML = '<div class="music-empty"><i class="material-icons">library_music</i><span>暂无音乐，请上传音频文件或添加URL歌曲</span></div>';
            return;
        }
        
        musicListEl.innerHTML = '';
        musicList.forEach((music, index) => {
            const musicCard = document.createElement('div');
            musicCard.className = 'music-item-card';
            
            // 判断歌曲类型，显示不同的图标和大小信息
            const isUrlMusic = music.type === 'url';
            const icon = isUrlMusic ? 'link' : 'music_note';
            const sizeText = isUrlMusic ? 'URL歌曲' : (music.size ? (music.size / 1024 / 1024).toFixed(2) + 'MB' : '未知大小');
            
            musicCard.innerHTML = `
                <div class="music-item-icon" style="background: ${isUrlMusic ? 'linear-gradient(135deg, #4a90e2, #357abd)' : 'linear-gradient(135deg, #a99cad, #8a7f8d)'};">
                    <i class="material-icons">${icon}</i>
                </div>
                <div class="music-item-info">
                    <div class="music-item-name">${music.name || '未知歌曲'}</div>
                    <div class="music-item-size">${sizeText}</div>
                </div>
                <div class="music-item-actions">
                    <button class="music-item-play" data-index="${index}"><i class="material-icons">play_arrow</i>播放</button>
                    <button class="music-item-delete" data-index="${index}"><i class="material-icons">delete</i></button>
                </div>
            `;
            
            musicCard.querySelector('.music-item-play').addEventListener('click', () => this.openMusicPlayer(music));
            musicCard.querySelector('.music-item-delete').addEventListener('click', () => this.deleteMusic(index));
            
            musicListEl.appendChild(musicCard);
        });
    }
    
    /**
     * 通过URL添加歌曲
     */
    addMusicByUrl() {
        const urlInput = document.getElementById('musicUrlInput');
        const nameInput = document.getElementById('musicUrlNameInput');
        
        const url = urlInput.value.trim();
        const name = nameInput.value.trim();
        
        if (!url) {
            this.showNotification('请输入歌曲URL');
            return;
        }
        
        // 简单的URL验证
        if (!url.match(/^https?:\/\/.+/)) {
            this.showNotification('请输入有效的HTTP/HTTPS URL');
            return;
        }
        
        // 检查是否支持音频格式（简单检查文件扩展名）
        const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm'];
        const hasValidExtension = audioExtensions.some(ext => url.toLowerCase().endsWith(ext));
        if (!hasValidExtension) {
            if (!confirm('URL可能不是音频文件，确定要继续添加吗？')) {
                return;
            }
        }
        
        // 生成歌曲名称
        let songName = name;
        if (!songName) {
            // 从URL中提取文件名
            const urlParts = url.split('/');
            const lastPart = urlParts[urlParts.length - 1];
            songName = lastPart.split('?')[0] || '未知歌曲';
            // 移除文件扩展名
            songName = songName.replace(/\.[^/.]+$/, '');
        }
        
        // 创建音乐数据对象
        const musicData = {
            id: Date.now() + Math.random(),
            name: songName,
            data: url,                    // 直接存储URL字符串
            size: 0,                       // URL歌曲大小为0
            type: 'url',                   // 标记为URL类型
            url: url,                      // 额外存储URL
            addedTime: new Date().toISOString()
        };
        
        // 添加到音乐列表
        if (!this.appData.musicSettings) {
            this.appData.musicSettings = { musicList: [] };
        }
        if (!this.appData.musicSettings.musicList) {
            this.appData.musicSettings.musicList = [];
        }
        
        this.appData.musicSettings.musicList.push(musicData);
        
        // 清空输入框
        urlInput.value = '';
        nameInput.value = '';
        
        // 重新渲染音乐列表
        this.renderMusicList();
        this.saveAllData();
        this.showNotification(`已添加歌曲: ${songName}`);
    }

    
    
    handleMusicUpload(e) {
        const files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('audio/')) {
                this.showNotification('请上传音频文件');
                continue;
            }
            if (file.size > 10 * 1024 * 1024) {
                this.showNotification(`文件 ${file.name} 超过10MB`);
                continue;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const musicData = {
                    id: Date.now() + i + Math.random(),
                    name: file.name.replace(/\.[^/.]+$/, ''),
                    data: event.target.result,
                    size: file.size,
                    type: file.type
                };
                
                if (!this.appData.musicSettings) this.appData.musicSettings = { musicList: [] };
                if (!this.appData.musicSettings.musicList) this.appData.musicSettings.musicList = [];
                this.appData.musicSettings.musicList.push(musicData);
                this.renderMusicList();
                this.saveAllData();
                this.showNotification(`已添加歌曲: ${musicData.name}`);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    }
    
    deleteMusic(index) {
        if (!this.appData.musicSettings?.musicList) return;
        const music = this.appData.musicSettings.musicList[index];
        if (!music) return;
        
        const musicType = music.type === 'url' ? 'URL歌曲' : '本地歌曲';
        if (confirm(`确定要删除${musicType}《${music.name}》吗？`)) {
            this.appData.musicSettings.musicList.splice(index, 1);
            this.renderMusicList();
            this.saveAllData();
            this.showNotification(`已删除歌曲: ${music.name}`);
            
            // 如果当前正在播放这首歌，关闭播放器
            if (this.appData.activeMusicPlayer && 
                this.appData.currentPlayingMusic?.id === music.id) {
                this.closeMusicPlayer();
            }
        }
    }
    
    openMusicPlayer(music) {
        const existing = document.querySelector('.music-window');
        if (existing) existing.remove();
        
        this.appData.currentPlayingMusic = music;
        
        const musicWindow = document.createElement('div');
        musicWindow.className = 'music-window';
        musicWindow.style.left = '80px';
        musicWindow.style.top = '150px';
        
        const coverImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIgM2MtNC45NyAwLTkgNC4wMy05IDlzNC4wMyA5IDkgOSA5LTQuMDMgOS05LTQuMDMtOS05LTl6bTAgMTZjLTMuODYgMC03LTMuMTQtNy03czMuMTQtNyA3LTcgNyAzLjE0IDcgNy0zLjE0IDctNyA3eiIgZmlsbD0iIzhhN2Y4ZCIvPjxwYXRoIGQ9Ik0xMCA5djZsNS0zLTUtM3oiIGZpbGw9IiM4YTdmOGQiLz48L3N2Zz4=';
        
        musicWindow.innerHTML = `
            <div class="window-header">
                <div class="window-title"><i class="material-icons">music_note</i><span>音乐播放器</span></div>
                <div class="window-controls"><button class="window-btn" id="minimizeMusic">−</button><button class="window-btn" id="closeMusic">×</button></div>
            </div>
            <div class="window-content" style="padding: 0;">
                <div class="music-cd-container">
                    <div class="music-cd" id="musicCd"><img src="${coverImage}" alt="CD"></div>
                    <div class="music-info">
                        <div class="music-title" id="musicTitle">${music.name || '未知歌曲'}</div>
                        <div class="music-artist"><i class="material-icons">album</i>梦角音乐</div>
                        <div class="music-progress-container">
                            <div class="music-progress-bar" id="musicProgressBar"><div class="music-progress-fill" id="musicProgressFill"><div class="music-progress-handle"></div></div></div>
                            <div class="music-time"><span id="currentTime">00:00</span><span id="duration">00:00</span></div>
                        </div>
                        <div class="music-controls-bar">
                            <button class="music-control-btn" id="prevMusic"><i class="material-icons">skip_previous</i></button>
                            <button class="music-control-btn" id="playPauseMusic"><i class="material-icons">play_arrow</i></button>
                            <button class="music-control-btn" id="nextMusic"><i class="material-icons">skip_next</i></button>
                            <button class="music-control-btn" id="closeMusicPlayer"><i class="material-icons">close</i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(musicWindow);
        this.appData.activeMusicPlayer = musicWindow;
        this.appData.isMusicPlaying = false;
        this.appData.musicAudio = null;
        
        this.makeWindowDraggable(musicWindow);
        this.initMusicAudio(music);
        
        musicWindow.querySelector('#playPauseMusic').addEventListener('click', () => this.toggleMusicPlay());
        musicWindow.querySelector('#prevMusic').addEventListener('click', () => this.playPrevMusic());
        musicWindow.querySelector('#nextMusic').addEventListener('click', () => this.playNextMusic());
        musicWindow.querySelector('#closeMusic').addEventListener('click', () => this.closeMusicPlayer());
        musicWindow.querySelector('#closeMusicPlayer').addEventListener('click', () => this.closeMusicPlayer());
        musicWindow.querySelector('#minimizeMusic').addEventListener('click', () => {
            musicWindow.style.display = musicWindow.style.display === 'none' ? 'flex' : 'none';
        });
        
        const progressBar = musicWindow.querySelector('#musicProgressBar');
        progressBar.addEventListener('click', (e) => this.seekMusic(e));
        
        const cd = musicWindow.querySelector('#musicCd');
        cd.addEventListener('click', () => this.toggleMusicPlay());
    }
    
    initMusicAudio(music) {
        if (!music) return;
        
        // 获取音频源
        let audioSrc;
        if (music.type === 'url') {
            audioSrc = music.url || music.data;  // URL歌曲
        } else {
            audioSrc = music.data;                // 本地文件
        }
        
        if (!audioSrc) return;
        
        if (this.appData.musicAudio) {
            this.appData.musicAudio.pause();
            this.appData.musicAudio = null;
        }
        
        const audio = new Audio(audioSrc);
        audio.volume = 0.8;
        
        // 添加跨域支持（对于URL歌曲）
        if (music.type === 'url') {
            audio.crossOrigin = 'anonymous';
        }
        
        // 加载错误处理
        audio.addEventListener('error', (e) => {
            console.error('音频加载错误:', e);
            let errorMsg = '无法播放音频';
            if (audio.error) {
                switch (audio.error.code) {
                    case 1: errorMsg = '用户中止了加载'; break;
                    case 2: errorMsg = '网络错误，可能URL无效或跨域限制'; break;
                    case 3: errorMsg = '解码错误，可能不是有效的音频文件'; break;
                    case 4: errorMsg = 'URL无效或格式不支持'; break;
                    default: errorMsg = '未知错误';
                }
            }
            this.showNotification(`播放失败：${errorMsg}`, 'error');
        });
        
        audio.addEventListener('loadedmetadata', () => {
            const duration = document.getElementById('duration');
            if (duration) duration.textContent = this.formatTime(audio.duration);
        });
        
        audio.addEventListener('timeupdate', () => {
            if (!this.appData.activeMusicPlayer) return;
            const currentTime = document.getElementById('currentTime');
            const progressFill = document.getElementById('musicProgressFill');
            if (currentTime) currentTime.textContent = this.formatTime(audio.currentTime);
            if (progressFill) progressFill.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
            this.appData.musicCurrentTime = audio.currentTime;
        });
        
        audio.addEventListener('ended', () => this.handleMusicEnded());
        
        this.appData.musicAudio = audio;
    }
    
    toggleMusicPlay() {
        if (!this.appData.musicAudio) return;
        const playPauseBtn = document.querySelector('#playPauseMusic i');
        const cd = document.querySelector('#musicCd');
        
        if (this.appData.isMusicPlaying) {
            this.appData.musicAudio.pause();
            if (playPauseBtn) playPauseBtn.textContent = 'play_arrow';
            if (cd) cd.classList.remove('playing');
        } else {
            this.appData.musicAudio.play();
            if (playPauseBtn) playPauseBtn.textContent = 'pause';
            if (cd) cd.classList.add('playing');
        }
        this.appData.isMusicPlaying = !this.appData.isMusicPlaying;
    }
    
    seekMusic(e) {
        if (!this.appData.musicAudio) return;
        const progressBar = document.getElementById('musicProgressBar');
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const seekTime = percent * this.appData.musicAudio.duration;
        this.appData.musicAudio.currentTime = seekTime;
    }
    
    playPrevMusic() {
        const musicList = this.appData.musicSettings?.musicList || [];
        if (musicList.length === 0) { this.closeMusicPlayer(); return; }
        const currentMusic = this.appData.currentPlayingMusic;
        let index = musicList.findIndex(m => m.id === currentMusic?.id);
        if (index === -1) index = 0;
        else index = (index - 1 + musicList.length) % musicList.length;
        this.openMusicPlayer(musicList[index]);
    }
    
    playNextMusic() {
        const musicList = this.appData.musicSettings?.musicList || [];
        if (musicList.length === 0) { this.closeMusicPlayer(); return; }
        const currentMusic = this.appData.currentPlayingMusic;
        let index = musicList.findIndex(m => m.id === currentMusic?.id);
        if (index === -1) index = 0;
        else index = (index + 1) % musicList.length;
        this.openMusicPlayer(musicList[index]);
    }
    
    handleMusicEnded() {
        const playMode = this.appData.musicSettings?.playMode || 'random';
        if (playMode === 'single') {
            this.appData.musicAudio.currentTime = 0;
            this.appData.musicAudio.play();
        } else if (playMode === 'list' || playMode === 'random') {
            this.playNextMusic();
        } else {
            this.appData.isMusicPlaying = false;
            const playPauseBtn = document.querySelector('#playPauseMusic i');
            const cd = document.querySelector('#musicCd');
            if (playPauseBtn) playPauseBtn.textContent = 'play_arrow';
            if (cd) cd.classList.remove('playing');
        }
    }
    
    closeMusicPlayer() {
        if (this.appData.musicAudio) {
            this.appData.musicAudio.pause();
            this.appData.musicAudio = null;
        }
        if (this.appData.activeMusicPlayer) {
            this.appData.activeMusicPlayer.remove();
            this.appData.activeMusicPlayer = null;
        }
        this.appData.isMusicPlaying = false;
        this.appData.currentPlayingMusic = null;
    }
    
    saveMusicSettings() {
        const autoPlayMusic = document.getElementById('autoPlayMusic');
        const musicFrequencySlider = document.getElementById('musicFrequencySlider');
        const playModeRadios = document.querySelectorAll('input[name="musicPlayMode"]');
        
        if (!this.appData.musicSettings) this.appData.musicSettings = { musicList: [] };
        if (autoPlayMusic) this.appData.musicSettings.autoPlayMusic = autoPlayMusic.checked;
        if (musicFrequencySlider) this.appData.musicSettings.musicFrequency = parseInt(musicFrequencySlider.value);
        playModeRadios.forEach(radio => { if (radio.checked) this.appData.musicSettings.playMode = radio.value; });
        
        this.saveAllData();
        this.showNotification('音乐设置已保存');
        this.closeSettingsPanel();
    }
    
    simulateMusicPlay() {
        const settings = this.appData.musicSettings;
        if (!settings || !settings.autoPlayMusic) return;
        const musicList = settings.musicList || [];
        if (musicList.length === 0) return;
        const frequency = settings.musicFrequency || 30;
        if (Math.random() * 100 > frequency) return;
        
        let selectedMusic;
        if (settings.playMode === 'random') {
            selectedMusic = musicList[Math.floor(Math.random() * musicList.length)];
        } else {
            const lastMusic = this.appData.lastPlayedMusic;
            let index = musicList.findIndex(m => m.id === lastMusic?.id);
            index = (index + 1) % musicList.length;
            selectedMusic = musicList[index];
        }
        this.appData.lastPlayedMusic = selectedMusic;
        
        setTimeout(() => {
            this.openMusicPlayer(selectedMusic);
            const musicMessage = {
                id: this.dataManager.generateMessageId(),
                type: 'music',
                text: `对方播放了歌曲: ${selectedMusic.name}`,
                sender: 'other',
                time: this.getCurrentTime(),
                read: true
            };
            this.appData.messages.push(musicMessage);
            this.renderMessages();
            this.saveAllData();
            this.showNotification(`对方正在播放: ${selectedMusic.name}`);
        }, 1000 + Math.random() * 2000);
    }
    
    formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity || seconds < 0) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    startMusicScheduler() {
        if (this.appData.musicTimer) clearInterval(this.appData.musicTimer);
        const settings = this.appData.musicSettings;
        if (!settings || !settings.autoPlayMusic || settings.musicFrequency <= 0) return;
        const baseInterval = 300000;
        const checkInterval = baseInterval * (100 / Math.max(settings.musicFrequency, 10));
        this.appData.musicTimer = setInterval(() => this.simulateMusicPlay(), checkInterval);
    }
    
    showNotification(message) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => { if (notification.parentNode) notification.remove(); }, 3000);
    }

    // ========================
    // 新增：表情包选择器功能（从第一个文件移植）
    // ========================
    initStickerPicker() {
        const pickerBtn = document.getElementById('stickerPickerButton');
        const picker = document.getElementById('user-sticker-picker');
        if (!pickerBtn || !picker) return;

        // 点击按钮切换面板
        pickerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (picker.style.display === 'none' || !picker.style.display) {
                picker.style.display = 'flex';
                this.renderStickerPickerContent(); // 每次打开都重新渲染
            } else {
                picker.style.display = 'none';
            }
        });

        // 点击其他地方关闭面板
        document.addEventListener('click', (e) => {
            if (!picker.contains(e.target) && !pickerBtn.contains(e.target)) {
                picker.style.display = 'none';
            }
        });

        // 处理选项卡切换
        const tabs = picker.querySelectorAll('.combo-tab-btn');
        tabs.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                tabs.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const tab = btn.dataset.tab;
                if (tab === 'sticker') {
                    this.renderStickerPickerContent();
                } else {
                    // 拍一拍功能
                    this.renderPokeTabContent();
                }
            });
        });
    }

    renderStickerPickerContent() {
        const area = document.getElementById('combo-content-area');
        if (!area) return;
        const stickers = this.appData.stickers || [];
        if (stickers.length === 0) {
            area.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text);">暂无表情包，请先在“设置 → 表情包库”中上传</div>';
            return;
        }

        let html = '<div class="sticker-grid-view">';
        stickers.forEach((sticker, index) => {
            html += `<div class="sticker-grid-item" data-index="${index}">
                        <img src="${sticker.data}" alt="表情包">
                     </div>`;
        });
        html += '</div>';
        area.innerHTML = html;

        // 绑定点击事件
        area.querySelectorAll('.sticker-grid-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = item.dataset.index;
                const sticker = this.appData.stickers[index];
                if (sticker) {
                    this.sendStickerMessage(sticker.data);
                    document.getElementById('user-sticker-picker').style.display = 'none'; // 发送后关闭
                }
            });
        });
    }

    renderPokeTabContent() {
        const area = document.getElementById('combo-content-area');
        if (!area) return;
        const phrases = this.appData.pokeSettings?.phrases || ["拍了拍你"];
        if (phrases.length === 0) {
            area.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text);">暂无拍一拍文案，请先在设置中添加</div>';
            return;
        }

        let html = '<div style="display:grid; grid-template-columns:repeat(2,1fr); gap:10px;">';
        phrases.forEach((phrase, index) => {
            html += `<div class="sticker-grid-item" data-poke-index="${index}" style="aspect-ratio:auto; padding:12px; text-align:center; background:var(--accent-light); color:white;">
                        ${phrase}
                     </div>`;
        });
        html += '</div>';
        area.innerHTML = html;

        // 绑定点击事件
        area.querySelectorAll('[data-poke-index]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const index = item.dataset.pokeIndex;
                const suffix = phrases[index];
                this.sendPokeMessage('self', suffix);
                document.getElementById('user-sticker-picker').style.display = 'none'; // 发送后关闭
            });
        });
    }

    sendStickerMessage(stickerData) {
        const imageMessage = {
            id: this.dataManager.generateMessageId(),
            isSticker: true,
            stickerData: stickerData,
            sender: 'self',
            time: this.getCurrentTime(),
            read: false,
            quotedMessage: this.appData.quotedMessage ? { ...this.appData.quotedMessage } : null
        };
        this.appData.messages.push(imageMessage);
        this.renderMessages();
        this.appData.quotedMessage = null;
        const input = document.getElementById('messageInput');
        if (input) input.placeholder = '输入消息...';
        this.saveAllData();

        // 触发对方回复逻辑（与发送图片后相同）
        this.triggerReplyAfterSend(imageMessage.id);
    }

    triggerReplyAfterSend(messageId) {
        const willReply = Math.random() > 0.2; // 80%概率回复
        if (willReply) {
            this.appData.waitingForReply = true;
            this.startTypingIndicator();
            
            const minDelay = (this.appData.sendSettings?.minReplyDelay || 1.5) * 1000;
            const maxDelay = (this.appData.sendSettings?.maxReplyDelay || 3.5) * 1000;
            const delay = minDelay + Math.random() * (maxDelay - minDelay);
            
            setTimeout(() => {
                if (this.appData.tarotSettings?.enabled && this.appData.tarotSettings.customPhrases?.length > 0) {
                    this.generateTarotReply('reply');
                } else {
                    this.generateReply(messageId);
                }
            }, delay);
        } else {
            this.appData.waitingForReply = false;
            setTimeout(() => {
                this.markSelfMessagesAsRead();
                if (messageId) {
                    if (!this.appData.readNoReplyMessageIds) this.appData.readNoReplyMessageIds = [];
                    this.appData.readNoReplyMessageIds.push(messageId);
                }
                this.renderMessages();
                this.showNotification('对方已读不回');
                this.saveAllData();
            }, 1000 + Math.random() * 3000);
        }
    }

    // ========================
    // 新增拍一拍相关方法
    // ========================
    renderPokeUI() {
        const toggle = document.getElementById('pokeEnableToggle');
        const slider = document.getElementById('pokeFrequencySlider');
        const freqValue = document.getElementById('pokeFrequencyValue');
        const textarea = document.getElementById('pokePhrasesTextarea');
        const countSpan = document.getElementById('pokePhraseCount');

        if (toggle && this.appData.pokeSettings) {
            toggle.checked = this.appData.pokeSettings.enabled !== false;
        }
        if (slider && this.appData.pokeSettings) {
            slider.value = this.appData.pokeSettings.frequency || 20;
        }
        if (freqValue && this.appData.pokeSettings) {
            freqValue.textContent = `${this.appData.pokeSettings.frequency || 20}%`;
        }
        if (textarea && this.appData.pokeSettings) {
            textarea.value = (this.appData.pokeSettings.phrases || []).join('\n');
            this.updatePokePhraseCount();
        }
    }

    updatePokePhraseCount() {
        const textarea = document.getElementById('pokePhrasesTextarea');
        const countSpan = document.getElementById('pokePhraseCount');
        if (!textarea || !countSpan) return;
        const text = textarea.value.trim();
        const phrases = text ? text.split('\n').map(p => p.trim()).filter(p => p) : [];
        countSpan.textContent = phrases.length;
    }

    savePokeSettings() {
        const toggle = document.getElementById('pokeEnableToggle');
        const slider = document.getElementById('pokeFrequencySlider');
        const textarea = document.getElementById('pokePhrasesTextarea');

        if (!this.appData.pokeSettings) {
            this.appData.pokeSettings = { enabled: true, frequency: 20, phrases: [] };
        }

        if (toggle) this.appData.pokeSettings.enabled = toggle.checked;
        if (slider) this.appData.pokeSettings.frequency = parseInt(slider.value);

        const text = textarea.value.trim();
        const phrases = text ? text.split('\n').map(p => p.trim()).filter(p => p) : [];
        this.appData.pokeSettings.phrases = phrases.length ? phrases : ["拍了拍你"]; // 保证至少一条

        this.saveAllData();
        this.showNotification('拍一拍设置已保存');
        this.updatePokePhraseCount();
        this.restartPokeScheduler(); // 重启定时器
        
        console.log('拍一拍设置已保存:', this.appData.pokeSettings);
    }

    restartPokeScheduler() {
        if (this.appData.pokeTimer) {
            clearInterval(this.appData.pokeTimer);
            this.appData.pokeTimer = null;
        }
        this.startPokeScheduler();
    }

    startPokeScheduler() {
        const settings = this.appData.pokeSettings;
        if (!settings || !settings.enabled || settings.frequency <= 0) return;

        // 临时改为 30秒，便于测试
        const baseInterval = 10000; // 30秒（测试用，之后可改回300000）

        if (this.appData.pokeTimer) {
            clearInterval(this.appData.pokeTimer);
        }
        
        this.appData.pokeTimer = setInterval(() => {
            if (Math.random() * 100 < settings.frequency) {
                console.log('触发对方拍一拍，频率:', settings.frequency);
                this.sendRandomPokeFromOther();
            }
        }, baseInterval);
    }

    sendRandomPokeFromOther() {
        const phrases = this.appData.pokeSettings?.phrases;
        if (!phrases || phrases.length === 0) {
            console.log('没有拍一拍文案');
            return;
        }

        const randomSuffix = phrases[Math.floor(Math.random() * phrases.length)];
        console.log('发送拍一拍:', randomSuffix); // 添加日志
        this.sendPokeMessage('other', randomSuffix);
    }

    sendPokeMessage(sender = 'self', suffix = null) {
        // 如果没有提供后缀，从文案库随机选一条
        if (!suffix) {
            const phrases = this.appData.pokeSettings?.phrases;
            if (!phrases || phrases.length === 0) {
                suffix = "拍了拍你"; // 默认
            } else {
                suffix = phrases[Math.floor(Math.random() * phrases.length)];
            }
        }

        // 构建显示文本：直接使用后缀（去除首尾空格）
        const displayText = suffix.trim();

        // 根据发送者确定完整的拍一拍文案
        let fullText = '';
        if (sender === 'self') {
            const myName = this.appData.selfInfo?.nickname || '我';
            fullText = `${myName} ${displayText}`;
        } else {
            const otherName = this.appData.otherInfo?.nickname || '对方';
            fullText = `${otherName} ${displayText}`;
        }

        // 创建拍一拍消息对象 - 使用 type: 'poke'，不要用 isPoke
        const pokeMessage = {
            id: this.dataManager.generateMessageId(),
            type: 'poke',           // ← 保持这个
            text: fullText,          // ← 使用完整文案
            sender: sender,
            time: this.getCurrentTime(),
            read: true
            // 不要加 isPoke 属性
        };

        this.appData.messages.push(pokeMessage);
        this.renderMessages();
        this.saveAllData();

        // 如果是自己发送拍一拍，触发对方回复（按比例 字卡80% 表情包10% 拍一拍10%）
        if (sender === 'self') {
            this.triggerReplyAfterPoke();
        }
    }

    // ========================
    // 新增：用户发送拍一拍后触发对方回复（字卡40% 表情包30% 拍一拍30%）
    // ========================
    triggerReplyAfterPoke() {
        // 显示对方正在输入
        this.appData.waitingForReply = true;
        this.startTypingIndicator();

        const minDelay = (this.appData.sendSettings?.minReplyDelay || 1.5) * 1000;
        const maxDelay = (this.appData.sendSettings?.maxReplyDelay || 3.5) * 1000;
        const delay = minDelay + Math.random() * (maxDelay - minDelay);

        setTimeout(() => {
            this.stopTypingIndicator();

            // 检查资源可用性
            let hasPhrase = this.appData.responsePhrases?.length > 0;
            let hasSticker = this.appData.stickers?.length > 0;
            let hasPoke = this.appData.pokeSettings?.enabled && this.appData.pokeSettings.phrases?.length > 0;

            // 如果某种资源缺失，重新分配剩余类型的比例
            let phraseProb = hasPhrase ? 80 : 0;
            let stickerProb = hasSticker ? 10 : 0;
            let pokeProb = hasPoke ? 10 : 0;

            // 重新归一化（避免总和为0）
            const total = phraseProb + stickerProb + pokeProb;
            if (total === 0) {
                // 什么都没有，就不回复了
                return;
            }

            const rand = Math.random() * total;
            if (rand < phraseProb) {
                // 普通词条
                this.generatePhraseReply();
            } else if (rand < phraseProb + stickerProb) {
                // 表情包
                this.generateStickerReply();
            } else {
                // 拍一拍
                this.generatePokeReply();
            }
        }, delay);
    }

    // 新增：生成一条对方发送的普通词条消息
    generatePhraseReply() {
        if (!this.appData.responsePhrases || this.appData.responsePhrases.length === 0) {
            // 如果没有普通词条，降级为表情包或拍一拍
            if (this.appData.stickers?.length > 0) {
                this.generateStickerReply();
            } else if (this.appData.pokeSettings?.enabled && this.appData.pokeSettings.phrases?.length > 0) {
                this.generatePokeReply();
            }
            return;
        }

        const randomPhrase = this.appData.responsePhrases[Math.floor(Math.random() * this.appData.responsePhrases.length)];
        const phraseMessage = {
            id: this.dataManager.generateMessageId(),
            text: randomPhrase,
            sender: 'other',
            time: this.getCurrentTime(),
            read: true
        };

        this.appData.messages.push(phraseMessage);
        this.renderMessages();
        this.saveAllData();
        this.showNotification('对方回复了一条消息');
    }

    // 生成一条对方发送的表情包消息
    generateStickerReply() {
        if (!this.appData.stickers || this.appData.stickers.length === 0) {
            // 如果没有表情包，降级为拍一拍（如果有）或字卡
            if (this.appData.pokeSettings?.enabled && this.appData.pokeSettings.phrases?.length > 0) {
                this.generatePokeReply();
            } else if (this.appData.tarotSettings?.enabled && this.appData.tarotSettings.customPhrases?.length > 0) {
                this.generateTarotReply('reply');
            }
            return;
        }

        const randomSticker = this.appData.stickers[Math.floor(Math.random() * this.appData.stickers.length)];
        const stickerMessage = {
            id: this.dataManager.generateMessageId(),
            isSticker: true,
            stickerData: randomSticker.data,
            sender: 'other',
            time: this.getCurrentTime(),
            read: true
        };

        this.appData.messages.push(stickerMessage);
        this.renderMessages();
        this.saveAllData();
        this.showNotification('对方发送了一个表情包');
    }

    // 生成一条对方发送的拍一拍消息
    generatePokeReply() {
        const phrases = this.appData.pokeSettings?.phrases;
        if (!phrases || phrases.length === 0) {
            // 如果没有拍一拍文案，降级为字卡或表情包
            if (this.appData.tarotSettings?.enabled && this.appData.tarotSettings.customPhrases?.length > 0) {
                this.generateTarotReply('reply');
            } else if (this.appData.stickers?.length > 0) {
                this.generateStickerReply();
            }
            return;
        }

        const randomSuffix = phrases[Math.floor(Math.random() * phrases.length)];
        this.sendPokeMessage('other', randomSuffix); // 注意 sender='other' 不会再次触发回复
    }

    // ========================
    // 新增随机变化设置方法
    // ========================
    
    /**
     * 渲染随机变化UI
     */
    renderRandomUI() {
        const minSlider = document.getElementById('minRandomSlider');
        const minInput = document.getElementById('minRandomInput');
        const minUnit = document.getElementById('minRandomUnit');
        const minValue = document.getElementById('minRandomValue');
        const maxSlider = document.getElementById('maxRandomSlider');
        const maxInput = document.getElementById('maxRandomInput');
        const maxUnit = document.getElementById('maxRandomUnit');
        const maxValue = document.getElementById('maxRandomValue');
        
        if (!minSlider || !maxSlider) return;
        
        const settings = this.appData.randomSettings || { 
            minValue: 2, minUnit: 1, 
            maxValue: 4, maxUnit: 3600 
        };
        
        // 设置最小值
        minSlider.value = settings.minValue;
        minInput.value = settings.minValue;
        minUnit.value = settings.minUnit;
        this.updateMinRandomDisplay();
        
        // 设置最大值
        maxSlider.value = settings.maxValue;
        maxInput.value = settings.maxValue;
        maxUnit.value = settings.maxUnit;
        this.updateMaxRandomDisplay();
        
        this.updateRandomPreview();
    }

    /**
     * 设置随机变化监听器
     */
    setupRandomSettingsListeners() {
        const minSlider = document.getElementById('minRandomSlider');
        const minInput = document.getElementById('minRandomInput');
        const minUnit = document.getElementById('minRandomUnit');
        const maxSlider = document.getElementById('maxRandomSlider');
        const maxInput = document.getElementById('maxRandomInput');
        const maxUnit = document.getElementById('maxRandomUnit');
        const saveBtn = document.getElementById('saveRandomSettingsBtn');
        
        if (minSlider) {
            minSlider.addEventListener('input', () => {
                minInput.value = minSlider.value;
                this.updateMinRandomDisplay();
                this.updateRandomPreview();
            });
        }
        
        if (minInput) {
            minInput.addEventListener('input', () => {
                let val = parseInt(minInput.value) || 1;
                if (val < 1) val = 1;
                if (val > 60) val = 60;
                minInput.value = val;
                minSlider.value = val;
                this.updateMinRandomDisplay();
                this.updateRandomPreview();
            });
        }
        
        if (minUnit) {
            minUnit.addEventListener('change', () => {
                this.updateMinRandomDisplay();
                this.updateRandomPreview();
            });
        }
        
        if (maxSlider) {
            maxSlider.addEventListener('input', () => {
                maxInput.value = maxSlider.value;
                this.updateMaxRandomDisplay();
                this.updateRandomPreview();
            });
        }
        
        if (maxInput) {
            maxInput.addEventListener('input', () => {
                let val = parseInt(maxInput.value) || 1;
                if (val < 1) val = 1;
                if (val > 24) val = 24;
                maxInput.value = val;
                maxSlider.value = val;
                this.updateMaxRandomDisplay();
                this.updateRandomPreview();
            });
        }
        
        if (maxUnit) {
            maxUnit.addEventListener('change', () => {
                this.updateMaxRandomDisplay();
                this.updateRandomPreview();
            });
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveRandomSettings());
        }
    }

    /**
     * 更新最小随机时间显示
     */
    updateMinRandomDisplay() {
        const val = document.getElementById('minRandomInput').value;
        const unit = document.getElementById('minRandomUnit').value;
        const display = document.getElementById('minRandomValue');
        
        let unitText = '秒';
        if (unit == 60) unitText = '分钟';
        if (unit == 3600) unitText = '小时';
        
        display.textContent = `${val}${unitText}`;
    }

    /**
     * 更新最大随机时间显示
     */
    updateMaxRandomDisplay() {
        const val = document.getElementById('maxRandomInput').value;
        const unit = document.getElementById('maxRandomUnit').value;
        const display = document.getElementById('maxRandomValue');
        
        let unitText = '秒';
        if (unit == 60) unitText = '分钟';
        if (unit == 3600) unitText = '小时';
        
        display.textContent = `${val}${unitText}`;
    }

    /**
     * 更新随机变化预览
     */
    updateRandomPreview() {
        const minVal = parseInt(document.getElementById('minRandomInput').value) || 2;
        const minUnit = parseInt(document.getElementById('minRandomUnit').value) || 1;
        const maxVal = parseInt(document.getElementById('maxRandomInput').value) || 4;
        const maxUnit = parseInt(document.getElementById('maxRandomUnit').value) || 3600;
        
        const minSeconds = minVal * minUnit;
        const maxSeconds = maxVal * maxUnit;
        
        // 计算每天大概变化次数
        const daySeconds = 24 * 60 * 60;
        const avgSeconds = (minSeconds + maxSeconds) / 2;
        const dailyCount = Math.round(daySeconds / avgSeconds);
        
        const minDisplay = document.getElementById('randomPreviewMin');
        const maxDisplay = document.getElementById('randomPreviewMax');
        const dailyDisplay = document.getElementById('randomPreviewDaily');
        
        if (minDisplay) {
            let unitText = '秒';
            if (minUnit == 60) unitText = '分钟';
            if (minUnit == 3600) unitText = '小时';
            minDisplay.textContent = `${minVal}${unitText}`;
        }
        
        if (maxDisplay) {
            let unitText = '秒';
            if (maxUnit == 60) unitText = '分钟';
            if (maxUnit == 3600) unitText = '小时';
            maxDisplay.textContent = `${maxVal}${unitText}`;
        }
        
        if (dailyDisplay) {
            dailyDisplay.textContent = `${dailyCount-2}-${dailyCount+2}`;
        }
    }

    /**
     * 保存随机变化设置
     */
    saveRandomSettings() {
        const minVal = parseInt(document.getElementById('minRandomInput').value) || 2;
        const minUnit = parseInt(document.getElementById('minRandomUnit').value) || 1;
        const maxVal = parseInt(document.getElementById('maxRandomInput').value) || 4;
        const maxUnit = parseInt(document.getElementById('maxRandomUnit').value) || 3600;
        
        if (!this.appData.randomSettings) {
            this.appData.randomSettings = {};
        }
        
        this.appData.randomSettings = {
            minValue: minVal,
            minUnit: minUnit,
            maxValue: maxVal,
            maxUnit: maxUnit
        };
        
        this.saveAllData();
        this.showNotification('随机变化设置已保存');
        this.restartOtherStatusRandomChanges(); // 重启随机变化定时器
    }

    /**
     * 重启对方状态随机变化定时器
     */
    restartOtherStatusRandomChanges() {
        if (this.appData.otherStatusTimer) {
            clearTimeout(this.appData.otherStatusTimer);
            this.appData.otherStatusTimer = null;
        }
        this.startOtherStatusRandomChanges();
    }

    // ========================
    // 新增对方状态随机变化方法（修改版，使用自定义设置）
    // ========================
    startOtherStatusRandomChanges() {
        // 清除已有的定时器
        if (this.appData.otherStatusTimer) {
            clearTimeout(this.appData.otherStatusTimer);
        }
        
        const scheduleNextChange = () => {
            // 获取自定义设置
            const settings = this.appData.randomSettings || { 
                minValue: 2, minUnit: 1, 
                maxValue: 4, maxUnit: 3600 
            };
            
            // 计算最小和最大延迟（毫秒）
            const minDelay = settings.minValue * settings.minUnit * 1000;
            const maxDelay = settings.maxValue * settings.maxUnit * 1000;
            
            // 随机生成下一次变化的时间
            const nextDelay = minDelay + Math.random() * (maxDelay - minDelay);
            
            this.appData.otherStatusTimer = setTimeout(() => {
                this.randomlyChangeOtherStatus();
                scheduleNextChange(); // 递归调用，实现持续随机变化
            }, nextDelay);
        };
        
        scheduleNextChange();
    }

    // 随机改变对方的位置状态和心情
    randomlyChangeOtherStatus() {
        // 位置状态选项
        const locationOptions = ['在DR', '在CR', '在线', '在忙', '在我身边'];
        
        // 随机选择新的位置
        const newLocation = locationOptions[Math.floor(Math.random() * locationOptions.length)];
        
        // 随机生成新的心情指数（0-100）
        const newMood = Math.floor(Math.random() * 101);
        
        // 更新数据
        if (this.appData.otherInfo) {
            this.appData.otherInfo.status = newLocation;
            this.appData.otherInfo.mood = newMood;
            
            // 更新UI
            this.updateOtherLocationUI(newLocation);
            this.updateOtherMoodUI(newMood);
            
            // 保存数据
            this.saveAllData();
        }
    }

    // 更新对方位置UI
    updateOtherLocationUI(location) {
        const locationEl = document.getElementById('otherLocationText');
        if (locationEl) {
            locationEl.textContent = location;
            // 移除动态颜色设置，让CSS统一控制
        }
    }

    // 更新对方心情UI
    updateOtherMoodUI(mood) {
        const moodEl = document.getElementById('otherMoodValue');
        if (moodEl) {
            moodEl.textContent = mood;
            // 移除动态颜色设置，让CSS统一控制
        }
    }
}

// ========================
// 全局函数：折叠/展开卡片
// ========================
function toggleSection(sectionId) {
    const content = document.getElementById(`content-${sectionId}`);
    const icon = document.getElementById(`icon-${sectionId}`);
    const header = document.querySelector(`#section-${sectionId} .settings-section-header`);
    
    if (content && icon && header) {
        content.classList.toggle('collapsed');
        header.classList.toggle('collapsed');
        icon.textContent = content.classList.contains('collapsed') ? 'expand_more' : 'expand_less';
    }
}

// ========================
// 启动应用
// ========================
document.addEventListener('DOMContentLoaded', () => {
    window.chatApp = new ChatApp();
});
