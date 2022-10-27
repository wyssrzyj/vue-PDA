declare type BaseConfig = {
    success?: Function;
    fail?: Function;
    complete?: Function;
};
export declare type Configs = ToastConfig | LoadingConfig;
export declare type ToastConfig = BaseConfig & {
    /**
     * 提示的延迟时间，单位毫秒，默认：1500
     */
    duration?: number;
    /**
     * 图标，默认值none
     */
    icon?: "success" | "loading" | "none";
    /**
     * 自定义图标的本地路径
     */
    image?: string;
    /**
     * 是否显示透明蒙层，防止触摸穿透，默认：true
     */
    mask?: boolean;
    /**
     * 纯文本轻提示显示位置，填写有效值后只有 title 属性生效， 有效值详见下方说明。
     */
    position?: "top" | "center" | "bottom";
};
export declare type LoadingConfig = BaseConfig & {
    /**
     * 是否显示透明蒙层，防止触摸穿透，默认：true
     */
    mask?: boolean;
};
export declare type ModalConfig = BaseConfig & {
    /**
     * 提示的标题
     */
    title?: string;
    /**
     * 是否显示取消按钮，默认为 true
     */
    showCancel?: boolean;
    /**
     * 	取消按钮的文字，默认为"取消"，最多 4 个字符
     */
    cancelText?: string;
    /**
     * 取消按钮的文字颜色，默认为"#000000"
     */
    cancelColor?: string;
    /**
     * 确定按钮的文字，默认为"确定"，最多 4 个字符
     */
    confirmText?: string;
    /**
     * 确定按钮的文字颜色，H5平台默认为"#007aff"，微信小程序平台默认为"#3CC51F"，百度小程序平台默认为"#3c76ff"
     */
    confirmColor?: string;
};
export declare type ActionSheet = {
    label: string;
    command: (index?: number) => unknown;
};
export declare type ActionSheetConfig = BaseConfig & {
    itemColor?: string;
    popover?: {
        top: number;
        left: number;
        width: number;
        height: number;
    };
};
export {};
