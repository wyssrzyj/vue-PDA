# lyz-uni-api-helper

# 插件信息

> repo：[https://gitee.com/dark-bb/uni-api-helper](https://gitee.com/dark-bb/uni-api-helper)

> issue：[https://gitee.com/dark-bb/uni-api-helper/issues](https://gitee.com/dark-bb/uni-api-helper/issues)

***

# 愿景
uniapp的部分api在使用时不是很方便，如在等待showToast之后进行操作，或者设置全局的showToast配置等，基于此原因，故对部分api进行增强，同时也期待大家参与进来共同完善或者提出好的意见和需求场景，我会持续迭代

***

# 使用文档

首先进行导入
```js
import { showToast } from "@/uni_modules/lyz-uni-api-helper";
export default {
  methods: {
    async show() {
      await showToast("lalala1");
      await showToast("lalala2");
      await showToast("lalala3");
      await showToast("lalala4");
    },
  }
};
```

## 设置全局默认配置及默认值
> 可配置项参考[https://uniapp.dcloud.io/api/ui/prompt?id=showtoast](https://uniapp.dcloud.io/api/ui/prompt?id=showtoast)

```js
import { setToastConfig, setLoadingConfig, setModalConfig, setActionSheetConfig } from 'uni_modules/lyz-uni-api-helper'

// 以下配置值即为默认值

setToastConfig({
    duration: 1500,
    icon: "none",
    mask: true,
})

setLoadingConfig({
    mask: true,
})

setModalConfig({
    title: "提示",
})

setActionSheetConfig({

})
```

## showToast 
```showToast(msg: string = "", customConfig?: ToastConfig)```

支持搭配await使用，可用于在提示消息后进行其他操作的场景，例如界面跳转，如下
```js
async handler(){
    await showToast('登录信息已过期');
    uni.navigateTo({
        // ***
    })
}
```
亦可嵌套或者异步其他操作
```js
async handler1() {
  await showToast("lalala1");
  console.log(1);
  await showToast("lalala2");
  console.log(2);
  showToast("lalala3");
  console.log(3);
},
```

## showLoading
```showLoading(msg: string = "", customConfig?: LoadingConfig)```

```js
handler2() {
  // 带消息内容
  showLoading("lalal");
  setTimeout(() => {
    // 不带内容
    showLoading();

    setTimeout(() => {
      uni.hideLoading();
    }, 1000 * 1.5);
  }, 1000 * 2);
},
```

## hideLoading
```hideLoading()```

增加500防抖延迟 可用于请求之后 即使请求速度过快 也能有个缓冲loading 给用户的体验性更好


## showModal
```showModal(content: string = "", customConfig?: ModalConfig)```

主要调整为promise方式的confirm和cancel
```js
async handler3() {
  try {
    await showModal("确定删除吗");
    console.log("确定");
  } catch (error) {
    console.log("取消");
  }
  showModal("还要如何？")
    .then((res) => {
      console.log(`确定了`);
      console.log(res);
    })
    .catch((res) => {
      console.log(`取消了`);
      console.log(res);
    });
},
```

## showActionSheet
```showActionSheet(actions: ActionSheet[] = [], customConfig?: ActionSheetConfig)```

调整为配套command，省去index判断，更符合开发习惯
```js
handler4() {
  showActionSheet([
    {
      label: "showToast",
      command: this.handler1,
    },
    {
      label: "loading",
      command: this.handler2,
    },
    {
      label: "什么也不做🤣",
      command: (index) => {
        console.log(index);
      },
    },
  ]);
},
```