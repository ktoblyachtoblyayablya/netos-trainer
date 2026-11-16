// SPDX-License-Identifier: GPL-3.0-or-later · Copyright (C) 2026 Пантелеев Г.Д.
/* Шпаргалки: показываются после ответа (поле c у вопроса) и на вкладке «Схемы и шпаргалки».
   Хелперы card/tbl/chain/seq/bits/note — в js/helpers.js. Знаки < > в тексте пишутся как &lt; &gt;. */

/* ---------- Linux ---------- */
C.dirs = card("Основные каталоги Linux",
  tbl(["Каталог","Что хранит"],[["/etc","конфигурация и скрипты настройки служб"],["/usr","файлы приложений пользователя и его служб"],["/var","изменяемые и временные данные служб"],["/var/log","протоколы (журналы) работы"],["/home/&lt;user&gt;","домашний каталог пользователя"],["/proc","виртуальная ФС: доступ к процессам и ядру"],["/dev","специальные файлы устройств"],["/var/cache/bind","рабочий каталог bind9 (статистика, дампы, slave-зоны)"],["/var/www","файлы веб-сайтов Apache"],["/var/mail","почтовые ящики mbox"]]));

C.perm = card("Права доступа",
  tbl(["Запись","Значение"],[["r = 4","чтение файла; для каталога — список имён"],["w = 2","изменение файла; создание/удаление в каталоге"],["x = 1","запуск файла; вход в каталог (cd) и доступ к атрибутам"],["755","rwxr-xr-x — владелец всё, остальные чтение и вход"],["644","rw-r--r-- — обычный файл"],["700","rwx------ — только владелец"],["777","всем всё (публичная папка)"]]),
  note("Три группы: владелец (u), группа (g), остальные (o). chmod 755 file · chmod u+x file · chown user:group dir · ls -la dir."));

C.proc = card("Процессы и сигналы",
  tbl(["Команда","Что делает"],[["ps ax","список всех процессов"],["ps ax | grep httpd","найти процессы по имени"],["pidof named","PID процесса по имени"],["kill PID","послать SIGTERM (15) — попросить завершиться"],["kill -9 PID","SIGKILL — убить без возможности перехватить"],["kill -HUP PID","SIGHUP (1) — многие демоны перечитывают конфиг"]]),
  note("Процесс наследует права владельца; у консольного процесса есть stdin, stdout, stderr."));

C.svc = card("Управление службами",
  tbl(["Способ","Пример"],[["systemd","systemctl start|stop|restart|reload|status named"],["автозапуск","systemctl enable --now apache2"],["журнал","journalctl -u isc-dhcp-server -f"],["SysV-скрипт","/etc/init.d/bind9 restart"],["обёртка service","service smbd restart"]]),
  note("Загрузка: загрузчик grub → ядро → init (systemd) → службы → окружение пользователя. В System V сценарии лежат в /etc/rcN.d, где N — уровень запуска."));

C.ports = card("Порты сетевых служб",
  tbl(["Порт","Служба"],[["22/tcp","SSH"],["25/tcp","SMTP"],["53/udp+tcp","DNS (tcp — трансфер зоны и большие ответы)"],["67/udp, 68/udp","DHCP сервер / клиент"],["80/tcp, 443/tcp","HTTP / HTTPS"],["110/tcp, 143/tcp","POP3 / IMAP"],["137/udp, 138/udp, 139/tcp","NetBIOS: имена, дейтаграммы, сеансы"],["445/tcp","SMB напрямую поверх TCP"],["161/udp, 162/udp","SNMP агент / приём trap"],["546/udp, 547/udp","DHCPv6 клиент / сервер"],["953/tcp","rndc (управление bind)"],["2049","NFS"]]));

C.diag = card("Диагностика",
  tbl(["Команда","Зачем"],[["ss -tulnp","слушающие TCP/UDP-сокеты с процессами"],["netstat -tunl","то же старой утилитой"],["ss -an","все сокеты, включая установленные"],["tcpdump -n -i ens33 port 67","перехват DHCP на интерфейсе"],["tcpdump -n -i any -w f.pcap","записать всё в файл для Wireshark"],["tcpdump -e","показывать MAC-адреса"],["ping -c3 10.200.12.1","проверить доступность"],["traceroute 10.200.12.66","маршрут по хопам"]]),
  note("tcpdump: -n — не преобразовывать адреса в имена, -i — интерфейс (any — все), -e — заголовки Ethernet, -v/-vv — подробности."));

