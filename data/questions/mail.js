// SPDX-License-Identifier: GPL-3.0-or-later · Copyright (C) 2026 Пантелеев Г.Д.
/* Электронная почта. o — варианты, первый правильный; a — эталоны для ввода. */
Q.push(
  {t:"mail-1",q:"Что делает MTA?",o:["пересылает письма между почтовыми серверами","показывает письма пользователю и отправляет новые","раскладывает письма по ящикам и отдаёт по POP3 и IMAP","разрешает имена"],e:"Mail Transfer Agent: Postfix, Sendmail, Exim.",f:"L06_p03",c:"mailroles"},
  {t:"mail-1",q:"Как называется агент передачи почты (аббревиатура латиницей)?",a:["MTA"],ci:1,h:"аббревиатура",e:"Mail Transfer Agent."},
  {t:"mail-1",q:"Как называется почтовый клиент пользователя (аббревиатура латиницей)?",a:["MUA"],ci:1,h:"аббревиатура",e:"Mail User Agent."},

  {t:"mail-2",q:"Какой протокол используется для передачи почты между серверами?",o:["SMTP","IMAP","POP3","SNMP"],e:"Simple Mail Transfer Protocol, порт 25.",f:"L06_p10"},
  {t:"mail-2",q:"Какой TCP-порт у SMTP?",a:["25"],h:"число",e:"Клиент MUA тоже отправляет почту по SMTP на 25 (или 587 с авторизацией).",c:"ports"},
  {t:"mail-2",q:"Какой TCP-порт у POP3?",a:["110"],h:"число",e:"POP3S — 995.",c:"ports"},
  {t:"mail-2",q:"Какой TCP-порт у IMAP?",a:["143"],h:"число",e:"IMAPS — 993.",c:"ports"},
  {t:"mail-2",q:"Какая версия протокола POP сейчас используется (цифрой)?",a:["3"],h:"число",e:"Отсюда название POP3."},

  {t:"mail-3",q:"Введите запись зоны: почта для vm3 идёт на vm2.ki0000.ru с приоритетом 10.",a:["vm3 IN MX 10 vm2.ki0000.ru.","vm3 MX 10 vm2.ki0000.ru.","vm3 IN MX 10 vm2","vm3 MX 10 vm2"],ci:1,h:"запись зоны",e:"Имя сервера в MX — с точкой на конце или относительное.",c:"dnsrr"},
  {t:"mail-3",q:"Введите команду dig: MX-запись vm2.ki0000.ru (без указания сервера).",a:["dig vm2.ki0000.ru MX","dig MX vm2.ki0000.ru","dig -t MX vm2.ki0000.ru"],ci:1,h:"команда целиком",e:"В отчёте показывают, что VM1 нашла сервер получателя по MX."},
  {t:"mail-3",q:"Какой символ отделяет имя пользователя от домена в адресе электронной почты?",a:["@"],h:"символ",e:"имя@[хост.]поддомен.домен_первого_уровня."},

  {t:"mail-4",q:"Введите первую команду SMTP-сеанса из лекции (приветствие, имя localhost).",a:["HELO localhost","EHLO localhost"],ci:1,h:"команда SMTP",e:"EHLO — расширенное приветствие ESMTP."},
  {t:"mail-4",q:"Введите команду SMTP: получатель usr2.",a:["RCPT TO:usr2","RCPT TO:<usr2>","RCPT TO: usr2"],ci:1,h:"команда SMTP",e:"Сервер отвечает 250 &lt;user&gt;... Recipient ok."},
  {t:"mail-4",q:"Введите команду SMTP: отправитель user@localhost.",a:["MAIL FROM:user@localhost","MAIL FROM:<user@localhost>","MAIL FROM: user@localhost"],ci:1,h:"команда SMTP",e:"250 … Sender ok."},
  {t:"mail-4",q:"Введите команду SMTP завершения сеанса.",a:["QUIT"],ci:1,h:"команда SMTP",e:"Сервер отвечает 221 … closing connection."},
  {t:"mail-4",q:"Введите команду: подключиться к SMTP-серверу 10.200.12.2 утилитой telnet.",a:["telnet 10.200.12.2 25"],h:"команда целиком",e:"Так проверяют SMTP вручную."},
  {t:"mail-4",q:"Введите команду: отправить письмо с темой test пользователю usr2@vm1.ki0000.ru, текст берётся из конвейера (утилита mail).",a:["mail -s test usr2@vm1.ki0000.ru","mail -s \"test\" usr2@vm1.ki0000.ru"],h:"команда целиком",e:"Полностью: echo \"текст\" | mail -s test usr2@vm1.ki0000.ru (пакет mailutils)."},

  {t:"mail-5",q:"Что отделяет заголовки письма от тела?",o:["пустая строка","строка из точки","заголовок Body:","двойная точка с запятой"],e:"Как и в HTTP."},
  {t:"mail-5",q:"Как называется заголовок с уникальным идентификатором письма?",a:["Message-Id"],ci:1,h:"имя заголовка",e:"Message-Id: &lt;…@gmail.com&gt;."},
  {t:"mail-5",q:"Как называется заголовок, который каждый почтовый сервер добавляет при передаче письма?",a:["Received"],ci:1,h:"имя заголовка",e:"В нём «from … by … with ESMTP id … for …; дата»."},

  {t:"mail-6",q:"Введите полный путь к главному файлу конфигурации Postfix.",a:["/etc/postfix/main.cf"],h:"путь",e:"Службы и порты — master.cf.",c:"postfix"},
  {t:"mail-6",q:"Введите строку main.cf: разрешить релей с localhost и сети 10.200.12.0/24.",a:["mynetworks = 127.0.0.0/8 10.200.12.0/24"],h:"параметр",e:"Пробелы вокруг = не важны."},
  {t:"mail-6",q:"Введите строку main.cf: имя хоста vm1.ki0000.ru.",a:["myhostname = vm1.ki0000.ru"],h:"параметр",e:"FQDN сервера."},
  {t:"mail-6",q:"Введите команду postconf: задать mydomain = ki0000.ru сразу в main.cf.",a:["postconf -e \"mydomain = ki0000.ru\"","postconf -e mydomain=ki0000.ru"],h:"команда целиком",e:"-e редактирует main.cf, без -e — только показывает."},
  {t:"mail-6",q:"Введите команду: показать только изменённые (нестандартные) параметры Postfix.",a:["postconf -n"],h:"команда целиком",e:"Удобно вставить в отчёт."},
  {t:"mail-6",q:"Введите команду systemd: перечитать конфигурацию Postfix.",a:["systemctl reload postfix","postfix reload"],h:"команда целиком",e:"В лекции — /etc/init.d/postfix reload."},
  {t:"mail-6",q:"Введите полный путь к журналу почты в Ubuntu.",a:["/var/log/mail.log"],h:"путь",e:"to=…, relay=…, status=sent/deferred/bounced."},

  {t:"mail-7",q:"Введите строку /etc/aliases: письма для usr2 пересылать на usr3@vm2.ki0000.ru.",a:["usr2: usr3@vm2.ki0000.ru"],h:"строка",e:"Формат: имя: адрес[, адрес…]."},
  {t:"mail-7",q:"Введите команду: пересобрать базу псевдонимов.",a:["newaliases","postalias /etc/aliases"],h:"команда целиком",e:"Без неё правка /etc/aliases не действует."},
  {t:"mail-7",q:"Введите команду: показать очередь почты Postfix.",a:["mailq","postqueue -p"],h:"команда целиком",e:"Письма со status=deferred висят в очереди."},
  {t:"mail-7",q:"Введите команду Postfix: попытаться отправить всю очередь сейчас.",a:["postqueue -f","postfix flush"],h:"команда целиком",e:"Полезно после исправления DNS."},

  {t:"mail-8",q:"Введите строку 10-auth.conf: разрешить пароль без шифрования.",a:["disable_plaintext_auth = no"],h:"параметр",e:"Только для учебного стенда."},
  {t:"mail-8",q:"Введите строку 10-mail.conf: ящик mbox во /var/mail, папки в ~/mail.",a:["mail_location = mbox:~/mail:INBOX=/var/mail/%u"],h:"параметр",e:"%u — имя пользователя. Postfix по умолчанию кладёт письма в /var/mail/&lt;user&gt;."},
  {t:"mail-8",q:"Введите имена двух пакетов Dovecot для IMAP и POP3 через пробел.",a:["dovecot-imapd dovecot-pop3d","dovecot-pop3d dovecot-imapd"],h:"пакеты",e:"sudo apt install dovecot-imapd dovecot-pop3d."},
  {t:"mail-8",q:"Введите номер порта IMAPS (IMAP поверх TLS).",a:["993"],h:"число",e:"POP3S — 995."}
);
