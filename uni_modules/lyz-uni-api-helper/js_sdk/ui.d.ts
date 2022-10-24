import { ActionSheet, ActionSheetConfig, LoadingConfig, ModalConfig, ToastConfig } from "./typings";
/**
 * 设置全局toast默认参数
 * @param setConfig
 */
export declare function setToastConfig(setConfig: ToastConfig): void;
/**
 * 显示消息提示框
 * @param msg 消息
 * @param customConfig 自定义配置
 * @returns
 */
export declare function showToast(msg?: string, customConfig?: ToastConfig): Promise<unknown>;
/**
 * 设置全局loading默认参数
 * @param setConfig
 */
export declare function setLoadingConfig(setConfig: LoadingConfig): void;
/**
 * 显示 loading 提示框, 需主动调用 uni.hideLoading 才能关闭提示框
 * @param msg 消息文字
 * @param customConfig 自定义配置
 * @returns
 */
export declare function showLoading(msg?: string, customConfig?: LoadingConfig): void;
/**
 * 隐藏loading，自带500ms防抖延迟
 */
export declare function hideLoading(): void;
/**
 * 设置全局modal配置
 * @param setConfig
 */
export declare function setModalConfig(setConfig: ModalConfig): void;
/**
 * 显示模态弹窗，可以只有一个确定按钮，也可以同时有确定和取消按钮
 * @param content 提示消息
 * @param customConfig 自定义配置
 * @returns
 */
export declare function showModal(content?: string, customConfig?: ModalConfig): Promise<unknown>;
/**
 * 设置全局actionSheet配置
 * @param setConfig
 */
export declare function setActionSheetConfig(setConfig: ActionSheetConfig): void;
/**
 * 从底部向上弹出操作菜单
 * @param actions 操作菜单数组
 * @param customConfig 自定义配置
 * @returns
 */
export declare function showActionSheet(actions?: ActionSheet[], customConfig?: ActionSheetConfig): void;