C.subnet = card("Маски и подсети",
  tbl(["Префикс","Маска","Адресов","Узлов"],[["/24","255.255.255.0","256","254"],["/25","255.255.255.128","128","126"],["/26","255.255.255.192","64","62"],["/27","255.255.255.224","32","30"],["/28","255.255.255.240","16","14"],["/30","255.255.255.252","4","2"]]),
  note("Узлов = 2^(32−префикс) − 2: первый адрес — адрес сети, последний — broadcast. Вариант 10.200.12.0/24: N1 = .0/26 (шлюз .1, broadcast .63), N2 = .64/26 (шлюз .65, broadcast .127)."));

C.apt = card("Пакеты и пользователи",
  tbl(["Команда","Что делает"],[["apt update","обновить списки пакетов"],["apt install bind9","установить пакет"],["apt-cdrom add","добавить диск как источник (лекция 2)"],["dpkg-reconfigure postfix","повторить вопросы установки пакета"],["adduser usr1","создать пользователя с домашним каталогом и паролем"],["useradd -M -s /usr/sbin/nologin sread","пользователь без дома и без входа"],["passwd usr1","сменить пароль"],["sudo -u www-data cmd","выполнить от имени другого пользователя"]]),
  note("Источники пакетов — /etc/apt/sources.list."));

/* ---------- DHCP ---------- */
C.netcfg = card("Настройка интерфейса",
  tbl(["Где","Как"],[["/etc/network/interfaces (Debian)","iface eth0 inet static / address / netmask / gateway / dns-nameservers; auto eth0"],["динамически","iface eth0 inet dhcp"],["netplan (Ubuntu)","/etc/netplan/*.yaml → sudo netplan apply"],["временно","ip addr add 192.168.0.77/24 dev eth0"],["просмотр","ip a · ip link · ip route · ifconfig -a"],["RedHat/CentOS","/etc/sysconfig/network-scripts/"]]),
  note("Служба networking читает конфигурацию, поднимает интерфейсы и при необходимости запрашивает адрес по DHCP/BOOTP."));

C.dora = card("DHCP: обмен DORA",
  seq("Клиент :68","Сервер :67",[[">","DHCPDISCOVER","broadcast, src 0.0.0.0"],["<","DHCPOFFER","предложение адреса (yiaddr) и опций"],[">","DHCPREQUEST","выбор сервера (опция 54) и адреса (50)"],["<","DHCPACK","аренда подтверждена"]]),
  tbl(["Сообщение","Когда"],[["DHCPNAK","сервер: параметры клиента не подходят"],["DHCPDECLINE","клиент: адрес уже занят"],["DHCPRELEASE","клиент досрочно освобождает адрес"],["DHCPINFORM","клиент с адресом просит только параметры"]]),
  note("Продление: при T1 = ½ аренды клиент шлёт REQUEST серверу напрямую (unicast). Максимальный срок аренды — 2³² секунд."));

C.dhcpconf = card("isc-dhcp-server",
  tbl(["Файл / директива","Назначение"],[["/etc/default/isc-dhcp-server","INTERFACESv4=\"ens33\" — где слушать"],["/etc/dhcp/dhcpd.conf","параметры сервера"],["subnet … netmask … { }","объявление сети"],["range A B;","пул динамических адресов"],["option routers","шлюз по умолчанию"],["option domain-name-servers","DNS-серверы"],["option netbios-name-servers","WINS-серверы"],["default-lease-time / max-lease-time","срок аренды, с"],["host X { hardware ethernet; fixed-address; }","постоянный адрес по MAC"],["/var/lib/dhcp/dhcpd.leases","выданные аренды"]]),
  note("Проверка: dhcpd -t -cf /etc/dhcp/dhcpd.conf · systemctl status isc-dhcp-server · journalctl -u isc-dhcp-server · ss -ulnp | grep 67."));

