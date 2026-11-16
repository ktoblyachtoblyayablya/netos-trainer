// SPDX-License-Identifier: GPL-3.0-or-later · Copyright (C) 2026 Пантелеев Г.Д.
/* Билеты: настройка сетевых параметров и DHCP (лекция 2, лабораторная 1). */
Object.assign(A, {
"dhcp-1": `
<p>Сетевой интерфейс настраивается <b>статически</b> (адрес, маска, шлюз, DNS заданы вручную) или <b>динамически</b> (параметры выдаёт DHCP-сервер). Конфигурацию читает служба networking (Debian), NetworkManager или systemd-networkd через netplan (Ubuntu).</p>
${H("Debian: /etc/network/interfaces")}
${CODE("iface eth0 inet static\n    address 192.168.0.1\n    netmask 255.255.255.0\n    gateway 192.168.0.254\n    dns-nameservers 10.1.1.1 1.1.1.1\nauto eth0\n\niface eth0 inet dhcp      # динамическая настройка")}
<p>Строка <b>iface eth0 inet static</b> — интерфейс IPv4 со статическим адресом; <b>auto eth0</b> — поднимать при загрузке. Перезапуск — /etc/init.d/networking restart.</p>
${H("Ubuntu: netplan (стенд, VM1)")}
${CODE("network:\n  version: 2\n  ethernets:\n    ens33:\n      addresses: [10.200.12.2/26]\n      routes:\n        - to: default\n          via: 10.200.12.1\n      nameservers:\n        addresses: [127.0.0.1]")}
<p>Применить: <b>sudo netplan apply</b>. Для DHCP — <b>dhcp4: true</b>.</p>
${CARD("netcfg")}`,

"dhcp-2": `
<p>Адреса DNS-серверов клиент берёт из <b>/etc/resolv.conf</b> (строки nameserver). В старых системах файл правили вручную. С Ubuntu 12.04 он генерируется автоматически, поэтому ручные правки теряются. В современных Ubuntu там стоит заглушка systemd-resolved <b>127.0.0.53</b>, а реальные серверы задают в netplan (nameservers) и смотрят командой <b>resolvectl status</b>.</p>
${CODE("resolvectl status\nresolvectl flush-caches\ncat /etc/resolv.conf     # nameserver 127.0.0.53")}
${N("На стенде: VM1 спрашивает свой bind (127.0.0.1), VM2 — VM1 (10.200.12.2). У внешнего интерфейса VM2 DNS от VMware отключают: dhcp4-overrides: use-dns: false.")}`,

"dhcp-3": `
<p><b>DHCP</b> (развитие BOOTP) выдаёт узлу IP-адрес и параметры не навсегда, а в <b>аренду</b> (lease) на срок до 2<sup>32</sup> секунд. По истечении срока адрес снова считается свободным. Клиент работает с UDP-порта 68, сервер — 67.</p>
${F("L02_p09")}
${CARD("dora")}
${UL(["Продлить аренду можно, не дожидаясь конца срока: DHCPREQUEST (или DHCPINFORM — только параметры).","DHCPRELEASE — досрочное прекращение аренды (ipconfig /release).","Ошибки: DHCPNAK — параметры клиента нельзя использовать в текущей конфигурации; DHCPDECLINE — предложенные сервером параметры не подходят клиенту (адрес занят)."])}`,

"dhcp-4": `
<p>Сервер — пакет <b>isc-dhcp-server</b>. Нужно указать интерфейс, на котором слушать, и объявить хотя бы одну подсеть этого интерфейса.</p>
${CODE("sudo apt install isc-dhcp-server\n# /etc/default/isc-dhcp-server\nINTERFACESv4=\"ens33\"\n\n# /etc/dhcp/dhcpd.conf\nsubnet 192.168.20.0 netmask 255.255.255.0 {\n    option routers 192.168.20.1;\n    pool {\n        range 192.168.20.10 192.168.20.20;\n    }\n}")}
${H("Проверка результатов запуска")}
${UL(["Состояние службы: service isc-dhcp-server status (systemctl status isc-dhcp-server).","Процесс в памяти: ps aux | grep dhcpd.","Сообщения о загрузке: tail /var/log/syslog -n 20 или journalctl -u isc-dhcp-server.","Сокет: netstat -tunl | grep 67 (ss -ulnp | grep :67).","Синтаксис: dhcpd -t -cf /etc/dhcp/dhcpd.conf."])}
${CARD("dhcpconf")}`,

"dhcp-5": `
<p>Параметры, заданные вне блоков subnet, — <b>общие</b> (опции сервера). Внутри subnet — параметры этой сети, они переопределяют общие.</p>
${CODE("option domain-name \"ki0000.ru\";\noption domain-name-servers 10.200.12.2, 10.200.12.1;   # первичный и вторичный DNS\noption netbios-name-servers 10.200.12.2;              # WINS\ndefault-lease-time 600;\nmax-lease-time 7200;\n\nsubnet 10.200.12.0 netmask 255.255.255.192 {\n    range 10.200.12.20 10.200.12.40;\n    option routers 10.200.12.1;\n    option subnet-mask 255.255.255.192;\n    option broadcast-address 10.200.12.63;\n}")}
${tbl(["Опция","Значение"],[["time-offset","смещение времени клиента от UTC, с"],["lpr-servers","принт-серверы (RFC 1179)"],["host-name","имя клиента"],["ip-forwarding","разрешить клиенту пересылку пакетов (0/1)"],["default-ip-ttl","TTL по умолчанию"],["interface-mtu","MTU интерфейса (не меньше 68)"],["tcp-keepalive-interval","интервал keepalive TCP"],["static-routes","пары «сеть назначения — маршрутизатор»"],["ntp-servers","серверы времени"],["netbios-name-servers","серверы имён NetBIOS (WINS)"]])}`,

"dhcp-6": `
<p>Чтобы узел всегда получал один и тот же адрес, его MAC связывают с адресом блоком <b>host</b>. Адрес берут из той же сети, но вне диапазона range, чтобы он не достался другому узлу.</p>
${CODE("host winhost {\n    hardware ethernet 00:50:56:c0:00:02;\n    fixed-address 10.200.12.50;\n}\n\ngroup {\n    option domain-name-servers 192.168.20.1;\n    option domain-name \"net20.sfu.local\";\n    option routers 192.168.20.1;\n    host myHost1 { hardware ethernet …; fixed-address …; }\n    host myHost2 { hardware ethernet …; fixed-address …; }\n}")}
<p><b>group</b> задаёт общие параметры для нескольких host. MAC в Windows — «Физический адрес» в ipconfig /all, дефисы заменить на двоеточия.</p>`,

"dhcp-7": `
<p>Широковещательный DHCPDISCOVER не проходит через маршрутизатор. <b>DHCP relay</b> на маршрутизаторе принимает его и пересылает серверу обычным (unicast) пакетом, записав в поле <b>giaddr</b> свой адрес в сети клиента. По giaddr сервер выбирает нужный subnet и отправляет ответ обратно relay, а тот — клиенту.</p>
${F("sv_relay")}
${F("L02_p24")}
${CODE("sudo apt install isc-dhcp-relay\n# /etc/default/isc-dhcp-relay\nSERVERS=\"10.200.12.2\"\nINTERFACES=\"ens34 ens35\"\nOPTIONS=\"\"\nservice isc-dhcp-relay status")}
${CARD("relay")}
${N("На сервере должен быть объявлен subnet сети клиентов (10.200.12.64/26 с option routers 10.200.12.65). INTERFACESv4 сервера менять не нужно. В логе сервера: «DHCPDISCOVER from … via 10.200.12.65».")}`,

"dhcp-8": `
<p>В RFC 2131 синхронизация серверов решается обменом сообщениями трёх типов: синхронизация аренд, «hello» о состоянии и «I am back» — от первичного сервера после простоя. В ISC DHCP это блок <b>failover peer</b>.</p>
${CODE("failover peer \"dhcp-failover\" {\n    primary;                  # secondary — на втором сервере\n    address 192.168.200.2;\n    port 647;\n    peer address 192.168.200.3;\n    peer port 647;\n    max-response-delay 30;\n    max-unacked-updates 10;\n    load balance max seconds 3;\n}")}
${CARD("dhcpsec")}
${N("DHCP snooping также запоминает выданные адреса и запрещает трафик с адресов, назначенных вручную в обход DHCP.")}`,

"dhcp-9": `
<p>Любое устройство с IPv6 имеет <b>link-local</b> адрес fe80::/64. Глобальный адрес задаётся вручную, через <b>NDP/RA</b> или <b>DHCPv6</b>.</p>
${F("L02_p29")}
${UL(["<b>NDP/RA</b>: клиент шлёт Router Solicitation на ff02::2 («все маршрутизаторы»). Маршрутизатор сообщает адрес, префикс и маску, время жизни префикса и опции. Клиент выбирает адрес в сети и проверяет его на занятость. Реализация — пакет <b>radvd</b>.","<b>DHCPv6</b> работает почти как DHCP: DISCOVER и REQUEST идут на ff02::1:2, порты UDP 546/547, маршрутизаторы клиент ищет сам.","В /etc/network/interfaces: iface eth0 inet6 auto."])}
${CODE("interface eth0 {\n    AdvSendAdvert on;\n    prefix 2001:0db8:0100:f101::/64 {\n        AdvOnLink on;\n        AdvAutonomous on;\n    };\n};")}
${CARD("ipv6")}`
});
