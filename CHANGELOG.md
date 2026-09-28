# RNOH Autolink 改动记录

## 2026-09-24

### 说明

- 本文只记录本次实际改动和本次实际生成结果。
- 本次修改范围：`integration`
- 本次是否修改三方库源码：是。对齐 HAR 包名与 CMake target，使 example 能消费已有 `harmony.autolinking`。
- 本次是否重打 HAR：否
- 本次自动接入或保留 manual link 的关键信息：example 按 0.84 参考工程接入 autolink。库 HAR 依赖放在 `example/harmony/oh-package.json5`，entry 只保留 `@rnoh/react-native-openharmony`。C++ 侧合并 `createRNOHPackages` 与 `RNOHGeneratedPackage`，ETS 侧合并 `createRNOHPackagesAutolinking`。没有再手动注册 `LewinScreenCapturePackage`。

### 手工修改文件

#### `harmony/lewin_screen_capture/oh-package.json5`

```diff
-  "name": "@react-native-ohos/react-native-lewin-screen-capture",
+  "name": "@react-native-ohos/react-native-lewin-screen-capture",
```

#### `harmony/lewin_screen_capture/src/main/cpp/CMakeLists.txt`

```diff
-add_library(lewin_screen_capture SHARED ${library_SRC} ${library_generated_SRC})
-target_include_directories(lewin_screen_capture PUBLIC
+add_library(rnoh_lewin_screen_capture SHARED ${library_SRC} ${library_generated_SRC})
+target_include_directories(rnoh_lewin_screen_capture PUBLIC
     ${CMAKE_CURRENT_SOURCE_DIR}
     ${library_generated_dir})
-target_link_libraries(lewin_screen_capture PUBLIC rnoh)
+target_link_libraries(rnoh_lewin_screen_capture PUBLIC rnoh)
```

#### `example/package.json`

```diff
- 依赖 react-native 0.72.5、@react-native-oh/react-native-harmony 0.72.139、@react-native-ohos/react-native-lewin-screen-capture
+ 依赖 react-native 0.84.1、@react-native-oh/react-native-harmony 0.84.2、@react-native-ohos/react-native-lewin-screen-capture、@rnoh/testerino
+ 脚本改为 codegen / pack:pkg / install:pkg / dev / prod / postinstall，目录使用 example
```

#### `example/harmony/hvigorfile.ts`

```diff
- 根工程启用 createRNOHModulePlugin
+ export { appTasks } from '@ohos/hvigor-ohos-plugin';
```

#### `example/harmony/entry/hvigorfile.ts`

```diff
- plugins: []
+ createRNOHModulePlugin({ nodeModulesPath: '../node_modules', codegen: null, autolinking: {} })
```

#### `example/harmony/hvigor/hvigor-config.json5`

```diff
- "@rnoh/hvigor-plugin": "file:../../node_modules/@react-native-oh/react-native-harmony-cli/harmony/rnoh-hvigor-plugin-0.3.0.tgz"
+ "@rnoh/hvigor-plugin": "file:../../node_modules/@react-native-oh/react-native-harmony-cli/harmony/rnoh-hvigor-plugin-0.84.2.tgz"
```

#### `example/harmony/oh-package.json5`

```diff
- "@react-native-ohos/react-native-lewin-screen-capture": "file:../node_modules/@react-native-ohos/react-native-lewin-screen-capture/harmony/lewin_screen_capture.har"
- "@rnoh/react-native-openharmony": "file:../node_modules/@react-native-oh/react-native-harmony/react_native_openharmony_release.har"
+ "@react-native-ohos/react-native-lewin-screen-capture": "file:../node_modules/@react-native-ohos/react-native-lewin-screen-capture/harmony/lewin_screen_capture.har"
+ "@rnoh/react-native-openharmony": "file:../node_modules/@react-native-oh/react-native-harmony/react_native_openharmony.har"
```

#### `example/harmony/entry/oh-package.json5`

```diff
- "@react-native-ohos/react-native-lewin-screen-capture": "file:../../node_modules/@react-native-ohos/react-native-lewin-screen-capture/harmony/lewin_screen_capture.har"
- "@rnoh/react-native-openharmony": ".../react_native_openharmony_release.har"
+ "@rnoh/react-native-openharmony": "file:../../node_modules/@react-native-oh/react-native-harmony/react_native_openharmony.har"
```

#### `example/harmony/entry/src/main/cpp/CMakeLists.txt`

```diff
- 0.72 手工 rnoh 目标与 folly include
+ 0.84 宿主 CMake：OH_MODULES_DIR / OH_MODULES / OH_MODULE_DIR、include autolinking.cmake、autolink_libraries(rnoh_app)、target_link_libraries(rnoh_app PUBLIC rnoh)
```

#### `example/harmony/entry/src/main/cpp/PackageProvider.cpp`

```diff
+ #include "generated/RNOHGeneratedPackage.h"
+ ManualLinkingPackage 仅保留 RNOHGeneratedPackage
+ packages = createRNOHPackages(ctx) 后再合并 ManualLinkingPackage
```

#### `example/harmony/entry/src/main/ets/RNPackagesFactory.ets`

```diff
- 保留手动注册注释
+ return [...createRNOHPackagesAutolinking(ctx)]
```

#### `example/harmony/build-profile.template.json5`

```diff
+ 新增模板。modules 包含 entry 与 lewin_screen_capture（srcPath: ../../harmony/lewin_screen_capture）
+ compatibleSdkVersion 为 5.0.0(12)
```

#### `example/harmony/build-profile.json5`

```diff
- 仅 entry 模块，compatibleSdkVersion 5.0.1(13)，targetSdkVersion 6.0.1(21)
+ 与模板结构对齐，并保留原有 signingConfigs
+ 增加 lewin_screen_capture 模块
```

#### `example/src/index.tsx`、`example/index.js`、`example/app.json`

```diff
- example/App.tsx 作为入口，appKey AwesomeProject
+ Testerino 页面覆盖 startListener / stopListener / screenCapture / clearCache
+ app.json name 为 app_name，与 Index.ets appKey 一致
```

### 自动生成文件

本次无自动生成文件。未运行 codegen，也未生成 `autolinking.cmake` 或 `RNOHPackagesFactory.ets`。

### 本次执行结果

#### `codegen`

```text
未执行
原因：本次只对齐 example 工程结构，未安装 0.84 依赖，也未编译 HAP。
```

#### `hvigor`

```text
未执行
原因：未执行 ohpm install 与 HAP 编译。
```

### 当前仍保留的 manual link

- `example/harmony/entry/src/main/cpp/PackageProvider.cpp` 仍手动加入 `RNOHGeneratedPackage`。
- `LewinScreenCapturePackage` 不再手动注册，改由 `createRNOHPackages` 与 `createRNOHPackagesAutolinking` 接入。
- `example/harmony/oh-package.json5` 仍手动声明库 HAR，路径指向安装后的 `node_modules/@react-native-ohos/react-native-lewin-screen-capture/harmony/lewin_screen_capture.har`。

### 尚未完成的验证

- 未执行 `npm i`、`npm run codegen`、`ohpm install`、hvigor 或 HAP 编译。
- 未在设备上验证截屏监听、主动截屏和清缓存。