C.relay = card("DHCP relay",
  tbl(["Что","Значение"],[["пакет","isc-dhcp-relay"],["файл","/etc/default/isc-dhcp-relay"],["SERVERS","адрес DHCP-сервера (10.200.12.2)"],["INTERFACES","оба интерфейса: к клиентам и к серверу (ens34 ens35)"],["giaddr","адрес relay в сети клиента; по нему сервер выбирает subnet"],["hops","увеличивается на 1 на каждом relay"]]),
  note("Relay принимает широковещательный DISCOVER и пересылает его серверу обычным (unicast) пакетом. Сервер отвечает на giaddr."));

C.dhcpsec = card("Отказоустойчивость и безопасность DHCP",
  tbl(["Механизм","Суть"],[["failover peer","два сервера обмениваются арендами, порт 647: primary/secondary, load balance"],["DHCP snooping","коммутатор пропускает OFFER только с доверенных портов"],["опция 82","коммутатор добавляет к DISCOVER номер порта (Circuit ID, Remote ID)"],["ограничение скорости","лимит DISCOVER в секунду на недоверенных портах"]]));

C.ipv6 = card("IPv6 на хосте",
  tbl(["Что","Как"],[["link-local","есть у любого IPv6-интерфейса (fe80::/64)"],["вручную","ip -6 addr add 2001:db8::10/64 dev eth0"],["отключить","sysctl -w net.ipv6.conf.eth0.disable_ipv6=1"],["NDP/RA","клиент шлёт Router Solicitation на ff02::2, маршрутизатор отвечает префиксом (radvd)"],["DHCPv6","запросы на ff02::1:2, порты 546/547"]]));

/* ---------- DNS ---------- */
C.dnsrr = card("Ресурсные записи DNS",
  tbl(["Тип","Содержит","Пример"],[["A","IPv4-адрес имени","www IN A 10.200.12.2"],["AAAA","IPv6-адрес","ns IN AAAA 2001:db8::1"],["CNAME","ссылка на каноническое имя","ftp IN CNAME vm1"],["MX","почтовый сервер домена с приоритетом","@ IN MX 10 mail.ki0000.ru."],["NS","DNS-сервер зоны или поддомена","z1 IN NS ns.z1.ki0000.ru."],["SOA","начало зоны: эталонный сервер, контакт, таймеры","@ IN SOA ns1… admin… (…)"],["PTR","имя по адресу (обратная зона)","2 IN PTR vm1.ki0000.ru."],["SRV","сервер службы (AD, SIP, Jabber)","_sip._tcp IN SRV 100 1 5061 host."],["TXT","произвольный текст (SPF и др.)","@ IN TXT \"v=spf1 …\""]]),
  note("Имя без точки на конце дополняется именем зоны ($ORIGIN). Имя с точкой — полное (FQDN). @ — сама зона."));

C.soa = card("Поля SOA",
  tbl(["Поле","Смысл"],[["MNAME","первичный сервер зоны (ns1.ki0000.ru.)"],["RNAME","почта ответственного, @ заменена точкой (admin.ki0000.ru.)"],["Serial","номер версии; увеличивать при каждом изменении (ГГГГММДДNN)"],["Refresh","как часто slave проверяет Serial"],["Retry","повтор проверки после неудачи"],["Expire","через сколько slave перестаёт отвечать без связи с master"],["Minimum / Negative TTL","сколько кешировать отрицательные ответы"]]),
  note("$TTL в начале файла — время кеширования записей по умолчанию."));

C.bind = card("bind9: файлы",
  tbl(["Файл","Назначение"],[["/etc/bind/named.conf","главный, подключает остальные"],["named.conf.options","options { directory, listen-on, forwarders, recursion, allow-recursion, dnssec-validation }"],["named.conf.local","объявления своих зон"],["named.conf.default-zones","корень, localhost, обратные локальные зоны"],["/etc/bind/db.root","адреса корневых серверов «.»"],["/etc/bind/db.ki0000.ru","файл прямой зоны"],["/var/cache/bind","directory: slave-зоны, named.stats, named_dump.db"]]),
  note("zone \"ki0000.ru\" { type master; file \"/etc/bind/db.ki0000.ru\"; allow-transfer { 10.200.12.1; }; };"));

