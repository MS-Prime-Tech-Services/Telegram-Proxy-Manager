[app]
title = Telegram Proxy Manager
package.name = telegramproxymanager
package.domain = org.telegramproxy
source.dir = .
source.include_exts = py,png,jpg,kv,atlas,txt,html
version = 1.0

requirements = python3,kivy,urllib3,charset_normalizer

orientation = portrait
osx.python_version = 3
osx.kivy_version = 2.1.0
fullscreen = 0
android.permissions = INTERNET
android.api = 31
android.minapi = 21
android.ndk = 23b
android.sdk = 31
android.arch = arm64-v8a

[buildozer]
log_level = 2
warn_on_root = 1