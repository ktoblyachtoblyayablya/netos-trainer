"""Схемы sv_* для тренажёра «Сетевые ОС (Linux)»: python3 tools/draw_src/schemes.py
Стенд — вариант 10.200.12.0/24, зона ki0000.ru."""
from svglib import D, INK, ACC, BLUE, GREEN, GREY, FILL_ACC, FILL_BLUE, FILL_GREY

FILL_GREEN = "#e3f4ea"


def lab():
    d = D(760, 470)
    d.box(270, 16, 220, 50, "Интернет", ["VMware NAT · VMnet8"], s=13, fill=FILL_GREY, c=GREY)
    d.line(380, 66, 380, 110)
    d.text(390, 93, "ens33 · DHCP 192.168.x.y", s=12, a="start", c=GREY)
    d.box(250, 110, 260, 80, "VM2 — маршрутизатор", ["NAT, DHCP-relay, DNS z1", "Apache, Postfix, MySQL, Cacti"], s=13, fill=FILL_ACC, c=ACC)
    d.line(300, 190, 300, 250, c=BLUE)
    d.line(460, 190, 460, 250, c=GREEN)
    d.text(292, 226, "ens34 · 10.200.12.1", s=12, a="end", c=BLUE)
    d.text(468, 226, "ens35 · 10.200.12.65", s=12, a="start", c=GREEN)
    d.box(20, 250, 340, 46, "N1 · VMnet2 · 10.200.12.0/26", ["host-only, пул DHCP .20–.40"], s=13, fill=FILL_BLUE, c=BLUE)
    d.box(400, 250, 340, 46, "N2 · VMnet3 · 10.200.12.64/26", ["host-only, пул .80–.100 через relay"], s=13, fill=FILL_GREEN, c=GREEN)
    for x in (100, 280):
        d.line(x, 296, x, 340, c=BLUE)
    d.line(570, 296, 570, 340, c=GREEN)
    d.box(20, 340, 160, 112, "VM1 — сервер", ["ens33 · 10.200.12.2", "DHCP, DNS master", "Apache, Samba, WINS", "Postfix, Dovecot, SNMP"], s=12.5)
    d.box(200, 340, 160, 112, "Хост Windows", ["адаптер VMnet2", "DHCP → 10.200.12.50", "nslookup, браузер,", "Wireshark, Thunderbird"], s=12.5)
    d.box(490, 340, 160, 112, "VM3 — клиент", ["ens33 · DHCP", "через relay VM2", "резерв 10.200.12.70", "vm3.ki0000.ru"], s=12.5)
    return d.save("sv_lab")


def subnets():
    d = D(760, 220)
    d.text(380, 26, "Блок 10.200.12.0/24 → четыре подсети /26 (маска 255.255.255.192)", s=14, wt="bold")
    x0, w = 30, 175
    segs = [("N1", "10.200.12.0/26", ".0 – .63", "узлы .1–.62, шлюз .1", FILL_BLUE, BLUE),
            ("N2", "10.200.12.64/26", ".64 – .127", "узлы .65–.126, шлюз .65", FILL_GREEN, GREEN),
            ("резерв", "10.200.12.128/26", ".128 – .191", "свободна", FILL_GREY, GREY),
            ("резерв", "10.200.12.192/26", ".192 – .255", "свободна", FILL_GREY, GREY)]
    for i, (n, net, rng, note, f, c) in enumerate(segs):
        x = x0 + i * w
        d.rect(x, 50, w, 80, c=c, fill=f)
        d.text(x + w / 2, 74, n, s=14, wt="bold", c=c)
        d.text(x + w / 2, 94, net, s=13)
        d.text(x + w / 2, 113, rng, s=12.5, c=GREY)
        d.text(x + w / 2, 152, note, s=12)
    d.text(380, 186, "2⁶ = 64 адреса в подсети, из них 62 для узлов: первый — адрес сети, последний — broadcast", s=13)
    d.text(380, 206, "Номер сети /26 — кратен 64 в последнем октете: .0, .64, .128, .192", s=12.5, c=GREY)
    return d.save("sv_subnets")


