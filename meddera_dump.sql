--
-- PostgreSQL database dump
--

\restrict 90UdIjn8tUQnWOPoOrbThjFdhpFTY53iKr6p3tVDEVI962O63sy2K7mbRFnstd2

-- Dumped from database version 17.10 (Debian 17.10-1.pgdg13+1)
-- Dumped by pg_dump version 17.10 (Debian 17.10-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: meddera_admin
--

CREATE TYPE public."Role" AS ENUM (
    'DOCTOR',
    'SUPERADMIN'
);


ALTER TYPE public."Role" OWNER TO meddera_admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: User; Type: TABLE; Schema: public; Owner: meddera_admin
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    role public."Role" DEFAULT 'DOCTOR'::public."Role" NOT NULL,
    "passwordHash" text,
    "googleId" text,
    "telegramId" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "mustChangePassword" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO meddera_admin;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: meddera_admin
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO meddera_admin;

--
-- Name: patients; Type: TABLE; Schema: public; Owner: meddera_admin
--

CREATE TABLE public.patients (
    id text NOT NULL,
    full_name text NOT NULL,
    phone text NOT NULL,
    birth_date text NOT NULL,
    address text NOT NULL,
    idnp text NOT NULL,
    last_visit_date text NOT NULL,
    complaints text DEFAULT ''::text NOT NULL,
    anamnesis text DEFAULT ''::text NOT NULL,
    objective_exam text DEFAULT ''::text NOT NULL,
    diagnosis text DEFAULT ''::text NOT NULL,
    investigations text DEFAULT ''::text NOT NULL,
    recommendations text DEFAULT ''::text NOT NULL,
    treatment text DEFAULT ''::text NOT NULL,
    procedure text DEFAULT ''::text NOT NULL,
    product text DEFAULT ''::text NOT NULL,
    patient_consent boolean DEFAULT false NOT NULL
);


ALTER TABLE public.patients OWNER TO meddera_admin;

--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: meddera_admin
--

COPY public."User" (id, email, name, role, "passwordHash", "googleId", "telegramId", "isActive", "mustChangePassword", "createdAt") FROM stdin;
cmsdw5w5y00002jhxq7kpq2db	schedrovstudio@gmail.com	Alex Dev	SUPERADMIN	$2b$12$lQ072mkb01VEexB1wqrGHuKnKNuEyouW1dTrwx807K.eb6vFIDFxG	103588588998621290412	256302541	t	f	2026-08-03 23:59:58.486
cmsem159m0000nv01qnwhweey	asd@gmail.com	Ecaterina Pintea	DOCTOR	\N	\N	6576456966	t	f	2026-08-04 12:04:07.018
cmsem22fu0001nv01cczn6cao	asd1@gmail.com	Meddera Admin Account	DOCTOR	\N	\N	7378233926	t	f	2026-08-04 12:04:50.01
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: meddera_admin
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
60a7eb88-43e2-4dd9-b696-83349a8c0baf	9484652284d52d8a2cf58f047c6b6653399756eb8436fcb28adb0152b9563028	2026-08-03 22:17:33.741088+00	20260803221733_init	\N	\N	2026-08-03 22:17:33.734914+00	1
dbee38ea-dbda-45c2-a5d6-16207b5dd19a	ced6059e7f6685ed30b7f0242e53fbde347b1bb754a13e5e19dadfd70396df9b	2026-08-03 23:38:04.229114+00	20260803233804_init_users	\N	\N	2026-08-03 23:38:04.210889+00	1
\.


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: meddera_admin
--

COPY public.patients (id, full_name, phone, birth_date, address, idnp, last_visit_date, complaints, anamnesis, objective_exam, diagnosis, investigations, recommendations, treatment, procedure, product, patient_consent) FROM stdin;
fa609226-a33e-4d56-8444-9e3dacef15dc	Alex test test	+37360000000	1991-06-14			2026-08-03										t
a1000001-0000-4000-8000-000000000001	Alina Bianca	+373 60 000 000	1989-04-15	Balti, Stefan Cel Mare, 13	33333333333	2026-08-04	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad at autem beata debitis, distinctio dolore explicabo harum illum, ipsa molestiae nam pariatur porro, quibusdam quidem quod quos repudiandae! Delectus?	Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aliquid, architecto aut consectetur culpa dolorem dolores doloribus eaque enim, expedita facere fugit impedit ipsam laboriosam nemo officiis quia repellat, repellendus sed totam!	Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aliquid, architecto aut consectetur culpa dolorem dolores doloribus eaque enim, expedita facere fugit impedit ipsam laboriosam nemo officiis quia repellat, repellendus sed totam!	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut cumque incidunt molestias nisi nobis perferendis quae repellendus sed tempora veniam?	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci dicta ipsa maxime quod saepe tempora ullam. Aliquid aperiam assumenda atque commodi debitis dolores expedita, hic ipsum, molestias nisi tempore vitae.	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aspernatur doloremque ea earum eius, esse, eveniet ex fugit incidunt nulla perferendis quisquam recusandae reprehenderit rerum saepe sapiente soluta tempora veritatis voluptate voluptatum?	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aspernatur doloremque ea earum eius, esse, eveniet ex fugit incidunt nulla perferendis quisquam recusandae reprehenderit rerum saepe sapiente soluta tempora veritatis voluptate voluptatum?	Lorem ipsum dolor sit amet, consectetur adipisicing elit.	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquid eum fugiat. Aspernatur aut, cumque excepturi facilis fuga fugit, labore laboriosam laborum maiores minima natus obcaecati odio officiis perferendis placeat provident quasi qui quia, quisquam quos repellendus rerum suscipit vitae.	t
8b1a680d-25c1-4d46-9f17-03f38e54fde1	test2 test2	+37360000000	1990-06-20			2026-08-04										t
\.


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: meddera_admin
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: meddera_admin
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: meddera_admin
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: meddera_admin
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_googleId_key; Type: INDEX; Schema: public; Owner: meddera_admin
--

CREATE UNIQUE INDEX "User_googleId_key" ON public."User" USING btree ("googleId");


--
-- Name: User_telegramId_key; Type: INDEX; Schema: public; Owner: meddera_admin
--

CREATE UNIQUE INDEX "User_telegramId_key" ON public."User" USING btree ("telegramId");


--
-- PostgreSQL database dump complete
--

\unrestrict 90UdIjn8tUQnWOPoOrbThjFdhpFTY53iKr6p3tVDEVI962O63sy2K7mbRFnstd2

