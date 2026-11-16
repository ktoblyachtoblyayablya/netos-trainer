// SPDX-License-Identifier: GPL-3.0-or-later · Copyright (C) 2026 Пантелеев Г.Д.
/* HTTP и Apache. o — варианты, первый правильный; a — эталоны для ввода. */
Q.push(
  {t:"web-1",q:"Из каких частей состоит главная строка HTTP-запроса?",o:["Метод Ресурс Версия","Версия Код Описание","Хост Порт Путь","Заголовок Тело Подпись"],e:"Например, GET /index.html HTTP/1.1. «Версия Код Описание» — строка ответа.",c:"http"},
  {t:"web-1",q:"Какой метод запрашивает только заголовки документа, без самого документа?",o:["HEAD","GET","POST","PUT"],e:"HEAD удобен, чтобы узнать размер или дату изменения.",c:"http"},
  {t:"web-1",q:"Какой TCP-порт по умолчанию у HTTP?",a:["80"],h:"число",e:"Клиент устанавливает TCP-соединение на порт 80 и отправляет запрос.",c:"ports"},
  {t:"web-1",q:"Введите простейший запрос HTTP/1.0 корневого документа (одна строка).",a:["GET / HTTP/1.0"],h:"строка запроса",e:"Пример из лекции 5. В HTTP/1.1 обязателен ещё заголовок Host."},
  {t:"web-1",q:"Введите главную строку запроса HTTP/1.1 на документ /index.html методом GET.",a:["GET /index.html HTTP/1.1"],h:"строка запроса",e:"Метод, ресурс, версия через пробел."},

  {t:"web-2",q:"Введите имя заголовка ответа с длиной тела в байтах.",a:["Content-Length"],ci:1,h:"имя заголовка",e:"Content-Length: 1234."},
  {t:"web-2",q:"Введите имя заголовка ответа с датой последнего изменения документа.",a:["Last-Modified"],ci:1,h:"имя заголовка",e:"Браузер вернёт эту дату в If-Modified-Since."},
  {t:"web-2",q:"Введите имя заголовка запроса с «кодовым обозначением» браузера.",a:["User-Agent"],ci:1,h:"имя заголовка",e:"Например, Mozilla/5.0 …"},
  {t:"web-2",q:"Введите MIME-тип веб-страницы.",a:["text/html"],ci:1,h:"тип/подтип",e:"Content-Type: text/html; charset=utf-8."},
  {t:"web-2",q:"Введите имя заголовка запроса со списком поддерживаемых браузером типов содержимого.",a:["Accept"],ci:1,h:"имя заголовка",e:"Accept: image/gif, image/jpeg, …"},

  {t:"web-3",q:"Введите код ответа «Не найдено».",a:["404"],h:"число",e:"404 Not Found.",c:"codes"},
  {t:"web-3",q:"Введите код ответа «Перемещено окончательно».",a:["301"],h:"число",e:"301 Moved Permanently, новый адрес — в заголовке Location; 302 — временно."},
  {t:"web-3",q:"Введите код ответа «Всё нормально».",a:["200"],h:"число",e:"200 OK."},
  {t:"web-3",q:"Введите код ответа «Сервис недоступен».",a:["503"],h:"число",e:"503 Service Unavailable."},
  {t:"web-3",q:"Введите код ответа «Метод не поддерживается».",a:["405"],h:"число",e:"405 Method Not Allowed."},
  {t:"web-3",q:"Введите строку ответа сервера с кодом 200 по протоколу HTTP/1.1.",a:["HTTP/1.1 200 OK"],ci:1,h:"строка ответа",e:"Версия, код, описание."},

  {t:"web-4",q:"Введите код ответа «не изменялся».",a:["304"],h:"число",e:"304 Not Modified."},
  {t:"web-4",q:"Введите имя заголовка условного запроса по дате изменения.",a:["If-Modified-Since"],ci:1,h:"имя заголовка",e:"Его значение — Last-Modified из прошлого ответа."},
  {t:"web-4",q:"Введите фильтр отображения Wireshark: показать только ответы HTTP с кодом 304.",a:["http.response.code == 304","http.response.code eq 304"],h:"фильтр",e:"Просто http — весь HTTP-трафик."},

  {t:"web-5",q:"Введите команду: включить сайт site1 (файл sites-available/site1.conf).",a:["a2ensite site1","a2ensite site1.conf"],h:"команда целиком",e:"Затем systemctl reload apache2.",c:"apache"},
  {t:"web-5",q:"Введите команду: включить модуль ssl.",a:["a2enmod ssl"],h:"команда целиком",e:"Пример из лекции 5. Модули — a2enmod, сайты — a2ensite, конфигурации — a2enconf."},
  {t:"web-5",q:"Введите команду: проверить синтаксис конфигурации Apache.",a:["apache2ctl configtest","apache2ctl -t","apachectl configtest","apachectl -t"],h:"команда целиком",e:"Syntax OK — можно перезагружать."},
  {t:"web-5",q:"Введите команду: показать список настроенных виртуальных хостов Apache.",a:["apache2ctl -S","apachectl -S"],h:"команда целиком",e:"Видно, какой хост по умолчанию и какие ServerName на каком порту."},
  {t:"web-5",q:"Введите команду: перечитать конфигурацию Apache без обрыва соединений (systemd).",a:["systemctl reload apache2"],h:"команда целиком",e:"restart — остановка и запуск."},
  {t:"web-5",q:"Введите полный путь к журналу ошибок Apache в Ubuntu.",a:["/var/log/apache2/error.log"],h:"путь",e:"Запросы — access.log в том же каталоге."},
  {t:"web-5",q:"Введите имя пакета веб-сервера Apache в Ubuntu.",a:["apache2"],h:"имя пакета",e:"sudo apt-get install apache2."},

  {t:"web-6",q:"Введите директиву: e-mail администратора сервера admin@ki0000.ru.",a:["ServerAdmin admin@ki0000.ru"],ci:1,h:"директива",e:"По умолчанию webmaster@localhost."},
  {t:"web-6",q:"Введите директиву: имя сайта www.ki0000.ru.",a:["ServerName www.ki0000.ru"],ci:1,h:"директива",e:"Без неё Apache пишет AH00558."},
  {t:"web-6",q:"Введите директиву: файлы сайта лежат в /var/www/site1.",a:["DocumentRoot /var/www/site1","DocumentRoot /var/www/site1/","DocumentRoot \"/var/www/site1\""],ci:1,h:"директива",e:"Каталог надо создать."},
  {t:"web-6",q:"Введите директиву: при ошибке 404 показывать /404.html.",a:["ErrorDocument 404 /404.html"],ci:1,h:"директива",e:"Работает в конфигурации и в .htaccess."},
  {t:"web-6",q:"Введите директиву: слушать порт 8080 на всех адресах.",a:["Listen 8080","Listen *:8080","Listen 0.0.0.0:8080"],ci:1,h:"директива",e:"В Ubuntu Listen — в /etc/apache2/ports.conf."},
  {t:"web-6",q:"Введите директиву: при запросе каталога отдавать index.php, а если его нет — index.html.",a:["DirectoryIndex index.php index.html"],ci:1,h:"директива",e:"Файлы проверяются по порядку."},

  {t:"web-7",q:"Введите первую строку блока виртуального хоста на порту 80 для всех адресов.",a:["<VirtualHost *:80>"],h:"строка конфигурации",e:"Закрывается строкой &lt;/VirtualHost&gt;.",c:"vhost"},
  {t:"web-7",q:"Введите директиву: виртуальный хост отвечает также на все поддомены site1.ki0000.ru.",a:["ServerAlias *.site1.ki0000.ru"],ci:1,h:"директива",e:"ServerAlias — дополнительные имена хоста."},
  {t:"web-7",q:"Введите запись DNS: site1 — псевдоним vm1.",a:["site1 IN CNAME vm1","site1 CNAME vm1","site1 IN CNAME vm1.ki0000.ru.","site1 CNAME vm1.ki0000.ru."],ci:1,h:"запись зоны",e:"После правки зоны — Serial + 1 и rndc reload ki0000.ru."},
  {t:"web-7",q:"Введите команду: отключить сайт по умолчанию 000-default.",a:["a2dissite 000-default","a2dissite 000-default.conf"],h:"команда целиком",e:"Обратная к a2ensite."},

  {t:"web-8",q:"Введите директиву: разрешить .htaccess переопределять всё.",a:["AllowOverride All"],ci:1,h:"директива",e:"По умолчанию в Ubuntu для /var/www/ стоит None."},
  {t:"web-8",q:"Введите директиву .htaccess: запретить листинг каталога.",a:["Options -Indexes"],ci:1,h:"директива",e:"+Indexes — разрешить."},
  {t:"web-8",q:"Введите директиву .htaccess: вид аутентификации — базовая.",a:["AuthType Basic"],ci:1,h:"директива",e:"Плюс AuthName, AuthUserFile, Require."},
  {t:"web-8",q:"Введите директиву .htaccess: пускать только пользователя webuser1.",a:["Require user webuser1"],ci:1,h:"директива",e:"Require valid-user — любого из файла паролей."},
  {t:"web-8",q:"Введите директиву .htaccess: файл паролей /etc/apache2/.htpasswd.",a:["AuthUserFile /etc/apache2/.htpasswd"],ci:1,h:"директива",e:"Файл кладут вне DocumentRoot, чтобы его нельзя было скачать."},
  {t:"web-8",q:"Введите команду: создать файл /etc/apache2/.htpasswd и добавить пользователя webuser1.",a:["htpasswd -c /etc/apache2/.htpasswd webuser1"],h:"команда целиком",e:"-c только при первом создании, иначе файл перезапишется.",c:"htaccess"},
  {t:"web-8",q:"Введите директиву .htaccess: перенаправить /old/ на /php/ навсегда.",a:["Redirect 301 /old/ /php/","Redirect permanent /old/ /php/"],ci:1,h:"директива",e:"Ответ 301 и Location: /php/."},

  {t:"web-9",q:"Введите команду: включить модуль CGI.",a:["a2enmod cgi","a2enmod cgid"],h:"команда целиком",e:"При mpm_prefork — cgi, при mpm_event — cgid; a2enmod выберет сам."},
  {t:"web-9",q:"Введите каталог CGI-скриптов в Ubuntu (полный путь).",a:["/usr/lib/cgi-bin","/usr/lib/cgi-bin/"],h:"путь",e:"Он открыт как /cgi-bin/ через ScriptAlias в serve-cgi-bin.conf."},
  {t:"web-9",q:"Введите первую строку bash-скрипта CGI (интерпретатор).",a:["#!/bin/bash","#!/usr/bin/env bash","#!/bin/sh"],h:"строка",e:"Строка #! говорит ядру, чем запускать файл."},
  {t:"web-9",q:"Введите простейшую PHP-страницу, которая выводит phpinfo (одна строка).",a:["<?php phpinfo(); ?>","<?php phpinfo() ?>","<?php phpinfo();"],h:"код",e:"Если страница скачивается вместо выполнения — не включён mod_php."},

  {t:"web-10",q:"Какой порт у HTTPS?",a:["443"],h:"число",e:"Сайт default-ssl слушает *:443.",c:"ports"},
  {t:"web-10",q:"Введите команду openssl из лекции: самоподписанный сертификат на 30 дней, ключ server.key, сертификат server.pem.",a:["openssl req -new -x509 -days 30 -keyout server.key -out server.pem"],h:"команда целиком",e:"В поле Common Name указывают имя сайта.",c:"ssl"},
  {t:"web-10",q:"Введите команду openssl: снять пароль с ключа server.key.orig и сохранить в server.key.",a:["openssl rsa -in server.key.orig -out server.key"],h:"команда целиком",e:"Иначе Apache будет спрашивать пароль при каждом запуске."},
  {t:"web-10",q:"Введите директиву mod_ssl: включить SSL для виртуального хоста.",a:["SSLEngine on"],ci:1,h:"директива",e:"Плюс SSLCertificateFile и SSLCertificateKeyFile."},
  {t:"web-10",q:"Введите директиву mod_ssl из лекции: разрешить все протоколы, кроме SSLv2.",a:["SSLProtocol all -SSLv2"],ci:1,h:"директива",e:"Сейчас обычно запрещают и SSLv3, TLSv1, TLSv1.1."},
  {t:"web-10",q:"Введите команду: включить сайт default-ssl.",a:["a2ensite default-ssl","a2ensite default-ssl.conf"],h:"команда целиком",e:"Файл /etc/apache2/sites-available/default-ssl.conf."},

  {t:"web-11",q:"Какой сервер в лекции описан как «монолитный процесс, расширение только внешними модулями»?",o:["nginx","Apache","lighttpd","IIS"],e:"Apache — модульный, часто сервер приложений; lighttpd — лёгкий.",f:"L05_p51"},
  {t:"web-11",q:"Введите вторую A-запись для www, указывающую на VM2 (10.200.12.1).",a:["www IN A 10.200.12.1","www A 10.200.12.1"],ci:1,h:"запись зоны",e:"Первая — www IN A 10.200.12.2. CNAME так не сделать: у имени с CNAME не может быть других записей."},
  {t:"web-11",q:"Введите команду dig: только адреса www.ki0000.ru от сервера 10.200.12.2, без подробностей.",a:["dig @10.200.12.2 www.ki0000.ru +short","dig www.ki0000.ru @10.200.12.2 +short","dig +short @10.200.12.2 www.ki0000.ru","dig +short www.ki0000.ru @10.200.12.2"],h:"команда целиком",e:"Повторите несколько раз — порядок адресов меняется."}
);
