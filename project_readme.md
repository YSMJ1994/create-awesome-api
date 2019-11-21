该项目由 [Create Awesome Api](http://192.168.11.199:9874/-/web/detail/@jinyiao/create-awesome-api)创建.

## 可用的脚本

在项目根目录下，你可以执行：

### `yarn start`

以开发模式启动一个React App，可用于在浏览器环境测试api<br>
在浏览器中打开 `http://${host}:4000` 查看.
其中`host`为拥有登录cookie并指向`127.0.0.1`的域名，如果访问接口无需cookie则使用`localhost`或`127.0.0.1`即可.

该React App启动了热更新.<br>

### `yarn build`

构建该api库，准备发布到NPM服务器上以供使用.

### `yarn build&publish`

构建并发布

### `yarn test`

执行所有测试用例

### `yarn test-single`

执行指定测试用例