C.dnstools = card("Утилиты DNS",
  tbl(["Команда","Что делает"],[["dig @10.200.12.2 www.ki0000.ru","запрос A к конкретному серверу"],["dig ki0000.ru MX","запрос записи нужного типа"],["dig -x 10.200.12.2","обратный запрос (PTR)"],["dig ki0000.ru AXFR","трансфер всей зоны"],["dig … +norecurse","запрос без флага RD"],["dig … +short","только данные ответа"],["host -t mx ki0000.ru","короткий запрос типа"],["nslookup -type=mx ki0000.ru 10.200.12.2","то же в Windows"],["named-checkconf","проверка конфигурации"],["named-checkzone ki0000.ru db.ki0000.ru","проверка файла зоны"]]),
  note("Флаги в ответе dig: qr — ответ, aa — авторитетный, rd — рекурсия запрошена, ra — рекурсия доступна."));

C.rndc = card("rndc",
  tbl(["Команда","Действие"],[["rndc status","состояние сервера"],["rndc reload [зона]","перечитать конфигурацию и зоны (или одну зону)"],["rndc reconfig","подхватить новые зоны из конфигурации"],["rndc refresh зона","проверить Serial у master и при необходимости обновить slave"],["rndc retransfer зона","принудительно перекачать зону"],["rndc stats","записать статистику в named.stats"],["rndc dumpdb -all","дамп кеша и зон в named_dump.db"],["rndc flush","очистить кеш"],["rndc querylog on","журнал запросов"],["rndc stop","остановить named"]]));

C.dnserr = card("Коды ошибок DNS",
  tbl(["Код","Значит"],[["NXDOMAIN","такого имени нет в зоне"],["SERVFAIL","сервер не смог ответить: рекурсия выключена или не удалась, не найден авторитетный сервер"],["REFUSED","сервер отказался выполнять запрос (например, рекурсия не разрешена этому клиенту)"],["TRUNCATED (TC)","ответ не поместился в UDP — клиент повторяет по TCP"],["NOERROR без ответа","имя есть, но записи такого типа нет, или это ссылка (referral)"]]));

C.dnsres = card("Рекурсия и итерация",
  chain([["Клиент","RD = 1"],["Рекурсивный сервер","кеш, forwarders"],["Корень «.»","ссылка на ru."],["ru.","ссылка на ki0000.ru."],["ki0000.ru.","авторитетный ответ"]]),
  note("Рекурсивный сервер сам проходит цепочку и отдаёт клиенту готовый ответ (без флага aa). Нерекурсивный возвращает ошибку или ссылку (referral) — куда идти дальше. Ответы кешируются на время TTL."));

C.slave = card("Master, slave и трансфер",
  seq("master VM2","slave VM1",[[">","NOTIFY","Serial изменился"],["<","SOA?","slave проверяет Serial"],["<","AXFR (TCP 53)","запрос всей зоны"],[">","записи зоны","slave сохраняет копию"]]),
  note("На master: allow-transfer { slave; }; also-notify { slave; };  На slave: type slave; masters { master; };  Если Serial не увеличить — slave не обновится."));

/* ---------- Web ---------- */
C.http = card("HTTP-запрос и методы",
  CODE("GET /index.html HTTP/1.1\nHost: www.ki0000.ru\nUser-Agent: Mozilla/5.0\nAccept: text/html\nConnection: keep-alive\n\n"),
  tbl(["Метод","Назначение"],[["GET","получить документ"],["HEAD","только заголовки, без тела"],["POST","передать данные (форма, CGI)"],["PUT","разместить документ на сервере"]]),
  note("Главная строка: Метод Ресурс Версия. Затем заголовки «Имя: значение», пустая строка и необязательное тело. По умолчанию TCP-порт 80."));

C.codes = card("Коды ответа HTTP",
  tbl(["Код","Значение"],[["1xx","информационные: 100 Continue, 101 Switching Protocols"],["200 OK","всё хорошо"],["201 Created","ресурс создан"],["204 No Content","нет содержимого"],["301 / 302","перемещён окончательно / временно (Location)"],["304 Not Modified","не изменялся — бери из кеша"],["400 Bad Request","плохой запрос"],["401 Unauthorized","нужна аутентификация (WWW-Authenticate)"],["403 Forbidden","запрещено"],["404 Not Found","не найдено"],["405 Method Not Allowed","метод не поддерживается"],["500 Internal Server Error","ошибка сервера (часто — сломанный CGI)"],["502 / 503 / 504","плохой шлюз / сервис недоступен / шлюз не отвечает"]]));