def relay():
    d = D(760, 440)
    xs = {"c": 110, "r": 380, "s": 650}
    d.box(30, 12, 160, 44, "Клиент VM3", ["0.0.0.0 → получит .8x"], s=12.5)
    d.box(290, 12, 180, 44, "Relay VM2", ["ens35 .65 · ens34 .1"], s=12.5, fill=FILL_ACC, c=ACC)
    d.box(570, 12, 160, 44, "Сервер VM1", ["isc-dhcp-server .2"], s=12.5, fill=FILL_BLUE, c=BLUE)
    for x in xs.values():
        d.line(x, 56, x, 430, c=GREY, w=1.2, dash="4 4")
    msgs = [("c", "r", "DISCOVER (broadcast)", "0.0.0.0:68 → 255.255.255.255:67", INK),
            ("r", "s", "DISCOVER, giaddr = 10.200.12.65", "unicast 10.200.12.1:67 → .2:67", ACC),
            ("s", "r", "OFFER → giaddr", "сервер выбрал пул N2 по giaddr", BLUE),
            ("r", "c", "OFFER (yiaddr)", ".65:67 → клиент :68", INK),
            ("c", "r", "REQUEST (broadcast)", "option 50, option 54", INK),
            ("r", "s", "REQUEST, giaddr = .65", "", ACC),
            ("s", "r", "ACK", "аренда 600 с", BLUE),
            ("r", "c", "ACK", "клиент настраивает ens33", INK)]
    y = 84
    for a, b, t, sub, c in msgs:
        x1, x2 = xs[a], xs[b]
        dx = 6 if x2 > x1 else -6
        d.arrow(x1 + dx, y, x2 - dx, y, c=c)
        xm = (x1 + x2) / 2
        d.text(xm, y - 6, t, s=12.5, wt="bold", c=c)
        if sub:
            d.text(xm, y + 15, sub, s=11, c=GREY)
        y += 44
    return d.save("sv_relay")


def dns():
    d = D(760, 320)
    d.box(290, 14, 200, 50, "Внешние DNS", ["forwarders 8.8.8.8, 1.1.1.1"], s=12.5, fill=FILL_GREY, c=GREY)
    d.box(20, 140, 170, 70, "Клиент", ["хост Windows, VM3", "DNS = 10.200.12.2"], s=12.5)
    d.box(290, 110, 200, 140, "VM1 · ns1.ki0000.ru", ["master ki0000.ru", "master 12.200.10.in-addr.arpa", "slave z1.ki0000.ru", "recursion yes", "forwarders { } в зоне"], s=12.5, fill=FILL_BLUE, c=BLUE)
    d.box(580, 120, 160, 100, "VM2 · ns.z1", ["master z1.ki0000.ru", "also-notify VM1", "allow-transfer VM1"], s=12.5, fill=FILL_ACC, c=ACC)
    d.arrow(190, 175, 288, 175)
    d.text(239, 167, "запрос", s=12)
    d.text(239, 192, "RD = 1", s=11, c=GREY)
    d.arrow(390, 108, 390, 66, c=GREY)
    d.text(398, 92, "внешние имена", s=12, a="start", c=GREY)
    d.arrow(490, 145, 578, 145, c=ACC)
    d.text(534, 137, "NS z1 + glue", s=12, c=ACC)
    d.arrow(578, 200, 492, 200, c=BLUE, dash="6 4")
    d.text(535, 192, "NOTIFY", s=12, c=BLUE)
    d.text(535, 218, "AXFR → slave", s=12, c=BLUE)
    d.text(380, 284, "Делегирование: в зоне ki0000.ru строки  z1 IN NS ns.z1.ki0000.ru.  и  ns.z1 IN A 10.200.12.1", s=12.5)
    d.text(380, 306, "Slave: VM1 сама становится авторитетной за z1 и обновляет копию по Serial", s=12.5, c=GREY)
    return d.save("sv_dns")


def mail():
    d = D(760, 340)
    d.box(20, 30, 150, 60, "Thunderbird", ["MUA · хост"], s=13)
    d.box(250, 30, 200, 60, "VM1 · Postfix", ["MTA · vm1.ki0000.ru"], s=13, fill=FILL_BLUE, c=BLUE)
    d.box(540, 30, 200, 60, "VM2 · Postfix", ["MTA · vm2, vm3.ki0000.ru"], s=13, fill=FILL_ACC, c=ACC)
    d.arrow(170, 60, 248, 60)
    d.text(209, 52, "SMTP :25", s=12)
    d.arrow(450, 60, 538, 60, c=ACC)
    d.text(494, 52, "SMTP :25", s=12, c=ACC)
    d.box(250, 150, 200, 64, "DNS на VM1", ["vm2 MX 10 vm2", "vm3 MX 10 vm2"], s=12.5, fill=FILL_GREY, c=GREY)
    d.arrow(330, 92, 330, 148, c=GREY, dash="5 4")
    d.text(322, 124, "MX?", s=12, a="end", c=GREY)
    d.box(560, 140, 180, 56, "MDA → /var/mail/usr3", ["mbox (mydestination)"], s=12.5)
    d.arrow(640, 92, 640, 138)
    d.box(560, 236, 180, 56, "Dovecot", ["IMAP :143 · POP3 :110"], s=12.5, fill=FILL_GREEN, c=GREEN)
    d.arrow(640, 198, 640, 234)
    d.path([(558, 264), (95, 264), (95, 92)], c=GREEN, arrow=True)
    d.text(330, 256, "клиент забирает письмо: IMAP/POP3, логин usr3", s=12, c=GREEN)
    d.text(380, 322, "Псевдоним на VM1 (/etc/aliases): usr2: usr3@vm2.ki0000.ru — письмо для usr2 уходит на VM2", s=12.5)
    return d.save("sv_mail")


