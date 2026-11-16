// SPDX-License-Identifier: GPL-3.0-or-later · Copyright (C) 2026 Пантелеев Г.Д.
/* Сетевые параметры и DHCP. o — варианты, первый правильный; a — эталоны для ввода. */
Q.push(
  {t:"dhcp-1",q:"Введите строку /etc/network/interfaces: статическая настройка IPv4 интерфейса eth0.",a:["iface eth0 inet static"],h:"строка конфигурации",e:"Следом идут address, netmask, gateway, dns-nameservers.",c:"netcfg"},
  {t:"dhcp-1",q:"Введите команду ip: временно назначить 192.168.0.77/24 интерфейсу eth0.",a:["ip addr add 192.168.0.77/24 dev eth0","ip a add 192.168.0.77/24 dev eth0","ip address add 192.168.0.77/24 dev eth0"],h:"команда целиком",e:"Временная настройка пропадёт после перезагрузки. В лекции так же с broadcast 192.168.0.255."},
  {t:"dhcp-1",q:"Введите команду: применить конфигурацию netplan.",a:["netplan apply"],h:"команда целиком",e:"netplan try — применить с откатом, если не подтвердить."},
  {t:"dhcp-1",q:"Введите команду: показать все адреса интерфейсов утилитой ip (кратко, одним словом после ip).",a:["ip a","ip addr","ip address","ip addr show","ip address show"],h:"команда целиком",e:"Список устройств — ip link, маршруты — ip route; старое — ifconfig -a."},
  {t:"dhcp-1",q:"Какой ключ YAML в netplan включает DHCP для IPv4 (вместе с значением)?",a:["dhcp4: true","dhcp4: yes"],h:"строка YAML",e:"ens33: { dhcp4: true } — так настраивается VM3 в лабе 1."},
  {t:"dhcp-1",q:"Введите команду (Debian, System V): перезапустить сетевые интерфейсы.",a:["/etc/init.d/networking restart","service networking restart","systemctl restart networking"],h:"команда целиком",e:"В Ubuntu 12.04 — restart networking / initctl restart networking."},

  {t:"dhcp-2",q:"Какое слово начинает строку с адресом DNS-сервера в /etc/resolv.conf?",a:["nameserver"],h:"одно слово",e:"nameserver 10.200.12.2 — по строке на сервер."},
  {t:"dhcp-2",q:"Введите команду: показать DNS-серверы, которые реально использует systemd-resolved.",a:["resolvectl status","resolvectl"],h:"команда целиком",e:"Выводит DNS Servers по каждому интерфейсу."},
  {t:"dhcp-2",q:"Введите команду: очистить кеш DNS systemd-resolved.",a:["resolvectl flush-caches"],h:"команда целиком",e:"Нужно, чтобы увидеть новый ответ DNS (например, round-robin) без ожидания TTL."},
  {t:"dhcp-2",q:"Введите команду Windows: очистить кеш DNS-клиента.",a:["ipconfig /flushdns"],ci:1,h:"команда целиком",e:"В лабе 3 так проверяют распределение нагрузки между www на VM1 и VM2."},

  {t:"dhcp-3",q:"В каком порядке идут сообщения при получении адреса по DHCP?",o:["DISCOVER → OFFER → REQUEST → ACK","REQUEST → OFFER → DISCOVER → ACK","OFFER → DISCOVER → ACK → REQUEST","DISCOVER → ACK → OFFER → REQUEST"],e:"DORA: обнаружение, предложение, запрос, подтверждение.",f:"L02_p09",c:"dora"},
  {t:"dhcp-3",q:"Какой UDP-порт у DHCP-сервера?",a:["67"],h:"число",e:"Сервер — 67, клиент — 68.",c:"ports"},
  {t:"dhcp-3",q:"Какой UDP-порт у DHCP-клиента?",a:["68"],h:"число",e:"DISCOVER идёт с 0.0.0.0:68 на 255.255.255.255:67."},
  {t:"dhcp-3",q:"Каким сообщением клиент досрочно прекращает аренду (как в логе, латиницей)?",a:["DHCPRELEASE","RELEASE"],ci:1,h:"имя сообщения",e:"Windows шлёт его по ipconfig /release."},
  {t:"dhcp-3",q:"Как называется передача IP-адреса клиенту на определённый срок (одно слово по-русски или по-английски)?",a:["аренда","lease"],ci:1,h:"одно слово",e:"Аренда (lease); по истечении адрес снова свободен. Максимум — 2³² секунд."},
  {t:"dhcp-3",q:"Введите команду Windows: заново получить адрес для адаптера VMnet2.",a:["ipconfig /renew \"*VMnet2*\"","ipconfig /renew \"VMware Network Adapter VMnet2\"","ipconfig /renew *VMnet2*"],ci:1,h:"команда целиком",e:"Перед этим ipconfig /release освобождает текущий адрес."},

  {t:"dhcp-4",q:"Введите строку /etc/default/isc-dhcp-server: слушать DHCP по IPv4 только на ens33.",a:["INTERFACESv4=\"ens33\"","INTERFACESv4=ens33"],h:"строка конфигурации",e:"В лекции (Ubuntu 12.04) — INTERFACES=\"eth0\".",c:"dhcpconf"},
  {t:"dhcp-4",q:"Введите полный путь к главному файлу конфигурации isc-dhcp-server.",a:["/etc/dhcp/dhcpd.conf"],h:"путь",e:"Для IPv6 — /etc/dhcp/dhcpd6.conf.",c:"dhcpconf"},
  {t:"dhcp-4",q:"Введите команду: проверить синтаксис /etc/dhcp/dhcpd.conf, не запуская сервер.",a:["dhcpd -t -cf /etc/dhcp/dhcpd.conf","dhcpd -t"],h:"команда целиком",e:"-t — только проверка, -cf — путь к конфигурации."},
  {t:"dhcp-4",q:"Введите полный путь к файлу с выданными арендами isc-dhcp-server.",a:["/var/lib/dhcp/dhcpd.leases"],h:"путь",e:"Там видны MAC, адрес, начало и конец аренды. Удобный вывод — dhcp-lease-list."},
  {t:"dhcp-4",q:"Введите директиву dhcpd.conf: пул адресов с 10.200.12.20 по 10.200.12.40.",a:["range 10.200.12.20 10.200.12.40;"],h:"директива",e:"range пишется внутри subnet (или pool).",c:"dhcpconf"},
  {t:"dhcp-4",q:"Введите первую строку объявления сети 10.200.12.0/26 в dhcpd.conf (до фигурной скобки включительно).",a:["subnet 10.200.12.0 netmask 255.255.255.192 {"],h:"строка конфигурации",e:"Маску пишут полностью, префикс /26 dhcpd не понимает."},
  {t:"dhcp-4",q:"Введите команду: последние 20 строк системного журнала из файла (как в лекции).",a:["tail /var/log/syslog -n 20","tail -n 20 /var/log/syslog","tail -20 /var/log/syslog","tail -n20 /var/log/syslog"],h:"команда целиком",e:"Сейчас то же даёт journalctl -u isc-dhcp-server."},

  {t:"dhcp-5",q:"Введите опцию dhcpd.conf: шлюз по умолчанию 10.200.12.1.",a:["option routers 10.200.12.1;"],h:"директива",e:"routers — шлюз по умолчанию для клиентов подсети.",c:"dhcpconf"},
  {t:"dhcp-5",q:"Введите опцию dhcpd.conf: первичный DNS 10.200.12.2 и вторичный 10.200.12.1.",a:["option domain-name-servers 10.200.12.2, 10.200.12.1;"],h:"директива",e:"Порядок важен: первый — первичный."},
  {t:"dhcp-5",q:"Введите опцию dhcpd.conf: WINS-сервер 10.200.12.2.",a:["option netbios-name-servers 10.200.12.2;"],h:"директива",e:"Пригодится в лабе 4: Windows-хост сам узнает WINS."},
  {t:"dhcp-5",q:"Введите опцию dhcpd.conf: доменное имя ki0000.ru.",a:["option domain-name \"ki0000.ru\";"],h:"директива",e:"Строковые значения — в кавычках."},
  {t:"dhcp-5",q:"Введите директиву dhcpd.conf: срок аренды по умолчанию 600 секунд.",a:["default-lease-time 600;"],h:"директива",e:"Максимальный срок, который может запросить клиент, — max-lease-time."},
  {t:"dhcp-5",q:"Сколько секунд в аренде 4 суток (значение из лекции)?",a:["345600"],h:"число",e:"4 × 24 × 3600 = 345600."},

  {t:"dhcp-6",q:"Введите строку блока host: MAC 00:50:56:c0:00:02.",a:["hardware ethernet 00:50:56:c0:00:02;"],ci:1,h:"директива",e:"MAC из ipconfig /all (дефисы → двоеточия). Регистр букв в MAC не важен."},
  {t:"dhcp-6",q:"Введите строку блока host: постоянный адрес 10.200.12.50.",a:["fixed-address 10.200.12.50;"],h:"директива",e:"host winhost { hardware ethernet …; fixed-address 10.200.12.50; }"},
  {t:"dhcp-6",q:"Введите команду Windows: показать MAC («Физический адрес») всех адаптеров.",a:["ipconfig /all","getmac"],ci:1,h:"команда целиком",e:"Адаптер хоста VMware VMnet2 обычно имеет MAC 00:50:56:C0:00:02."},

  {t:"dhcp-7",q:"По какому полю сервер понимает, из какой сети пришёл запрос через relay?",o:["giaddr","ciaddr","yiaddr","chaddr"],e:"giaddr — адрес relay в сети клиента (10.200.12.65). По нему сервер выбирает subnet N2.",f:"sv_relay",c:"relay"},
  {t:"dhcp-7",q:"Введите имя пакета DHCP-relay ISC в Ubuntu.",a:["isc-dhcp-relay"],h:"имя пакета",e:"sudo apt install isc-dhcp-relay — установщик спросит сервер и интерфейсы."},
  {t:"dhcp-7",q:"Введите полный путь к файлу настроек isc-dhcp-relay.",a:["/etc/default/isc-dhcp-relay"],h:"путь",e:"Переменные SERVERS, INTERFACES, OPTIONS."},
  {t:"dhcp-7",q:"Введите строку настроек relay: DHCP-сервер 10.200.12.2.",a:["SERVERS=\"10.200.12.2\"","SERVERS=10.200.12.2"],h:"строка конфигурации",e:"В лекции: SERVERS=\"192.168.123.4\".",c:"relay"},
  {t:"dhcp-7",q:"Введите строку настроек relay: слушать интерфейсы ens34 и ens35.",a:["INTERFACES=\"ens34 ens35\"","INTERFACES=\"ens35 ens34\""],h:"строка конфигурации",e:"Оба интерфейса через пробел."},
  {t:"dhcp-7",q:"Какой адрес окажется в поле giaddr при запросе VM3 через relay на стенде?",a:["10.200.12.65"],h:"IP-адрес",e:"Адрес интерфейса relay в сети клиента — ens35 на VM2."},
  {t:"dhcp-7",q:"Введите команду systemd: перезапустить DHCP-relay.",a:["systemctl restart isc-dhcp-relay","systemctl restart isc-dhcp-relay.service","service isc-dhcp-relay restart"],h:"команда целиком",e:"Статус — systemctl status isc-dhcp-relay (в лекции service isc-dhcp-relay status)."},

  {t:"dhcp-8",q:"Какие сообщения RFC 2131 предусматривает для синхронизации двух серверов?",o:["синхронизация аренд, «hello» и «I am back»","DISCOVER, OFFER, REQUEST и ACK между серверами","AXFR, IXFR и NOTIFY, как при передаче зоны DNS","Get и Set"],e:"«I am back» шлёт первичный сервер, вернувшись после простоя."},
  {t:"dhcp-8",q:"Введите номер TCP-порта для обмена failover в примере лекции.",a:["647"],h:"число",e:"port 647; peer port 647;"},
  {t:"dhcp-8",q:"Введите ключевое слово блока failover peer на первичном сервере.",a:["primary;"],h:"слово",e:"На вторичном — secondary;"},

  {t:"dhcp-9",q:"Какой UDP-порт у сервера DHCPv6?",a:["547"],h:"число",e:"Клиент — 546, сервер — 547.",c:"ports"},
  {t:"dhcp-9",q:"Введите команду: отключить IPv6 на eth0 через sysctl.",a:["sysctl -w net.ipv6.conf.eth0.disable_ipv6=1"],h:"команда целиком",e:"=0 — включить обратно."},
  {t:"dhcp-9",q:"Введите строку /etc/network/interfaces: автонастройка IPv6 на eth0.",a:["iface eth0 inet6 auto"],h:"строка конфигурации",e:"Адрес получается через NDP/RA."}
);