C.cond = card("Условный запрос",
  seq("Браузер","Сервер",[[">","GET /","кеш пуст"],["<","200 OK","Last-Modified, ETag, тело"],[">","GET / (F5)","If-Modified-Since, If-None-Match"],["<","304 Not Modified","без тела — страница из кеша"]]),
  note("Ctrl+F5 — запрос без условных заголовков, сервер снова отдаёт 200."));

C.apache = card("Apache2 в Ubuntu",
  tbl(["Что","Где / как"],[["главный конфиг","/etc/apache2/apache2.conf"],["сайты","sites-available → a2ensite site1 → sites-enabled"],["модули","mods-available → a2enmod cgi → mods-enabled"],["доп. конфигурации","conf-available → a2enconf"],["порты","/etc/apache2/ports.conf (Listen 80)"],["проверка","apache2ctl configtest · apache2ctl -S"],["журналы","/var/log/apache2/access.log, error.log"],["корень по умолчанию","/var/www/html"]]),
  note("После изменений: systemctl reload apache2 (без обрыва соединений) или restart."));

C.vhost = card("Виртуальный хост",
  CODE("<VirtualHost *:80>\n    ServerName site1.ki0000.ru\n    ServerAlias *.site1.ki0000.ru\n    DocumentRoot /var/www/site1\n    ErrorLog ${APACHE_LOG_DIR}/site1_error.log\n    CustomLog ${APACHE_LOG_DIR}/site1_access.log combined\n</VirtualHost>"),
  note("Сайт без ServerName (первый, 000-default) отвечает на все имена, которые не подошли другим хостам."));

C.htaccess = card(".htaccess",
  tbl(["Директива","Действие"],[["AllowOverride All","разрешить .htaccess (в apache2.conf, блок &lt;Directory /var/www/&gt;)"],["Options -Indexes / +Indexes","запретить / разрешить листинг каталога"],["ErrorDocument 404 /404.html","своя страница ошибки"],["Redirect 301 /old/ /new/","перенаправление"],["DirectoryIndex index.php","файл по умолчанию"],["AuthType Basic","вид аутентификации"],["AuthUserFile /etc/apache2/.htpasswd","файл паролей"],["Require user webuser1","кого пускать (или valid-user)"]]),
  note("Файл паролей: htpasswd -c /etc/apache2/.htpasswd webuser1 (ключ -c только при первом создании)."));

C.ssl = card("HTTPS в Apache",
  CODE("openssl req -new -x509 -days 30 -keyout server.key -out server.pem\nopenssl rsa -in server.key.orig -out server.key   # снять пароль\na2enmod ssl\na2ensite default-ssl"),
  note("В default-ssl.conf: SSLEngine on, SSLCertificateFile /etc/ssl/certs/server.pem, SSLCertificateKeyFile /etc/ssl/private/server.key, SSLProtocol all -SSLv2. Порт 443."));

/* ---------- Samba ---------- */
C.netbios = card("NetBIOS",
  tbl(["Что","Значение"],[["имя","16 байт: 15 — имя, 16-й — тип (суффикс)"],["&lt;00&gt;","рабочая станция"],["&lt;20&gt;","файловый сервер"],["&lt;1D&gt;","master browser группы"],["137/udp","служба имён"],["138/udp","служба дейтаграмм"],["139/tcp","служба сеансов"]]),
  note("Порядок поиска в Windows: кеш NetBIOS → WINS → широковещание → LMHOSTS → HOSTS → DNS."));

C.smbconf = card("smb.conf: параметры ресурса",
  tbl(["Параметр","Смысл"],[["[имя]","имя ресурса: \\\\сервер\\имя"],["path","каталог на сервере"],["browseable","виден в списке ресурсов"],["guest ok = yes","вход без пароля (гостем)"],["read only = no","разрешить запись (writable = yes)"],["valid users","кому разрешено"],["force user = root","все операции — от имени root"],["create mask / directory mask","права новых файлов / каталогов"],["workgroup, security = user","[global]: рабочая группа и режим проверки"],["wins support = yes","[global]: сам сервер — WINS"]]),
  note("Комментарии в smb.conf — только отдельной строкой (# или ;). Проверка: testparm."));