def nat():
    d = D(760, 250)
    d.box(20, 80, 160, 70, "VM1", ["10.200.12.2", "шлюз 10.200.12.1"], s=13)
    d.box(280, 50, 220, 130, "VM2", ["ens34 ← N1", "ip_forward = 1", "nat POSTROUTING", "-o ens33 -j MASQUERADE", "ens33 → NAT"], s=12.5, fill=FILL_ACC, c=ACC)
    d.box(600, 80, 140, 70, "Интернет", ["8.8.8.8"], s=13, fill=FILL_GREY, c=GREY)
    d.arrow(180, 100, 278, 100)
    d.text(229, 92, "src 10.200.12.2", s=11.5)
    d.arrow(500, 100, 598, 100, c=ACC)
    d.text(549, 92, "src 192.168.x.y", s=11.5, c=ACC)
    d.arrow(598, 135, 502, 135, dash="5 4", c=GREY)
    d.arrow(278, 135, 182, 135, dash="5 4", c=GREY)
    d.text(549, 152, "ответ", s=11.5, c=GREY)
    d.text(229, 152, "dst 10.200.12.2", s=11.5, c=GREY)
    d.text(380, 214, "conntrack помнит соединение и возвращает ответ внутреннему адресу", s=12.5)
    d.text(380, 234, "MASQUERADE = SNAT на текущий адрес выходного интерфейса (удобно, когда адрес даёт DHCP)", s=12, c=GREY)
    return d.save("sv_nat")


def snmp():
    d = D(760, 300)
    d.box(20, 30, 150, 56, "Браузер", ["http://10.200.12.1/cacti"], s=12.5)
    d.box(260, 20, 240, 170, "VM2 · Cacti (менеджер)", ["Apache + PHP — веб-интерфейс", "MySQL — устройства, шаблоны", "poller раз в 5 мин (cron)", "RRDtool — хранит и рисует", "snmpwalk/snmpget", "+ свой snmpd (localhost)"], s=12.5, fill=FILL_ACC, c=ACC)
    d.arrow(170, 58, 258, 58)
    d.text(214, 50, "HTTP", s=12)
    d.box(590, 40, 150, 76, "VM1 · snmpd", ["агент, UDP 161", "rocommunity", "ki0000ro"], s=12.5, fill=FILL_BLUE, c=BLUE)
    d.arrow(500, 60, 588, 60, c=ACC)
    d.text(544, 52, "Get / GetNext", s=11.5, c=ACC)
    d.arrow(588, 96, 502, 96, c=BLUE)
    d.text(544, 112, "Response", s=11.5, c=BLUE)
    d.arrow(588, 150, 502, 150, c=GREY, dash="5 4")
    d.text(544, 166, "Trap :162", s=11.5, c=GREY)
    d.text(380, 230, "Что рисует Cacti: трафик интерфейсов (IF-MIB ifIn/OutOctets),", s=12.5)
    d.text(380, 250, "загрузку CPU (UCD-SNMP, .1.3.6.1.4.1.2021.11), свободное место (HOST-RESOURCES hrStorage)", s=12.5)
    d.text(380, 276, "SNMPv2c передаёт community открытым текстом — доступ ограничивают источником 10.200.12.0/24", s=12, c=GREY)
    return d.save("sv_snmp")


def vhost():
    d = D(760, 230)
    names = [("www.ki0000.ru", "A 10.200.12.2"), ("site1.ki0000.ru", "CNAME vm1"), ("site2.ki0000.ru", "CNAME vm1")]
    dirs = ["/var/www/html", "/var/www/site1", "/var/www/site2"]
    for i, (n, r) in enumerate(names):
        y = 20 + i * 66
        d.box(20, y, 180, 48, n, [r], s=12.5)
        d.arrow(200, y + 24, 288, 110)
        d.box(560, y, 180, 48, dirs[i], ["DocumentRoot"], s=12.5, fill=FILL_GREEN, c=GREEN)
        d.arrow(470, 110, 558, y + 24, c=GREEN)
    d.box(290, 66, 180, 90, "Apache", ["10.200.12.2:80", "смотрит заголовок", "Host: → VirtualHost"], s=12.5, fill=FILL_ACC, c=ACC)
    d.text(380, 222, "Один IP — много сайтов: выбор по ServerName / ServerAlias (name-based virtual hosts)", s=12.5)
    return d.save("sv_vhost")


if __name__ == "__main__":
    for f in (lab, subnets, relay, dns, mail, nat, snmp, vhost):
        print(f())
