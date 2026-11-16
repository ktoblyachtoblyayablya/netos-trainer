// SPDX-License-Identifier: GPL-3.0-or-later · Copyright (C) 2026 Пантелеев Г.Д.
/* Билеты: электронная почта (лекция 6, лабораторная 5). */
Object.assign(A, {
"mail-1": `
<p>Почта передаётся между узлами программами пересылки — <b>MTA</b> (Mail Transfer Agent). Они пересылают сообщения пользователям той же или удалённых систем и маршрутизируют их всеми доступными средствами. <b>MDA</b> (Mail Delivery Agent) работает в почтовой системе и доставляет письма в ящики пользователей. <b>MUA</b> (Mail User Agent) — программа, через которую пользователь получает доступ к почте.</p>
${F("L06_p03")}
${CARD("mailroles")}`,

"mail-2": `
${tbl(["Протокол","Суть"],[["UUCP","UNIX-to-UNIX CoPy: копирование между UNIX-хостами по модемам и телефонным линиям; вытеснен сетевыми протоколами"],["SMTP","Simple Mail Transfer Protocol: передача почты между хостами интернета, текстовые команды, порт 25"],["POP3","Post Office Protocol v3: клиент загружает каждое сообщение со своего ящика на сервере к себе"],["IMAP","Interactive Mail Access Protocol: папки и письма хранятся на сервере, доступ с любой станции к одним и тем же ящикам"]])}
${F2("L06_p10","","L06_p14","")}`,

"mail-3": `
<p>Адрес: <b>имя@[хост.]поддомен.домен_первого_уровня</b>, где имя — пользователь на принимающем компьютере, а после @ — доменное имя компьютера (домена).</p>
<p><b>MX-запись</b> сообщает удалённым серверам, куда отправлять почту для зоны: <b>name MX preference host</b>. name — имя зоны (если опущено — из SOA), preference — приоритет (меньше — раньше), host — имя почтового сервера.</p>
${CODE("sfu-kras.ru.  3600 IN MX 10 mx1.sfu-kras.ru.\n; стенд\nvm1  IN MX 10 vm1.ki0000.ru.\nvm2  IN MX 10 vm2.ki0000.ru.\nvm3  IN MX 10 vm2.ki0000.ru.   ; почта для vm3 идёт на VM2")}
${N("MX указывает на имя с A-записью, а не на CNAME и не на IP-адрес.")}`,

"mail-4": `
<p>SMTP работает в текстовом режиме: к порту 25 можно подключиться telnet и отправить письмо командами вручную.</p>
${CARD("smtp")}
${CODE("$ telnet localhost 25\n220 mail.small.org ESMTP Sendmail\nHELO localhost\n250 mail.small.org Hello localhost[127.0.0.1], pleased to meet you\nMAIL FROM:user@localhost\n250 <user@localhost>... Sender ok\nRCPT TO:user\n250 <user>... Recipient ok\nDATA\n354 Enter mail, end with \".\" on a line by itself\nThis is a short mail message.\n.\n250 QAA01619 Message accepted for delivery\nQUIT\n221 mail.small.org closing connection")}`,

"mail-5": `
<p>Сообщение = заголовки + пустая строка + тело. Каждый сервер на пути добавляет сверху строку <b>Received</b>, поэтому путь письма читается снизу вверх.</p>
${tbl(["Заголовок","Смысл"],[["Return-path","адрес для возврата"],["Received","через какие серверы прошло письмо и когда"],["From / To / Subject / Date","отправитель, получатель, тема, дата"],["Message-Id","уникальный идентификатор"],["Content-Type","MIME-тип; multipart — несколько частей"],["DKIM-Signature","подпись домена отправителя"],["X-…","нестандартные (спам-фильтры, антивирусы)"]])}
${N("Двоичные данные: DATA принимает только текст ASCII, поэтому клиент перекодирует вложения в текст (MIME, base64), а программа получателя декодирует их обратно.")}`,

"mail-6": `
<p><b>Postfix</b> — свободный MTA, который маршрутизирует и доставляет почту. Перед установкой у сервера должно быть полное доменное имя (FQDN).</p>
${CODE("sudo apt install postfix        # тип установки: Internet Site, имя — почтовый домен\nsudo postconf -e 'myhostname = vm1.ki0000.ru' 'mynetworks = 127.0.0.0/8 10.200.12.0/24'\npostconf -n\nsudo systemctl reload postfix   # (в лекции: /etc/init.d/postfix reload)")}
${CARD("postfix")}
${N("mynetworks шире нужного превращает сервер в открытый релей — его используют для рассылки спама.")}`,

"mail-7": `
<p>Таблица псевдонимов <b>/etc/aliases</b> переадресует почту локального получателя на другой адрес. После правки обязательно <b>newaliases</b> — пересобирает базу aliases.db.</p>
${CODE("# /etc/aliases на VM1\nusr2: usr3@vm2.ki0000.ru\n\nsudo newaliases\nsudo tail -f /var/log/mail.log    # to=<usr3@vm2…>, orig_to=<usr2@vm1…>\nmailq                             # очередь\nsudo postqueue -f                 # отправить очередь сейчас")}
${F("sv_mail")}`,

"mail-8": `
<p><b>Dovecot</b> — почтовый офис: сервер IMAP и POP3. Он не принимает почту по SMTP, а только выдаёт клиентам то, что доставил MDA.</p>
${CARD("dovecot")}
${CODE("sudo apt install dovecot-imapd dovecot-pop3d\n# /etc/dovecot/conf.d/10-auth.conf\ndisable_plaintext_auth = no\nauth_mechanisms = plain login\nsudo systemctl restart dovecot")}
${N("Thunderbird без SSL: защита соединения «Нет», аутентификация «Обычный пароль», логин — имя пользователя Linux.")}`
});