C.smbtools = card("Команды Samba",
  tbl(["Команда","Что делает"],[["smbpasswd -a user","добавить пользователя Samba (Linux-пользователь должен существовать)"],["smbpasswd -e user","включить пользователя"],["pdbedit -L","список пользователей Samba"],["testparm","проверить smb.conf"],["smbclient -L //10.200.12.2 -N","список ресурсов без пароля"],["smbclient //10.200.12.2/public -N","войти гостем, дальше ls/get/put"],["smbclient //10.200.12.2/readwrite -U swrite","войти пользователем"],["smbstatus","активные сеансы и блокировки"],["nmblookup -U 10.200.12.2 -R VM2","спросить имя у WINS"],["systemctl restart smbd nmbd","перезапуск (nmbd — NetBIOS и WINS)"]]));

C.nfs = card("NFS",
  CODE("apt install nfs-kernel-server\n# /etc/exports\n/share *(ro,sync,no_root_squash)\n/main  *(rw,sync,no_root_squash)\n\nmount example.hostname.com:/share /local/ubuntu"),
  note("NFS (Sun, 1984) работает поверх ONC RPC и не хранит состояние клиентов: каждый запрос самодостаточен. Клиенту нужен пакет nfs-common; постоянно — строка в /etc/fstab."));

/* ---------- почта ---------- */
C.mailroles = card("Участники и протоколы почты",
  tbl(["Кто / что","Роль"],[["MTA (Postfix, Sendmail)","пересылает письма между серверами, маршрутизирует"],["MDA","доставляет письмо в почтовый ящик"],["MUA (Thunderbird)","программа пользователя"],["SMTP, 25/tcp","отправка и пересылка"],["POP3, 110/tcp","забрать письма на клиент"],["IMAP, 143/tcp","работать с папками на сервере"],["UUCP","старый протокол копирования между UNIX-хостами по модему"]]));

C.smtp = card("Диалог SMTP",
  seq("Клиент","Сервер :25",[["<","220 mail ESMTP","приветствие"],[">","HELO localhost",""],["<","250 Hello",""],[">","MAIL FROM:user@localhost","отправитель"],[">","RCPT TO:usr2","получатель"],[">","DATA","дальше текст письма"],[">",".","точка на отдельной строке — конец"],["<","250 queued",""],[">","QUIT",""]]),
  note("Проверить вручную: telnet 10.200.12.2 25. Команда DATA передаёт только текст ASCII — вложения кодируются (MIME, base64)."));

C.postfix = card("Postfix: main.cf",
  tbl(["Параметр","Смысл"],[["myhostname","FQDN сервера (vm1.ki0000.ru)"],["mydomain","домен (ki0000.ru)"],["myorigin","домен отправителя для локальной почты"],["mydestination","домены, почта для которых доставляется локально"],["mynetworks","кому разрешено отправлять через сервер (релей)"],["relayhost","сервер для пересылки всей почты"],["inet_interfaces","на каких адресах слушать (all)"]]),
  note("postconf -e 'mynetworks = 127.0.0.0/8 10.200.12.0/24' · postconf -n · systemctl reload postfix · журнал /var/log/mail.log · очередь mailq."));

C.dovecot = card("Dovecot",
  tbl(["Файл / параметр","Значение"],[["пакеты","dovecot-imapd, dovecot-pop3d"],["10-mail.conf: mail_location","mbox:~/mail:INBOX=/var/mail/%u"],["10-auth.conf: disable_plaintext_auth = no","разрешить пароль без TLS (для лабы)"],["auth_mechanisms = plain login","механизмы входа"],["порты","IMAP 143, POP3 110 (IMAPS 993, POP3S 995)"]]));

/* ---------- безопасность ---------- */
C.iaa = card("Регистрация в системе",
  chain([["Идентификация","кто ты? (логин)"],["Аутентификация","докажи (пароль, ключ)"],["Авторизация","что тебе можно (права)"]]),
  note("Плюс администрирование (учётные записи, пароли, права) и аудит (протоколирование действий)."));

