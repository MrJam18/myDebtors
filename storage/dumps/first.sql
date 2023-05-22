--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2 (Ubuntu 15.2-1.pgdg22.04+1)
-- Dumped by pg_dump version 15.2 (Ubuntu 15.2-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: actionObjects; Type: TABLE DATA; Schema: public; Owner: postgres
--
COPY public.user_roles (id, name) FROM stdin;
1	Администратор
\.
COPY public.groups (id, name, created_at, updated_at) FROM stdin;
1	УФК	now()	now()
\.
COPY public.users (id, name, surname, patronymic, email, password, is_online, phone, "created_at", "updated_at", email_verified_at, role_id, group_id) FROM stdin;
1	Джамиль	Мамедов	Рафигович	mr.jam18@yandex.ru	$2b$04$qH.ugIzR6.us.3e9V6l0YuPiBphbY67l4yU64PpmdfulbTx47vDjm	f	+79821174497	now()	now()	\N	1	1
\.
COPY public."action_objects" (id, name) FROM stdin;
1	судебный приказ
2	Платеж
3	Название договора
4	дата выдачи
5	дата исполнения
6	сумма выдачи
7	процентная ставка
8	размер неустойки
9	номер договора
10	комментарий
11	исковое заявление
12	статус
13	заявление о возбуждении ИП
14	файл
\.


--
-- Data for Name: actionTypes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."action_types" (id, name) FROM stdin;
1	создание
2	добавление
3	удаление
4	изменение
\.


--
-- Data for Name: areas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.areas (id, name) FROM stdin;
1	Дебёсский р-н
\.


--
-- Data for Name: bankRequisites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."bank_requisites" (id, name, "BIK") FROM stdin;
1	Филиал ПАО "Банк Уралсиб" в г. Уфа	048073770
\.


--
-- Data for Name: block_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.block_types (id, name, short) FROM stdin;
1	корпус	к
\.



--
-- Data for Name: cessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cession_groups (id, name, "created_at", "updated_at", "user_id") FROM stdin;
6	переименование ООО МКК "УФК" в ООО "УФК"	2022-12-22 14:08:30.814+04	2022-12-22 14:08:30.814+04	1
7	дог. № 30/19 от 15.01.2019 г. ООО МКК "УФК" - Тутулин В. Г.	2022-12-22 14:08:30.814+04	2022-12-22 14:08:30.814+04	1
8	переименование ООО МФО "УФК" - ООО "УФК"	2022-12-22 14:08:30.814+04	2022-12-22 14:08:30.814+04	1
\.


--
-- Data for Name: city_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.settlement_types (id, name, short) FROM stdin;
1	город	г
2	деревня	д
3	село	с
\.


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.settlements (id, name) FROM stdin;
1	Ижевск
2	Бор
3	Москва
4	Нижний Новгород
5	Сюрногурт
6	Дебёсы
\.


--
-- Data for Name: contract_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contract_types (id, name) FROM stdin;
1	loan
2	credit
\.


--
-- Data for Name: creditorTypes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."creditor_types" (id, name) FROM stdin;
1	Микрофинансовая организация
2	Банк
3	Физическое лицо
\.


--
-- Data for Name: flat_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.flat_types (id, name, short) FROM stdin;
1	квартира	кв
2	офис	офис
\.


--
-- Data for Name: house_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.house_types (id, name, short) FROM stdin;
1	дом	д
\.


--
-- Data for Name: region_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.region_types (id, name, short) FROM stdin;
1	республика	Респ
2	область	обл
3	город	г
\.


--
-- Data for Name: regions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.regions (id, name) FROM stdin;
1	Удмуртская
2	Нижегородская
3	Москва
\.


--
-- Data for Name: requisites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requisites (id, "checking_account", "correspondent_account", "created_at", "updated_at", "bank_id") FROM stdin;
3	0                   	0                   	2022-12-27 17:00:35.825+04	2022-12-27 17:00:35.825+04	1
1	40701810001070000003	30101810600000000770	2022-12-24 16:26:03.31+04	2023-01-02 09:53:45.433+04	1
2	40701810001070000003	30101810600000000770	2022-12-24 16:28:28.174+04	2023-01-02 09:53:50.534+04	1
4	40817810001079001667	30101810600000000770	2023-01-06 14:40:42.651+04	2023-01-06 14:40:42.651+04	1
5	00000000000000000000	00000000000000000000	2023-01-06 16:54:20.659+04	2023-01-06 16:54:20.659+04	1
\.


--
-- Data for Name: street_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.street_types (id, name, short) FROM stdin;
1	улица	ул
2	проспект	пр-кт
3	территория	тер
\.


--
-- Data for Name: streets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.streets (id, name) FROM stdin;
1	Воровского
2	Ленина
3	12-я
4	Тестовская
5	им Петрова
6	Клубная
7	Красноармейская
8	Удмуртская
9	Лесная
10	Ивана Сусанина
11	Автозаводская
12	Ключевой поселок
13	им Татьяны Барамзиной
14	Гагарина
15	Пушкинская
16	Циолковского
17	Совхоз Медведево
18	Сибирская
19	Советская
20	9 Января
21	Молодежная
22	Союзная
23	Карла Либкнехта
24	Колосковая
25	50 лет Пионерии
26	40 лет Победы
27	Труда
28	Коммунаров
29	Дарьинская
30	Вологодская
\.
