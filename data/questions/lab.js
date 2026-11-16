// SPDX-License-Identifier: GPL-3.0-or-later · Copyright (C) 2026 Пантелеев Г.Д.
/* Лабораторные работы на стенде 10.200.12.0/24 (зона ki0000.ru). o — варианты, первый правильный; a — эталоны для ввода. */
Q.push(
  {t:"lab-0",q:"Какой адрес у VM2 в сети N1?",a:["10.200.12.1"],h:"IP-адрес",e:"Шлюз N1.",c:"lab"},
  {t:"lab-0",q:"Какой шлюз по умолчанию у узлов сети N2?",a:["10.200.12.65"],h:"IP-адрес",e:"Интерфейс ens35 VM2."},
  {t:"lab-0",q:"Введите команду: кратко показать сетевые интерфейсы с их MAC-адресами.",a:["ip -br link","ip -brief link","ip -br l","ip link"],h:"команда целиком",e:"Сопоставьте MAC с VM → Settings → Network Adapter → Advanced."},
  {t:"lab-0",q:"Введите строку файла /etc/sysctl.d/99-forward.conf, включающую маршрутизацию.",a:["net.ipv4.ip_forward=1"],h:"строка",e:"Затем sudo sysctl --system.",c:"nat"},
  {t:"lab-0",q:"Введите команду: применить все файлы настроек sysctl.",a:["sysctl --system","sysctl -p /etc/sysctl.d/99-forward.conf"],h:"команда целиком",e:"sysctl -p без пути читает только /etc/sysctl.conf."},
  {t:"lab-0",q:"Введите имя пакета, который сохраняет правила iptables между перезагрузками.",a:["iptables-persistent"],h:"имя пакета",e:"Пересохранить после изменений — netfilter-persistent save."},
  {t:"lab-0",q:"Введите команду Windows (от администратора): постоянный маршрут в сеть N2 через 10.200.12.1.",a:["route -p add 10.200.12.64 mask 255.255.255.192 10.200.12.1"],ci:1,h:"команда целиком",e:"Иначе хост не дойдёт до VM3."},
  {t:"lab-0",q:"Введите строку netplan для ens34 на VM2: адрес в сети N1 (ключ и значение).",a:["addresses: [10.200.12.1/26]","addresses: [ 10.200.12.1/26 ]"],h:"строка YAML",e:"ens35 — addresses: [10.200.12.65/26].",c:"netcfg"},
  {t:"lab-0",q:"Введите команду: применить netplan с автоматическим откатом, если не подтвердить.",a:["netplan try"],h:"команда целиком",e:"Спасает от потери SSH при ошибке в адресе."},

  {t:"lab-1",q:"Какой адрес получит хост Windows после закрепления по MAC?",a:["10.200.12.50"],h:"IP-адрес",e:"Вне пула .20–.40, но в N1."},
  {t:"lab-1",q:"Введите первую строку объявления сети N2 в dhcpd.conf (до скобки).",a:["subnet 10.200.12.64 netmask 255.255.255.192 {"],h:"строка конфигурации",e:"Без неё сервер проигнорирует запросы через relay из N2."},
  {t:"lab-1",q:"Введите опцию шлюза для пула N2.",a:["option routers 10.200.12.65;"],h:"директива",e:"Шлюз N2 — ens35 VM2."},
  {t:"lab-1",q:"Введите директиву пула N2 (с .80 по .100).",a:["range 10.200.12.80 10.200.12.100;"],h:"директива",e:"Пул N1 — .20–.40."},
  {t:"lab-1",q:"Введите фильтр tcpdump, который ловит DHCP по обоим портам.",a:["port 67 or port 68","port 68 or port 67","udp port 67 or udp port 68","port 67 or 68"],h:"фильтр",e:"В кавычках после ключей: tcpdump -n -i any 'port 67 or port 68'."},
  {t:"lab-1",q:"Введите команду для VM3 (systemd-networkd): продлить аренду на ens33.",a:["networkctl renew ens33"],h:"команда целиком",e:"Сбросить адрес полностью — ip addr flush dev ens33 и networkctl reconfigure ens33."},
  {t:"lab-1",q:"Введите фильтр отображения Wireshark для DHCP.",a:["dhcp","bootp"],ci:1,h:"фильтр",e:"В старых версиях Wireshark — bootp."},
  {t:"lab-1",q:"Введите команду: красиво показать список аренд isc-dhcp-server.",a:["dhcp-lease-list"],h:"команда целиком",e:"Сырые данные — /var/lib/dhcp/dhcpd.leases."},

  {t:"lab-2",q:"Каким будет следующий Serial после 2026111401 в тот же день?",a:["2026111402"],h:"число",e:"Последние две цифры — номер правки за день."},
  {t:"lab-2",q:"Введите команду: проверить файл обратной зоны /etc/bind/db.10.200.12.",a:["named-checkzone 12.200.10.in-addr.arpa /etc/bind/db.10.200.12"],h:"команда целиком",e:"Первым аргументом — имя зоны."},
  {t:"lab-2",q:"Введите команду Windows: запросить www.z1.ki0000.ru у VM2.",a:["nslookup www.z1.ki0000.ru 10.200.12.1"],ci:1,h:"команда целиком",e:"VM2 авторитетна за z1 — ответ без пометки «не заслуживающий доверия»."},
  {t:"lab-2",q:"Введите полный путь к файлу slave-зоны z1 на VM1.",a:["/var/cache/bind/db.z1.ki0000.ru"],h:"путь",e:"bind может писать только в /var/cache/bind (AppArmor)."},
  {t:"lab-2",q:"Введите директиву options, выключающую рекурсию.",a:["recursion no;"],h:"директива",e:"После правки — sudo systemctl restart named (заодно очистится кеш)."},
  {t:"lab-2",q:"Введите ключ dig, который запрашивает без рекурсии (сбрасывает флаг RD).",a:["+norecurse","+norec"],h:"ключ",e:"dig @10.200.12.2 www.z1.ki0000.ru +norecurse."},
  {t:"lab-2",q:"Введите полный путь к файлу дампа после rndc dumpdb -all.",a:["/var/cache/bind/named_dump.db"],h:"путь",e:"Статистика — /var/cache/bind/named.stats."},
  {t:"lab-2",q:"Введите команду: следить за журналом named в реальном времени (видно «Transfer completed»).",a:["journalctl -u named -f","journalctl -f -u named"],h:"команда целиком",e:"Изменение на master → NOTIFY → AXFR на slave."},

  {t:"lab-3",q:"Введите URL CGI-скрипта hello.sh на www.ki0000.ru.",a:["http://www.ki0000.ru/cgi-bin/hello.sh"],ci:1,h:"URL",e:"/cgi-bin/ → /usr/lib/cgi-bin/ (ScriptAlias)."},
  {t:"lab-3",q:"Введите команду curl: запросить только заголовки ответа http://www.ki0000.ru/.",a:["curl -I http://www.ki0000.ru/","curl -I http://www.ki0000.ru","curl --head http://www.ki0000.ru/","curl --head http://www.ki0000.ru"],h:"команда целиком",e:"-I — метод HEAD."},
  {t:"lab-3",q:"Введите команду curl: открыть http://www.ki0000.ru/private/ с логином webuser1 и паролем pass.",a:["curl -u webuser1:pass http://www.ki0000.ru/private/"],h:"команда целиком",e:"Ожидается 200 OK."},
  {t:"lab-3",q:"Введите строку apache2.conf, открывающую блок настроек каталога /var/www/.",a:["<Directory /var/www/>"],h:"строка конфигурации",e:"Внутри меняют AllowOverride None на AllowOverride All."},
  {t:"lab-3",q:"Введите команду: создать каталоги сайтов /var/www/site1 и /var/www/site2 одной командой.",a:["mkdir -p /var/www/site1 /var/www/site2","mkdir /var/www/site1 /var/www/site2","mkdir -p /var/www/{site1,site2}"],h:"команда целиком",e:"-p не ругается, если каталог уже есть."},

  {t:"lab-4",q:"Кому на сервере будет принадлежать файл r.txt, записанный пользователем sroot в rootshare?",o:["root","sroot","nobody","swrite"],e:"force user = root — подмена прав на root.",c:"smbconf"},
  {t:"lab-4",q:"Введите команду: создать пользователя sread без домашнего каталога и без входа в систему.",a:["useradd -M -s /usr/sbin/nologin sread","useradd -s /usr/sbin/nologin -M sread"],h:"команда целиком",e:"Затем smbpasswd -a sread."},
  {t:"lab-4",q:"Введите команду: создать четыре каталога /srv/samba/{public,readonly,readwrite,rootshare} одной командой.",a:["mkdir -p /srv/samba/{public,readonly,readwrite,rootshare}"],h:"команда целиком",e:"Фигурные скобки раскрывает bash."},
  {t:"lab-4",q:"Введите команду smbclient: гостем записать /etc/hostname в public как from_vm2.txt и показать список.",a:["smbclient //10.200.12.2/public -N -c 'put /etc/hostname from_vm2.txt; ls'","smbclient -N //10.200.12.2/public -c 'put /etc/hostname from_vm2.txt; ls'"],h:"команда целиком",e:"-c выполняет команды и выходит."},
  {t:"lab-4",q:"Введите команду: установить на VM2 клиент Samba.",a:["apt install smbclient","apt-get install smbclient","apt install -y smbclient"],h:"команда целиком",e:"samba-client — имя пакета в RedHat/CentOS."},

  {t:"lab-5",q:"Что в задании лабы 5 означает srv3.&lt;имя группы&gt;.ru?",o:["домен vm3.ki0000.ru, который обслуживает VM2","отдельный третий сервер Postfix","поддомен DNS z1","адрес VM3"],e:"Письмо идёт на usr4@vm3.ki0000.ru — опечатка в задании."},
  {t:"lab-5",q:"Какой адрес сервера входящей почты для учётной записи usr3 в Thunderbird?",a:["10.200.12.1","vm2.ki0000.ru"],ci:1,h:"IP или имя",e:"usr3 живёт на VM2; исходящая — VM1."},
  {t:"lab-5",q:"Введите строку main.cf на VM2, чтобы принимать и домен vm3.ki0000.ru.",a:["mydestination = $myhostname, vm3.ki0000.ru, localhost.$mydomain, localhost"],h:"параметр",e:"Через postconf -e '…' и reload."},
  {t:"lab-5",q:"Введите команду: отправить письмо с темой lab5 пользователю usr4@vm3.ki0000.ru (текст из конвейера).",a:["mail -s lab5 usr4@vm3.ki0000.ru","mail -s \"lab5\" usr4@vm3.ki0000.ru"],h:"команда целиком",e:"echo \"текст\" | mail -s lab5 usr4@vm3.ki0000.ru."},
  {t:"lab-5",q:"Введите команду: посмотреть ящик usr4 на VM2 (файл mbox).",a:["cat /var/mail/usr4","less /var/mail/usr4"],h:"команда целиком",e:"Или учётная запись usr4 в Thunderbird."},

  {t:"lab-6",q:"Какое сообщество SNMP используется на стенде?",a:["ki0000ro"],h:"строка",e:"rocommunity ki0000ro 10.200.12.0/24."},
  {t:"lab-6",q:"Введите OID ветки загрузки CPU UCD-SNMP.",a:["1.3.6.1.4.1.2021.11",".1.3.6.1.4.1.2021.11"],h:"OID",e:"systemStats: ssCpuUser, ssCpuSystem, ssCpuIdle.",c:"oid"},
  {t:"lab-6",q:"Введите команду: запустить опрос Cacti вручную, не дожидаясь cron.",a:["sudo -u www-data php /usr/share/cacti/site/poller.php --force","php /usr/share/cacti/site/poller.php --force"],h:"команда целиком",e:"От имени www-data, чтобы RRD-файлы остались его."},
  {t:"lab-6",q:"Введите команду: создать нагрузку на CPU в фоне для графиков Cacti.",a:["yes > /dev/null &","yes >/dev/null &"],h:"команда целиком",e:"Остановить — kill %1."},
);