C.chains = card("Цепочки и таблицы iptables",
  tbl(["Таблица","Цепочки","Для чего"],[["filter (по умолчанию)","INPUT, FORWARD, OUTPUT","фильтрация: ACCEPT, DROP, REJECT"],["nat","PREROUTING, OUTPUT, POSTROUTING (в новых ядрах ещё INPUT)","DNAT, SNAT, MASQUERADE, REDIRECT (только новые соединения)"],["mangle","все пять","изменение заголовков: TTL, TOS, MARK"],["raw","PREROUTING, OUTPUT","NOTRACK — мимо conntrack"]]),
  note("Транзитный пакет: PREROUTING → FORWARD → POSTROUTING. Пакет для хоста: PREROUTING → INPUT. От локального процесса: OUTPUT → POSTROUTING."));

C.ipt = card("Команды iptables",
  tbl(["Команда","Действие"],[["iptables -L -n -v","показать правила со счётчиками"],["iptables -A INPUT …","добавить в конец цепочки"],["iptables -I INPUT 1 …","вставить первым"],["iptables -D INPUT 3","удалить правило № 3"],["iptables -F","очистить цепочки таблицы"],["iptables -P INPUT DROP","политика по умолчанию"],["-p tcp --dport 22","протокол и порт назначения"],["-s 10.0.0.0/8 / -d","источник / назначение"],["-i eth0 / -o eth1","входной / выходной интерфейс"],["-m conntrack --ctstate ESTABLISHED,RELATED","состояние соединения"],["-j ACCEPT|DROP|REJECT|LOG","действие"],["iptables-save / iptables-restore","сохранить / загрузить правила"]]));

C.nat = card("NAT в Linux",
  CODE("sysctl -w net.ipv4.ip_forward=1\niptables -t nat -A POSTROUTING -s 10.200.12.0/24 -o ens33 -j MASQUERADE\niptables -A FORWARD -i ens34 -j ACCEPT\niptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT"),
  tbl(["Действие","Где","Что меняет"],[["MASQUERADE","POSTROUTING","источник на адрес выходного интерфейса (динамический)"],["SNAT --to-source","POSTROUTING","источник на заданный адрес"],["DNAT --to-destination","PREROUTING","адрес назначения (проброс порта)"],["REDIRECT","PREROUTING","на порт самого хоста"]]));

C.tls = card("Установление TLS-соединения",
  seq("Клиент","Сервер",[[">","ClientHello","список алгоритмов"],["<","ServerHello","выбранный алгоритм"],["<","сертификат + открытый ключ","подписан ЦС"],[">","случайное число, зашифрованное открытым ключом","из него — сеансовый ключ"],[">","прикладные данные (HTTP)","шифруются сеансовым ключом"]]),
  note("SSL 2.0 (1995), 3.0 (1996); TLS 1.0 (1999), 1.1 (2006), 1.2 (2008), 1.3 (2018). Порт HTTPS — 443."));

C.openssl = card("openssl: ЦС и сертификаты",
  CODE("openssl genrsa -out root.key 2048\nopenssl req -new -key root.key -out root.csr\nopenssl x509 -req -days 3650 -in root.csr -signkey root.key -out root.pem\n\nopenssl genrsa -out server.key 2048\nopenssl req -new -key server.key -out server.csr\nopenssl x509 -req -in server.csr -CA root.pem -CAkey root.key -CAcreateserial -out server.pem -days 365"),
  note("Корневой сертификат подписан сам собой (-signkey). Серверный — ключом ЦС (-CA, -CAkey). CSR — запрос на подпись."));

C.ovpn = card("OpenVPN",
  tbl(["Что","Зачем"],[["ca.crt, server.crt, server.key","PKI: проверка сторон"],["dh.pem","Диффи-Хеллман: общий ключ по открытому каналу, защита записанного трафика"],["ta.key (HMAC)","подпись пакетов, защита от DoS и флуда"],["dev tun","IP-туннель (3 уровень), маршрутизация"],["dev tap","Ethernet-туннель (2 уровень), мост"],["server 10.0.0.0 255.255.255.0","подсеть туннеля"],["push \"route …\"","передать маршрут клиентам"]]),
  note("Клиенту передают client.crt, client.key и ca.crt."));

C.ssh = card("SSH",
  tbl(["Команда / параметр","Что делает"],[["ssh user@10.200.12.2","вход на сервер (22/tcp)"],["ssh-keygen -t ed25519","создать пару ключей"],["ssh-copy-id user@host","положить открытый ключ в ~/.ssh/authorized_keys"],["scp file user@host:/tmp/","копирование по SSH"],["/etc/ssh/sshd_config","конфигурация сервера"],["PermitRootLogin no","запретить вход root"],["PasswordAuthentication no","только ключи"]]));

