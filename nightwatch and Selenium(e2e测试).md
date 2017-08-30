## 初步了解e2e测试

### 步骤

+ 安装nightwatch

+ 安装selenium-standalone

+ 配置nightwatch

整体分为三部分内容: 基础配置, selenium的配置,具体测试的配置

1. nightwatch.json(基础配置文件)

```
{
  "default_browser": "phantomjs",
  "src_folders" : ["tests"],
  "output_folder" : "reports",
  "custom_commands_path" : "",
  "custom_assertions_path" : "",
  "page_objects_path" : "",
  "globals_path" : "",

  "selenium" : {
    "start_process" : true,
    "server_path" : "",
    "log_path" : "",
    "host" : "127.0.0.1",
    "port" : 4444,
    "cli_args" : {
      "webdriver.chrome.driver" : "",
      "webdriver.ie.driver" : ""
    }
  },

  "test_settings" : {
    "default" : {
      "launch_url" : "http://localhost",
      "selenium_port"  : 4444,
      "selenium_host"  : "localhost",
      "silent": true,
      "screenshots" : {
        "enabled" : false,
        "path" : ""
      },

      "desiredCapabilities": {
        "browserName": "",
        "javascriptEnabled": true,
        "acceptSslCerts": true,
        "phantomjs.binary.path" : ""
      }
    },

    "chrome" : {
      "desiredCapabilities": {
        "browserName": "chrome",
        "javascriptEnabled": true,
        "acceptSslCerts": true
      }
    }
  }
}
```

2. nightwatch.conf.js(动态配置)

