// SPDX-License-Identifier: GPL-3.0-or-later · Copyright (C) 2026 Пантелеев Г.Д.
/* Лабораторные работы 0–6: порядок выполнения на стенде 10.200.12.0/24 (Ubuntu Server 24.04, зона ki0000.ru)
   и что спрашивают на защите. Интерфейсы ens33/ens34/ens35 — замените на свои (ip -br link). */
Object.assign(A, {
"lab-0": `
<p><b>Цель</b>: создать три VM, соединить их по схеме VM1 — VM2 — VM3 (VM2 — в «Сеть СФУ»), установить ОС, разбить выданный блок на сети и нарисовать схему с MAC и IP.</p>
${F2("sv_lab","Стенд лабораторных","L00_p06","Типовой стенд курса")}
${H("1. Сети в VMware (Edit → Virtual Network Editor)")}
${UL(["VMnet2: Host-only, DHCP VMware выключен, адаптер хоста подключён, 10.200.12.0 / 255.255.255.192.","VMnet3: Host-only, DHCP выключен, адаптер хоста не подключён, 10.200.12.64 / 255.255.255.192.","VMnet8 (NAT) — как есть: выход VM2 в интернет."])}
${H("2. Адреса (netplan)")}
${CODE("# VM2 /etc/netplan/01-lab.yaml\nnetwork:\n  version: 2\n  ethernets:\n    ens33: { dhcp4: true }\n    ens34: { addresses: [10.200.12.1/26] }\n    ens35: { addresses: [10.200.12.65/26] }\n# VM1: 10.200.12.2/26, default via 10.200.12.1\nsudo chmod 600 /etc/netplan/01-lab.yaml && sudo netplan apply")}
${H("3. Маршрутизация и NAT на VM2")}
${CODE("echo 'net.ipv4.ip_forward=1' | sudo tee /etc/sysctl.d/99-forward.conf\nsudo sysctl --system\nsudo iptables -t nat -A POSTROUTING -s 10.200.12.0/24 -o ens33 -j MASQUERADE\nsudo apt install iptables-persistent")}
${CARD("lab")}
${N("На защите: показать ip -br a и ip route на всех VM, ping и traceroute между N1 и N2, расчёт подсетей /26 (маска 255.255.255.192, 62 узла). Хосту Windows VMware даёт адрес .1 — его меняют на 10.200.12.10, иначе конфликт с VM2.")}`,

"lab-1": `
<p><b>Цель</b>: изучить динамическую конфигурацию хостов, установку и работу DHCP-сервера и relay.</p>
${H("1. Пул N1 и опции (VM1)")}
${CODE("# /etc/default/isc-dhcp-server\nINTERFACESv4=\"ens33\"\n# /etc/dhcp/dhcpd.conf\nauthoritative;\ndefault-lease-time 600;\nmax-lease-time 7200;\noption domain-name \"ki0000.ru\";\noption domain-name-servers 10.200.12.2, 10.200.12.1;\noption netbios-name-servers 10.200.12.2;\nsubnet 10.200.12.0 netmask 255.255.255.192 {\n    range 10.200.12.20 10.200.12.40;\n    option routers 10.200.12.1;\n    option subnet-mask 255.255.255.192;\n}\nsudo dhcpd -t -cf /etc/dhcp/dhcpd.conf && sudo systemctl restart isc-dhcp-server")}
<p>Проверка с хоста: адаптер VMnet2 → «получить автоматически», ipconfig /release и /renew, ipconfig /all.</p>
${H("2. Закрепление адреса")}
${CODE("host winhost {\n    hardware ethernet 00:50:56:c0:00:02;\n    fixed-address 10.200.12.50;\n}")}
${H("3. Relay на VM2")}
${CODE("# VM1: subnet 10.200.12.64 netmask 255.255.255.192 { range 10.200.12.80 10.200.12.100; option routers 10.200.12.65; }\n# VM2: sudo apt install isc-dhcp-relay; /etc/default/isc-dhcp-relay\nSERVERS=\"10.200.12.2\"\nINTERFACES=\"ens34 ens35\"\n# VM3 netplan: dhcp4: true")}
${H("4. Анализ")}
${CODE("sudo tcpdump -n -i any -vv 'port 67 or port 68' -w /tmp/dhcp.pcap   # на VM2")}
${F("sv_relay")}
${N("На защите: DORA и номера портов; зачем giaddr; почему relay слушает оба интерфейса; чем продление (unicast напрямую серверу) отличается от первичного получения; где лежат аренды (/var/lib/dhcp/dhcpd.leases).")}`,

"lab-2": `
<p><b>Цель</b>: изучить организацию DNS и настройку bind9: зона, делегирование, обратная зона, slave, rndc, рекурсия.</p>
${H("1. Зона ki0000.ru (VM1)")}
${CODE("zone \"ki0000.ru\" {\n    type master;\n    file \"/etc/bind/db.ki0000.ru\";\n    allow-transfer { 127.0.0.1; 10.200.12.1; };\n    forwarders { };\n};")}
<p>В зоне не меньше трёх записей A, CNAME и MX. Проверка: host, dig на сервере; nslookup на хосте (DNS = 10.200.12.2).</p>
${H("2. Делегирование z1")}
${CODE("; VM1, db.ki0000.ru (Serial +1)\nz1      IN  NS  ns.z1.ki0000.ru.\nns.z1   IN  A   10.200.12.1\n; VM2: master-зона z1.ki0000.ru с also-notify и allow-transfer для VM1")}
${H("3–4. Обратная зона и slave")}
${CODE("zone \"12.200.10.in-addr.arpa\" { type master; file \"/etc/bind/db.10.200.12\"; };\nzone \"z1.ki0000.ru\" { type slave; masters { 10.200.12.1; }; file \"/var/cache/bind/db.z1.ki0000.ru\"; masterfile-format text; };")}
${H("5–6. rndc и рекурсия")}
${CODE("sudo rndc status ; sudo rndc reload ; sudo rndc retransfer z1.ki0000.ru\nsudo rndc stats   # /var/cache/bind/named.stats\nsudo rndc dumpdb -all   # /var/cache/bind/named_dump.db\nsudo rndc stop\n# recursion no; → dig @10.200.12.2 www.z1.ki0000.ru — только ссылка (referral)")}
${F("sv_dns")}
${N("На защите: разница ответов VM1 и VM2 (VM2 не знает ki0000.ru — делегирование идёт сверху вниз); зачем glue и forwarders { }; почему без нового Serial slave не обновится; флаги aa, rd, ra в dig. Пункт 6 делайте до пункта 4: после slave VM1 сама авторитетна за z1.")}`,

"lab-3": `
<p><b>Цель</b>: развернуть Apache, разместить PHP и CGI, настроить виртуальные хосты, .htaccess с авторизацией, балансировку и разобрать HTTP.</p>
${CODE("sudo apt install apache2 php libapache2-mod-php\n# DNS: www IN A 10.200.12.2 ; site1/site2 IN CNAME vm1\nsudo a2enmod cgi\n# /var/www/html/php/index.php, /usr/lib/cgi-bin/hello.sh (chmod 755)\nsudo a2ensite site1 site2 && sudo systemctl reload apache2\n# apache2.conf: <Directory /var/www/> AllowOverride All\nsudo htpasswd -c /etc/apache2/.htpasswd webuser1\n# копия на VM2 + вторая запись www IN A 10.200.12.1 — round-robin")}
${F("sv_vhost")}
${CARD("htaccess")}
${N("На защите: структура запроса и ответа в Wireshark, заголовок Host и выбор виртуального хоста, 401 и Authorization: Basic, условный запрос If-Modified-Since / If-None-Match → 304, почему балансировка через DNS не учитывает отказ сервера.")}`,

"lab-4": `
<p><b>Цель</b>: установить Samba, создать общие папки с разными правами, проверить доступ клиентом с VM2 и запустить WINS.</p>
${CODE("for u in sread swrite sroot; do sudo useradd -M -s /usr/sbin/nologin $u; sudo smbpasswd -a $u; done\nsudo mkdir -p /srv/samba/{public,readonly,readwrite,rootshare}\n# smb.conf: [public] guest ok; [readonly] valid users = sread, read only = yes;\n#           [readwrite] valid users = swrite, read only = no; [rootshare] force user = root\n# [global] wins support = yes\ntestparm && sudo systemctl restart smbd nmbd\n# VM2\nsmbclient -L //10.200.12.2 -N\nsmbclient //10.200.12.2/readonly -U sread -c 'put /etc/hostname x.txt'   # NT_STATUS_ACCESS_DENIED\nnmblookup -U 10.200.12.2 -R VM2")}
${CARD("smbtools")}
${N("На защите: чем отличаются valid users, read only, guest ok и force user; почему файл в rootshare принадлежит root; какие порты у NetBIOS и SMB; как проверить регистрацию в WINS (wins.dat, nmblookup, nbtstat).")}`,

"lab-5": `
<p><b>Цель</b>: настроить Postfix и Dovecot на VM1 и VM2, отправить почту между серверами, настроить псевдоним и MX для vm3.</p>
${CODE("sudo apt install postfix mailutils dovecot-imapd dovecot-pop3d   # Internet Site\nsudo postconf -e 'myhostname = vm1.ki0000.ru' 'mydestination = $myhostname, localhost.$mydomain, localhost' 'mynetworks = 127.0.0.0/8 10.200.12.0/24'\n# Dovecot: disable_plaintext_auth = no\nsudo adduser usr1 ; sudo adduser usr2      # VM1;  usr3, usr4 — VM2\n# /etc/aliases на VM1: usr2: usr3@vm2.ki0000.ru → sudo newaliases\n# DNS: vm3 IN MX 10 vm2.ki0000.ru.\n# VM2: mydestination = $myhostname, vm3.ki0000.ru, localhost.$mydomain, localhost\necho test | mail -s lab5 usr4@vm3.ki0000.ru")}
${F("sv_mail")}
${N("На защите: роли MTA/MDA/MUA; как VM1 нашла VM2 (MX); что такое mydestination и mynetworks; путь письма по заголовкам Received и mail.log; почему в задании srv3 — это vm3.ki0000.ru.")}`,

"lab-6": `
<p><b>Цель</b>: настроить SNMP-агентов на VM1 и VM2, установить на VM2 MySQL, Apache и Cacti, настроить графики трафика, CPU и свободного места.</p>
${CODE("sudo apt install snmpd snmp     # VM1 и VM2\n# snmpd.conf: agentaddress udp:161 ; rocommunity ki0000ro 10.200.12.0/24\nsnmpwalk -v2c -c ki0000ro 10.200.12.2 1.3.6.1.2.1.1\nsudo apt install mysql-server apache2 php libapache2-mod-php cacti   # VM2\n# http://10.200.12.1/cacti → admin/admin → New Primary Server → Net-SNMP Device")}
${F("sv_snmp")}
${CARD("cacti")}
${N("На защите: агент и менеджер, порты 161/162, community и почему его ограничивают по адресам, что делает poller, откуда берутся данные для трёх видов графиков (IF-MIB, UCD-SNMP, HOST-RESOURCES-MIB).")}`
});
