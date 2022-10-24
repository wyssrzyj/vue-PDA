import { debounce } from 'lodash';

/**
 * 默认toast配置
 */
let defaultToastConfig = {
    duration: 1500,
    icon: "none",
    mask: true,
    success: () => { },
    fail: () => { },
    complete: () => { },
};
/**
 * 防抖时间
 */
const shakeTiming = 200;
/**
 * 设置全局toast默认参数
 * @param setConfig
 */
function setToastConfig(setConfig) {
    defaultToastConfig = generateConfig(defaultToastConfig, setConfig);
}
/**
 * 显示消息提示框
 * @param msg 消息
 * @param customConfig 自定义配置
 * @returns
 */
function showToast(msg = "", customConfig) {
    uni.hideToast();
    const config = generateConfig(defaultToastConfig, customConfig);
    return new Promise((rs, rj) => {
        uni.showToast(Object.assign(Object.assign({}, config), { title: msg, success: () => {
                config.success();
            }, fail: function () {
                config.fail();
                rj();
            }, complete: function () {
                config.complete();
            } }));
        setTimeout(() => {
            rs(null);
        }, config.duration + shakeTiming);
    });
}
/**
 * 默认loading配置
 */
let defaultLoadingConfig = {
    mask: true,
    success: () => { },
    fail: () => { },
    complete: () => { },
};
/**
 * 设置全局loading默认参数
 * @param setConfig
 */
function setLoadingConfig(setConfig) {
    defaultLoadingConfig = generateConfig(defaultLoadingConfig, setConfig);
}
/**
 * 显示 loading 提示框, 需主动调用 uni.hideLoading 才能关闭提示框
 * @param msg 消息文字
 * @param customConfig 自定义配置
 * @returns
 */
function showLoading(msg = "", customConfig) {
    const config = generateConfig(defaultLoadingConfig, customConfig);
    return uni.showLoading(Object.assign(Object.assign({}, config), { title: msg, success: () => {
            config.success();
        }, fail: () => {
            config.fail();
        }, complete: () => {
            config.complete();
        } }));
}
const hideUniLoading = debounce(uni.hideLoading, 500);
/**
 * 隐藏loading，自带500ms防抖延迟
 */
function hideLoading() {
    return hideUniLoading();
}
/**
 * 默认modal配置
 */
let defaultModalConfig = {
    title: "提示",
    success: () => { },
    fail: () => { },
    complete: () => { },
};
/**
 * 设置全局modal配置
 * @param setConfig
 */
function setModalConfig(setConfig) {
    defaultModalConfig = generateConfig(defaultModalConfig, setConfig);
}
/**
 * 显示模态弹窗，可以只有一个确定按钮，也可以同时有确定和取消按钮
 * @param content 提示消息
 * @param customConfig 自定义配置
 * @returns
 */
function showModal(content = "", customConfig) {
    const config = generateConfig(defaultModalConfig, customConfig);
    const { title, showCancel, cancelText, cancelColor, confirmText, confirmColor, } = config;
    return new Promise((rs, rj) => {
        uni.showModal({
            title,
            showCancel,
            cancelText,
            cancelColor,
            confirmText,
            confirmColor,
            content,
            success: (res) => {
                config.success();
                if (res.confirm)
                    rs(true);
                else if (res.cancel)
                    rj(false);
            },
            fail: () => {
                config.fail();
                rj(false);
            },
            complete: () => {
                config.complete();
            },
        });
    });
}
/**
 * 默认actionSheet配置
 */
let defaultActionSheetConfig = {
    success: () => { },
    fail: () => { },
    complete: () => { },
};
/**
 * 设置全局actionSheet配置
 * @param setConfig
 */
function setActionSheetConfig(setConfig) {
    defaultActionSheetConfig = generateConfig(defaultActionSheetConfig, setConfig);
}
/**
 * 从底部向上弹出操作菜单
 * @param actions 操作菜单数组
 * @param customConfig 自定义配置
 * @returns
 */
function showActionSheet(actions = [], customConfig) {
    const config = generateConfig(defaultActionSheetConfig, customConfig);
    const itemList = actions.map((i) => i.label);
    const { itemColor, popover } = config;
    return uni.showActionSheet({
        itemList,
        itemColor,
        // @ts-ignore
        popover,
        success: ({ tapIndex }) => {
            actions[tapIndex].command(tapIndex);
        },
        fail: () => {
            config.fail();
        },
        complete: () => {
            config.complete();
        },
    });
}
/**
 * 构造配置
 * @param customConfig 自定义配置
 * @returns
 */
function generateConfig(defaultConfig, customConfig) {
    const config = Object.assign(Object.assign({}, defaultConfig), customConfig);
    return config;
}

export { hideLoading, setActionSheetConfig, setLoadingConfig, setModalConfig, setToastConfig, showActionSheet, showLoading, showModal, showToast };