/* ---------- SNMP ---------- */
C.snmpmsg = card("Сообщения SNMP",
  tbl(["Сообщение","Кто → кому","Зачем"],[["GetRequest","менеджер → агент","значение переменной(ых)"],["GetNextRequest","менеджер → агент","следующая переменная в дереве (обход, snmpwalk)"],["GetBulkRequest","менеджер → агент","много данных одним запросом (с v2)"],["SetRequest","менеджер → агент","изменить переменную"],["Response","агент → менеджер","ответ на Get/Set"],["Trap","агент → менеджер","асинхронное уведомление, UDP 162"]]),
  note("Запросы идут на UDP 161 агента."));

C.snmpver = card("Версии SNMP",
  tbl(["Версия","Защита"],[["v1","community (пароль) открытым текстом"],["v2c","то же + GetBulk"],["v3","пользователи; authNoPriv — подпись, authPriv — подпись и шифрование (SHA, AES)"]]),
  note("SNMP view — поддерево OID, доступное по community. Community = пароль, передаётся в открытом виде, поэтому доступ ограничивают адресами."));

C.snmpd = card("snmpd.conf и утилиты",
  CODE("agentAddress udp:161\nrocommunity ki0000ro 10.200.12.0/24\ncreateUser login SHA \"auth password\" AES \"priv password\"\nrouser login\n\nsnmpwalk -v2c -c ki0000ro 10.200.12.2 1.3.6.1.2.1.1\nsnmpget  -v2c -c ki0000ro 10.200.12.2 1.3.6.1.2.1.1.5.0\nsnmpwalk -v3 -l authPriv -u login -a SHA -A authpass -x AES -X privpass 10.200.12.2"),
  note("Пакеты Debian/Ubuntu: snmpd — агент, snmp — утилиты, snmptrapd — приём trap."));

C.oid = card("Полезные OID",
  tbl(["OID","Что"],[["1.3.6.1","iso.org.dod.internet"],["1.3.6.1.2.1.1","system (MIB-2): sysDescr, sysUpTime, sysName…"],["1.3.6.1.2.1.1.5.0","sysName — имя узла"],["1.3.6.1.2.1.2.2.1.2","ifDescr — имена интерфейсов"],["1.3.6.1.2.1.2.2.1.10 / .16","ifInOctets / ifOutOctets — трафик"],["1.3.6.1.2.1.25.2.3","hrStorageTable — диски и память"],["1.3.6.1.4.1","enterprises (частные MIB)"],["1.3.6.1.4.1.2021.11","UCD-SNMP: загрузка CPU"],["1.3.6.1.4.1.9","Cisco"]]));

C.cacti = card("Cacti",
  chain([["poller (cron, 5 мин)","snmpget/snmpwalk"],["RRDtool","кольцевые базы .rrd"],["Apache + PHP","веб-интерфейс /cacti"],["MySQL","устройства, шаблоны, графики"]]),
  note("Устройство: Hostname, Device Template (Net-SNMP Device), SNMP Version 2, community. Графики: Data Query «SNMP - Interface Statistics», «SNMP - Get Mounted Partitions», шаблон CPU. Вход по умолчанию admin/admin."));

/* ---------- стенд ---------- */
C.lab = card("Стенд 10.200.12.0/24",
  tbl(["Узел","Адрес","Роль"],[["VM2 ens34 (N1)","10.200.12.1/26","шлюз N1, relay, DNS z1, Cacti"],["VM2 ens35 (N2)","10.200.12.65/26","шлюз N2"],["VM2 ens33","DHCP VMware (NAT)","выход в интернет, MASQUERADE"],["VM1 ens33","10.200.12.2/26","DHCP, DNS, Apache, Samba, Postfix, SNMP"],["VM3","DHCP → 10.200.12.70","клиент в N2"],["Хост Windows (VMnet2)","DHCP → 10.200.12.50","клиент: nslookup, браузер, Thunderbird"],["пулы","N1 .20–.40, N2 .80–.100","DHCP на VM1"]]),
  note("Зона ki0000.ru, поддомен z1.ki0000.ru на VM2, обратная зона 12.200.10.in-addr.arpa."));
