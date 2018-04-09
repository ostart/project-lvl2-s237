# project-lvl2-s237

[![Maintainability](https://api.codeclimate.com/v1/badges/a277901f7b91d0cc54cb/maintainability)](https://codeclimate.com/github/ostart/project-lvl2-s237/maintainability)

[![Test Coverage](https://api.codeclimate.com/v1/badges/a277901f7b91d0cc54cb/test_coverage)](https://codeclimate.com/github/ostart/project-lvl2-s237/test_coverage)

[![Build Status](https://travis-ci.org/ostart/project-lvl2-s237.svg?branch=master)](https://travis-ci.org/ostart/project-lvl2-s237)

# Вычислитель отличий (Второй проект на Hexlet.io)

В рамках данного проекта реализована утилита командной строки для поиска отличий в конфигурационных файлах.

Возможности утилиты:

Поддержка разных форматов: json, yaml, ini
Генерация отчета в виде plain text, pretty и json

Пример использования:
```
$ gendiff --format plain first-config.ini second-config.ini
Setting "common.setting2" deleted.
Setting "common.setting4" added with value "blah blah".
Setting "group1.baz" changed from "bas" to "bars".
Section "group2" deleted.
```
## Install

`npm install -g gendiff-ostart-js`

## Usage

```
Usage: gendiff [options] <firstConfig> <secondConfig>

Compares two configuration files and shows a difference.

Options:

-V, --version        output the version number
-f, --format [type]  Output format [tree (default), plain, json]
-h, --help           output usage information
```
