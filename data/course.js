// SPDX-License-Identifier: GPL-3.0-or-later · Copyright (C) 2026 Пантелеев Г.Д.
/* Настройки курса для общего движка (js/app.js, js/helpers.js). */
const LECT = {L00:"вступительная лекция", L01:"лекция 1 «Структура сетевых служб в ОС Linux»", L02:"лекция 2 «Настройка сетевых параметров»",
  L03:"лекция 3 «DNS»", L05:"лекция 5 «Настройка сервера Web»", L06:"лекция 6 «Принципы организации электронной почты»",
  L16:"лекция 6 «Сервисы хранения файлов»", L07:"лекция 7 «Основы безопасности»", L08:"лекция 8 «SNMP»"};
const SECLABEL = {os:"Linux", dhcp:"DHCP", dns:"DNS", web:"Web", smb:"Samba", mail:"Почта", sec:"Безопасность", snmp:"SNMP", lab:"Лаба"};
const COURSE = {
  key: "netosquiz-v2",                       // v2: статистика по тексту вопроса, старая (v1) не переносится
  title: "Сетевые ОС и администрирование (Linux)",
  credit: "По материалам курса Казакова Ф.А. Автор: Пантелеев Г.Д.",
  /* Слайды лекций — img/slides/Lxx_pyy.webp, схемы стенда — img/svg/sv_*.svg (tools/draw_src/schemes.py). */
  img: k => k.indexOf("sv_") === 0 ? "img/svg/" + k + ".svg" : "img/slides/" + k + ".webp",
  figSource: k => { const m = k.match(/^(L\d\d)_p(\d\d)$/); return m ? (LECT[m[1]] || "лекция") + ", слайд " + (+m[2]) : ""; },
  tlabel: id => { const p = id.split("-"); return (SECLABEL[p[0]] || p[0]) + " · " + p[1]; },
  figWord: "Схема",
  inputHint: "Вопросы, где ответ — команда, файл, директива или число: его нужно набрать самому",
  ticketsNote: "Нажмите на вопрос, чтобы открыть ответ с командами и схемами.",
  schemesNote: "Схемы из лекций и нарисованные схемы стенда, а также шпаргалки с командами — по вопросам раздела. Нажмите на картинку, чтобы увеличить.",
  pair: {
    label: "Билет: два вопроса теории + лаба",
    pick: () => {
      const th = shuffle(SEC.filter(s => s.id !== "lab").map(s => s.id)).slice(0, 2).map(s => { const ts = topicsOf(s); return ts[Math.floor(Math.random() * ts.length)]; });
      const labs = topicsOf("lab");   // лаба 0 — подготовка стенда, в билет не попадает
      return th.concat(labs[1 + Math.floor(Math.random() * (labs.length - 1))]);
    }
  },
  sub: s => s.plural(s.n, ["вопрос", "вопроса", "вопросов"]) + " по " + SEC.filter(x => !x.testless && x.id !== "lab").length +
    " темам курса и 7 лабораторным: " + (s.n - s.ni) + " с выбором ответа и " + s.ni + " с вводом команды, файла или числа · " +
    s.plural(s.na, ["билет", "билета", "билетов"]) + " с ответами · " + s.plural(s.nc, ["шпаргалка", "шпаргалки", "шпаргалок"]) + ".",
  /* Сверка ввода: регистр важен (как в Linux); не учитываются лишние пробелы, приглашение $ или #, префикс sudo,
     вид кавычек, пробелы вокруг = , ; { }, точка с запятой в конце, порядок букв в слитных ключах (ss -tulnp = ss -lntup). */
  input: { prompt: /^[$#]\s+/, sudo: true, quotes: true, flags: true, seps: "=,;{}" }
};
