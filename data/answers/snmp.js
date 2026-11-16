// SPDX-License-Identifier: GPL-3.0-or-later · Copyright (C) 2026 Пантелеев Г.Д.
/* Билеты: SNMP и мониторинг (лекция 8, лабораторная 6). */
Object.assign(A, {
"snmp-1": `
${H("Задачи")}
${UL(["отслеживание доступности сетевой инфраструктуры;","отслеживание критических параметров устройств (температура, загрузка ЦП, свободное место на диске и т. д.);","отслеживание аномалий параметров;","оповещение администратора о возможных проблемах."])}
${H("Методы сбора данных")}
${UL(["ICMP (ping и т. д.) — только доступность.","Удалённый вход (telnet/SSH) — команды на устройстве.","SNMP — стандартный протокол опроса и управления."])}
<p>Системы мониторинга: Cacti, Zabbix, Nagios, MRTG, Munin, NetXMS, OpenNMS, PRTG, RRDtool и другие.</p>`,

"snmp-2": `
${F("L08_p04")}
${UL(["<b>Агент</b> — ПО на управляемом устройстве (или на устройстве, подключённом к его интерфейсу управления).","<b>Менеджер</b> — управляющее ПО на компьютере администратора.","<b>NMS</b> (Network Management System) — ПО, которое через менеджеров поддерживает структуру данных о состоянии сети.","<b>Управляемое устройство</b> — элемент сети с интерфейсом управления (не обязательно SNMP): доступ только на чтение или на чтение и запись."])}
${F("sv_snmp")}
${N("Порты: агент принимает запросы на UDP 161, менеджер принимает trap на UDP 162.")}`,

"snmp-3": `
<p><b>OID</b> (Object IDentifier) — уникальное значение, однозначно определяющее элемент управляемого устройства. OID образуют иерархическое дерево: 1.3.6.1 = iso.org.dod.internet, 1.3.6.1.4.1 = private.enterprises, 1.3.6.1.4.1.9 = cisco.</p>
<p><b>MIB</b> (Management Information Base) описывает структуру управляемых данных подсистемы. Каждый OID имеет текстовое имя и числовой SNMP-адрес. MIB необязательны: они переводят имена в числа, «как DNS».</p>
${F("L08_p08")}
${CARD("oid")}`,

"snmp-4": `${CARD("snmpmsg")}
${N("snmpwalk обходит поддерево, посылая GetNextRequest, пока OID ответа не выйдет за пределы поддерева.")}`,

"snmp-5": `${CARD("snmpver")}
${UL(["<b>Ключ авторизации</b> (Auth key) генерируется из пароля авторизации, им подписываются все сообщения SNMPv3.","Необязательный <b>ключ шифрования</b> (Private key) получают из priv password, тогда сообщения шифруются.","В v3 вместо community — логины."])}`,

"snmp-6": `
${CODE("sudo apt install snmpd snmp\n# /etc/snmp/snmpd.conf\nagentAddress udp:192.168.237.56:161          # где слушать\ncreateUser login SHA \"auth password\" AES \"priv password\"\nrouser login                                 # SNMPv3\nrocommunity public                           # SNMPv2\n\nservice snmpd start|stop|restart")}
${H("Стенд (лаба 6)")}
${CODE("agentaddress udp:161\nsysLocation  VM1, network N1\nsysContact   admin@ki0000.ru\nrocommunity  ki0000ro 10.200.12.0/24\nrocommunity  ki0000ro 127.0.0.1\ndisk  /\nload  12 10 5")}
${N("По умолчанию в Ubuntu snmpd слушает только 127.0.0.1 и отдаёт лишь ветку system (view systemonly). Для Cacti конфигурацию меняют, иначе графиков не будет.")}`,

"snmp-7": `${CARD("snmpd")}
${CODE("snmpwalk -v2c -c community IP OID\nsnmpwalk -v3 -l authPriv -u login -a SHA -A auth_password -x AES -X priv_password IP OID\nsnmpget -v2c -c ki0000ro 10.200.12.2 1.3.6.1.2.1.1.5.0\nsnmpset -v2c -c private 10.200.12.2 1.3.6.1.2.1.1.6.0 s \"Krasnoyarsk\"")}
${N("На оборудовании Cisco: access-list 10 permit &lt;IP менеджера&gt;, snmp-server community public RO, snmp-server group … v3 priv, snmp-server user … auth sha … priv aes ….")}`,

"snmp-8": `
<p><b>Cacti</b> — открытая система мониторинга. Poller по cron (раз в 5 минут) опрашивает устройства по SNMP, данные пишутся в базы RRDtool, по ним строятся графики. Конфигурация (устройства, шаблоны, графики) хранится в MySQL, интерфейс работает на Apache + PHP.</p>
${CARD("cacti")}
${CODE("sudo apt install mysql-server apache2 php libapache2-mod-php\nsudo apt install cacti                  # dbconfig-common: Yes, веб-сервер apache2\nmysql_tzinfo_to_sql /usr/share/zoneinfo | sudo mysql mysql\n# http://10.200.12.1/cacti — admin/admin, мастер установки, шаблоны Net-SNMP Device\nsudo -u www-data php /usr/share/cacti/site/poller.php --force")}`
});
