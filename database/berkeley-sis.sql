--
-- PostgreSQL database dump
--

\restrict jLTyJmuILYVP2GYyaSISUiuX19Nyz2ekIqcE1gOLBPT154CVbwOzehCIU5imBZs

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.2

-- Started on 2026-03-27 19:38:23

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
-- TOC entry 34 (class 2615 OID 16498)
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- TOC entry 21 (class 2615 OID 16392)
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- TOC entry 32 (class 2615 OID 16578)
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql;


ALTER SCHEMA graphql OWNER TO supabase_admin;

--
-- TOC entry 31 (class 2615 OID 16567)
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- TOC entry 10 (class 2615 OID 16390)
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- TOC entry 11 (class 2615 OID 16559)
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- TOC entry 35 (class 2615 OID 16546)
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- TOC entry 29 (class 2615 OID 16607)
-- Name: vault; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA vault;


ALTER SCHEMA vault OWNER TO supabase_admin;

--
-- TOC entry 6 (class 3079 OID 16643)
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA graphql;


--
-- TOC entry 4604 (class 0 OID 0)
-- Dependencies: 6
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'pg_graphql: GraphQL support';


--
-- TOC entry 2 (class 3079 OID 16393)
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- TOC entry 4605 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- TOC entry 4 (class 3079 OID 16447)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- TOC entry 4606 (class 0 OID 0)
-- Dependencies: 4
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 5 (class 3079 OID 16608)
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault;


--
-- TOC entry 4607 (class 0 OID 0)
-- Dependencies: 5
-- Name: EXTENSION supabase_vault; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION supabase_vault IS 'Supabase Vault Extension';


--
-- TOC entry 3 (class 3079 OID 16436)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- TOC entry 4608 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 1168 (class 1247 OID 16738)
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


ALTER TYPE auth.aal_level OWNER TO supabase_auth_admin;

--
-- TOC entry 1192 (class 1247 OID 16879)
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


ALTER TYPE auth.code_challenge_method OWNER TO supabase_auth_admin;

--
-- TOC entry 1165 (class 1247 OID 16732)
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


ALTER TYPE auth.factor_status OWNER TO supabase_auth_admin;

--
-- TOC entry 1162 (class 1247 OID 16727)
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


ALTER TYPE auth.factor_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1210 (class 1247 OID 16982)
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


ALTER TYPE auth.oauth_authorization_status OWNER TO supabase_auth_admin;

--
-- TOC entry 1222 (class 1247 OID 17055)
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


ALTER TYPE auth.oauth_client_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1204 (class 1247 OID 16960)
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


ALTER TYPE auth.oauth_registration_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1213 (class 1247 OID 16992)
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


ALTER TYPE auth.oauth_response_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1198 (class 1247 OID 16921)
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


ALTER TYPE auth.one_time_token_type OWNER TO supabase_auth_admin;

--
-- TOC entry 1300 (class 1247 OID 17534)
-- Name: gender_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.gender_type AS ENUM (
    'Male',
    'Female'
);


ALTER TYPE public.gender_type OWNER TO postgres;

--
-- TOC entry 1303 (class 1247 OID 17540)
-- Name: import_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.import_status AS ENUM (
    'processing',
    'success',
    'partial',
    'failed'
);


ALTER TYPE public.import_status OWNER TO postgres;

--
-- TOC entry 1306 (class 1247 OID 17550)
-- Name: student_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.student_status AS ENUM (
    'Enrolled',
    'Promoted',
    'Retained',
    'Transferred',
    'Dropped'
);


ALTER TYPE public.student_status OWNER TO postgres;

--
-- TOC entry 1309 (class 1247 OID 17562)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'teacher',
    'registrar'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- TOC entry 1258 (class 1247 OID 17257)
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- TOC entry 1240 (class 1247 OID 17168)
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- TOC entry 1243 (class 1247 OID 17183)
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- TOC entry 1264 (class 1247 OID 17312)
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type_name text,
	type_oid oid,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- TOC entry 1261 (class 1247 OID 17269)
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- TOC entry 1273 (class 1247 OID 17381)
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


ALTER TYPE storage.buckettype OWNER TO supabase_storage_admin;

--
-- TOC entry 412 (class 1255 OID 16544)
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- TOC entry 4609 (class 0 OID 0)
-- Dependencies: 412
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- TOC entry 431 (class 1255 OID 16709)
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- TOC entry 411 (class 1255 OID 16543)
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- TOC entry 4612 (class 0 OID 0)
-- Dependencies: 411
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- TOC entry 410 (class 1255 OID 16542)
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- TOC entry 4614 (class 0 OID 0)
-- Dependencies: 410
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- TOC entry 413 (class 1255 OID 16551)
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO supabase_admin;

--
-- TOC entry 4630 (class 0 OID 0)
-- Dependencies: 413
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- TOC entry 417 (class 1255 OID 16572)
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- TOC entry 4632 (class 0 OID 0)
-- Dependencies: 417
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- TOC entry 414 (class 1255 OID 16553)
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO supabase_admin;

--
-- TOC entry 4634 (class 0 OID 0)
-- Dependencies: 414
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- TOC entry 415 (class 1255 OID 16563)
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- TOC entry 416 (class 1255 OID 16564)
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- TOC entry 418 (class 1255 OID 16574)
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- TOC entry 4663 (class 0 OID 0)
-- Dependencies: 418
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- TOC entry 360 (class 1255 OID 16391)
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: supabase_admin
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO ''
    AS $_$
  BEGIN
      RAISE DEBUG 'PgBouncer auth request: %', p_usename;

      RETURN QUERY
      SELECT
          rolname::text,
          CASE WHEN rolvaliduntil < now()
              THEN null
              ELSE rolpassword::text
          END
      FROM pg_authid
      WHERE rolname=$1 and rolcanlogin;
  END;
  $_$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO supabase_admin;

--
-- TOC entry 460 (class 1255 OID 17569)
-- Name: add_student(jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_student(p_student_data jsonb) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO students (
        lrn, first_name, middle_name, last_name, name_extension, gender, birthdate,
        birth_place, nationality, religion, mother_tongue, address, barangay,
        municipality, province, father_name, mother_name, guardian_name,
        guardian_relationship, contact_number, elem_school_name, elem_school_id,
        elem_school_address, elem_pept_passer, elem_pept_date, elem_als_ae_passer,
        elem_als_ae_date, elem_completion_date, elem_gen_average, elem_citation,
        alt_credential_type, alt_credential_rating, alt_credential_exam_date,
        alt_credential_center
    )
    VALUES (
        p_student_data->>'lrn',
        p_student_data->>'firstName',
        p_student_data->>'middleName',
        p_student_data->>'lastName',
        p_student_data->>'nameExtension',
        (p_student_data->>'sex')::gender_type,
        (p_student_data->>'birthdate')::DATE,
        p_student_data->>'birthPlace',
        COALESCE(p_student_data->>'nationality', 'Filipino'),
        p_student_data->>'religion',
        p_student_data->>'motherTongue',
        p_student_data->>'address',
        p_student_data->>'barangay',
        p_student_data->>'municipality',
        p_student_data->>'province',
        p_student_data->>'fatherName',
        p_student_data->>'motherName',
        p_student_data->>'guardianName',
        p_student_data->>'guardianRelationship',
        p_student_data->>'contactNumber',
        p_student_data->>'elementarySchoolName',
        p_student_data->>'elementarySchoolId',
        p_student_data->>'elementarySchoolAddress',
        COALESCE((p_student_data->>'elemPeptPasser')::BOOLEAN, false),
        (p_student_data->>'elemPeptDate')::DATE,
        COALESCE((p_student_data->>'elemAlsAePasser')::BOOLEAN, false),
        (p_student_data->>'elemAlsAeDate')::DATE,
        (p_student_data->>'elemCompletionDate')::DATE,
        (p_student_data->>'elemGenAverage')::NUMERIC,
        p_student_data->>'elemCitation',
        p_student_data->>'altCredentialType',
        (p_student_data->>'altCredentialRating')::NUMERIC,
        (p_student_data->>'altCredentialExamDate')::DATE,
        p_student_data->>'altCredentialCenter'
    );

    RETURN QUERY SELECT 'Student added successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.add_student(p_student_data jsonb) OWNER TO postgres;

--
-- TOC entry 461 (class 1255 OID 17570)
-- Name: add_transferee_transcript(integer, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.add_transferee_transcript(p_student_id integer, p_transcript_data jsonb) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_header_id INTEGER;
BEGIN
    INSERT INTO transcript_headers (
        student_id, source, school_name, school_id, district, division, region,
        grade_level, section_name, school_year, adviser_name, general_average,
        final_remarks, display_order
    )
    VALUES (
        p_student_id,
        'external',
        p_transcript_data->>'schoolName',
        p_transcript_data->>'schoolId',
        p_transcript_data->>'district',
        p_transcript_data->>'division',
        p_transcript_data->>'region',
        (p_transcript_data->>'gradeLevel')::SMALLINT,
        p_transcript_data->>'sectionName',
        p_transcript_data->>'schoolYear',
        p_transcript_data->>'adviserName',
        (p_transcript_data->>'generalAverage')::NUMERIC,
        p_transcript_data->>'finalRemarks',
        (p_transcript_data->>'gradeLevel')::SMALLINT
    )
    RETURNING id INTO v_header_id;

    -- Insert subject rows if provided
    IF p_transcript_data ? 'subjects' THEN
        INSERT INTO transcript_subject_rows (
            transcript_header_id, subject_name, is_mapeh, mapeh_component,
            q1_grade, q2_grade, q3_grade, q4_grade, final_rating, remarks, row_order
        )
        SELECT
            v_header_id,
            subj->>'subjectName',
            COALESCE((subj->>'isMapeh')::BOOLEAN, false),
            subj->>'mapehComponent',
            (subj->>'q1Grade')::NUMERIC,
            (subj->>'q2Grade')::NUMERIC,
            (subj->>'q3Grade')::NUMERIC,
            (subj->>'q4Grade')::NUMERIC,
            (subj->>'finalRating')::NUMERIC,
            subj->>'remarks',
            ROW_NUMBER() OVER ()
        FROM jsonb_array_elements(p_transcript_data->'subjects') subj;
    END IF;

    RETURN QUERY SELECT 'Transcript added successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.add_transferee_transcript(p_student_id integer, p_transcript_data jsonb) OWNER TO postgres;

--
-- TOC entry 462 (class 1255 OID 17571)
-- Name: assign_section_adviser(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.assign_section_adviser(p_section_id integer, p_teacher_id integer) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE sections
    SET adviser_id = p_teacher_id,
        updated_at = NOW()
    WHERE id = p_section_id;

    RETURN QUERY SELECT 'Adviser assigned successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.assign_section_adviser(p_section_id integer, p_teacher_id integer) OWNER TO postgres;

--
-- TOC entry 463 (class 1255 OID 17572)
-- Name: compute_subject_final_grade(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.compute_subject_final_grade() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Final grade = average of whichever quarters have been entered
    NEW.final_grade := ROUND(
        (COALESCE(NEW.q1_grade, 0) +
         COALESCE(NEW.q2_grade, 0) +
         COALESCE(NEW.q3_grade, 0) +
         COALESCE(NEW.q4_grade, 0)) /
        NULLIF(
            (CASE WHEN NEW.q1_grade IS NOT NULL THEN 1 ELSE 0 END +
             CASE WHEN NEW.q2_grade IS NOT NULL THEN 1 ELSE 0 END +
             CASE WHEN NEW.q3_grade IS NOT NULL THEN 1 ELSE 0 END +
             CASE WHEN NEW.q4_grade IS NOT NULL THEN 1 ELSE 0 END),
            0
        ),
        2
    );

    NEW.remarks := CASE
        WHEN NEW.final_grade IS NULL THEN NULL
        WHEN NEW.final_grade >= 75   THEN 'Passed'
        ELSE 'Failed'
    END;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.compute_subject_final_grade() OWNER TO postgres;

--
-- TOC entry 464 (class 1255 OID 17573)
-- Name: confirm_import(integer, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.confirm_import(p_import_log_id integer, p_skip_errors boolean DEFAULT false) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_import_log RECORD;
    v_preview_row RECORD;
    v_student_id INTEGER;
    v_enrollment_id INTEGER;
    v_academic_record_id INTEGER;
BEGIN
    -- Get import log details
    SELECT * INTO v_import_log FROM import_logs WHERE id = p_import_log_id;

    -- Process each preview row
    FOR v_preview_row IN
        SELECT * FROM import_preview_rows
        WHERE import_log_id = p_import_log_id
        ORDER BY row_number
    LOOP
        -- Skip if has errors and not skipping errors
        CONTINUE WHEN NOT p_skip_errors AND jsonb_array_length(v_preview_row.validation_notes) > 0;

        -- Find or create student
        SELECT id INTO v_student_id
        FROM students
        WHERE lrn = v_preview_row.mapped_data->>'lrn';

        IF v_student_id IS NULL THEN
            -- Create new student
            INSERT INTO students (lrn, last_name, first_name, middle_name)
            VALUES (
                v_preview_row.mapped_data->>'lrn',
                v_preview_row.mapped_data->>'lastName',
                v_preview_row.mapped_data->>'firstName',
                v_preview_row.mapped_data->>'middleName'
            )
            RETURNING id INTO v_student_id;
        END IF;

        -- Find enrollment
        SELECT id INTO v_enrollment_id
        FROM enrollments
        WHERE student_id = v_student_id
          AND school_year_id = v_import_log.school_year_id
          AND section_id = v_import_log.section_id;

        IF v_enrollment_id IS NULL THEN
            -- Create enrollment
            INSERT INTO enrollments (student_id, school_year_id, section_id, grade_level)
            VALUES (v_student_id, v_import_log.school_year_id, v_import_log.section_id, v_import_log.grade_level)
            RETURNING id INTO v_enrollment_id;

            -- Create academic record
            INSERT INTO academic_records (enrollment_id)
            VALUES (v_enrollment_id)
            RETURNING id INTO v_academic_record_id;
        ELSE
            -- Get existing academic record
            SELECT id INTO v_academic_record_id
            FROM academic_records
            WHERE enrollment_id = v_enrollment_id;
        END IF;

        -- Insert/update grades (this is simplified - would need more complex logic)
        -- This would process the grades from v_preview_row.mapped_data
    END LOOP;

    -- Update import log status
    UPDATE import_logs
    SET status = 'success', completed_at = NOW()
    WHERE id = p_import_log_id;

    RETURN QUERY SELECT 'Import completed successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.confirm_import(p_import_log_id integer, p_skip_errors boolean) OWNER TO postgres;

--
-- TOC entry 465 (class 1255 OID 17574)
-- Name: create_school_year(character varying, character varying, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_school_year(p_start_year character varying, p_end_year character varying, p_is_active boolean) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_start_date DATE;
    v_end_date DATE;
    v_label VARCHAR(20);
BEGIN
    v_start_date := TO_DATE(p_start_year || '-06-01', 'YYYY-MM-DD');
    v_end_date := TO_DATE(p_end_year || '-04-30', 'YYYY-MM-DD');
    v_label := p_start_year || '-' || p_end_year;

    INSERT INTO school_years (label, start_date, end_date, is_active)
    VALUES (v_label, v_start_date, v_end_date, p_is_active);

    RETURN QUERY SELECT 'School year created successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.create_school_year(p_start_year character varying, p_end_year character varying, p_is_active boolean) OWNER TO postgres;

--
-- TOC entry 507 (class 1255 OID 18052)
-- Name: create_school_year(character varying, date, date, boolean, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_school_year(p_label character varying, p_start_date date, p_end_date date, p_is_active boolean, p_quarters_json jsonb) RETURNS TABLE(id integer, label character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE v_sy_id INTEGER; v_q RECORD;
BEGIN
    INSERT INTO school_years (label, start_date, end_date, is_active)
    VALUES (p_label, p_start_date, p_end_date, p_is_active)
    RETURNING school_years.id INTO v_sy_id;

    -- Using double quotes for record columns to match camelCase JSON keys
    FOR v_q IN SELECT * FROM jsonb_to_recordset(p_quarters_json) 
        AS x(number smallint, "startDate" date, "endDate" date, "isActive" boolean)
    LOOP
        INSERT INTO quarters (school_year_id, quarter_number, start_date, end_date, is_active)
        VALUES (v_sy_id, v_q.number, v_q."startDate", v_q."endDate", v_q."isActive");
    END LOOP;
    
    RETURN QUERY SELECT v_sy_id, p_label;
END; $$;


ALTER FUNCTION public.create_school_year(p_label character varying, p_start_date date, p_end_date date, p_is_active boolean, p_quarters_json jsonb) OWNER TO postgres;

--
-- TOC entry 466 (class 1255 OID 17575)
-- Name: create_section(character varying, smallint, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_section(p_name character varying, p_grade_level smallint, p_school_year_id integer) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO sections (name, grade_level, school_year_id)
    VALUES (p_name, p_grade_level, p_school_year_id);

    RETURN QUERY SELECT 'Section created successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.create_section(p_name character varying, p_grade_level smallint, p_school_year_id integer) OWNER TO postgres;

--
-- TOC entry 511 (class 1255 OID 18056)
-- Name: create_section(integer, smallint, character varying, integer, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_section(p_sy_id integer, p_grade smallint, p_name character varying, p_adviser integer, p_room character varying) RETURNS TABLE(id integer, name character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE v_id INTEGER;
BEGIN
    INSERT INTO sections (school_year_id, grade_level, name, adviser_id, room_number)
    VALUES (p_sy_id, p_grade, p_name, p_adviser, p_room)
    RETURNING sections.id INTO v_id;
    RETURN QUERY SELECT v_id, p_name;
END; $$;


ALTER FUNCTION public.create_section(p_sy_id integer, p_grade smallint, p_name character varying, p_adviser integer, p_room character varying) OWNER TO postgres;

--
-- TOC entry 509 (class 1255 OID 18054)
-- Name: create_student(character varying, character varying, character varying, character varying, character varying, public.gender_type, date, character varying, character varying, character varying, character varying, text, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, character varying, text, boolean, date, boolean, date, date, numeric, character varying, character varying, numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_student(p_lrn character varying, p_fname character varying, p_mname character varying, p_lname character varying, p_suffix character varying, p_gender public.gender_type, p_birthdate date, p_bplace character varying, p_nat character varying, p_rel character varying, p_mtongue character varying, p_addr text, p_brgy character varying, p_muni character varying, p_prov character varying, p_fnamed character varying, p_mnamed character varying, p_gnamed character varying, p_grel character varying, p_contact character varying, p_esname character varying, p_esid character varying, p_esaddr text, p_epept boolean, p_epdate date, p_eals boolean, p_eadate date, p_ecomp date, p_eavg numeric, p_ecit character varying, p_actype character varying, p_acrating numeric) RETURNS TABLE(id integer, lrn character varying)
    LANGUAGE plpgsql
    AS $$
DECLARE v_id INTEGER;
BEGIN
    INSERT INTO students (
        lrn, first_name, middle_name, last_name, suffix, gender, birthdate, birth_place, nationality,
        religion, mother_tongue, address, barangay, municipality, province, father_name, mother_name,
        guardian_name, guardian_relationship, contact_number, elem_school_name, elem_school_id,
        elem_school_address, elem_pept_passer, elem_pept_date, elem_als_ae_passer, elem_als_ae_date,
        elem_completion_date, elem_gen_average, elem_citation, alt_credential_type, alt_credential_rating
    ) VALUES (
        p_lrn, p_fname, p_mname, p_lname, p_suffix, p_gender, p_birthdate, p_bplace, p_nat,
        p_rel, p_mtongue, p_addr, p_brgy, p_muni, p_prov, p_fnamed, p_mnamed, p_gnamed, p_grel, p_contact,
        p_esname, p_esid, p_esaddr, p_epept, p_epdate, p_eals, p_eadate, p_ecomp, p_eavg, p_ecit, p_actype, p_acrating
    ) RETURNING students.id INTO v_id;
    RETURN QUERY SELECT v_id, p_lrn;
END; $$;


ALTER FUNCTION public.create_student(p_lrn character varying, p_fname character varying, p_mname character varying, p_lname character varying, p_suffix character varying, p_gender public.gender_type, p_birthdate date, p_bplace character varying, p_nat character varying, p_rel character varying, p_mtongue character varying, p_addr text, p_brgy character varying, p_muni character varying, p_prov character varying, p_fnamed character varying, p_mnamed character varying, p_gnamed character varying, p_grel character varying, p_contact character varying, p_esname character varying, p_esid character varying, p_esaddr text, p_epept boolean, p_epdate date, p_eals boolean, p_eadate date, p_ecomp date, p_eavg numeric, p_ecit character varying, p_actype character varying, p_acrating numeric) OWNER TO postgres;

--
-- TOC entry 467 (class 1255 OID 17576)
-- Name: create_subject(character varying, character varying, smallint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_subject(p_name character varying, p_code character varying, p_grade_level smallint, p_description text, p_is_mapeh boolean DEFAULT false, p_mapeh_parent_id integer DEFAULT NULL, p_is_active boolean DEFAULT true, p_display_name character varying DEFAULT NULL) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_max_order SMALLINT;
BEGIN
    SELECT COALESCE(MAX(sort_order), 0) INTO v_max_order FROM subjects;

    INSERT INTO subjects (name, code, grade_level, description, is_mapeh, mapeh_parent_id, is_active, display_name, sort_order)
    VALUES (p_name, p_code, p_grade_level, p_description, p_is_mapeh, p_mapeh_parent_id, p_is_active, p_display_name, v_max_order + 1);

    RETURN QUERY SELECT 'Subject created successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.create_subject(p_name character varying, p_code character varying, p_grade_level smallint, p_description text, p_is_mapeh boolean, p_mapeh_parent_id integer, p_is_active boolean, p_display_name character varying) OWNER TO postgres;

--
-- TOC entry 468 (class 1255 OID 17577)
-- Name: delete_school_year(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_school_year(p_id integer) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if school year has enrollments
    IF EXISTS (SELECT 1 FROM enrollments WHERE school_year_id = p_id) THEN
        RETURN QUERY SELECT 'Cannot delete school year with existing enrollments'::TEXT;
    END IF;

    DELETE FROM school_years WHERE id = p_id;
    RETURN QUERY SELECT 'School year deleted successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.delete_school_year(p_id integer) OWNER TO postgres;

--
-- TOC entry 469 (class 1255 OID 17578)
-- Name: delete_section(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_section(p_id integer) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if section has enrollments
    IF EXISTS (SELECT 1 FROM enrollments WHERE section_id = p_id) THEN
        RETURN QUERY SELECT 'Cannot delete section with existing enrollments'::TEXT;
    END IF;

    DELETE FROM sections WHERE id = p_id;
    RETURN QUERY SELECT 'Section deleted successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.delete_section(p_id integer) OWNER TO postgres;

--
-- TOC entry 470 (class 1255 OID 17579)
-- Name: delete_student(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_student(p_student_id integer) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Soft delete by setting is_active to false
    UPDATE students
    SET is_active = false, updated_at = NOW()
    WHERE id = p_student_id;

    RETURN QUERY SELECT 'Student deleted successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.delete_student(p_student_id integer) OWNER TO postgres;

--
-- TOC entry 471 (class 1255 OID 17580)
-- Name: delete_subject(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_subject(p_id integer) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if subject has grades
    IF EXISTS (SELECT 1 FROM subject_grades WHERE subject_id = p_id) THEN
        RETURN QUERY SELECT 'Cannot delete subject with existing grades'::TEXT;
    END IF;

    DELETE FROM subjects WHERE id = p_id;
    RETURN QUERY SELECT 'Subject deleted successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.delete_subject(p_id integer) OWNER TO postgres;

--
-- TOC entry 472 (class 1255 OID 17581)
-- Name: enroll_student(integer, integer, integer, smallint, date); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.enroll_student(p_student_id integer, p_school_year_id integer, p_section_id integer, p_grade_level smallint, p_enrollment_date date DEFAULT CURRENT_DATE) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_enrollment_id INTEGER;
BEGIN
    INSERT INTO enrollments (student_id, school_year_id, section_id, grade_level, enrollment_date)
    VALUES (p_student_id, p_school_year_id, p_section_id, p_grade_level, p_enrollment_date)
    ON CONFLICT (student_id, school_year_id)
    DO UPDATE SET
        section_id      = EXCLUDED.section_id,
        grade_level     = EXCLUDED.grade_level,
        enrollment_date = EXCLUDED.enrollment_date,
        updated_at      = NOW()
    RETURNING id INTO v_enrollment_id;

    INSERT INTO academic_records (enrollment_id)
    VALUES (v_enrollment_id)
    ON CONFLICT (enrollment_id) DO NOTHING;

    RETURN v_enrollment_id;
END;
$$;


ALTER FUNCTION public.enroll_student(p_student_id integer, p_school_year_id integer, p_section_id integer, p_grade_level smallint, p_enrollment_date date) OWNER TO postgres;

--
-- TOC entry 473 (class 1255 OID 17582)
-- Name: export_sf10_pdf(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.export_sf10_pdf(p_student_id integer) RETURNS TABLE(pdf_data bytea)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- This would generate PDF data - placeholder implementation
    -- In a real implementation, this would use a PDF generation library
    RETURN QUERY SELECT NULL::BYTEA;
END;
$$;


ALTER FUNCTION public.export_sf10_pdf(p_student_id integer) OWNER TO postgres;

--
-- TOC entry 474 (class 1255 OID 17583)
-- Name: generate_bulk_sf10(jsonb, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.generate_bulk_sf10(p_student_ids jsonb, p_options jsonb) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_student_id INTEGER;
BEGIN
    -- Process each student ID
    FOR v_student_id IN
        SELECT jsonb_array_elements_text(p_student_ids)::INTEGER
    LOOP
        -- Generate SF10 for this student (snapshot enrollment to transcript)
        PERFORM snapshot_enrollment_to_transcript(e.id)
        FROM enrollments e
        WHERE e.student_id = v_student_id
          AND e.status IN ('Promoted', 'Retained', 'Transferred', 'Dropped');
    END LOOP;

    RETURN QUERY SELECT 'Bulk SF10 generation completed'::TEXT;
END;
$$;


ALTER FUNCTION public.generate_bulk_sf10(p_student_ids jsonb, p_options jsonb) OWNER TO postgres;

--
-- TOC entry 475 (class 1255 OID 17584)
-- Name: get_class_grade_sheet(integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_class_grade_sheet(p_section_id integer, p_school_year_id integer) RETURNS TABLE(student_id integer, lrn character varying, full_name text, subject_id integer, subject_name character varying, q1_grade numeric, q2_grade numeric, q3_grade numeric, q4_grade numeric, final_grade numeric, remarks character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        s.lrn,
        CONCAT(s.last_name, ', ', s.first_name,
               COALESCE(' ' || s.middle_name, '')),
        sub.id,
        sub.name,
        sg.q1_grade,
        sg.q2_grade,
        sg.q3_grade,
        sg.q4_grade,
        sg.final_grade,
        sg.remarks
    FROM students s
    JOIN enrollments e
        ON e.student_id     = s.id
       AND e.school_year_id = p_school_year_id
       AND e.section_id     = p_section_id
    JOIN academic_records ar ON ar.enrollment_id      = e.id
    JOIN subject_grades sg   ON sg.academic_record_id = ar.id
    JOIN subjects sub        ON sub.id                = sg.subject_id
    ORDER BY s.last_name, s.first_name, sub.sort_order, sub.name;
END;
$$;


ALTER FUNCTION public.get_class_grade_sheet(p_section_id integer, p_school_year_id integer) OWNER TO postgres;

--
-- TOC entry 476 (class 1255 OID 17585)
-- Name: get_class_grade_sheet(integer, integer, smallint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_class_grade_sheet(p_section_id integer, p_school_year_id integer, p_quarter_number smallint DEFAULT NULL::smallint) RETURNS TABLE(student_id integer, lrn character varying, full_name text, subject_id integer, subject_name character varying, q1_grade numeric, q2_grade numeric, q3_grade numeric, q4_grade numeric, final_grade numeric, remarks character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        s.lrn,
        CONCAT(s.last_name, ', ', s.first_name, COALESCE(' ' || s.middle_name, '')),
        sub.id,
        sub.name,
        sg.q1_grade,
        sg.q2_grade,
        sg.q3_grade,
        sg.q4_grade,
        sg.final_grade,
        sg.remarks
    FROM students s
    JOIN enrollments e
        ON e.student_id      = s.id
       AND e.school_year_id  = p_school_year_id
       AND e.section_id      = p_section_id
    JOIN academic_records ar ON ar.enrollment_id      = e.id
    JOIN subject_grades sg   ON sg.academic_record_id = ar.id
    JOIN subjects sub        ON sub.id                = sg.subject_id
    ORDER BY s.last_name, s.first_name, sub.name;
END;
$$;


ALTER FUNCTION public.get_class_grade_sheet(p_section_id integer, p_school_year_id integer, p_quarter_number smallint) OWNER TO postgres;

--
-- TOC entry 477 (class 1255 OID 17586)
-- Name: get_class_grade_sheet(text, text, smallint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_class_grade_sheet(p_section_name text, p_school_year_label text, p_quarter smallint DEFAULT NULL::smallint) RETURNS TABLE(student_id integer, lrn character varying, full_name text, subject_id integer, subject_name character varying, q1_grade numeric, q2_grade numeric, q3_grade numeric, q4_grade numeric, final_grade numeric, remarks character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        s.lrn,
        CONCAT(s.last_name, ', ', s.first_name, COALESCE(' ' || s.middle_name, '')),
        sub.id,
        sub.name,
        sg.q1_grade,
        sg.q2_grade,
        sg.q3_grade,
        sg.q4_grade,
        sg.final_grade,
        sg.remarks
    FROM students s
    JOIN enrollments e ON e.student_id = s.id
    JOIN school_years sy ON sy.id = e.school_year_id AND sy.label = p_school_year_label
    JOIN sections sec ON sec.id = e.section_id AND sec.name = p_section_name
    JOIN academic_records ar ON ar.enrollment_id = e.id
    JOIN subject_grades sg ON sg.academic_record_id = ar.id
    JOIN subjects sub ON sub.id = sg.subject_id
    ORDER BY s.last_name, s.first_name, sub.sort_order, sub.name;
END;
$$;


ALTER FUNCTION public.get_class_grade_sheet(p_section_name text, p_school_year_label text, p_quarter smallint) OWNER TO postgres;

--
-- TOC entry 478 (class 1255 OID 17587)
-- Name: get_general_average(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_general_average(p_section_name text, p_quarter text) RETURNS TABLE(student_id integer, lrn character varying, full_name text, general_average numeric)
    LANGUAGE plpgsql
    AS $_$
DECLARE
    v_quarter_filter TEXT := '';
BEGIN
    -- Build quarter filter based on input
    IF p_quarter IS NOT NULL AND p_quarter != 'all' THEN
        v_quarter_filter := ' AND sg.q' || p_quarter || '_grade IS NOT NULL';
    END IF;

    RETURN QUERY EXECUTE format('
        SELECT
            s.id,
            s.lrn,
            CONCAT(s.last_name, '', '', s.first_name, COALESCE('' '' || s.middle_name, '''')),
            ROUND(AVG(sg.final_grade), 2)
        FROM students s
        JOIN enrollments e ON e.student_id = s.id
        JOIN sections sec ON sec.id = e.section_id AND sec.name = $1
        JOIN academic_records ar ON ar.enrollment_id = e.id
        JOIN subject_grades sg ON sg.academic_record_id = ar.id
        WHERE sg.final_grade IS NOT NULL %s
        GROUP BY s.id, s.lrn, s.last_name, s.first_name, s.middle_name
        ORDER BY ROUND(AVG(sg.final_grade), 2) DESC
    ', v_quarter_filter)
    USING p_section_name;
END;
$_$;


ALTER FUNCTION public.get_general_average(p_section_name text, p_quarter text) OWNER TO postgres;

--
-- TOC entry 479 (class 1255 OID 17588)
-- Name: get_import_preview(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_import_preview(p_import_log_id integer) RETURNS TABLE(row_number integer, lrn character varying, student_name text, grades jsonb, validation_errors jsonb)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        pr.row_number,
        pr.raw_data->>'lrn',
        CONCAT(pr.raw_data->>'lastName', ', ', pr.raw_data->>'firstName'),
        pr.mapped_data,
        jsonb_build_array() -- Placeholder for validation errors
    FROM import_preview_rows pr
    WHERE pr.import_log_id = p_import_log_id
    ORDER BY pr.row_number;
END;
$$;


ALTER FUNCTION public.get_import_preview(p_import_log_id integer) OWNER TO postgres;

--
-- TOC entry 480 (class 1255 OID 17589)
-- Name: get_school_profile(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_school_profile() RETURNS TABLE(id integer, name character varying, school_id character varying, district character varying, division character varying, region character varying, address text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT s.id, s.name, s.deped_id, s.district, s.division, s.region, s.address
    FROM school s
    LIMIT 1;
END;
$$;


ALTER FUNCTION public.get_school_profile() OWNER TO postgres;

--
-- TOC entry 515 (class 1255 OID 18066)
-- Name: get_school_year_by_id(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_school_year_by_id(p_id integer) RETURNS TABLE(id integer, label character varying, "startDate" date, "endDate" date, "isActive" boolean, quarters jsonb)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sy.id, 
        sy.label, 
        sy.start_date AS "startDate", 
        sy.end_date AS "endDate", 
        sy.is_active AS "isActive",
        COALESCE((
            SELECT jsonb_agg(q_ordered)
            FROM (
                SELECT 
                    q.id, 
                    q.quarter_number as "number",
                    CASE 
                        WHEN q.quarter_number = 1 THEN '1st Quarter'
                        WHEN q.quarter_number = 2 THEN '2nd Quarter'
                        WHEN q.quarter_number = 3 THEN '3rd Quarter'
                        WHEN q.quarter_number = 4 THEN '4th Quarter'
                    END as "label",
                    q.start_date as "startDate",
                    q.end_date as "endDate",
                    q.is_active as "isActive"
                FROM quarters q
                WHERE q.school_year_id = sy.id
                ORDER BY q.quarter_number
            ) q_ordered
        ), '[]'::jsonb) as quarters
    FROM school_years sy
    WHERE sy.id = p_id;
END;
$$;


ALTER FUNCTION public.get_school_year_by_id(p_id integer) OWNER TO postgres;

--
-- TOC entry 514 (class 1255 OID 18065)
-- Name: get_school_years(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_school_years() RETURNS TABLE(id integer, label character varying, "startDate" date, "endDate" date, "isActive" boolean, quarters jsonb)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sy.id, 
        sy.label, 
        sy.start_date AS "startDate", 
        sy.end_date AS "endDate", 
        sy.is_active AS "isActive",
        COALESCE((
            SELECT jsonb_agg(q_ordered)
            FROM (
                SELECT 
                    q.id, 
                    q.quarter_number as "number",
                    CASE 
                        WHEN q.quarter_number = 1 THEN '1st Quarter'
                        WHEN q.quarter_number = 2 THEN '2nd Quarter'
                        WHEN q.quarter_number = 3 THEN '3rd Quarter'
                        WHEN q.quarter_number = 4 THEN '4th Quarter'
                    END as "label",
                    q.start_date as "startDate",
                    q.end_date as "endDate",
                    q.is_active as "isActive"
                FROM quarters q
                WHERE q.school_year_id = sy.id
                ORDER BY q.quarter_number
            ) q_ordered
        ), '[]'::jsonb) as quarters
    FROM school_years sy
    ORDER BY sy.start_date DESC;
END;
$$;


ALTER FUNCTION public.get_school_years() OWNER TO postgres;

--
-- TOC entry 481 (class 1255 OID 17591)
-- Name: get_sections(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_sections() RETURNS TABLE(id integer, name character varying, grade_level smallint, school_year_id integer, school_year character varying, adviser_id integer, adviser_name text, student_count bigint, room_number character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        s.name,
        s.grade_level,
        s.school_year_id,
        sy.label,
        s.adviser_id,
        CASE WHEN s.adviser_id IS NOT NULL THEN CONCAT(t.last_name, ', ', t.first_name) ELSE NULL END,
        COUNT(e.id),
        s.room_number
    FROM sections s
    LEFT JOIN school_years sy ON sy.id = s.school_year_id
    LEFT JOIN teachers t ON t.id = s.adviser_id
    LEFT JOIN enrollments e ON e.section_id = s.id AND e.status = 'Enrolled'
    GROUP BY s.id, s.name, s.grade_level, s.school_year_id, sy.label, s.adviser_id, t.last_name, t.first_name, s.room_number
    ORDER BY s.grade_level, s.name;
END;
$$;


ALTER FUNCTION public.get_sections() OWNER TO postgres;

--
-- TOC entry 510 (class 1255 OID 18055)
-- Name: get_sections(integer, smallint); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_sections(p_sy_id integer, p_grade smallint) RETURNS TABLE(id integer, name character varying, grade_level smallint, school_year_id integer, adviser_id integer, room_number character varying)
    LANGUAGE sql
    AS $$
    SELECT id, name, grade_level, school_year_id, adviser_id, room_number 
    FROM sections 
    WHERE (p_sy_id IS NULL OR school_year_id = p_sy_id)
    AND (p_grade IS NULL OR grade_level = p_grade);
$$;


ALTER FUNCTION public.get_sections(p_sy_id integer, p_grade smallint) OWNER TO postgres;

--
-- TOC entry 482 (class 1255 OID 17592)
-- Name: get_sf10_full_history(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_sf10_full_history(p_student_id integer) RETURNS TABLE(header_id integer, source character varying, school_name character varying, school_id character varying, district character varying, division character varying, region character varying, grade_level smallint, section_name character varying, school_year character varying, adviser_name character varying, general_average numeric, final_remarks character varying, remedial_from date, remedial_to date, subject_name character varying, is_mapeh boolean, mapeh_component character varying, q1_grade numeric, q2_grade numeric, q3_grade numeric, q4_grade numeric, final_rating numeric, subject_remarks character varying, row_order smallint)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        th.id,
        th.source,
        th.school_name,
        th.school_id,
        th.district,
        th.division,
        th.region,
        th.grade_level,
        th.section_name,
        th.school_year,
        th.adviser_name,
        th.general_average,
        th.final_remarks,
        th.remedial_from,
        th.remedial_to,
        sr.subject_name,
        sr.is_mapeh,
        sr.mapeh_component,
        sr.q1_grade,
        sr.q2_grade,
        sr.q3_grade,
        sr.q4_grade,
        sr.final_rating,
        sr.remarks,
        sr.row_order
    FROM transcript_headers th
    LEFT JOIN transcript_subject_rows sr ON sr.transcript_header_id = th.id
    WHERE th.student_id = p_student_id
    ORDER BY th.display_order, th.grade_level, sr.row_order;
END;
$$;


ALTER FUNCTION public.get_sf10_full_history(p_student_id integer) OWNER TO postgres;

--
-- TOC entry 483 (class 1255 OID 17593)
-- Name: get_student_academic_records(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_student_academic_records(p_student_id integer) RETURNS TABLE(enrollment_id integer, school_year character varying, grade_level smallint, section_name character varying, general_average numeric, remarks text, subject_name character varying, q1_grade numeric, q2_grade numeric, q3_grade numeric, q4_grade numeric, final_grade numeric, subject_remarks character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        sy.label,
        e.grade_level,
        s.name,
        ar.general_average,
        ar.remarks,
        sub.name,
        sg.q1_grade,
        sg.q2_grade,
        sg.q3_grade,
        sg.q4_grade,
        sg.final_grade,
        sg.remarks
    FROM enrollments e
    JOIN school_years sy ON sy.id = e.school_year_id
    JOIN sections s ON s.id = e.section_id
    JOIN academic_records ar ON ar.enrollment_id = e.id
    LEFT JOIN subject_grades sg ON sg.academic_record_id = ar.id
    LEFT JOIN subjects sub ON sub.id = sg.subject_id
    WHERE e.student_id = p_student_id
    ORDER BY sy.start_date DESC, sub.name;
END;
$$;


ALTER FUNCTION public.get_student_academic_records(p_student_id integer) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 330 (class 1259 OID 17694)
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id integer NOT NULL,
    lrn character varying(12) NOT NULL,
    first_name character varying(100) NOT NULL,
    middle_name character varying(100),
    last_name character varying(100) NOT NULL,
    suffix character varying(20),
    gender public.gender_type NOT NULL,
    birthdate date NOT NULL,
    birth_place character varying(255),
    nationality character varying(100) DEFAULT 'Filipino'::character varying,
    religion character varying(100),
    mother_tongue character varying(100),
    address text,
    barangay character varying(100),
    municipality character varying(100),
    province character varying(100),
    father_name character varying(255),
    mother_name character varying(255),
    guardian_name character varying(255),
    guardian_relationship character varying(100),
    contact_number character varying(30),
    elem_school_name character varying(255),
    elem_school_id character varying(50),
    elem_school_address text,
    elem_pept_passer boolean DEFAULT false,
    elem_pept_date date,
    elem_als_ae_passer boolean DEFAULT false,
    elem_als_ae_date date,
    elem_completion_date date,
    elem_gen_average numeric(5,2),
    elem_citation character varying(255),
    alt_credential_type character varying(50),
    alt_credential_rating numeric(5,2),
    alt_credential_exam_date date,
    alt_credential_center character varying(255),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name_extension character varying(20)
);


ALTER TABLE public.students OWNER TO postgres;

--
-- TOC entry 513 (class 1255 OID 18058)
-- Name: get_student_by_id(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_student_by_id(p_id integer) RETURNS SETOF public.students
    LANGUAGE sql
    AS $$
    SELECT * FROM students WHERE id = p_id;
$$;


ALTER FUNCTION public.get_student_by_id(p_id integer) OWNER TO postgres;

--
-- TOC entry 484 (class 1255 OID 17594)
-- Name: get_student_details(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_student_details(p_student_id integer) RETURNS TABLE(id integer, lrn character varying, first_name character varying, middle_name character varying, last_name character varying, name_extension character varying, gender public.gender_type, birthdate date, birth_place character varying, nationality character varying, religion character varying, mother_tongue character varying, address text, barangay character varying, municipality character varying, province character varying, father_name character varying, mother_name character varying, guardian_name character varying, guardian_relationship character varying, contact_number character varying, elem_school_name character varying, elem_school_id character varying, elem_school_address text, elem_pept_passer boolean, elem_pept_date date, elem_als_ae_passer boolean, elem_als_ae_date date, elem_completion_date date, elem_gen_average numeric, elem_citation character varying, alt_credential_type character varying, alt_credential_rating numeric, alt_credential_exam_date date, alt_credential_center character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id, s.lrn, s.first_name, s.middle_name, s.last_name, s.name_extension,
        s.gender, s.birthdate, s.birth_place, s.nationality, s.religion,
        s.mother_tongue, s.address, s.barangay, s.municipality, s.province,
        s.father_name, s.mother_name, s.guardian_name, s.guardian_relationship,
        s.contact_number, s.elem_school_name, s.elem_school_id, s.elem_school_address,
        s.elem_pept_passer, s.elem_pept_date, s.elem_als_ae_passer, s.elem_als_ae_date,
        s.elem_completion_date, s.elem_gen_average, s.elem_citation,
        s.alt_credential_type, s.alt_credential_rating, s.alt_credential_exam_date,
        s.alt_credential_center
    FROM students s
    WHERE s.id = p_student_id;
END;
$$;


ALTER FUNCTION public.get_student_details(p_student_id integer) OWNER TO postgres;

--
-- TOC entry 485 (class 1255 OID 17595)
-- Name: get_student_enrollments(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_student_enrollments(p_student_id integer) RETURNS TABLE(id integer, school_year character varying, grade_level smallint, section_name character varying, adviser_name text, status public.student_status, enrollment_date date)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        sy.label,
        e.grade_level,
        s.name,
        CONCAT(t.last_name, ', ', t.first_name),
        e.status,
        e.enrollment_date
    FROM enrollments e
    JOIN school_years sy ON sy.id = e.school_year_id
    JOIN sections s ON s.id = e.section_id
    LEFT JOIN teachers t ON t.id = s.adviser_id
    WHERE e.student_id = p_student_id
    ORDER BY sy.start_date DESC;
END;
$$;


ALTER FUNCTION public.get_student_enrollments(p_student_id integer) OWNER TO postgres;

--
-- TOC entry 486 (class 1255 OID 17596)
-- Name: get_student_grades(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_student_grades(p_student_id integer) RETURNS TABLE(subject_name character varying, q1_grade numeric, q2_grade numeric, q3_grade numeric, q4_grade numeric, final_grade numeric, remarks character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        sub.name,
        sg.q1_grade,
        sg.q2_grade,
        sg.q3_grade,
        sg.q4_grade,
        sg.final_grade,
        sg.remarks
    FROM enrollments e
    JOIN academic_records ar ON ar.enrollment_id = e.id
    JOIN subject_grades sg ON sg.academic_record_id = ar.id
    JOIN subjects sub ON sub.id = sg.subject_id
    WHERE e.student_id = p_student_id
    ORDER BY sub.sort_order, sub.name;
END;
$$;


ALTER FUNCTION public.get_student_grades(p_student_id integer) OWNER TO postgres;

--
-- TOC entry 487 (class 1255 OID 17597)
-- Name: get_student_sf10_data(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_student_sf10_data(p_student_id integer) RETURNS TABLE(enrollment_id integer, school_year character varying, grade_level smallint, section_name character varying, adviser_name text, status public.student_status, subject_name character varying, final_grade numeric, general_average numeric, record_remarks text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        sy.label,
        e.grade_level,
        sec.name,
        CONCAT(t.last_name, ', ', t.first_name),
        e.status,
        sub.name,
        sg.final_grade,
        ar.general_average,
        ar.remarks
    FROM enrollments e
    JOIN school_years sy     ON sy.id  = e.school_year_id
    JOIN sections sec        ON sec.id = e.section_id
    LEFT JOIN teachers t     ON t.id   = sec.adviser_id
    JOIN academic_records ar ON ar.enrollment_id      = e.id
    LEFT JOIN subject_grades sg ON sg.academic_record_id = ar.id
    LEFT JOIN subjects sub   ON sub.id = sg.subject_id
    WHERE e.student_id = p_student_id
    ORDER BY sy.start_date, sub.name;
END;
$$;


ALTER FUNCTION public.get_student_sf10_data(p_student_id integer) OWNER TO postgres;

--
-- TOC entry 512 (class 1255 OID 18057)
-- Name: get_students(text, smallint, text, text, text, integer, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_students(p_search text, p_grade smallint, p_section text, p_sy text, p_sex text, p_limit integer, p_offset integer) RETURNS SETOF public.students
    LANGUAGE sql
    AS $$
    SELECT * FROM students 
    WHERE (p_search = '' OR lrn ILIKE '%'||p_search||'%' OR first_name ILIKE '%'||p_search||'%' OR last_name ILIKE '%'||p_search||'%')
    LIMIT p_limit OFFSET p_offset;
$$;


ALTER FUNCTION public.get_students(p_search text, p_grade smallint, p_section text, p_sy text, p_sex text, p_limit integer, p_offset integer) OWNER TO postgres;

--
-- TOC entry 488 (class 1255 OID 17598)
-- Name: get_students_with_enrollments(text, text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_students_with_enrollments(p_grade text, p_section text, p_year text, p_sex text, p_search text) RETURNS TABLE(id integer, lrn character varying, first_name character varying, middle_name character varying, last_name character varying, name_extension character varying, gender public.gender_type, birthdate date, enrollment_id integer, school_year character varying, grade_level smallint, section_name character varying, status public.student_status)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id,
        s.lrn,
        s.first_name,
        s.middle_name,
        s.last_name,
        s.name_extension,
        s.gender,
        s.birthdate,
        e.id,
        sy.label,
        e.grade_level,
        sec.name,
        e.status
    FROM students s
    LEFT JOIN enrollments e ON e.student_id = s.id
        AND (p_year IS NULL OR e.school_year_id = (SELECT sy_inner.id FROM school_years sy_inner WHERE sy_inner.label = p_year LIMIT 1))
        AND (p_grade IS NULL OR e.grade_level::TEXT = p_grade)
    LEFT JOIN school_years sy ON sy.id = e.school_year_id
    LEFT JOIN sections sec ON sec.id = e.section_id
        AND (p_section IS NULL OR sec.name = p_section)
    WHERE s.is_active = true
        AND (p_sex IS NULL OR s.gender::TEXT = p_sex)
        AND (p_search IS NULL OR
             s.lrn ILIKE '%' || p_search || '%' OR
             CONCAT(s.last_name, ' ', s.first_name) ILIKE '%' || p_search || '%')
    ORDER BY s.last_name, s.first_name;
END;
$$;


ALTER FUNCTION public.get_students_with_enrollments(p_grade text, p_section text, p_year text, p_sex text, p_search text) OWNER TO postgres;

--
-- TOC entry 489 (class 1255 OID 17599)
-- Name: get_subjects(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_subjects() RETURNS TABLE(id integer, code character varying, name character varying, display_name character varying, grade_level smallint, is_mapeh boolean, mapeh_component character varying, mapeh_parent_id integer, description text, sort_order smallint, is_active boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.id, s.code, s.name, s.display_name, s.grade_level, s.is_mapeh,
        s.mapeh_component, s.mapeh_parent_id, s.description, s.sort_order, s.is_active
    FROM subjects s
    ORDER BY s.sort_order, s.name;
END;
$$;


ALTER FUNCTION public.get_subjects() OWNER TO postgres;

--
-- TOC entry 490 (class 1255 OID 17600)
-- Name: get_teachers(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_teachers() RETURNS TABLE(id integer, name text, email character varying, employee_id character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.id,
        CONCAT(t.last_name, ', ', t.first_name, COALESCE(' ' || t.middle_name, '')),
        t.email,
        t.employee_id
    FROM teachers t
    WHERE t.is_active = true
    ORDER BY t.last_name, t.first_name;
END;
$$;


ALTER FUNCTION public.get_teachers() OWNER TO postgres;

--
-- TOC entry 491 (class 1255 OID 17601)
-- Name: get_user_for_login(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_user_for_login(p_username character varying) RETURNS TABLE(id integer, username character varying, email character varying, password_hash text, role public.user_role, is_active boolean)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.username, u.email, u.password_hash, u.role, u.is_active
    FROM users u
    WHERE u.username = p_username OR u.email = p_username;
END;
$$;


ALTER FUNCTION public.get_user_for_login(p_username character varying) OWNER TO postgres;

--
-- TOC entry 492 (class 1255 OID 17602)
-- Name: recalculate_general_average(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.recalculate_general_average(p_academic_record_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE academic_records
    SET
        general_average = (
            SELECT ROUND(AVG(final_grade), 2)
            FROM subject_grades
            WHERE academic_record_id = p_academic_record_id
              AND final_grade IS NOT NULL
        ),
        remarks = CASE
            WHEN (
                SELECT ROUND(AVG(final_grade), 2)
                FROM subject_grades
                WHERE academic_record_id = p_academic_record_id
                  AND final_grade IS NOT NULL
            ) >= 75 THEN 'Passed'
            ELSE 'Failed'
        END,
        updated_at = NOW()
    WHERE id = p_academic_record_id;
END;
$$;


ALTER FUNCTION public.recalculate_general_average(p_academic_record_id integer) OWNER TO postgres;

--
-- TOC entry 493 (class 1255 OID 17603)
-- Name: register_user(character varying, character varying, text, public.user_role); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.register_user(p_username character varying, p_email character varying, p_password_hash text, p_role public.user_role DEFAULT 'teacher'::public.user_role) RETURNS TABLE(user_id integer, username character varying, email character varying, role public.user_role, status text, message text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    INSERT INTO users (username, email, password_hash, role)
    VALUES (p_username, p_email, p_password_hash, p_role)
    RETURNING
        users.id,
        users.username,
        users.email,
        users.role,
        'success'::TEXT,
        'User registered successfully'::TEXT;

EXCEPTION
    WHEN unique_violation THEN
        RETURN QUERY
        SELECT
            NULL::INTEGER,
            p_username,
            p_email,
            p_role,
            'error'::TEXT,
            'Username or email already exists'::TEXT;
END;
$$;


ALTER FUNCTION public.register_user(p_username character varying, p_email character varying, p_password_hash text, p_role public.user_role) OWNER TO postgres;

--
-- TOC entry 494 (class 1255 OID 17604)
-- Name: reorder_subject(integer, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.reorder_subject(p_subject_id integer, p_direction text) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_current_order SMALLINT;
    v_swap_order SMALLINT;
    v_swap_id INTEGER;
BEGIN
    -- Get current order
    SELECT sort_order INTO v_current_order
    FROM subjects WHERE id = p_subject_id;

    IF p_direction = 'up' THEN
        -- Find the subject above this one
        SELECT id, sort_order INTO v_swap_id, v_swap_order
        FROM subjects
        WHERE sort_order < v_current_order
        ORDER BY sort_order DESC
        LIMIT 1;
    ELSE
        -- Find the subject below this one
        SELECT id, sort_order INTO v_swap_id, v_swap_order
        FROM subjects
        WHERE sort_order > v_current_order
        ORDER BY sort_order ASC
        LIMIT 1;
    END IF;

    IF v_swap_id IS NOT NULL THEN
        -- Swap the sort orders
        UPDATE subjects SET sort_order = v_swap_order WHERE id = p_subject_id;
        UPDATE subjects SET sort_order = v_current_order WHERE id = v_swap_id;
        RETURN QUERY SELECT 'Subject reordered successfully'::TEXT;
    ELSE
        RETURN QUERY SELECT 'Cannot reorder: no adjacent subject'::TEXT;
    END IF;
END;
$$;


ALTER FUNCTION public.reorder_subject(p_subject_id integer, p_direction text) OWNER TO postgres;

--
-- TOC entry 432 (class 1255 OID 17160)
-- Name: rls_auto_enable(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.rls_auto_enable() RETURNS event_trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION public.rls_auto_enable() OWNER TO postgres;

--
-- TOC entry 495 (class 1255 OID 17605)
-- Name: save_class_grades(jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.save_class_grades(p_grades_data jsonb) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_grade_record RECORD;
BEGIN
    -- Update each grade record
    FOR v_grade_record IN
        SELECT
            (grade->>'studentId')::INTEGER as student_id,
            (grade->>'subjectId')::INTEGER as subject_id,
            (grade->>'sectionId')::INTEGER as section_id,
            (grade->>'schoolYearId')::INTEGER as school_year_id,
            (grade->>'quarter')::TEXT as quarter,
            (grade->>'grade')::NUMERIC as grade_value
        FROM jsonb_array_elements(p_grades_data) grade
    LOOP
        -- Find the academic record for this student/section/year
        UPDATE subject_grades
        SET
            q1_grade = CASE WHEN v_grade_record.quarter = '1' THEN v_grade_record.grade_value ELSE q1_grade END,
            q2_grade = CASE WHEN v_grade_record.quarter = '2' THEN v_grade_record.grade_value ELSE q2_grade END,
            q3_grade = CASE WHEN v_grade_record.quarter = '3' THEN v_grade_record.grade_value ELSE q3_grade END,
            q4_grade = CASE WHEN v_grade_record.quarter = '4' THEN v_grade_record.grade_value ELSE q4_grade END,
            updated_at = NOW()
        FROM academic_records ar
        JOIN enrollments e ON e.id = ar.enrollment_id
        WHERE subject_grades.academic_record_id = ar.id
          AND e.student_id = v_grade_record.student_id
          AND e.section_id = v_grade_record.section_id
          AND e.school_year_id = v_grade_record.school_year_id
          AND subject_grades.subject_id = v_grade_record.subject_id;
    END LOOP;

    -- Recalculate final grades and general averages
    PERFORM recalculate_general_average(ar.id)
    FROM academic_records ar
    JOIN enrollments e ON e.id = ar.enrollment_id
    WHERE e.section_id IN (
        SELECT DISTINCT (grade->>'sectionId')::INTEGER
        FROM jsonb_array_elements(p_grades_data) grade
    );

    RETURN QUERY SELECT 'Grades saved successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.save_class_grades(p_grades_data jsonb) OWNER TO postgres;

--
-- TOC entry 496 (class 1255 OID 17606)
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

--
-- TOC entry 497 (class 1255 OID 17607)
-- Name: snapshot_enrollment_to_transcript(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.snapshot_enrollment_to_transcript(p_enrollment_id integer) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_enrollment      RECORD;
    v_school          RECORD;
    v_section         RECORD;
    v_school_year     RECORD;
    v_academic_record RECORD;
    v_adviser_name    TEXT;
    v_header_id       INTEGER;
BEGIN
    SELECT * INTO v_enrollment FROM enrollments WHERE id = p_enrollment_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Enrollment % not found', p_enrollment_id;
    END IF;

    SELECT * INTO v_school_year FROM school_years WHERE id = v_enrollment.school_year_id;
    SELECT * INTO v_school      FROM school LIMIT 1;
    SELECT * INTO v_section     FROM sections WHERE id = v_enrollment.section_id;

    SELECT CONCAT(t.last_name, ', ', t.first_name,
                  COALESCE(' ' || LEFT(t.middle_name, 1) || '.', ''))
    INTO v_adviser_name
    FROM teachers t WHERE t.id = v_section.adviser_id;

    SELECT * INTO v_academic_record
    FROM academic_records WHERE enrollment_id = p_enrollment_id;

    INSERT INTO transcript_headers (
        student_id,    source,           enrollment_id,
        school_name,   school_id,        district,
        division,      region,           school_address,
        grade_level,   section_name,     school_year,
        adviser_name,  general_average,  final_remarks,
        display_order
    )
    VALUES (
        v_enrollment.student_id,
        'system',
        p_enrollment_id,
        COALESCE(v_school.name, ''),
        v_school.deped_id,
        v_school.district,
        v_school.division,
        v_school.region,
        v_school.address,              -- ← newly captured
        v_enrollment.grade_level,
        v_section.name,
        v_school_year.label,
        v_adviser_name,
        v_academic_record.general_average,
        v_enrollment.status::TEXT,
        v_enrollment.grade_level
    )
    ON CONFLICT (student_id, school_year, grade_level)
    DO UPDATE SET
        school_name     = EXCLUDED.school_name,
        school_id       = EXCLUDED.school_id,
        district        = EXCLUDED.district,
        division        = EXCLUDED.division,
        region          = EXCLUDED.region,
        school_address  = EXCLUDED.school_address,   -- ← newly synced
        section_name    = EXCLUDED.section_name,
        adviser_name    = EXCLUDED.adviser_name,
        general_average = EXCLUDED.general_average,
        final_remarks   = EXCLUDED.final_remarks,
        updated_at      = NOW()
    RETURNING id INTO v_header_id;

    DELETE FROM transcript_subject_rows WHERE transcript_header_id = v_header_id;

    INSERT INTO transcript_subject_rows (
        transcript_header_id,
        subject_name,    is_mapeh,       mapeh_component,
        q1_grade,        q2_grade,       q3_grade,        q4_grade,
        final_rating,    remarks,        row_order
    )
    SELECT
        v_header_id,
        sub.name,        sub.is_mapeh,   sub.mapeh_component,
        sg.q1_grade,     sg.q2_grade,    sg.q3_grade,     sg.q4_grade,
        sg.final_grade,  sg.remarks,
        ROW_NUMBER() OVER (ORDER BY sub.is_mapeh, sub.sort_order, sub.name)
    FROM subject_grades sg
    JOIN subjects sub ON sub.id = sg.subject_id
    WHERE sg.academic_record_id = v_academic_record.id;

    RETURN v_header_id;
END;
$$;


ALTER FUNCTION public.snapshot_enrollment_to_transcript(p_enrollment_id integer) OWNER TO postgres;

--
-- TOC entry 498 (class 1255 OID 17608)
-- Name: start_import(text, text, smallint, text, smallint, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.start_import(p_file_url text, p_section text, p_grade_level smallint, p_school_year text, p_quarter smallint, p_column_mappings jsonb) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_import_log_id INTEGER;
    v_section_id INTEGER;
    v_school_year_id INTEGER;
BEGIN
    -- Find section and school year IDs
    SELECT id INTO v_section_id FROM sections WHERE name = p_section;
    SELECT id INTO v_school_year_id FROM school_years WHERE label = p_school_year;

    IF v_section_id IS NULL THEN
        RETURN QUERY SELECT 'Section not found'::TEXT;
    END IF;

    IF v_school_year_id IS NULL THEN
        RETURN QUERY SELECT 'School year not found'::TEXT;
    END IF;

    -- Create import log
    INSERT INTO import_logs (
        school_year_id, section_id, quarter_number, source_url, status
    )
    VALUES (
        v_school_year_id, v_section_id, p_quarter, p_file_url, 'processing'
    )
    RETURNING id INTO v_import_log_id;

    -- Store column mappings
    INSERT INTO column_mappings (import_log_id, source_column, target_field)
    SELECT
        v_import_log_id,
        mapping->>'sourceColumn',
        mapping->>'targetField'
    FROM jsonb_array_elements(p_column_mappings) mapping;

    RETURN QUERY SELECT 'Import started successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.start_import(p_file_url text, p_section text, p_grade_level smallint, p_school_year text, p_quarter smallint, p_column_mappings jsonb) OWNER TO postgres;

--
-- TOC entry 499 (class 1255 OID 17609)
-- Name: trg_auto_snapshot_on_finalize(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trg_auto_snapshot_on_finalize() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.status IN ('Promoted', 'Retained', 'Transferred', 'Dropped')
       AND (OLD.status IS DISTINCT FROM NEW.status) THEN
        PERFORM snapshot_enrollment_to_transcript(NEW.id);
    END IF;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.trg_auto_snapshot_on_finalize() OWNER TO postgres;

--
-- TOC entry 500 (class 1255 OID 17610)
-- Name: trg_refresh_general_average(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trg_refresh_general_average() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM recalculate_general_average(
        COALESCE(NEW.academic_record_id, OLD.academic_record_id)
    );
    RETURN NULL;
END;
$$;


ALTER FUNCTION public.trg_refresh_general_average() OWNER TO postgres;

--
-- TOC entry 501 (class 1255 OID 17611)
-- Name: update_import_mappings(integer, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_import_mappings(p_import_log_id integer, p_column_mappings jsonb) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Delete existing mappings
    DELETE FROM column_mappings WHERE import_log_id = p_import_log_id;

    -- Insert new mappings
    INSERT INTO column_mappings (import_log_id, source_column, target_field)
    SELECT
        p_import_log_id,
        mapping->>'sourceColumn',
        mapping->>'targetField'
    FROM jsonb_array_elements(p_column_mappings) mapping;

    RETURN QUERY SELECT 'Column mappings updated successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.update_import_mappings(p_import_log_id integer, p_column_mappings jsonb) OWNER TO postgres;

--
-- TOC entry 502 (class 1255 OID 17612)
-- Name: update_school_profile(character varying, character varying, character varying, character varying, character varying, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_school_profile(p_name character varying, p_school_id character varying, p_district character varying, p_division character varying, p_region character varying, p_address text) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE school
    SET name = p_name,
        deped_id = p_school_id,
        district = p_district,
        division = p_division,
        region = p_region,
        address = p_address,
        updated_at = NOW()
    WHERE id = (SELECT id FROM school LIMIT 1);

    RETURN QUERY SELECT 'School profile updated successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.update_school_profile(p_name character varying, p_school_id character varying, p_district character varying, p_division character varying, p_region character varying, p_address text) OWNER TO postgres;

--
-- TOC entry 503 (class 1255 OID 17613)
-- Name: update_school_year(integer, character varying, character varying, boolean); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_school_year(p_id integer, p_start_year character varying, p_end_year character varying, p_is_active boolean) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_start_date DATE;
    v_end_date DATE;
    v_label VARCHAR(20);
BEGIN
    v_start_date := TO_DATE(p_start_year || '-06-01', 'YYYY-MM-DD');
    v_end_date := TO_DATE(p_end_year || '-04-30', 'YYYY-MM-DD');
    v_label := p_start_year || '-' || p_end_year;

    UPDATE school_years
    SET label = v_label,
        start_date = v_start_date,
        end_date = v_end_date,
        is_active = p_is_active,
        updated_at = NOW()
    WHERE id = p_id;

    RETURN QUERY SELECT 'School year updated successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.update_school_year(p_id integer, p_start_year character varying, p_end_year character varying, p_is_active boolean) OWNER TO postgres;

--
-- TOC entry 508 (class 1255 OID 18053)
-- Name: update_school_year(integer, character varying, date, date, boolean, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_school_year(p_id integer, p_label character varying, p_start_date date, p_end_date date, p_is_active boolean, p_quarters_json jsonb) RETURNS TABLE(id integer, label character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE school_years 
    SET label = p_label, start_date = p_start_date, end_date = p_end_date, is_active = p_is_active, updated_at = NOW() 
    WHERE school_years.id = p_id; -- Specifically scoping to the school_years table to avoid ambiguity with the returned "id" column

    DELETE FROM quarters WHERE school_year_id = p_id;

    INSERT INTO quarters (school_year_id, quarter_number, start_date, end_date, is_active)
    SELECT p_id, 
           (x->>'number')::smallint, 
           (x->>'startDate')::date, 
           (x->>'endDate')::date, 
           (x->>'isActive')::boolean
    FROM jsonb_array_elements(p_quarters_json) AS x;

    RETURN QUERY SELECT p_id, p_label;
END; $$;


ALTER FUNCTION public.update_school_year(p_id integer, p_label character varying, p_start_date date, p_end_date date, p_is_active boolean, p_quarters_json jsonb) OWNER TO postgres;

--
-- TOC entry 504 (class 1255 OID 17614)
-- Name: update_section(integer, character varying, smallint, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_section(p_id integer, p_name character varying, p_grade_level smallint, p_school_year_id integer) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE sections
    SET name = p_name,
        grade_level = p_grade_level,
        school_year_id = p_school_year_id,
        updated_at = NOW()
    WHERE id = p_id;

    RETURN QUERY SELECT 'Section updated successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.update_section(p_id integer, p_name character varying, p_grade_level smallint, p_school_year_id integer) OWNER TO postgres;

--
-- TOC entry 505 (class 1255 OID 17615)
-- Name: update_student(integer, jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_student(p_student_id integer, p_student_data jsonb) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE students
    SET
        lrn = COALESCE(p_student_data->>'lrn', lrn),
        first_name = COALESCE(p_student_data->>'firstName', first_name),
        middle_name = COALESCE(p_student_data->>'middleName', middle_name),
        last_name = COALESCE(p_student_data->>'lastName', last_name),
        name_extension = COALESCE(p_student_data->>'nameExtension', name_extension),
        gender = COALESCE((p_student_data->>'sex')::gender_type, gender),
        birthdate = COALESCE((p_student_data->>'birthdate')::DATE, birthdate),
        birth_place = COALESCE(p_student_data->>'birthPlace', birth_place),
        nationality = COALESCE(p_student_data->>'nationality', nationality),
        religion = COALESCE(p_student_data->>'religion', religion),
        mother_tongue = COALESCE(p_student_data->>'motherTongue', mother_tongue),
        address = COALESCE(p_student_data->>'address', address),
        barangay = COALESCE(p_student_data->>'barangay', barangay),
        municipality = COALESCE(p_student_data->>'municipality', municipality),
        province = COALESCE(p_student_data->>'province', province),
        father_name = COALESCE(p_student_data->>'fatherName', father_name),
        mother_name = COALESCE(p_student_data->>'motherName', mother_name),
        guardian_name = COALESCE(p_student_data->>'guardianName', guardian_name),
        guardian_relationship = COALESCE(p_student_data->>'guardianRelationship', guardian_relationship),
        contact_number = COALESCE(p_student_data->>'contactNumber', contact_number),
        elem_school_name = COALESCE(p_student_data->>'elementarySchoolName', elem_school_name),
        elem_school_id = COALESCE(p_student_data->>'elementarySchoolId', elem_school_id),
        elem_school_address = COALESCE(p_student_data->>'elementarySchoolAddress', elem_school_address),
        elem_pept_passer = COALESCE((p_student_data->>'elemPeptPasser')::BOOLEAN, elem_pept_passer),
        elem_pept_date = COALESCE((p_student_data->>'elemPeptDate')::DATE, elem_pept_date),
        elem_als_ae_passer = COALESCE((p_student_data->>'elemAlsAePasser')::BOOLEAN, elem_als_ae_passer),
        elem_als_ae_date = COALESCE((p_student_data->>'elemAlsAeDate')::DATE, elem_als_ae_date),
        elem_completion_date = COALESCE((p_student_data->>'elemCompletionDate')::DATE, elem_completion_date),
        elem_gen_average = COALESCE((p_student_data->>'elemGenAverage')::NUMERIC, elem_gen_average),
        elem_citation = COALESCE(p_student_data->>'elemCitation', elem_citation),
        alt_credential_type = COALESCE(p_student_data->>'altCredentialType', alt_credential_type),
        alt_credential_rating = COALESCE((p_student_data->>'altCredentialRating')::NUMERIC, alt_credential_rating),
        alt_credential_exam_date = COALESCE((p_student_data->>'altCredentialExamDate')::DATE, alt_credential_exam_date),
        alt_credential_center = COALESCE(p_student_data->>'altCredentialCenter', alt_credential_center),
        updated_at = NOW()
    WHERE id = p_student_id;

    RETURN QUERY SELECT 'Student updated successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.update_student(p_student_id integer, p_student_data jsonb) OWNER TO postgres;

--
-- TOC entry 506 (class 1255 OID 17616)
-- Name: update_subject(integer, character varying, character varying, smallint, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_subject(p_id integer, p_name character varying, p_code character varying, p_grade_level smallint, p_description text, p_is_mapeh boolean DEFAULT false, p_mapeh_parent_id integer DEFAULT NULL, p_is_active boolean DEFAULT true, p_display_name character varying DEFAULT NULL) RETURNS TABLE(result text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE subjects
    SET name = p_name,
        code = p_code,
        grade_level = p_grade_level,
        description = p_description,
        is_mapeh = p_is_mapeh,
        mapeh_parent_id = p_mapeh_parent_id,
        is_active = p_is_active,
        display_name = p_display_name,
        updated_at = NOW()
    WHERE id = p_id;

    RETURN QUERY SELECT 'Subject updated successfully'::TEXT;
END;
$$;


ALTER FUNCTION public.update_subject(p_id integer, p_name character varying, p_code character varying, p_grade_level smallint, p_description text, p_is_mapeh boolean, p_mapeh_parent_id integer, p_is_active boolean, p_display_name character varying) OWNER TO postgres;

--
-- TOC entry 444 (class 1255 OID 17298)
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_
        -- Filter by action early - only get subscriptions interested in this action
        -- action_filter column can be: '*' (all), 'INSERT', 'UPDATE', or 'DELETE'
        and (subs.action_filter = '*' or subs.action_filter = action::text);

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- TOC entry 459 (class 1255 OID 17509)
-- Name: broadcast_changes(text, text, text, text, text, record, record, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text DEFAULT 'ROW'::text) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


ALTER FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) OWNER TO supabase_admin;

--
-- TOC entry 448 (class 1255 OID 17357)
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- TOC entry 439 (class 1255 OID 17254)
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
declare
  res jsonb;
begin
  if type_::text = 'bytea' then
    return to_jsonb(val);
  end if;
  execute format('select to_jsonb(%L::'|| type_::text || ')', val) into res;
  return res;
end
$$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- TOC entry 438 (class 1255 OID 17249)
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- TOC entry 445 (class 1255 OID 17313)
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- TOC entry 456 (class 1255 OID 17449)
-- Name: list_changes(name, name, integer, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) RETURNS SETOF realtime.wal_rls
    LANGUAGE sql
    SET log_min_messages TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


ALTER FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) OWNER TO supabase_admin;

--
-- TOC entry 437 (class 1255 OID 17239)
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- TOC entry 458 (class 1255 OID 17508)
-- Name: send(jsonb, text, text, boolean); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean DEFAULT true) RETURNS void
    LANGUAGE plpgsql
    AS $$
DECLARE
  generated_id uuid;
  final_payload jsonb;
BEGIN
  BEGIN
    -- Generate a new UUID for the id
    generated_id := gen_random_uuid();

    -- Check if payload has an 'id' key, if not, add the generated UUID
    IF payload ? 'id' THEN
      final_payload := payload;
    ELSE
      final_payload := jsonb_set(payload, '{id}', to_jsonb(generated_id));
    END IF;

    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (id, payload, event, topic, private, extension)
    VALUES (generated_id, final_payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


ALTER FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) OWNER TO supabase_admin;

--
-- TOC entry 433 (class 1255 OID 17205)
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- TOC entry 441 (class 1255 OID 17283)
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- TOC entry 457 (class 1255 OID 17502)
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE FUNCTION realtime.topic() RETURNS text
    LANGUAGE sql STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


ALTER FUNCTION realtime.topic() OWNER TO supabase_realtime_admin;

--
-- TOC entry 446 (class 1255 OID 17314)
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


ALTER FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) OWNER TO supabase_storage_admin;

--
-- TOC entry 450 (class 1255 OID 17378)
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


ALTER FUNCTION storage.enforce_bucket_name_length() OWNER TO supabase_storage_admin;

--
-- TOC entry 436 (class 1255 OID 17237)
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 435 (class 1255 OID 17236)
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 434 (class 1255 OID 17235)
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- TOC entry 451 (class 1255 OID 17434)
-- Name: get_common_prefix(text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) RETURNS text
    LANGUAGE sql IMMUTABLE
    AS $$
SELECT CASE
    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0
    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))
    ELSE NULL
END;
$$;


ALTER FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) OWNER TO supabase_storage_admin;

--
-- TOC entry 440 (class 1255 OID 17274)
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- TOC entry 447 (class 1255 OID 17356)
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


ALTER FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) OWNER TO supabase_storage_admin;

--
-- TOC entry 452 (class 1255 OID 17435)
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;

    -- Configuration
    v_is_asc BOOLEAN;
    v_prefix TEXT;
    v_start TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';
    v_prefix := coalesce(prefix_param, '');
    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;
    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);

    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE "C")
    IF v_prefix = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix, 1) = delimiter_param THEN
        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);
    ELSE
        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'AND o.name COLLATE "C" < $3 ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" >= $2 ' ||
                'ORDER BY o.name COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'AND o.name COLLATE "C" >= $3 ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE "C" < $2 ' ||
                'ORDER BY o.name COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- ========================================================================
    -- SEEK INITIALIZATION: Determine starting position
    -- ========================================================================
    IF v_start = '' THEN
        IF v_is_asc THEN
            v_next_seek := v_prefix;
        ELSE
            -- DESC without cursor: find the last item in range
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_next_seek FROM storage.objects o
                WHERE o.bucket_id = _bucket_id
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;

            IF v_next_seek IS NOT NULL THEN
                v_next_seek := v_next_seek || delimiter_param;
            ELSE
                RETURN;
            END IF;
        END IF;
    ELSE
        -- Cursor provided: determine if it refers to a folder or leaf
        IF EXISTS (
            SELECT 1 FROM storage.objects o
            WHERE o.bucket_id = _bucket_id
              AND o.name COLLATE "C" LIKE v_start || delimiter_param || '%'
            LIMIT 1
        ) THEN
            -- Cursor refers to a folder
            IF v_is_asc THEN
                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_start || delimiter_param;
            END IF;
        ELSE
            -- Cursor refers to a leaf object
            IF v_is_asc THEN
                v_next_seek := v_start || delimiter_param;
            ELSE
                v_next_seek := v_start;
            END IF;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= max_keys;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek AND o.name COLLATE "C" < v_upper_bound
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" >= v_next_seek
                ORDER BY o.name COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek AND o.name COLLATE "C" >= v_prefix
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = _bucket_id AND o.name COLLATE "C" < v_next_seek
                ORDER BY o.name COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Emit and skip to next folder (no heap access needed)
            name := rtrim(v_common_prefix, delimiter_param);
            id := NULL;
            updated_at := NULL;
            created_at := NULL;
            last_accessed_at := NULL;
            metadata := NULL;
            RETURN NEXT;
            v_count := v_count + 1;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);
            ELSE
                v_next_seek := v_common_prefix;
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,
                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := v_current.name;
                    EXIT;
                END IF;

                -- Emit file
                name := v_current.name;
                id := v_current.id;
                updated_at := v_current.updated_at;
                created_at := v_current.created_at;
                last_accessed_at := v_current.last_accessed_at;
                metadata := v_current.metadata;
                RETURN NEXT;
                v_count := v_count + 1;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := v_current.name || delimiter_param;
                ELSE
                    v_next_seek := v_current.name;
                END IF;

                EXIT WHEN v_count >= max_keys;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text) OWNER TO supabase_storage_admin;

--
-- TOC entry 449 (class 1255 OID 17373)
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


ALTER FUNCTION storage.operation() OWNER TO supabase_storage_admin;

--
-- TOC entry 455 (class 1255 OID 17441)
-- Name: protect_delete(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.protect_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Check if storage.allow_delete_query is set to 'true'
    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN
        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'
            USING HINT = 'This prevents accidental data loss from orphaned objects.',
                  ERRCODE = '42501';
    END IF;
    RETURN NULL;
END;
$$;


ALTER FUNCTION storage.protect_delete() OWNER TO supabase_storage_admin;

--
-- TOC entry 442 (class 1255 OID 17287)
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_peek_name TEXT;
    v_current RECORD;
    v_common_prefix TEXT;
    v_delimiter CONSTANT TEXT := '/';

    -- Configuration
    v_limit INT;
    v_prefix TEXT;
    v_prefix_lower TEXT;
    v_is_asc BOOLEAN;
    v_order_by TEXT;
    v_sort_order TEXT;
    v_upper_bound TEXT;
    v_file_batch_size INT;

    -- Dynamic SQL for batch query only
    v_batch_query TEXT;

    -- Seek state
    v_next_seek TEXT;
    v_count INT := 0;
    v_skipped INT := 0;
BEGIN
    -- ========================================================================
    -- INITIALIZATION
    -- ========================================================================
    v_limit := LEAST(coalesce(limits, 100), 1500);
    v_prefix := coalesce(prefix, '') || coalesce(search, '');
    v_prefix_lower := lower(v_prefix);
    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';
    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);

    -- Validate sort column
    CASE lower(coalesce(sortcolumn, 'name'))
        WHEN 'name' THEN v_order_by := 'name';
        WHEN 'updated_at' THEN v_order_by := 'updated_at';
        WHEN 'created_at' THEN v_order_by := 'created_at';
        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';
        ELSE v_order_by := 'name';
    END CASE;

    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;

    -- ========================================================================
    -- NON-NAME SORTING: Use path_tokens approach (unchanged)
    -- ========================================================================
    IF v_order_by != 'name' THEN
        RETURN QUERY EXECUTE format(
            $sql$
            WITH folders AS (
                SELECT path_tokens[$1] AS folder
                FROM storage.objects
                WHERE objects.name ILIKE $2 || '%%'
                  AND bucket_id = $3
                  AND array_length(objects.path_tokens, 1) <> $1
                GROUP BY folder
                ORDER BY folder %s
            )
            (SELECT folder AS "name",
                   NULL::uuid AS id,
                   NULL::timestamptz AS updated_at,
                   NULL::timestamptz AS created_at,
                   NULL::timestamptz AS last_accessed_at,
                   NULL::jsonb AS metadata FROM folders)
            UNION ALL
            (SELECT path_tokens[$1] AS "name",
                   id, updated_at, created_at, last_accessed_at, metadata
             FROM storage.objects
             WHERE objects.name ILIKE $2 || '%%'
               AND bucket_id = $3
               AND array_length(objects.path_tokens, 1) = $1
             ORDER BY %I %s)
            LIMIT $4 OFFSET $5
            $sql$, v_sort_order, v_order_by, v_sort_order
        ) USING levels, v_prefix, bucketname, v_limit, offsets;
        RETURN;
    END IF;

    -- ========================================================================
    -- NAME SORTING: Hybrid skip-scan with batch optimization
    -- ========================================================================

    -- Calculate upper bound for prefix filtering
    IF v_prefix_lower = '' THEN
        v_upper_bound := NULL;
    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);
    ELSE
        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);
    END IF;

    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)
    IF v_is_asc THEN
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'AND lower(o.name) COLLATE "C" < $3 ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" >= $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" ASC LIMIT $4';
        END IF;
    ELSE
        IF v_upper_bound IS NOT NULL THEN
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'AND lower(o.name) COLLATE "C" >= $3 ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        ELSE
            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||
                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE "C" < $2 ' ||
                'ORDER BY lower(o.name) COLLATE "C" DESC LIMIT $4';
        END IF;
    END IF;

    -- Initialize seek position
    IF v_is_asc THEN
        v_next_seek := v_prefix_lower;
    ELSE
        -- DESC: find the last item in range first (static SQL)
        IF v_upper_bound IS NOT NULL THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower AND lower(o.name) COLLATE "C" < v_upper_bound
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSIF v_prefix_lower <> '' THEN
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_prefix_lower
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        ELSE
            SELECT o.name INTO v_peek_name FROM storage.objects o
            WHERE o.bucket_id = bucketname
            ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
        END IF;

        IF v_peek_name IS NOT NULL THEN
            v_next_seek := lower(v_peek_name) || v_delimiter;
        ELSE
            RETURN;
        END IF;
    END IF;

    -- ========================================================================
    -- MAIN LOOP: Hybrid peek-then-batch algorithm
    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch
    -- ========================================================================
    LOOP
        EXIT WHEN v_count >= v_limit;

        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)
        IF v_is_asc THEN
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek AND lower(o.name) COLLATE "C" < v_upper_bound
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" >= v_next_seek
                ORDER BY lower(o.name) COLLATE "C" ASC LIMIT 1;
            END IF;
        ELSE
            IF v_upper_bound IS NOT NULL THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSIF v_prefix_lower <> '' THEN
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek AND lower(o.name) COLLATE "C" >= v_prefix_lower
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            ELSE
                SELECT o.name INTO v_peek_name FROM storage.objects o
                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE "C" < v_next_seek
                ORDER BY lower(o.name) COLLATE "C" DESC LIMIT 1;
            END IF;
        END IF;

        EXIT WHEN v_peek_name IS NULL;

        -- STEP 2: Check if this is a FOLDER or FILE
        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);

        IF v_common_prefix IS NOT NULL THEN
            -- FOLDER: Handle offset, emit if needed, skip to next folder
            IF v_skipped < offsets THEN
                v_skipped := v_skipped + 1;
            ELSE
                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);
                id := NULL;
                updated_at := NULL;
                created_at := NULL;
                last_accessed_at := NULL;
                metadata := NULL;
                RETURN NEXT;
                v_count := v_count + 1;
            END IF;

            -- Advance seek past the folder range
            IF v_is_asc THEN
                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);
            ELSE
                v_next_seek := lower(v_common_prefix);
            END IF;
        ELSE
            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)
            -- For ASC: upper_bound is the exclusive upper limit (< condition)
            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)
            FOR v_current IN EXECUTE v_batch_query
                USING bucketname, v_next_seek,
                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size
            LOOP
                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);

                IF v_common_prefix IS NOT NULL THEN
                    -- Hit a folder: exit batch, let peek handle it
                    v_next_seek := lower(v_current.name);
                    EXIT;
                END IF;

                -- Handle offset skipping
                IF v_skipped < offsets THEN
                    v_skipped := v_skipped + 1;
                ELSE
                    -- Emit file
                    name := split_part(v_current.name, v_delimiter, levels);
                    id := v_current.id;
                    updated_at := v_current.updated_at;
                    created_at := v_current.created_at;
                    last_accessed_at := v_current.last_accessed_at;
                    metadata := v_current.metadata;
                    RETURN NEXT;
                    v_count := v_count + 1;
                END IF;

                -- Advance seek past this file
                IF v_is_asc THEN
                    v_next_seek := lower(v_current.name) || v_delimiter;
                ELSE
                    v_next_seek := lower(v_current.name);
                END IF;

                EXIT WHEN v_count >= v_limit;
            END LOOP;
        END IF;
    END LOOP;
END;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- TOC entry 454 (class 1255 OID 17439)
-- Name: search_by_timestamp(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    v_cursor_op text;
    v_query text;
    v_prefix text;
BEGIN
    v_prefix := coalesce(p_prefix, '');

    IF p_sort_order = 'asc' THEN
        v_cursor_op := '>';
    ELSE
        v_cursor_op := '<';
    END IF;

    v_query := format($sql$
        WITH raw_objects AS (
            SELECT
                o.name AS obj_name,
                o.id AS obj_id,
                o.updated_at AS obj_updated_at,
                o.created_at AS obj_created_at,
                o.last_accessed_at AS obj_last_accessed_at,
                o.metadata AS obj_metadata,
                storage.get_common_prefix(o.name, $1, '/') AS common_prefix
            FROM storage.objects o
            WHERE o.bucket_id = $2
              AND o.name COLLATE "C" LIKE $1 || '%%'
        ),
        -- Aggregate common prefixes (folders)
        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior
        aggregated_prefixes AS (
            SELECT
                rtrim(common_prefix, '/') AS name,
                NULL::uuid AS id,
                MIN(obj_created_at) AS updated_at,
                MIN(obj_created_at) AS created_at,
                NULL::timestamptz AS last_accessed_at,
                NULL::jsonb AS metadata,
                TRUE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NOT NULL
            GROUP BY common_prefix
        ),
        leaf_objects AS (
            SELECT
                obj_name AS name,
                obj_id AS id,
                obj_updated_at AS updated_at,
                obj_created_at AS created_at,
                obj_last_accessed_at AS last_accessed_at,
                obj_metadata AS metadata,
                FALSE AS is_prefix
            FROM raw_objects
            WHERE common_prefix IS NULL
        ),
        combined AS (
            SELECT * FROM aggregated_prefixes
            UNION ALL
            SELECT * FROM leaf_objects
        ),
        filtered AS (
            SELECT *
            FROM combined
            WHERE (
                $5 = ''
                OR ROW(
                    date_trunc('milliseconds', %I),
                    name COLLATE "C"
                ) %s ROW(
                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),
                    $5
                )
            )
        )
        SELECT
            split_part(name, '/', $3) AS key,
            name,
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
        FROM filtered
        ORDER BY
            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,
            name COLLATE "C" %s
        LIMIT $4
    $sql$,
        p_sort_column,
        v_cursor_op,
        p_sort_column,
        p_sort_order,
        p_sort_order
    );

    RETURN QUERY EXECUTE v_query
    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;
END;
$_$;


ALTER FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) OWNER TO supabase_storage_admin;

--
-- TOC entry 453 (class 1255 OID 17438)
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    v_sort_col text;
    v_sort_ord text;
    v_limit int;
BEGIN
    -- Cap limit to maximum of 1500 records
    v_limit := LEAST(coalesce(limits, 100), 1500);

    -- Validate and normalize sort_order
    v_sort_ord := lower(coalesce(sort_order, 'asc'));
    IF v_sort_ord NOT IN ('asc', 'desc') THEN
        v_sort_ord := 'asc';
    END IF;

    -- Validate and normalize sort_column
    v_sort_col := lower(coalesce(sort_column, 'name'));
    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN
        v_sort_col := 'name';
    END IF;

    -- Route to appropriate implementation
    IF v_sort_col = 'name' THEN
        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))
        RETURN QUERY
        SELECT
            split_part(l.name, '/', levels) AS key,
            l.name AS name,
            l.id,
            l.updated_at,
            l.created_at,
            l.last_accessed_at,
            l.metadata
        FROM storage.list_objects_with_delimiter(
            bucket_name,
            coalesce(prefix, ''),
            '/',
            v_limit,
            start_after,
            '',
            v_sort_ord
        ) l;
    ELSE
        -- Use aggregation approach for timestamp sorting
        -- Not efficient for large datasets but supports correct pagination
        RETURN QUERY SELECT * FROM storage.search_by_timestamp(
            prefix, bucket_name, v_limit, levels, start_after,
            v_sort_ord, v_sort_col, sort_column_after
        );
    END IF;
END;
$$;


ALTER FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) OWNER TO supabase_storage_admin;

--
-- TOC entry 443 (class 1255 OID 17294)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

--
-- TOC entry 272 (class 1259 OID 16529)
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- TOC entry 4751 (class 0 OID 0)
-- Dependencies: 272
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- TOC entry 292 (class 1259 OID 17078)
-- Name: custom_oauth_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.custom_oauth_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_type text NOT NULL,
    identifier text NOT NULL,
    name text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    acceptable_client_ids text[] DEFAULT '{}'::text[] NOT NULL,
    scopes text[] DEFAULT '{}'::text[] NOT NULL,
    pkce_enabled boolean DEFAULT true NOT NULL,
    attribute_mapping jsonb DEFAULT '{}'::jsonb NOT NULL,
    authorization_params jsonb DEFAULT '{}'::jsonb NOT NULL,
    enabled boolean DEFAULT true NOT NULL,
    email_optional boolean DEFAULT false NOT NULL,
    issuer text,
    discovery_url text,
    skip_nonce_check boolean DEFAULT false NOT NULL,
    cached_discovery jsonb,
    discovery_cached_at timestamp with time zone,
    authorization_url text,
    token_url text,
    userinfo_url text,
    jwks_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT custom_oauth_providers_authorization_url_https CHECK (((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_authorization_url_length CHECK (((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_client_id_length CHECK (((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))),
    CONSTRAINT custom_oauth_providers_discovery_url_length CHECK (((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_identifier_format CHECK ((identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)),
    CONSTRAINT custom_oauth_providers_issuer_length CHECK (((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))),
    CONSTRAINT custom_oauth_providers_jwks_uri_https CHECK (((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_jwks_uri_length CHECK (((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))),
    CONSTRAINT custom_oauth_providers_name_length CHECK (((char_length(name) >= 1) AND (char_length(name) <= 100))),
    CONSTRAINT custom_oauth_providers_oauth2_requires_endpoints CHECK (((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))),
    CONSTRAINT custom_oauth_providers_oidc_discovery_url_https CHECK (((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_issuer_https CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_oidc_requires_issuer CHECK (((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))),
    CONSTRAINT custom_oauth_providers_provider_type_check CHECK ((provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))),
    CONSTRAINT custom_oauth_providers_token_url_https CHECK (((token_url IS NULL) OR (token_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_token_url_length CHECK (((token_url IS NULL) OR (char_length(token_url) <= 2048))),
    CONSTRAINT custom_oauth_providers_userinfo_url_https CHECK (((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))),
    CONSTRAINT custom_oauth_providers_userinfo_url_length CHECK (((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048)))
);


ALTER TABLE auth.custom_oauth_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 286 (class 1259 OID 16883)
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text,
    code_challenge_method auth.code_challenge_method,
    code_challenge text,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone,
    invite_token text,
    referrer text,
    oauth_client_state_id uuid,
    linking_target_id uuid,
    email_optional boolean DEFAULT false NOT NULL
);


ALTER TABLE auth.flow_state OWNER TO supabase_auth_admin;

--
-- TOC entry 4754 (class 0 OID 0)
-- Dependencies: 286
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.flow_state IS 'Stores metadata for all OAuth/SSO login flows';


--
-- TOC entry 277 (class 1259 OID 16681)
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- TOC entry 4756 (class 0 OID 0)
-- Dependencies: 277
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- TOC entry 4757 (class 0 OID 0)
-- Dependencies: 277
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- TOC entry 271 (class 1259 OID 16522)
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- TOC entry 4759 (class 0 OID 0)
-- Dependencies: 271
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- TOC entry 281 (class 1259 OID 16770)
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


ALTER TABLE auth.mfa_amr_claims OWNER TO supabase_auth_admin;

--
-- TOC entry 4761 (class 0 OID 0)
-- Dependencies: 281
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- TOC entry 280 (class 1259 OID 16758)
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


ALTER TABLE auth.mfa_challenges OWNER TO supabase_auth_admin;

--
-- TOC entry 4763 (class 0 OID 0)
-- Dependencies: 280
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- TOC entry 279 (class 1259 OID 16745)
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


ALTER TABLE auth.mfa_factors OWNER TO supabase_auth_admin;

--
-- TOC entry 4765 (class 0 OID 0)
-- Dependencies: 279
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- TOC entry 4766 (class 0 OID 0)
-- Dependencies: 279
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- TOC entry 289 (class 1259 OID 16995)
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


ALTER TABLE auth.oauth_authorizations OWNER TO supabase_auth_admin;

--
-- TOC entry 291 (class 1259 OID 17068)
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE auth.oauth_client_states OWNER TO supabase_auth_admin;

--
-- TOC entry 4769 (class 0 OID 0)
-- Dependencies: 291
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- TOC entry 288 (class 1259 OID 16965)
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    token_endpoint_auth_method text NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
    CONSTRAINT oauth_clients_token_endpoint_auth_method_check CHECK ((token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text])))
);


ALTER TABLE auth.oauth_clients OWNER TO supabase_auth_admin;

--
-- TOC entry 290 (class 1259 OID 17028)
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


ALTER TABLE auth.oauth_consents OWNER TO supabase_auth_admin;

--
-- TOC entry 287 (class 1259 OID 16933)
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


ALTER TABLE auth.one_time_tokens OWNER TO supabase_auth_admin;

--
-- TOC entry 270 (class 1259 OID 16511)
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- TOC entry 4774 (class 0 OID 0)
-- Dependencies: 270
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- TOC entry 269 (class 1259 OID 16510)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- TOC entry 4776 (class 0 OID 0)
-- Dependencies: 269
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- TOC entry 284 (class 1259 OID 16812)
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


ALTER TABLE auth.saml_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 4778 (class 0 OID 0)
-- Dependencies: 284
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- TOC entry 285 (class 1259 OID 16830)
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


ALTER TABLE auth.saml_relay_states OWNER TO supabase_auth_admin;

--
-- TOC entry 4780 (class 0 OID 0)
-- Dependencies: 285
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- TOC entry 273 (class 1259 OID 16537)
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- TOC entry 4782 (class 0 OID 0)
-- Dependencies: 273
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- TOC entry 278 (class 1259 OID 16711)
-- Name: sessions; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


ALTER TABLE auth.sessions OWNER TO supabase_auth_admin;

--
-- TOC entry 4784 (class 0 OID 0)
-- Dependencies: 278
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- TOC entry 4785 (class 0 OID 0)
-- Dependencies: 278
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- TOC entry 4786 (class 0 OID 0)
-- Dependencies: 278
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- TOC entry 4787 (class 0 OID 0)
-- Dependencies: 278
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- TOC entry 283 (class 1259 OID 16797)
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


ALTER TABLE auth.sso_domains OWNER TO supabase_auth_admin;

--
-- TOC entry 4789 (class 0 OID 0)
-- Dependencies: 283
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- TOC entry 282 (class 1259 OID 16788)
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


ALTER TABLE auth.sso_providers OWNER TO supabase_auth_admin;

--
-- TOC entry 4791 (class 0 OID 0)
-- Dependencies: 282
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- TOC entry 4792 (class 0 OID 0)
-- Dependencies: 282
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- TOC entry 268 (class 1259 OID 16499)
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- TOC entry 4794 (class 0 OID 0)
-- Dependencies: 268
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- TOC entry 4795 (class 0 OID 0)
-- Dependencies: 268
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- TOC entry 294 (class 1259 OID 17143)
-- Name: webauthn_challenges; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_challenges (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    challenge_type text NOT NULL,
    session_data jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    CONSTRAINT webauthn_challenges_challenge_type_check CHECK ((challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text])))
);


ALTER TABLE auth.webauthn_challenges OWNER TO supabase_auth_admin;

--
-- TOC entry 293 (class 1259 OID 17120)
-- Name: webauthn_credentials; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.webauthn_credentials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    credential_id bytea NOT NULL,
    public_key bytea NOT NULL,
    attestation_type text DEFAULT ''::text NOT NULL,
    aaguid uuid,
    sign_count bigint DEFAULT 0 NOT NULL,
    transports jsonb DEFAULT '[]'::jsonb NOT NULL,
    backup_eligible boolean DEFAULT false NOT NULL,
    backed_up boolean DEFAULT false NOT NULL,
    friendly_name text DEFAULT ''::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    last_used_at timestamp with time zone
);


ALTER TABLE auth.webauthn_credentials OWNER TO supabase_auth_admin;

--
-- TOC entry 310 (class 1259 OID 17617)
-- Name: academic_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.academic_records (
    id integer NOT NULL,
    enrollment_id integer NOT NULL,
    general_average numeric(5,2),
    remarks text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.academic_records OWNER TO postgres;

--
-- TOC entry 311 (class 1259 OID 17624)
-- Name: academic_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.academic_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.academic_records_id_seq OWNER TO postgres;

--
-- TOC entry 4802 (class 0 OID 0)
-- Dependencies: 311
-- Name: academic_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.academic_records_id_seq OWNED BY public.academic_records.id;


--
-- TOC entry 312 (class 1259 OID 17625)
-- Name: column_mappings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.column_mappings (
    id integer NOT NULL,
    import_log_id integer NOT NULL,
    source_column character varying(255) NOT NULL,
    target_field character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.column_mappings OWNER TO postgres;

--
-- TOC entry 313 (class 1259 OID 17629)
-- Name: column_mappings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.column_mappings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.column_mappings_id_seq OWNER TO postgres;

--
-- TOC entry 4805 (class 0 OID 0)
-- Dependencies: 313
-- Name: column_mappings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.column_mappings_id_seq OWNED BY public.column_mappings.id;


--
-- TOC entry 314 (class 1259 OID 17630)
-- Name: enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.enrollments (
    id integer NOT NULL,
    student_id integer NOT NULL,
    school_year_id integer NOT NULL,
    section_id integer NOT NULL,
    grade_level smallint NOT NULL,
    status public.student_status DEFAULT 'Enrolled'::public.student_status NOT NULL,
    enrollment_date date DEFAULT CURRENT_DATE NOT NULL,
    remarks text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT enrollments_grade_level_check CHECK (((grade_level >= 7) AND (grade_level <= 10)))
);


ALTER TABLE public.enrollments OWNER TO postgres;

--
-- TOC entry 315 (class 1259 OID 17640)
-- Name: enrollments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.enrollments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enrollments_id_seq OWNER TO postgres;

--
-- TOC entry 4808 (class 0 OID 0)
-- Dependencies: 315
-- Name: enrollments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.enrollments_id_seq OWNED BY public.enrollments.id;


--
-- TOC entry 316 (class 1259 OID 17641)
-- Name: import_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.import_logs (
    id integer NOT NULL,
    school_year_id integer,
    section_id integer,
    quarter_number smallint,
    source_url text,
    source_filename character varying(255),
    imported_by integer,
    status public.import_status DEFAULT 'processing'::public.import_status NOT NULL,
    total_rows integer DEFAULT 0,
    success_rows integer DEFAULT 0,
    failed_rows integer DEFAULT 0,
    error_summary text,
    imported_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    CONSTRAINT import_logs_quarter_number_check CHECK (((quarter_number >= 1) AND (quarter_number <= 4)))
);


ALTER TABLE public.import_logs OWNER TO postgres;

--
-- TOC entry 317 (class 1259 OID 17652)
-- Name: import_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.import_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.import_logs_id_seq OWNER TO postgres;

--
-- TOC entry 4811 (class 0 OID 0)
-- Dependencies: 317
-- Name: import_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.import_logs_id_seq OWNED BY public.import_logs.id;


--
-- TOC entry 318 (class 1259 OID 17653)
-- Name: import_preview_rows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.import_preview_rows (
    id integer NOT NULL,
    import_log_id integer NOT NULL,
    row_number integer NOT NULL,
    raw_data jsonb NOT NULL,
    mapped_data jsonb,
    is_valid boolean DEFAULT false NOT NULL,
    validation_notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.import_preview_rows OWNER TO postgres;

--
-- TOC entry 319 (class 1259 OID 17660)
-- Name: import_preview_rows_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.import_preview_rows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.import_preview_rows_id_seq OWNER TO postgres;

--
-- TOC entry 4814 (class 0 OID 0)
-- Dependencies: 319
-- Name: import_preview_rows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.import_preview_rows_id_seq OWNED BY public.import_preview_rows.id;


--
-- TOC entry 320 (class 1259 OID 17661)
-- Name: quarters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quarters (
    id integer NOT NULL,
    school_year_id integer NOT NULL,
    quarter_number smallint NOT NULL,
    start_date date,
    end_date date,
    is_active boolean DEFAULT false NOT NULL,
    CONSTRAINT quarters_quarter_number_check CHECK (((quarter_number >= 1) AND (quarter_number <= 4)))
);


ALTER TABLE public.quarters OWNER TO postgres;

--
-- TOC entry 321 (class 1259 OID 17666)
-- Name: quarters_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quarters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quarters_id_seq OWNER TO postgres;

--
-- TOC entry 4817 (class 0 OID 0)
-- Dependencies: 321
-- Name: quarters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quarters_id_seq OWNED BY public.quarters.id;


--
-- TOC entry 322 (class 1259 OID 17667)
-- Name: school; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    deped_id character varying(50),
    district character varying(150),
    division character varying(150),
    region character varying(100),
    address text,
    contact_number character varying(30),
    email character varying(255),
    principal_name character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.school OWNER TO postgres;

--
-- TOC entry 323 (class 1259 OID 17674)
-- Name: school_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.school_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.school_id_seq OWNER TO postgres;

--
-- TOC entry 4820 (class 0 OID 0)
-- Dependencies: 323
-- Name: school_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.school_id_seq OWNED BY public.school.id;


--
-- TOC entry 324 (class 1259 OID 17675)
-- Name: school_years; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_years (
    id integer NOT NULL,
    label character varying(20) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    is_active boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_sy_dates CHECK ((end_date > start_date))
);


ALTER TABLE public.school_years OWNER TO postgres;

--
-- TOC entry 325 (class 1259 OID 17682)
-- Name: school_years_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.school_years_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.school_years_id_seq OWNER TO postgres;

--
-- TOC entry 4823 (class 0 OID 0)
-- Dependencies: 325
-- Name: school_years_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.school_years_id_seq OWNED BY public.school_years.id;


--
-- TOC entry 326 (class 1259 OID 17683)
-- Name: section_subjects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.section_subjects (
    id integer NOT NULL,
    section_id integer NOT NULL,
    subject_id integer NOT NULL,
    teacher_id integer
);


ALTER TABLE public.section_subjects OWNER TO postgres;

--
-- TOC entry 327 (class 1259 OID 17686)
-- Name: section_subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.section_subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.section_subjects_id_seq OWNER TO postgres;

--
-- TOC entry 4826 (class 0 OID 0)
-- Dependencies: 327
-- Name: section_subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.section_subjects_id_seq OWNED BY public.section_subjects.id;


--
-- TOC entry 328 (class 1259 OID 17687)
-- Name: sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sections (
    id integer NOT NULL,
    school_year_id integer NOT NULL,
    grade_level smallint NOT NULL,
    name character varying(100) NOT NULL,
    adviser_id integer,
    room_number character varying(50),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT sections_grade_level_check CHECK (((grade_level >= 7) AND (grade_level <= 10)))
);


ALTER TABLE public.sections OWNER TO postgres;

--
-- TOC entry 329 (class 1259 OID 17693)
-- Name: sections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sections_id_seq OWNER TO postgres;

--
-- TOC entry 4829 (class 0 OID 0)
-- Dependencies: 329
-- Name: sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sections_id_seq OWNED BY public.sections.id;


--
-- TOC entry 331 (class 1259 OID 17705)
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.students_id_seq OWNER TO postgres;

--
-- TOC entry 4831 (class 0 OID 0)
-- Dependencies: 331
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- TOC entry 332 (class 1259 OID 17706)
-- Name: subject_grades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subject_grades (
    id integer NOT NULL,
    academic_record_id integer NOT NULL,
    subject_id integer NOT NULL,
    q1_grade numeric(5,2),
    q2_grade numeric(5,2),
    q3_grade numeric(5,2),
    q4_grade numeric(5,2),
    final_grade numeric(5,2),
    remarks character varying(50),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT subject_grades_final_grade_check CHECK (((final_grade >= (0)::numeric) AND (final_grade <= (100)::numeric))),
    CONSTRAINT subject_grades_q1_grade_check CHECK (((q1_grade >= (0)::numeric) AND (q1_grade <= (100)::numeric))),
    CONSTRAINT subject_grades_q2_grade_check CHECK (((q2_grade >= (0)::numeric) AND (q2_grade <= (100)::numeric))),
    CONSTRAINT subject_grades_q3_grade_check CHECK (((q3_grade >= (0)::numeric) AND (q3_grade <= (100)::numeric))),
    CONSTRAINT subject_grades_q4_grade_check CHECK (((q4_grade >= (0)::numeric) AND (q4_grade <= (100)::numeric)))
);


ALTER TABLE public.subject_grades OWNER TO postgres;

--
-- TOC entry 333 (class 1259 OID 17716)
-- Name: subject_grades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subject_grades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subject_grades_id_seq OWNER TO postgres;

--
-- TOC entry 4834 (class 0 OID 0)
-- Dependencies: 333
-- Name: subject_grades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subject_grades_id_seq OWNED BY public.subject_grades.id;


--
-- TOC entry 334 (class 1259 OID 17717)
-- Name: subjects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subjects (
    id integer NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    grade_level smallint,
    is_mapeh boolean DEFAULT false NOT NULL,
    mapeh_component character varying(50),
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    display_name character varying(255),
    sort_order smallint DEFAULT 0 NOT NULL,
    mapeh_parent_id integer,
    CONSTRAINT subjects_grade_level_check CHECK (((grade_level >= 7) AND (grade_level <= 10)))
);


ALTER TABLE public.subjects OWNER TO postgres;

--
-- TOC entry 335 (class 1259 OID 17728)
-- Name: subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subjects_id_seq OWNER TO postgres;

--
-- TOC entry 4837 (class 0 OID 0)
-- Dependencies: 335
-- Name: subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subjects_id_seq OWNED BY public.subjects.id;


--
-- TOC entry 336 (class 1259 OID 17729)
-- Name: teachers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teachers (
    id integer NOT NULL,
    user_id integer,
    employee_id character varying(50),
    first_name character varying(100) NOT NULL,
    middle_name character varying(100),
    last_name character varying(100) NOT NULL,
    suffix character varying(20),
    gender public.gender_type,
    birthdate date,
    contact_number character varying(30),
    email character varying(255),
    specialization character varying(150),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.teachers OWNER TO postgres;

--
-- TOC entry 337 (class 1259 OID 17737)
-- Name: teachers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teachers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teachers_id_seq OWNER TO postgres;

--
-- TOC entry 4840 (class 0 OID 0)
-- Dependencies: 337
-- Name: teachers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teachers_id_seq OWNED BY public.teachers.id;


--
-- TOC entry 338 (class 1259 OID 17738)
-- Name: transcript_headers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transcript_headers (
    id integer NOT NULL,
    student_id integer NOT NULL,
    source character varying(20) DEFAULT 'external'::character varying NOT NULL,
    enrollment_id integer,
    school_name character varying(255) NOT NULL,
    school_id character varying(50),
    district character varying(150),
    division character varying(150),
    region character varying(100),
    grade_level smallint NOT NULL,
    section_name character varying(100),
    school_year character varying(20) NOT NULL,
    adviser_name character varying(255),
    adviser_signature text,
    general_average numeric(5,2),
    final_remarks character varying(100),
    remedial_from date,
    remedial_to date,
    display_order smallint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    school_address text,
    CONSTRAINT transcript_headers_general_average_check CHECK (((general_average >= (0)::numeric) AND (general_average <= (100)::numeric))),
    CONSTRAINT transcript_headers_grade_level_check CHECK (((grade_level >= 1) AND (grade_level <= 13))),
    CONSTRAINT transcript_headers_source_check CHECK (((source)::text = ANY (ARRAY[('external'::character varying)::text, ('system'::character varying)::text])))
);


ALTER TABLE public.transcript_headers OWNER TO postgres;

--
-- TOC entry 339 (class 1259 OID 17750)
-- Name: transcript_headers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transcript_headers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transcript_headers_id_seq OWNER TO postgres;

--
-- TOC entry 4843 (class 0 OID 0)
-- Dependencies: 339
-- Name: transcript_headers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transcript_headers_id_seq OWNED BY public.transcript_headers.id;


--
-- TOC entry 340 (class 1259 OID 17751)
-- Name: transcript_remedial_rows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transcript_remedial_rows (
    id integer NOT NULL,
    transcript_header_id integer NOT NULL,
    subject_name character varying(255) NOT NULL,
    final_rating numeric(5,2),
    remedial_class_mark numeric(5,2),
    recomputed_final_grade numeric(5,2),
    remarks character varying(100),
    row_order smallint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.transcript_remedial_rows OWNER TO postgres;

--
-- TOC entry 341 (class 1259 OID 17756)
-- Name: transcript_remedial_rows_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transcript_remedial_rows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transcript_remedial_rows_id_seq OWNER TO postgres;

--
-- TOC entry 4846 (class 0 OID 0)
-- Dependencies: 341
-- Name: transcript_remedial_rows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transcript_remedial_rows_id_seq OWNED BY public.transcript_remedial_rows.id;


--
-- TOC entry 342 (class 1259 OID 17757)
-- Name: transcript_subject_rows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transcript_subject_rows (
    id integer NOT NULL,
    transcript_header_id integer NOT NULL,
    subject_name character varying(255) NOT NULL,
    is_mapeh boolean DEFAULT false NOT NULL,
    mapeh_component character varying(50),
    q1_grade numeric(5,2),
    q2_grade numeric(5,2),
    q3_grade numeric(5,2),
    q4_grade numeric(5,2),
    final_rating numeric(5,2),
    remarks character varying(50),
    row_order smallint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT transcript_subject_rows_final_rating_check CHECK (((final_rating >= (0)::numeric) AND (final_rating <= (100)::numeric))),
    CONSTRAINT transcript_subject_rows_q1_grade_check CHECK (((q1_grade >= (0)::numeric) AND (q1_grade <= (100)::numeric))),
    CONSTRAINT transcript_subject_rows_q2_grade_check CHECK (((q2_grade >= (0)::numeric) AND (q2_grade <= (100)::numeric))),
    CONSTRAINT transcript_subject_rows_q3_grade_check CHECK (((q3_grade >= (0)::numeric) AND (q3_grade <= (100)::numeric))),
    CONSTRAINT transcript_subject_rows_q4_grade_check CHECK (((q4_grade >= (0)::numeric) AND (q4_grade <= (100)::numeric)))
);


ALTER TABLE public.transcript_subject_rows OWNER TO postgres;

--
-- TOC entry 343 (class 1259 OID 17769)
-- Name: transcript_subject_rows_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transcript_subject_rows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transcript_subject_rows_id_seq OWNER TO postgres;

--
-- TOC entry 4849 (class 0 OID 0)
-- Dependencies: 343
-- Name: transcript_subject_rows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transcript_subject_rows_id_seq OWNED BY public.transcript_subject_rows.id;


--
-- TOC entry 344 (class 1259 OID 17770)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    role public.user_role DEFAULT 'teacher'::public.user_role NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 345 (class 1259 OID 17779)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4852 (class 0 OID 0)
-- Dependencies: 345
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 346 (class 1259 OID 17780)
-- Name: validation_errors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.validation_errors (
    id integer NOT NULL,
    import_log_id integer NOT NULL,
    row_number integer,
    field_name character varying(100),
    raw_value text,
    error_message text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.validation_errors OWNER TO postgres;

--
-- TOC entry 347 (class 1259 OID 17786)
-- Name: validation_errors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.validation_errors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.validation_errors_id_seq OWNER TO postgres;

--
-- TOC entry 4855 (class 0 OID 0)
-- Dependencies: 347
-- Name: validation_errors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.validation_errors_id_seq OWNED BY public.validation_errors.id;


--
-- TOC entry 309 (class 1259 OID 17512)
-- Name: messages; Type: TABLE; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE TABLE realtime.messages (
    topic text NOT NULL,
    extension text NOT NULL,
    payload jsonb,
    event text,
    private boolean DEFAULT false,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    inserted_at timestamp without time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
)
PARTITION BY RANGE (inserted_at);


ALTER TABLE realtime.messages OWNER TO supabase_realtime_admin;

--
-- TOC entry 295 (class 1259 OID 17162)
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- TOC entry 298 (class 1259 OID 17185)
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    action_filter text DEFAULT '*'::text,
    CONSTRAINT subscription_action_filter_check CHECK ((action_filter = ANY (ARRAY['*'::text, 'INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- TOC entry 297 (class 1259 OID 17184)
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 300 (class 1259 OID 17206)
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 300
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 306 (class 1259 OID 17386)
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


ALTER TABLE storage.buckets_analytics OWNER TO supabase_storage_admin;

--
-- TOC entry 307 (class 1259 OID 17399)
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.buckets_vectors OWNER TO supabase_storage_admin;

--
-- TOC entry 299 (class 1259 OID 17190)
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- TOC entry 301 (class 1259 OID 17216)
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 301
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: supabase_storage_admin
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- TOC entry 304 (class 1259 OID 17321)
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


ALTER TABLE storage.s3_multipart_uploads OWNER TO supabase_storage_admin;

--
-- TOC entry 305 (class 1259 OID 17335)
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.s3_multipart_uploads_parts OWNER TO supabase_storage_admin;

--
-- TOC entry 308 (class 1259 OID 17409)
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE storage.vector_indexes OWNER TO supabase_storage_admin;

--
-- TOC entry 3806 (class 2604 OID 16514)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 3883 (class 2604 OID 17787)
-- Name: academic_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_records ALTER COLUMN id SET DEFAULT nextval('public.academic_records_id_seq'::regclass);


--
-- TOC entry 3886 (class 2604 OID 17788)
-- Name: column_mappings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.column_mappings ALTER COLUMN id SET DEFAULT nextval('public.column_mappings_id_seq'::regclass);


--
-- TOC entry 3888 (class 2604 OID 17789)
-- Name: enrollments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments ALTER COLUMN id SET DEFAULT nextval('public.enrollments_id_seq'::regclass);


--
-- TOC entry 3893 (class 2604 OID 17790)
-- Name: import_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_logs ALTER COLUMN id SET DEFAULT nextval('public.import_logs_id_seq'::regclass);


--
-- TOC entry 3899 (class 2604 OID 17791)
-- Name: import_preview_rows id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_preview_rows ALTER COLUMN id SET DEFAULT nextval('public.import_preview_rows_id_seq'::regclass);


--
-- TOC entry 3902 (class 2604 OID 17792)
-- Name: quarters id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quarters ALTER COLUMN id SET DEFAULT nextval('public.quarters_id_seq'::regclass);


--
-- TOC entry 3904 (class 2604 OID 17793)
-- Name: school id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school ALTER COLUMN id SET DEFAULT nextval('public.school_id_seq'::regclass);


--
-- TOC entry 3907 (class 2604 OID 17794)
-- Name: school_years id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_years ALTER COLUMN id SET DEFAULT nextval('public.school_years_id_seq'::regclass);


--
-- TOC entry 3911 (class 2604 OID 17795)
-- Name: section_subjects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section_subjects ALTER COLUMN id SET DEFAULT nextval('public.section_subjects_id_seq'::regclass);


--
-- TOC entry 3912 (class 2604 OID 17796)
-- Name: sections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections ALTER COLUMN id SET DEFAULT nextval('public.sections_id_seq'::regclass);


--
-- TOC entry 3915 (class 2604 OID 17797)
-- Name: students id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- TOC entry 3922 (class 2604 OID 17798)
-- Name: subject_grades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject_grades ALTER COLUMN id SET DEFAULT nextval('public.subject_grades_id_seq'::regclass);


--
-- TOC entry 3925 (class 2604 OID 17799)
-- Name: subjects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects ALTER COLUMN id SET DEFAULT nextval('public.subjects_id_seq'::regclass);


--
-- TOC entry 3931 (class 2604 OID 17800)
-- Name: teachers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers ALTER COLUMN id SET DEFAULT nextval('public.teachers_id_seq'::regclass);


--
-- TOC entry 3935 (class 2604 OID 17801)
-- Name: transcript_headers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript_headers ALTER COLUMN id SET DEFAULT nextval('public.transcript_headers_id_seq'::regclass);


--
-- TOC entry 3940 (class 2604 OID 17802)
-- Name: transcript_remedial_rows id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript_remedial_rows ALTER COLUMN id SET DEFAULT nextval('public.transcript_remedial_rows_id_seq'::regclass);


--
-- TOC entry 3943 (class 2604 OID 17803)
-- Name: transcript_subject_rows id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript_subject_rows ALTER COLUMN id SET DEFAULT nextval('public.transcript_subject_rows_id_seq'::regclass);


--
-- TOC entry 3948 (class 2604 OID 17804)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3953 (class 2604 OID 17805)
-- Name: validation_errors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validation_errors ALTER COLUMN id SET DEFAULT nextval('public.validation_errors_id_seq'::regclass);


--
-- TOC entry 4524 (class 0 OID 16529)
-- Dependencies: 272
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) FROM stdin;
\.


--
-- TOC entry 4541 (class 0 OID 17078)
-- Dependencies: 292
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.custom_oauth_providers (id, provider_type, identifier, name, client_id, client_secret, acceptable_client_ids, scopes, pkce_enabled, attribute_mapping, authorization_params, enabled, email_optional, issuer, discovery_url, skip_nonce_check, cached_discovery, discovery_cached_at, authorization_url, token_url, userinfo_url, jwks_uri, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4535 (class 0 OID 16883)
-- Dependencies: 286
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.flow_state (id, user_id, auth_code, code_challenge_method, code_challenge, provider_type, provider_access_token, provider_refresh_token, created_at, updated_at, authentication_method, auth_code_issued_at, invite_token, referrer, oauth_client_state_id, linking_target_id, email_optional) FROM stdin;
\.


--
-- TOC entry 4526 (class 0 OID 16681)
-- Dependencies: 277
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) FROM stdin;
\.


--
-- TOC entry 4523 (class 0 OID 16522)
-- Dependencies: 271
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.instances (id, uuid, raw_base_config, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4530 (class 0 OID 16770)
-- Dependencies: 281
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_amr_claims (session_id, created_at, updated_at, authentication_method, id) FROM stdin;
\.


--
-- TOC entry 4529 (class 0 OID 16758)
-- Dependencies: 280
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_challenges (id, factor_id, created_at, verified_at, ip_address, otp_code, web_authn_session_data) FROM stdin;
\.


--
-- TOC entry 4528 (class 0 OID 16745)
-- Dependencies: 279
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.mfa_factors (id, user_id, friendly_name, factor_type, status, created_at, updated_at, secret, phone, last_challenged_at, web_authn_credential, web_authn_aaguid, last_webauthn_challenge_data) FROM stdin;
\.


--
-- TOC entry 4538 (class 0 OID 16995)
-- Dependencies: 289
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_authorizations (id, authorization_id, client_id, user_id, redirect_uri, scope, state, resource, code_challenge, code_challenge_method, response_type, status, authorization_code, created_at, expires_at, approved_at, nonce) FROM stdin;
\.


--
-- TOC entry 4540 (class 0 OID 17068)
-- Dependencies: 291
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_client_states (id, provider_type, code_verifier, created_at) FROM stdin;
\.


--
-- TOC entry 4537 (class 0 OID 16965)
-- Dependencies: 288
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_clients (id, client_secret_hash, registration_type, redirect_uris, grant_types, client_name, client_uri, logo_uri, created_at, updated_at, deleted_at, client_type, token_endpoint_auth_method) FROM stdin;
\.


--
-- TOC entry 4539 (class 0 OID 17028)
-- Dependencies: 290
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.oauth_consents (id, user_id, client_id, scopes, granted_at, revoked_at) FROM stdin;
\.


--
-- TOC entry 4536 (class 0 OID 16933)
-- Dependencies: 287
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.one_time_tokens (id, user_id, token_type, token_hash, relates_to, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4522 (class 0 OID 16511)
-- Dependencies: 270
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) FROM stdin;
\.


--
-- TOC entry 4533 (class 0 OID 16812)
-- Dependencies: 284
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_providers (id, sso_provider_id, entity_id, metadata_xml, metadata_url, attribute_mapping, created_at, updated_at, name_id_format) FROM stdin;
\.


--
-- TOC entry 4534 (class 0 OID 16830)
-- Dependencies: 285
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.saml_relay_states (id, sso_provider_id, request_id, for_email, redirect_to, created_at, updated_at, flow_state_id) FROM stdin;
\.


--
-- TOC entry 4525 (class 0 OID 16537)
-- Dependencies: 273
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.schema_migrations (version) FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
20250717082212
20250731150234
20250804100000
20250901200500
20250903112500
20250904133000
20250925093508
20251007112900
20251104100000
20251111201300
20251201000000
20260115000000
20260121000000
20260219120000
20260302000000
\.


--
-- TOC entry 4527 (class 0 OID 16711)
-- Dependencies: 278
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sessions (id, user_id, created_at, updated_at, factor_id, aal, not_after, refreshed_at, user_agent, ip, tag, oauth_client_id, refresh_token_hmac_key, refresh_token_counter, scopes) FROM stdin;
\.


--
-- TOC entry 4532 (class 0 OID 16797)
-- Dependencies: 283
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_domains (id, sso_provider_id, domain, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4531 (class 0 OID 16788)
-- Dependencies: 282
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.sso_providers (id, resource_id, created_at, updated_at, disabled) FROM stdin;
\.


--
-- TOC entry 4520 (class 0 OID 16499)
-- Dependencies: 268
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous) FROM stdin;
\.


--
-- TOC entry 4543 (class 0 OID 17143)
-- Dependencies: 294
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_challenges (id, user_id, challenge_type, session_data, created_at, expires_at) FROM stdin;
\.


--
-- TOC entry 4542 (class 0 OID 17120)
-- Dependencies: 293
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY auth.webauthn_credentials (id, user_id, credential_id, public_key, attestation_type, aaguid, sign_count, transports, backup_eligible, backed_up, friendly_name, created_at, updated_at, last_used_at) FROM stdin;
\.


--
-- TOC entry 4555 (class 0 OID 17617)
-- Dependencies: 310
-- Data for Name: academic_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.academic_records (id, enrollment_id, general_average, remarks, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4557 (class 0 OID 17625)
-- Dependencies: 312
-- Data for Name: column_mappings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.column_mappings (id, import_log_id, source_column, target_field, created_at) FROM stdin;
\.


--
-- TOC entry 4559 (class 0 OID 17630)
-- Dependencies: 314
-- Data for Name: enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.enrollments (id, student_id, school_year_id, section_id, grade_level, status, enrollment_date, remarks, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4561 (class 0 OID 17641)
-- Dependencies: 316
-- Data for Name: import_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.import_logs (id, school_year_id, section_id, quarter_number, source_url, source_filename, imported_by, status, total_rows, success_rows, failed_rows, error_summary, imported_at, completed_at) FROM stdin;
\.


--
-- TOC entry 4563 (class 0 OID 17653)
-- Dependencies: 318
-- Data for Name: import_preview_rows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.import_preview_rows (id, import_log_id, row_number, raw_data, mapped_data, is_valid, validation_notes, created_at) FROM stdin;
\.


--
-- TOC entry 4565 (class 0 OID 17661)
-- Dependencies: 320
-- Data for Name: quarters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quarters (id, school_year_id, quarter_number, start_date, end_date, is_active) FROM stdin;
38	10	1	2027-05-28	2027-07-07	t
39	10	2	2027-07-14	2027-09-22	f
40	10	3	2027-10-06	2027-12-15	f
41	10	4	2027-12-22	2028-03-01	f
\.


--
-- TOC entry 4567 (class 0 OID 17667)
-- Dependencies: 322
-- Data for Name: school; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.school (id, name, deped_id, district, division, region, address, contact_number, email, principal_name, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4569 (class 0 OID 17675)
-- Dependencies: 324
-- Data for Name: school_years; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.school_years (id, label, start_date, end_date, is_active, created_at, updated_at) FROM stdin;
10	2026-2028	2027-04-26	2028-04-26	t	2026-03-27 09:31:15.674863+00	2026-03-27 09:42:03.215301+00
\.


--
-- TOC entry 4571 (class 0 OID 17683)
-- Dependencies: 326
-- Data for Name: section_subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.section_subjects (id, section_id, subject_id, teacher_id) FROM stdin;
\.


--
-- TOC entry 4573 (class 0 OID 17687)
-- Dependencies: 328
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sections (id, school_year_id, grade_level, name, adviser_id, room_number, created_at, updated_at) FROM stdin;
4	10	7	Integrity	\N	\N	2026-03-27 09:58:48.15311+00	2026-03-27 09:58:48.15311+00
5	10	7	Dignity	\N	\N	2026-03-27 10:25:18.526444+00	2026-03-27 10:25:18.526444+00
\.


--
-- TOC entry 4575 (class 0 OID 17694)
-- Dependencies: 330
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, lrn, first_name, middle_name, last_name, suffix, gender, birthdate, birth_place, nationality, religion, mother_tongue, address, barangay, municipality, province, father_name, mother_name, guardian_name, guardian_relationship, contact_number, elem_school_name, elem_school_id, elem_school_address, elem_pept_passer, elem_pept_date, elem_als_ae_passer, elem_als_ae_date, elem_completion_date, elem_gen_average, elem_citation, alt_credential_type, alt_credential_rating, alt_credential_exam_date, alt_credential_center, is_active, created_at, updated_at, name_extension) FROM stdin;
\.


--
-- TOC entry 4577 (class 0 OID 17706)
-- Dependencies: 332
-- Data for Name: subject_grades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subject_grades (id, academic_record_id, subject_id, q1_grade, q2_grade, q3_grade, q4_grade, final_grade, remarks, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4579 (class 0 OID 17717)
-- Dependencies: 334
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subjects (id, code, name, grade_level, is_mapeh, mapeh_component, description, is_active, created_at, updated_at, display_name, sort_order, mapeh_parent_id) FROM stdin;
\.


--
-- TOC entry 4581 (class 0 OID 17729)
-- Dependencies: 336
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teachers (id, user_id, employee_id, first_name, middle_name, last_name, suffix, gender, birthdate, contact_number, email, specialization, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4583 (class 0 OID 17738)
-- Dependencies: 338
-- Data for Name: transcript_headers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transcript_headers (id, student_id, source, enrollment_id, school_name, school_id, district, division, region, grade_level, section_name, school_year, adviser_name, adviser_signature, general_average, final_remarks, remedial_from, remedial_to, display_order, created_at, updated_at, school_address) FROM stdin;
\.


--
-- TOC entry 4585 (class 0 OID 17751)
-- Dependencies: 340
-- Data for Name: transcript_remedial_rows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transcript_remedial_rows (id, transcript_header_id, subject_name, final_rating, remedial_class_mark, recomputed_final_grade, remarks, row_order, created_at) FROM stdin;
\.


--
-- TOC entry 4587 (class 0 OID 17757)
-- Dependencies: 342
-- Data for Name: transcript_subject_rows; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transcript_subject_rows (id, transcript_header_id, subject_name, is_mapeh, mapeh_component, q1_grade, q2_grade, q3_grade, q4_grade, final_rating, remarks, row_order, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4589 (class 0 OID 17770)
-- Dependencies: 344
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password_hash, role, is_active, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4591 (class 0 OID 17780)
-- Dependencies: 346
-- Data for Name: validation_errors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.validation_errors (id, import_log_id, row_number, field_name, raw_value, error_message, created_at) FROM stdin;
\.


--
-- TOC entry 4544 (class 0 OID 17162)
-- Dependencies: 295
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.schema_migrations (version, inserted_at) FROM stdin;
20211116024918	2026-03-27 02:47:28
20211116045059	2026-03-27 02:47:28
20211116050929	2026-03-27 02:47:28
20211116051442	2026-03-27 02:47:28
20211116212300	2026-03-27 02:47:28
20211116213355	2026-03-27 02:47:28
20211116213934	2026-03-27 02:47:28
20211116214523	2026-03-27 02:47:28
20211122062447	2026-03-27 02:47:28
20211124070109	2026-03-27 02:47:28
20211202204204	2026-03-27 02:47:28
20211202204605	2026-03-27 02:47:28
20211210212804	2026-03-27 02:47:28
20211228014915	2026-03-27 02:47:28
20220107221237	2026-03-27 02:47:28
20220228202821	2026-03-27 02:47:28
20220312004840	2026-03-27 02:47:29
20220603231003	2026-03-27 02:47:29
20220603232444	2026-03-27 02:47:29
20220615214548	2026-03-27 02:47:29
20220712093339	2026-03-27 02:47:29
20220908172859	2026-03-27 02:47:29
20220916233421	2026-03-27 02:47:29
20230119133233	2026-03-27 02:47:29
20230128025114	2026-03-27 02:47:29
20230128025212	2026-03-27 02:47:29
20230227211149	2026-03-27 02:47:29
20230228184745	2026-03-27 02:47:29
20230308225145	2026-03-27 02:49:02
20230328144023	2026-03-27 02:49:02
20231018144023	2026-03-27 02:49:02
20231204144023	2026-03-27 02:49:02
20231204144024	2026-03-27 02:49:02
20231204144025	2026-03-27 02:49:02
20240108234812	2026-03-27 02:49:02
20240109165339	2026-03-27 02:49:02
20240227174441	2026-03-27 02:49:02
20240311171622	2026-03-27 02:49:02
20240321100241	2026-03-27 02:49:02
20240401105812	2026-03-27 02:49:02
20240418121054	2026-03-27 02:49:02
20240523004032	2026-03-27 02:49:02
20240618124746	2026-03-27 02:49:03
20240801235015	2026-03-27 02:49:03
20240805133720	2026-03-27 02:49:03
20240827160934	2026-03-27 02:49:03
20240919163303	2026-03-27 02:49:03
20240919163305	2026-03-27 02:49:03
20241019105805	2026-03-27 02:49:03
20241030150047	2026-03-27 02:49:03
20241108114728	2026-03-27 02:49:03
20241121104152	2026-03-27 02:49:03
20241130184212	2026-03-27 02:49:03
20241220035512	2026-03-27 02:49:03
20241220123912	2026-03-27 02:49:03
20241224161212	2026-03-27 02:49:03
20250107150512	2026-03-27 02:49:03
20250110162412	2026-03-27 02:49:03
20250123174212	2026-03-27 02:49:03
20250128220012	2026-03-27 02:49:04
20250506224012	2026-03-27 02:49:04
20250523164012	2026-03-27 02:49:04
20250714121412	2026-03-27 02:49:04
20250905041441	2026-03-27 02:49:04
20251103001201	2026-03-27 02:49:04
20251120212548	2026-03-27 02:49:04
20251120215549	2026-03-27 02:49:04
20260218120000	2026-03-27 02:49:04
\.


--
-- TOC entry 4546 (class 0 OID 17185)
-- Dependencies: 298
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: supabase_admin
--

COPY realtime.subscription (id, subscription_id, entity, filters, claims, created_at, action_filter) FROM stdin;
\.


--
-- TOC entry 4548 (class 0 OID 17206)
-- Dependencies: 300
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets (id, name, owner, created_at, updated_at, public, avif_autodetection, file_size_limit, allowed_mime_types, owner_id, type) FROM stdin;
\.


--
-- TOC entry 4552 (class 0 OID 17386)
-- Dependencies: 306
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_analytics (name, type, format, created_at, updated_at, id, deleted_at) FROM stdin;
\.


--
-- TOC entry 4553 (class 0 OID 17399)
-- Dependencies: 307
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.buckets_vectors (id, type, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4547 (class 0 OID 17190)
-- Dependencies: 299
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.migrations (id, name, hash, executed_at) FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2026-03-27 02:47:28.356815
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2026-03-27 02:47:28.389768
2	storage-schema	f6a1fa2c93cbcd16d4e487b362e45fca157a8dbd	2026-03-27 02:47:28.432902
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2026-03-27 02:47:28.563595
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2026-03-27 02:47:28.823938
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2026-03-27 02:47:28.83091
6	change-column-name-in-get-size	ded78e2f1b5d7e616117897e6443a925965b30d2	2026-03-27 02:47:28.837269
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2026-03-27 02:47:28.843497
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2026-03-27 02:47:28.849184
9	fix-search-function	af597a1b590c70519b464a4ab3be54490712796b	2026-03-27 02:47:28.855114
10	search-files-search-function	b595f05e92f7e91211af1bbfe9c6a13bb3391e16	2026-03-27 02:47:28.861409
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2026-03-27 02:47:28.875199
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2026-03-27 02:47:28.883845
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2026-03-27 02:47:28.890757
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2026-03-27 02:47:28.896803
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2026-03-27 02:47:29.07825
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2026-03-27 02:47:29.084273
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2026-03-27 02:47:29.090774
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2026-03-27 02:47:29.096325
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2026-03-27 02:47:29.103781
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2026-03-27 02:47:29.109575
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2026-03-27 02:47:29.118155
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2026-03-27 02:47:29.140366
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2026-03-27 02:47:29.156396
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2026-03-27 02:47:29.162858
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2026-03-27 02:47:29.169231
26	objects-prefixes	215cabcb7f78121892a5a2037a09fedf9a1ae322	2026-03-27 02:47:29.175355
27	search-v2	859ba38092ac96eb3964d83bf53ccc0b141663a6	2026-03-27 02:47:29.180775
28	object-bucket-name-sorting	c73a2b5b5d4041e39705814fd3a1b95502d38ce4	2026-03-27 02:47:29.186411
29	create-prefixes	ad2c1207f76703d11a9f9007f821620017a66c21	2026-03-27 02:47:29.191802
30	update-object-levels	2be814ff05c8252fdfdc7cfb4b7f5c7e17f0bed6	2026-03-27 02:47:29.197023
31	objects-level-index	b40367c14c3440ec75f19bbce2d71e914ddd3da0	2026-03-27 02:47:29.202713
32	backward-compatible-index-on-objects	e0c37182b0f7aee3efd823298fb3c76f1042c0f7	2026-03-27 02:47:29.208097
33	backward-compatible-index-on-prefixes	b480e99ed951e0900f033ec4eb34b5bdcb4e3d49	2026-03-27 02:47:29.213493
34	optimize-search-function-v1	ca80a3dc7bfef894df17108785ce29a7fc8ee456	2026-03-27 02:47:29.218916
35	add-insert-trigger-prefixes	458fe0ffd07ec53f5e3ce9df51bfdf4861929ccc	2026-03-27 02:47:29.225362
36	optimise-existing-functions	6ae5fca6af5c55abe95369cd4f93985d1814ca8f	2026-03-27 02:47:29.230753
37	add-bucket-name-length-trigger	3944135b4e3e8b22d6d4cbb568fe3b0b51df15c1	2026-03-27 02:47:29.236188
38	iceberg-catalog-flag-on-buckets	02716b81ceec9705aed84aa1501657095b32e5c5	2026-03-27 02:47:29.24399
39	add-search-v2-sort-support	6706c5f2928846abee18461279799ad12b279b78	2026-03-27 02:47:40.587885
40	fix-prefix-race-conditions-optimized	7ad69982ae2d372b21f48fc4829ae9752c518f6b	2026-03-27 02:47:40.659185
41	add-object-level-update-trigger	07fcf1a22165849b7a029deed059ffcde08d1ae0	2026-03-27 02:47:40.66255
42	rollback-prefix-triggers	771479077764adc09e2ea2043eb627503c034cd4	2026-03-27 02:47:40.679459
43	fix-object-level	84b35d6caca9d937478ad8a797491f38b8c2979f	2026-03-27 02:47:40.683018
44	vector-bucket-type	99c20c0ffd52bb1ff1f32fb992f3b351e3ef8fb3	2026-03-27 02:47:40.686053
45	vector-buckets	049e27196d77a7cb76497a85afae669d8b230953	2026-03-27 02:47:40.794792
46	buckets-objects-grants	fedeb96d60fefd8e02ab3ded9fbde05632f84aed	2026-03-27 02:47:40.909633
47	iceberg-table-metadata	649df56855c24d8b36dd4cc1aeb8251aa9ad42c2	2026-03-27 02:47:40.917123
48	iceberg-catalog-ids	e0e8b460c609b9999ccd0df9ad14294613eed939	2026-03-27 02:47:40.921205
49	buckets-objects-grants-postgres	072b1195d0d5a2f888af6b2302a1938dd94b8b3d	2026-03-27 02:47:41.667981
50	search-v2-optimised	6323ac4f850aa14e7387eb32102869578b5bd478	2026-03-27 02:47:41.693413
51	index-backward-compatible-search	2ee395d433f76e38bcd3856debaf6e0e5b674011	2026-03-27 02:47:44.598801
52	drop-not-used-indexes-and-functions	5cc44c8696749ac11dd0dc37f2a3802075f3a171	2026-03-27 02:47:44.630589
53	drop-index-lower-name	d0cb18777d9e2a98ebe0bc5cc7a42e57ebe41854	2026-03-27 02:47:44.678933
54	drop-index-object-level	6289e048b1472da17c31a7eba1ded625a6457e67	2026-03-27 02:47:44.681506
55	prevent-direct-deletes	262a4798d5e0f2e7c8970232e03ce8be695d5819	2026-03-27 02:47:44.683171
56	fix-optimized-search-function	cb58526ebc23048049fd5bf2fd148d18b04a2073	2026-03-27 02:47:44.696284
\.


--
-- TOC entry 4549 (class 0 OID 17216)
-- Dependencies: 301
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.objects (id, bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata, version, owner_id, user_metadata) FROM stdin;
\.


--
-- TOC entry 4550 (class 0 OID 17321)
-- Dependencies: 304
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads (id, in_progress_size, upload_signature, bucket_id, key, version, owner_id, created_at, user_metadata) FROM stdin;
\.


--
-- TOC entry 4551 (class 0 OID 17335)
-- Dependencies: 305
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.s3_multipart_uploads_parts (id, upload_id, size, part_number, bucket_id, key, etag, owner_id, version, created_at) FROM stdin;
\.


--
-- TOC entry 4554 (class 0 OID 17409)
-- Dependencies: 308
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY storage.vector_indexes (id, name, bucket_id, data_type, dimension, distance_metric, metadata_configuration, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 3796 (class 0 OID 16612)
-- Dependencies: 274
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY vault.secrets (id, name, description, secret, key_id, nonce, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4872 (class 0 OID 0)
-- Dependencies: 269
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('auth.refresh_tokens_id_seq', 1, false);


--
-- TOC entry 4873 (class 0 OID 0)
-- Dependencies: 311
-- Name: academic_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.academic_records_id_seq', 1, false);


--
-- TOC entry 4874 (class 0 OID 0)
-- Dependencies: 313
-- Name: column_mappings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.column_mappings_id_seq', 1, false);


--
-- TOC entry 4875 (class 0 OID 0)
-- Dependencies: 315
-- Name: enrollments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.enrollments_id_seq', 1, false);


--
-- TOC entry 4876 (class 0 OID 0)
-- Dependencies: 317
-- Name: import_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.import_logs_id_seq', 1, false);


--
-- TOC entry 4877 (class 0 OID 0)
-- Dependencies: 319
-- Name: import_preview_rows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.import_preview_rows_id_seq', 1, false);


--
-- TOC entry 4878 (class 0 OID 0)
-- Dependencies: 321
-- Name: quarters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quarters_id_seq', 41, true);


--
-- TOC entry 4879 (class 0 OID 0)
-- Dependencies: 323
-- Name: school_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.school_id_seq', 1, false);


--
-- TOC entry 4880 (class 0 OID 0)
-- Dependencies: 325
-- Name: school_years_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.school_years_id_seq', 12, true);


--
-- TOC entry 4881 (class 0 OID 0)
-- Dependencies: 327
-- Name: section_subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.section_subjects_id_seq', 1, false);


--
-- TOC entry 4882 (class 0 OID 0)
-- Dependencies: 329
-- Name: sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sections_id_seq', 5, true);


--
-- TOC entry 4883 (class 0 OID 0)
-- Dependencies: 331
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.students_id_seq', 1, true);


--
-- TOC entry 4884 (class 0 OID 0)
-- Dependencies: 333
-- Name: subject_grades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subject_grades_id_seq', 1, false);


--
-- TOC entry 4885 (class 0 OID 0)
-- Dependencies: 335
-- Name: subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subjects_id_seq', 1, false);


--
-- TOC entry 4886 (class 0 OID 0)
-- Dependencies: 337
-- Name: teachers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teachers_id_seq', 1, false);


--
-- TOC entry 4887 (class 0 OID 0)
-- Dependencies: 339
-- Name: transcript_headers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transcript_headers_id_seq', 1, false);


--
-- TOC entry 4888 (class 0 OID 0)
-- Dependencies: 341
-- Name: transcript_remedial_rows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transcript_remedial_rows_id_seq', 1, false);


--
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 343
-- Name: transcript_subject_rows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transcript_subject_rows_id_seq', 1, false);


--
-- TOC entry 4890 (class 0 OID 0)
-- Dependencies: 345
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 4891 (class 0 OID 0)
-- Dependencies: 347
-- Name: validation_errors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.validation_errors_id_seq', 1, false);


--
-- TOC entry 4892 (class 0 OID 0)
-- Dependencies: 297
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: supabase_admin
--

SELECT pg_catalog.setval('realtime.subscription_id_seq', 1, false);


--
-- TOC entry 4074 (class 2606 OID 16783)
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- TOC entry 4043 (class 2606 OID 16535)
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 4129 (class 2606 OID 17115)
-- Name: custom_oauth_providers custom_oauth_providers_identifier_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_identifier_key UNIQUE (identifier);


--
-- TOC entry 4131 (class 2606 OID 17113)
-- Name: custom_oauth_providers custom_oauth_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.custom_oauth_providers
    ADD CONSTRAINT custom_oauth_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4097 (class 2606 OID 16889)
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- TOC entry 4052 (class 2606 OID 16907)
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- TOC entry 4054 (class 2606 OID 16917)
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- TOC entry 4041 (class 2606 OID 16528)
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- TOC entry 4076 (class 2606 OID 16776)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- TOC entry 4072 (class 2606 OID 16764)
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 4064 (class 2606 OID 16957)
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- TOC entry 4066 (class 2606 OID 16751)
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- TOC entry 4110 (class 2606 OID 17016)
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- TOC entry 4112 (class 2606 OID 17014)
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- TOC entry 4114 (class 2606 OID 17012)
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- TOC entry 4124 (class 2606 OID 17074)
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- TOC entry 4107 (class 2606 OID 16976)
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- TOC entry 4118 (class 2606 OID 17038)
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- TOC entry 4120 (class 2606 OID 17040)
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- TOC entry 4101 (class 2606 OID 16942)
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4035 (class 2606 OID 16518)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4038 (class 2606 OID 16694)
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- TOC entry 4086 (class 2606 OID 16823)
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- TOC entry 4088 (class 2606 OID 16821)
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4093 (class 2606 OID 16837)
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- TOC entry 4046 (class 2606 OID 16541)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4059 (class 2606 OID 16715)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 4083 (class 2606 OID 16804)
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- TOC entry 4078 (class 2606 OID 16795)
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- TOC entry 4028 (class 2606 OID 16877)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- TOC entry 4030 (class 2606 OID 16505)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4139 (class 2606 OID 17152)
-- Name: webauthn_challenges webauthn_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_pkey PRIMARY KEY (id);


--
-- TOC entry 4135 (class 2606 OID 17135)
-- Name: webauthn_credentials webauthn_credentials_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_pkey PRIMARY KEY (id);


--
-- TOC entry 4177 (class 2606 OID 17807)
-- Name: academic_records academic_records_enrollment_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_records
    ADD CONSTRAINT academic_records_enrollment_id_key UNIQUE (enrollment_id);


--
-- TOC entry 4179 (class 2606 OID 17809)
-- Name: academic_records academic_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_records
    ADD CONSTRAINT academic_records_pkey PRIMARY KEY (id);


--
-- TOC entry 4181 (class 2606 OID 17811)
-- Name: column_mappings column_mappings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.column_mappings
    ADD CONSTRAINT column_mappings_pkey PRIMARY KEY (id);


--
-- TOC entry 4183 (class 2606 OID 17813)
-- Name: enrollments enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);


--
-- TOC entry 4185 (class 2606 OID 17815)
-- Name: enrollments enrollments_student_id_school_year_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_student_id_school_year_id_key UNIQUE (student_id, school_year_id);


--
-- TOC entry 4191 (class 2606 OID 17817)
-- Name: import_logs import_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_logs
    ADD CONSTRAINT import_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4194 (class 2606 OID 17819)
-- Name: import_preview_rows import_preview_rows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_preview_rows
    ADD CONSTRAINT import_preview_rows_pkey PRIMARY KEY (id);


--
-- TOC entry 4196 (class 2606 OID 17821)
-- Name: quarters quarters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quarters
    ADD CONSTRAINT quarters_pkey PRIMARY KEY (id);


--
-- TOC entry 4198 (class 2606 OID 17823)
-- Name: quarters quarters_school_year_id_quarter_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quarters
    ADD CONSTRAINT quarters_school_year_id_quarter_number_key UNIQUE (school_year_id, quarter_number);


--
-- TOC entry 4200 (class 2606 OID 17825)
-- Name: school school_deped_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school
    ADD CONSTRAINT school_deped_id_key UNIQUE (deped_id);


--
-- TOC entry 4202 (class 2606 OID 17827)
-- Name: school school_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school
    ADD CONSTRAINT school_pkey PRIMARY KEY (id);


--
-- TOC entry 4204 (class 2606 OID 17829)
-- Name: school_years school_years_label_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_years
    ADD CONSTRAINT school_years_label_key UNIQUE (label);


--
-- TOC entry 4206 (class 2606 OID 17831)
-- Name: school_years school_years_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_years
    ADD CONSTRAINT school_years_pkey PRIMARY KEY (id);


--
-- TOC entry 4208 (class 2606 OID 17833)
-- Name: section_subjects section_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section_subjects
    ADD CONSTRAINT section_subjects_pkey PRIMARY KEY (id);


--
-- TOC entry 4210 (class 2606 OID 17835)
-- Name: section_subjects section_subjects_section_id_subject_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section_subjects
    ADD CONSTRAINT section_subjects_section_id_subject_id_key UNIQUE (section_id, subject_id);


--
-- TOC entry 4213 (class 2606 OID 17837)
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- TOC entry 4215 (class 2606 OID 17839)
-- Name: sections sections_school_year_id_grade_level_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_school_year_id_grade_level_name_key UNIQUE (school_year_id, grade_level, name);


--
-- TOC entry 4219 (class 2606 OID 17841)
-- Name: students students_lrn_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_lrn_key UNIQUE (lrn);


--
-- TOC entry 4221 (class 2606 OID 17843)
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- TOC entry 4225 (class 2606 OID 17845)
-- Name: subject_grades subject_grades_academic_record_id_subject_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject_grades
    ADD CONSTRAINT subject_grades_academic_record_id_subject_id_key UNIQUE (academic_record_id, subject_id);


--
-- TOC entry 4227 (class 2606 OID 17847)
-- Name: subject_grades subject_grades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject_grades
    ADD CONSTRAINT subject_grades_pkey PRIMARY KEY (id);


--
-- TOC entry 4231 (class 2606 OID 17849)
-- Name: subjects subjects_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_code_key UNIQUE (code);


--
-- TOC entry 4233 (class 2606 OID 17851)
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- TOC entry 4236 (class 2606 OID 17853)
-- Name: teachers teachers_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_employee_id_key UNIQUE (employee_id);


--
-- TOC entry 4238 (class 2606 OID 17855)
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- TOC entry 4242 (class 2606 OID 17857)
-- Name: transcript_headers transcript_headers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript_headers
    ADD CONSTRAINT transcript_headers_pkey PRIMARY KEY (id);


--
-- TOC entry 4244 (class 2606 OID 17859)
-- Name: transcript_headers transcript_headers_student_id_school_year_grade_level_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript_headers
    ADD CONSTRAINT transcript_headers_student_id_school_year_grade_level_key UNIQUE (student_id, school_year, grade_level);


--
-- TOC entry 4247 (class 2606 OID 17861)
-- Name: transcript_remedial_rows transcript_remedial_rows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript_remedial_rows
    ADD CONSTRAINT transcript_remedial_rows_pkey PRIMARY KEY (id);


--
-- TOC entry 4250 (class 2606 OID 17863)
-- Name: transcript_subject_rows transcript_subject_rows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript_subject_rows
    ADD CONSTRAINT transcript_subject_rows_pkey PRIMARY KEY (id);


--
-- TOC entry 4252 (class 2606 OID 17865)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4254 (class 2606 OID 17867)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4256 (class 2606 OID 17869)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4259 (class 2606 OID 17871)
-- Name: validation_errors validation_errors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validation_errors
    ADD CONSTRAINT validation_errors_pkey PRIMARY KEY (id);


--
-- TOC entry 4175 (class 2606 OID 17526)
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE ONLY realtime.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id, inserted_at);


--
-- TOC entry 4145 (class 2606 OID 17196)
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- TOC entry 4142 (class 2606 OID 17166)
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- TOC entry 4166 (class 2606 OID 17432)
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- TOC entry 4153 (class 2606 OID 17214)
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- TOC entry 4169 (class 2606 OID 17408)
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- TOC entry 4148 (class 2606 OID 17203)
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- TOC entry 4150 (class 2606 OID 17199)
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4159 (class 2606 OID 17227)
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- TOC entry 4164 (class 2606 OID 17344)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- TOC entry 4162 (class 2606 OID 17329)
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- TOC entry 4172 (class 2606 OID 17418)
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- TOC entry 4044 (class 1259 OID 16536)
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- TOC entry 4018 (class 1259 OID 16704)
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4125 (class 1259 OID 17119)
-- Name: custom_oauth_providers_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_created_at_idx ON auth.custom_oauth_providers USING btree (created_at);


--
-- TOC entry 4126 (class 1259 OID 17118)
-- Name: custom_oauth_providers_enabled_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_enabled_idx ON auth.custom_oauth_providers USING btree (enabled);


--
-- TOC entry 4127 (class 1259 OID 17116)
-- Name: custom_oauth_providers_identifier_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_identifier_idx ON auth.custom_oauth_providers USING btree (identifier);


--
-- TOC entry 4132 (class 1259 OID 17117)
-- Name: custom_oauth_providers_provider_type_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX custom_oauth_providers_provider_type_idx ON auth.custom_oauth_providers USING btree (provider_type);


--
-- TOC entry 4019 (class 1259 OID 16706)
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4020 (class 1259 OID 16707)
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4062 (class 1259 OID 16785)
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- TOC entry 4095 (class 1259 OID 16893)
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- TOC entry 4050 (class 1259 OID 16873)
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- TOC entry 4893 (class 0 OID 0)
-- Dependencies: 4050
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- TOC entry 4055 (class 1259 OID 16701)
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- TOC entry 4098 (class 1259 OID 16890)
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- TOC entry 4122 (class 1259 OID 17075)
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- TOC entry 4099 (class 1259 OID 16891)
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- TOC entry 4070 (class 1259 OID 16896)
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- TOC entry 4067 (class 1259 OID 16757)
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- TOC entry 4068 (class 1259 OID 16902)
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- TOC entry 4108 (class 1259 OID 17027)
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- TOC entry 4105 (class 1259 OID 16980)
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- TOC entry 4115 (class 1259 OID 17053)
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- TOC entry 4116 (class 1259 OID 17051)
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- TOC entry 4121 (class 1259 OID 17052)
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- TOC entry 4102 (class 1259 OID 16949)
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- TOC entry 4103 (class 1259 OID 16948)
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- TOC entry 4104 (class 1259 OID 16950)
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- TOC entry 4021 (class 1259 OID 16708)
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4022 (class 1259 OID 16705)
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- TOC entry 4031 (class 1259 OID 16519)
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- TOC entry 4032 (class 1259 OID 16520)
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- TOC entry 4033 (class 1259 OID 16700)
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- TOC entry 4036 (class 1259 OID 16787)
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- TOC entry 4039 (class 1259 OID 16892)
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- TOC entry 4089 (class 1259 OID 16829)
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- TOC entry 4090 (class 1259 OID 16894)
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- TOC entry 4091 (class 1259 OID 16844)
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- TOC entry 4094 (class 1259 OID 16843)
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- TOC entry 4056 (class 1259 OID 16895)
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- TOC entry 4057 (class 1259 OID 17065)
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- TOC entry 4060 (class 1259 OID 16786)
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- TOC entry 4081 (class 1259 OID 16811)
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- TOC entry 4084 (class 1259 OID 16810)
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- TOC entry 4079 (class 1259 OID 16796)
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- TOC entry 4080 (class 1259 OID 16958)
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- TOC entry 4069 (class 1259 OID 16955)
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- TOC entry 4061 (class 1259 OID 16784)
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- TOC entry 4023 (class 1259 OID 16864)
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- TOC entry 4894 (class 0 OID 0)
-- Dependencies: 4023
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- TOC entry 4024 (class 1259 OID 16702)
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- TOC entry 4025 (class 1259 OID 16509)
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- TOC entry 4026 (class 1259 OID 16919)
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- TOC entry 4137 (class 1259 OID 17159)
-- Name: webauthn_challenges_expires_at_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_expires_at_idx ON auth.webauthn_challenges USING btree (expires_at);


--
-- TOC entry 4140 (class 1259 OID 17158)
-- Name: webauthn_challenges_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_challenges_user_id_idx ON auth.webauthn_challenges USING btree (user_id);


--
-- TOC entry 4133 (class 1259 OID 17141)
-- Name: webauthn_credentials_credential_id_key; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX webauthn_credentials_credential_id_key ON auth.webauthn_credentials USING btree (credential_id);


--
-- TOC entry 4136 (class 1259 OID 17142)
-- Name: webauthn_credentials_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX webauthn_credentials_user_id_idx ON auth.webauthn_credentials USING btree (user_id);


--
-- TOC entry 4186 (class 1259 OID 17872)
-- Name: idx_enrollments_school_year; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_enrollments_school_year ON public.enrollments USING btree (school_year_id);


--
-- TOC entry 4187 (class 1259 OID 17873)
-- Name: idx_enrollments_section; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_enrollments_section ON public.enrollments USING btree (section_id);


--
-- TOC entry 4188 (class 1259 OID 17874)
-- Name: idx_enrollments_student; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_enrollments_student ON public.enrollments USING btree (student_id);


--
-- TOC entry 4189 (class 1259 OID 17875)
-- Name: idx_import_logs_school_year; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_import_logs_school_year ON public.import_logs USING btree (school_year_id);


--
-- TOC entry 4192 (class 1259 OID 17876)
-- Name: idx_preview_rows_import; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_preview_rows_import ON public.import_preview_rows USING btree (import_log_id);


--
-- TOC entry 4211 (class 1259 OID 17877)
-- Name: idx_sections_school_year; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_sections_school_year ON public.sections USING btree (school_year_id);


--
-- TOC entry 4216 (class 1259 OID 17878)
-- Name: idx_students_last_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_students_last_name ON public.students USING btree (last_name);


--
-- TOC entry 4217 (class 1259 OID 17879)
-- Name: idx_students_lrn; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_students_lrn ON public.students USING btree (lrn);


--
-- TOC entry 4222 (class 1259 OID 17880)
-- Name: idx_subject_grades_record; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subject_grades_record ON public.subject_grades USING btree (academic_record_id);


--
-- TOC entry 4223 (class 1259 OID 17881)
-- Name: idx_subject_grades_subject; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subject_grades_subject ON public.subject_grades USING btree (subject_id);


--
-- TOC entry 4228 (class 1259 OID 17882)
-- Name: idx_subjects_mapeh_parent; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subjects_mapeh_parent ON public.subjects USING btree (mapeh_parent_id);


--
-- TOC entry 4229 (class 1259 OID 17883)
-- Name: idx_subjects_sort_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_subjects_sort_order ON public.subjects USING btree (sort_order);


--
-- TOC entry 4234 (class 1259 OID 17884)
-- Name: idx_teachers_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_teachers_user ON public.teachers USING btree (user_id);


--
-- TOC entry 4239 (class 1259 OID 17885)
-- Name: idx_transcript_headers_enrollment; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transcript_headers_enrollment ON public.transcript_headers USING btree (enrollment_id);


--
-- TOC entry 4240 (class 1259 OID 17886)
-- Name: idx_transcript_headers_student; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transcript_headers_student ON public.transcript_headers USING btree (student_id);


--
-- TOC entry 4245 (class 1259 OID 17887)
-- Name: idx_transcript_remedial_header; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transcript_remedial_header ON public.transcript_remedial_rows USING btree (transcript_header_id);


--
-- TOC entry 4248 (class 1259 OID 17888)
-- Name: idx_transcript_rows_header; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_transcript_rows_header ON public.transcript_subject_rows USING btree (transcript_header_id);


--
-- TOC entry 4257 (class 1259 OID 17889)
-- Name: idx_validation_errors_import; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_validation_errors_import ON public.validation_errors USING btree (import_log_id);


--
-- TOC entry 4143 (class 1259 OID 17527)
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING btree (entity);


--
-- TOC entry 4173 (class 1259 OID 17528)
-- Name: messages_inserted_at_topic_index; Type: INDEX; Schema: realtime; Owner: supabase_realtime_admin
--

CREATE INDEX messages_inserted_at_topic_index ON ONLY realtime.messages USING btree (inserted_at DESC, topic) WHERE ((extension = 'broadcast'::text) AND (private IS TRUE));


--
-- TOC entry 4146 (class 1259 OID 17531)
-- Name: subscription_subscription_id_entity_filters_action_filter_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_action_filter_key ON realtime.subscription USING btree (subscription_id, entity, filters, action_filter);


--
-- TOC entry 4151 (class 1259 OID 17215)
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- TOC entry 4154 (class 1259 OID 17233)
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- TOC entry 4167 (class 1259 OID 17433)
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- TOC entry 4160 (class 1259 OID 17355)
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- TOC entry 4155 (class 1259 OID 17319)
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- TOC entry 4156 (class 1259 OID 17440)
-- Name: idx_objects_bucket_id_name_lower; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX idx_objects_bucket_id_name_lower ON storage.objects USING btree (bucket_id, lower(name) COLLATE "C");


--
-- TOC entry 4157 (class 1259 OID 17234)
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- TOC entry 4170 (class 1259 OID 17424)
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- TOC entry 4312 (class 2620 OID 17890)
-- Name: academic_records trg_academic_records_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_academic_records_updated_at BEFORE UPDATE ON public.academic_records FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4319 (class 2620 OID 17891)
-- Name: subject_grades trg_compute_final_grade; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_compute_final_grade BEFORE INSERT OR UPDATE ON public.subject_grades FOR EACH ROW EXECUTE FUNCTION public.compute_subject_final_grade();


--
-- TOC entry 4313 (class 2620 OID 17892)
-- Name: enrollments trg_enrollment_finalize_snapshot; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_enrollment_finalize_snapshot AFTER UPDATE OF status ON public.enrollments FOR EACH ROW EXECUTE FUNCTION public.trg_auto_snapshot_on_finalize();


--
-- TOC entry 4314 (class 2620 OID 17893)
-- Name: enrollments trg_enrollments_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_enrollments_updated_at BEFORE UPDATE ON public.enrollments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4315 (class 2620 OID 17894)
-- Name: school trg_school_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_school_updated_at BEFORE UPDATE ON public.school FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4316 (class 2620 OID 17895)
-- Name: school_years trg_school_years_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_school_years_updated_at BEFORE UPDATE ON public.school_years FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4317 (class 2620 OID 17896)
-- Name: sections trg_sections_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_sections_updated_at BEFORE UPDATE ON public.sections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4318 (class 2620 OID 17897)
-- Name: students trg_students_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4320 (class 2620 OID 17898)
-- Name: subject_grades trg_subject_grades_refresh_avg; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_subject_grades_refresh_avg AFTER INSERT OR DELETE OR UPDATE ON public.subject_grades FOR EACH ROW EXECUTE FUNCTION public.trg_refresh_general_average();


--
-- TOC entry 4321 (class 2620 OID 17899)
-- Name: subject_grades trg_subject_grades_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_subject_grades_updated_at BEFORE UPDATE ON public.subject_grades FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4322 (class 2620 OID 17900)
-- Name: subjects trg_subjects_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4323 (class 2620 OID 17901)
-- Name: teachers trg_teachers_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_teachers_updated_at BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4324 (class 2620 OID 17902)
-- Name: transcript_headers trg_transcript_headers_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_transcript_headers_updated_at BEFORE UPDATE ON public.transcript_headers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4325 (class 2620 OID 17903)
-- Name: transcript_subject_rows trg_transcript_subject_rows_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_transcript_subject_rows_updated_at BEFORE UPDATE ON public.transcript_subject_rows FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4326 (class 2620 OID 17904)
-- Name: users trg_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4307 (class 2620 OID 17226)
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- TOC entry 4308 (class 2620 OID 17379)
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- TOC entry 4309 (class 2620 OID 17442)
-- Name: buckets protect_buckets_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- TOC entry 4310 (class 2620 OID 17443)
-- Name: objects protect_objects_delete; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete();


--
-- TOC entry 4311 (class 2620 OID 17296)
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- TOC entry 4261 (class 2606 OID 16688)
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4266 (class 2606 OID 16777)
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 4265 (class 2606 OID 16765)
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- TOC entry 4264 (class 2606 OID 16752)
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4272 (class 2606 OID 17017)
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- TOC entry 4273 (class 2606 OID 17022)
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4274 (class 2606 OID 17046)
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- TOC entry 4275 (class 2606 OID 17041)
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4271 (class 2606 OID 16943)
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4260 (class 2606 OID 16721)
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- TOC entry 4268 (class 2606 OID 16824)
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4269 (class 2606 OID 16897)
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- TOC entry 4270 (class 2606 OID 16838)
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4262 (class 2606 OID 17060)
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- TOC entry 4263 (class 2606 OID 16716)
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4267 (class 2606 OID 16805)
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- TOC entry 4277 (class 2606 OID 17153)
-- Name: webauthn_challenges webauthn_challenges_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_challenges
    ADD CONSTRAINT webauthn_challenges_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4276 (class 2606 OID 17136)
-- Name: webauthn_credentials webauthn_credentials_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.webauthn_credentials
    ADD CONSTRAINT webauthn_credentials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- TOC entry 4283 (class 2606 OID 17905)
-- Name: academic_records academic_records_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_records
    ADD CONSTRAINT academic_records_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id) ON DELETE CASCADE;


--
-- TOC entry 4284 (class 2606 OID 17910)
-- Name: column_mappings column_mappings_import_log_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.column_mappings
    ADD CONSTRAINT column_mappings_import_log_id_fkey FOREIGN KEY (import_log_id) REFERENCES public.import_logs(id) ON DELETE CASCADE;


--
-- TOC entry 4285 (class 2606 OID 17915)
-- Name: enrollments enrollments_school_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_school_year_id_fkey FOREIGN KEY (school_year_id) REFERENCES public.school_years(id) ON DELETE RESTRICT;


--
-- TOC entry 4286 (class 2606 OID 17920)
-- Name: enrollments enrollments_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id) ON DELETE RESTRICT;


--
-- TOC entry 4287 (class 2606 OID 17925)
-- Name: enrollments enrollments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE RESTRICT;


--
-- TOC entry 4288 (class 2606 OID 17930)
-- Name: import_logs import_logs_imported_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_logs
    ADD CONSTRAINT import_logs_imported_by_fkey FOREIGN KEY (imported_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4289 (class 2606 OID 17935)
-- Name: import_logs import_logs_school_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_logs
    ADD CONSTRAINT import_logs_school_year_id_fkey FOREIGN KEY (school_year_id) REFERENCES public.school_years(id) ON DELETE SET NULL;


--
-- TOC entry 4290 (class 2606 OID 17940)
-- Name: import_logs import_logs_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_logs
    ADD CONSTRAINT import_logs_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id) ON DELETE SET NULL;


--
-- TOC entry 4291 (class 2606 OID 17945)
-- Name: import_preview_rows import_preview_rows_import_log_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.import_preview_rows
    ADD CONSTRAINT import_preview_rows_import_log_id_fkey FOREIGN KEY (import_log_id) REFERENCES public.import_logs(id) ON DELETE CASCADE;


--
-- TOC entry 4292 (class 2606 OID 17950)
-- Name: quarters quarters_school_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quarters
    ADD CONSTRAINT quarters_school_year_id_fkey FOREIGN KEY (school_year_id) REFERENCES public.school_years(id) ON DELETE CASCADE;


--
-- TOC entry 4293 (class 2606 OID 17955)
-- Name: section_subjects section_subjects_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section_subjects
    ADD CONSTRAINT section_subjects_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id) ON DELETE CASCADE;


--
-- TOC entry 4294 (class 2606 OID 17960)
-- Name: section_subjects section_subjects_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section_subjects
    ADD CONSTRAINT section_subjects_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE RESTRICT;


--
-- TOC entry 4295 (class 2606 OID 17965)
-- Name: section_subjects section_subjects_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section_subjects
    ADD CONSTRAINT section_subjects_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE SET NULL;


--
-- TOC entry 4296 (class 2606 OID 17970)
-- Name: sections sections_adviser_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_adviser_id_fkey FOREIGN KEY (adviser_id) REFERENCES public.teachers(id) ON DELETE SET NULL;


--
-- TOC entry 4297 (class 2606 OID 17975)
-- Name: sections sections_school_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_school_year_id_fkey FOREIGN KEY (school_year_id) REFERENCES public.school_years(id) ON DELETE RESTRICT;


--
-- TOC entry 4298 (class 2606 OID 17980)
-- Name: subject_grades subject_grades_academic_record_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject_grades
    ADD CONSTRAINT subject_grades_academic_record_id_fkey FOREIGN KEY (academic_record_id) REFERENCES public.academic_records(id) ON DELETE CASCADE;


--
-- TOC entry 4299 (class 2606 OID 17985)
-- Name: subject_grades subject_grades_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subject_grades
    ADD CONSTRAINT subject_grades_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE RESTRICT;


--
-- TOC entry 4300 (class 2606 OID 17990)
-- Name: subjects subjects_mapeh_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_mapeh_parent_id_fkey FOREIGN KEY (mapeh_parent_id) REFERENCES public.subjects(id) ON DELETE SET NULL;


--
-- TOC entry 4301 (class 2606 OID 17995)
-- Name: teachers teachers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 4302 (class 2606 OID 18000)
-- Name: transcript_headers transcript_headers_enrollment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript_headers
    ADD CONSTRAINT transcript_headers_enrollment_id_fkey FOREIGN KEY (enrollment_id) REFERENCES public.enrollments(id) ON DELETE SET NULL;


--
-- TOC entry 4303 (class 2606 OID 18005)
-- Name: transcript_headers transcript_headers_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript_headers
    ADD CONSTRAINT transcript_headers_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id) ON DELETE CASCADE;


--
-- TOC entry 4304 (class 2606 OID 18010)
-- Name: transcript_remedial_rows transcript_remedial_rows_transcript_header_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript_remedial_rows
    ADD CONSTRAINT transcript_remedial_rows_transcript_header_id_fkey FOREIGN KEY (transcript_header_id) REFERENCES public.transcript_headers(id) ON DELETE CASCADE;


--
-- TOC entry 4305 (class 2606 OID 18015)
-- Name: transcript_subject_rows transcript_subject_rows_transcript_header_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transcript_subject_rows
    ADD CONSTRAINT transcript_subject_rows_transcript_header_id_fkey FOREIGN KEY (transcript_header_id) REFERENCES public.transcript_headers(id) ON DELETE CASCADE;


--
-- TOC entry 4306 (class 2606 OID 18020)
-- Name: validation_errors validation_errors_import_log_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.validation_errors
    ADD CONSTRAINT validation_errors_import_log_id_fkey FOREIGN KEY (import_log_id) REFERENCES public.import_logs(id) ON DELETE CASCADE;


--
-- TOC entry 4278 (class 2606 OID 17228)
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4279 (class 2606 OID 17330)
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4280 (class 2606 OID 17350)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- TOC entry 4281 (class 2606 OID 17345)
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- TOC entry 4282 (class 2606 OID 17419)
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- TOC entry 4478 (class 0 OID 16529)
-- Dependencies: 272
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4489 (class 0 OID 16883)
-- Dependencies: 286
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4480 (class 0 OID 16681)
-- Dependencies: 277
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4477 (class 0 OID 16522)
-- Dependencies: 271
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4484 (class 0 OID 16770)
-- Dependencies: 281
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4483 (class 0 OID 16758)
-- Dependencies: 280
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4482 (class 0 OID 16745)
-- Dependencies: 279
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4490 (class 0 OID 16933)
-- Dependencies: 287
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4476 (class 0 OID 16511)
-- Dependencies: 270
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4487 (class 0 OID 16812)
-- Dependencies: 284
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4488 (class 0 OID 16830)
-- Dependencies: 285
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4479 (class 0 OID 16537)
-- Dependencies: 273
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4481 (class 0 OID 16711)
-- Dependencies: 278
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4486 (class 0 OID 16797)
-- Dependencies: 283
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4485 (class 0 OID 16788)
-- Dependencies: 282
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4475 (class 0 OID 16499)
-- Dependencies: 268
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4500 (class 0 OID 17617)
-- Dependencies: 310
-- Name: academic_records; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.academic_records ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4501 (class 0 OID 17625)
-- Dependencies: 312
-- Name: column_mappings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.column_mappings ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4502 (class 0 OID 17630)
-- Dependencies: 314
-- Name: enrollments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4503 (class 0 OID 17641)
-- Dependencies: 316
-- Name: import_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.import_logs ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4504 (class 0 OID 17653)
-- Dependencies: 318
-- Name: import_preview_rows; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.import_preview_rows ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4505 (class 0 OID 17661)
-- Dependencies: 320
-- Name: quarters; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.quarters ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4506 (class 0 OID 17667)
-- Dependencies: 322
-- Name: school; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.school ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4507 (class 0 OID 17675)
-- Dependencies: 324
-- Name: school_years; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.school_years ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4508 (class 0 OID 17683)
-- Dependencies: 326
-- Name: section_subjects; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.section_subjects ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4509 (class 0 OID 17687)
-- Dependencies: 328
-- Name: sections; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4510 (class 0 OID 17694)
-- Dependencies: 330
-- Name: students; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4511 (class 0 OID 17706)
-- Dependencies: 332
-- Name: subject_grades; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.subject_grades ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4512 (class 0 OID 17717)
-- Dependencies: 334
-- Name: subjects; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4513 (class 0 OID 17729)
-- Dependencies: 336
-- Name: teachers; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4514 (class 0 OID 17738)
-- Dependencies: 338
-- Name: transcript_headers; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.transcript_headers ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4515 (class 0 OID 17751)
-- Dependencies: 340
-- Name: transcript_remedial_rows; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.transcript_remedial_rows ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4516 (class 0 OID 17757)
-- Dependencies: 342
-- Name: transcript_subject_rows; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.transcript_subject_rows ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4517 (class 0 OID 17770)
-- Dependencies: 344
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4518 (class 0 OID 17780)
-- Dependencies: 346
-- Name: validation_errors; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.validation_errors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4499 (class 0 OID 17512)
-- Dependencies: 309
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: supabase_realtime_admin
--

ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4492 (class 0 OID 17206)
-- Dependencies: 300
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4496 (class 0 OID 17386)
-- Dependencies: 306
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4497 (class 0 OID 17399)
-- Dependencies: 307
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4491 (class 0 OID 17190)
-- Dependencies: 299
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4493 (class 0 OID 17216)
-- Dependencies: 301
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4494 (class 0 OID 17321)
-- Dependencies: 304
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4495 (class 0 OID 17335)
-- Dependencies: 305
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4498 (class 0 OID 17409)
-- Dependencies: 308
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- TOC entry 4519 (class 6104 OID 16430)
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- TOC entry 4598 (class 0 OID 0)
-- Dependencies: 34
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT USAGE ON SCHEMA auth TO postgres;


--
-- TOC entry 4599 (class 0 OID 0)
-- Dependencies: 21
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- TOC entry 4600 (class 0 OID 0)
-- Dependencies: 36
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- TOC entry 4601 (class 0 OID 0)
-- Dependencies: 11
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;
GRANT USAGE ON SCHEMA realtime TO anon;
GRANT USAGE ON SCHEMA realtime TO authenticated;
GRANT USAGE ON SCHEMA realtime TO service_role;
GRANT ALL ON SCHEMA realtime TO supabase_realtime_admin;


--
-- TOC entry 4602 (class 0 OID 0)
-- Dependencies: 35
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA storage TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- TOC entry 4603 (class 0 OID 0)
-- Dependencies: 29
-- Name: SCHEMA vault; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA vault TO postgres WITH GRANT OPTION;
GRANT USAGE ON SCHEMA vault TO service_role;


--
-- TOC entry 4610 (class 0 OID 0)
-- Dependencies: 412
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- TOC entry 4611 (class 0 OID 0)
-- Dependencies: 431
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- TOC entry 4613 (class 0 OID 0)
-- Dependencies: 411
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- TOC entry 4615 (class 0 OID 0)
-- Dependencies: 410
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- TOC entry 4616 (class 0 OID 0)
-- Dependencies: 406
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- TOC entry 4617 (class 0 OID 0)
-- Dependencies: 407
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.armor(bytea, text[], text[]) FROM postgres;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- TOC entry 4618 (class 0 OID 0)
-- Dependencies: 378
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.crypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- TOC entry 4619 (class 0 OID 0)
-- Dependencies: 408
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.dearmor(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- TOC entry 4620 (class 0 OID 0)
-- Dependencies: 382
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4621 (class 0 OID 0)
-- Dependencies: 384
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4622 (class 0 OID 0)
-- Dependencies: 375
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- TOC entry 4623 (class 0 OID 0)
-- Dependencies: 374
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.digest(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- TOC entry 4624 (class 0 OID 0)
-- Dependencies: 381
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4625 (class 0 OID 0)
-- Dependencies: 383
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4626 (class 0 OID 0)
-- Dependencies: 385
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_bytes(integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- TOC entry 4627 (class 0 OID 0)
-- Dependencies: 386
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_random_uuid() FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- TOC entry 4628 (class 0 OID 0)
-- Dependencies: 379
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- TOC entry 4629 (class 0 OID 0)
-- Dependencies: 380
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.gen_salt(text, integer) FROM postgres;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- TOC entry 4631 (class 0 OID 0)
-- Dependencies: 413
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_cron_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- TOC entry 4633 (class 0 OID 0)
-- Dependencies: 417
-- Name: FUNCTION grant_pg_graphql_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.grant_pg_graphql_access() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4635 (class 0 OID 0)
-- Dependencies: 414
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION extensions.grant_pg_net_access() FROM supabase_admin;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO supabase_admin WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- TOC entry 4636 (class 0 OID 0)
-- Dependencies: 377
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4637 (class 0 OID 0)
-- Dependencies: 376
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.hmac(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- TOC entry 4638 (class 0 OID 0)
-- Dependencies: 362
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT shared_blk_read_time double precision, OUT shared_blk_write_time double precision, OUT local_blk_read_time double precision, OUT local_blk_write_time double precision, OUT temp_blk_read_time double precision, OUT temp_blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric, OUT jit_functions bigint, OUT jit_generation_time double precision, OUT jit_inlining_count bigint, OUT jit_inlining_time double precision, OUT jit_optimization_count bigint, OUT jit_optimization_time double precision, OUT jit_emission_count bigint, OUT jit_emission_time double precision, OUT jit_deform_count bigint, OUT jit_deform_time double precision, OUT stats_since timestamp with time zone, OUT minmax_stats_since timestamp with time zone) TO dashboard_user;


--
-- TOC entry 4639 (class 0 OID 0)
-- Dependencies: 361
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- TOC entry 4640 (class 0 OID 0)
-- Dependencies: 363
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) FROM postgres;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint, minmax_only boolean) TO dashboard_user;


--
-- TOC entry 4641 (class 0 OID 0)
-- Dependencies: 409
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- TOC entry 4642 (class 0 OID 0)
-- Dependencies: 405
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_key_id(bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- TOC entry 4643 (class 0 OID 0)
-- Dependencies: 399
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- TOC entry 4644 (class 0 OID 0)
-- Dependencies: 401
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4645 (class 0 OID 0)
-- Dependencies: 403
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- TOC entry 4646 (class 0 OID 0)
-- Dependencies: 400
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- TOC entry 4647 (class 0 OID 0)
-- Dependencies: 402
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4648 (class 0 OID 0)
-- Dependencies: 404
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- TOC entry 4649 (class 0 OID 0)
-- Dependencies: 395
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- TOC entry 4650 (class 0 OID 0)
-- Dependencies: 397
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- TOC entry 4651 (class 0 OID 0)
-- Dependencies: 396
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- TOC entry 4652 (class 0 OID 0)
-- Dependencies: 398
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- TOC entry 4653 (class 0 OID 0)
-- Dependencies: 391
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- TOC entry 4654 (class 0 OID 0)
-- Dependencies: 393
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- TOC entry 4655 (class 0 OID 0)
-- Dependencies: 392
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- TOC entry 4656 (class 0 OID 0)
-- Dependencies: 394
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- TOC entry 4657 (class 0 OID 0)
-- Dependencies: 387
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- TOC entry 4658 (class 0 OID 0)
-- Dependencies: 389
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- TOC entry 4659 (class 0 OID 0)
-- Dependencies: 388
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- TOC entry 4660 (class 0 OID 0)
-- Dependencies: 390
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) FROM postgres;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- TOC entry 4661 (class 0 OID 0)
-- Dependencies: 415
-- Name: FUNCTION pgrst_ddl_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_ddl_watch() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4662 (class 0 OID 0)
-- Dependencies: 416
-- Name: FUNCTION pgrst_drop_watch(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.pgrst_drop_watch() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4664 (class 0 OID 0)
-- Dependencies: 418
-- Name: FUNCTION set_graphql_placeholder(); Type: ACL; Schema: extensions; Owner: supabase_admin
--

GRANT ALL ON FUNCTION extensions.set_graphql_placeholder() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4665 (class 0 OID 0)
-- Dependencies: 369
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- TOC entry 4666 (class 0 OID 0)
-- Dependencies: 370
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v1mc() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- TOC entry 4667 (class 0 OID 0)
-- Dependencies: 371
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- TOC entry 4668 (class 0 OID 0)
-- Dependencies: 372
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v4() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- TOC entry 4669 (class 0 OID 0)
-- Dependencies: 373
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- TOC entry 4670 (class 0 OID 0)
-- Dependencies: 364
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_nil() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- TOC entry 4671 (class 0 OID 0)
-- Dependencies: 365
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_dns() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- TOC entry 4672 (class 0 OID 0)
-- Dependencies: 367
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_oid() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- TOC entry 4673 (class 0 OID 0)
-- Dependencies: 366
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_url() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- TOC entry 4674 (class 0 OID 0)
-- Dependencies: 368
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON FUNCTION extensions.uuid_ns_x500() FROM postgres;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- TOC entry 4675 (class 0 OID 0)
-- Dependencies: 430
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- TOC entry 4676 (class 0 OID 0)
-- Dependencies: 348
-- Name: FUNCTION pg_reload_conf(); Type: ACL; Schema: pg_catalog; Owner: supabase_admin
--

GRANT ALL ON FUNCTION pg_catalog.pg_reload_conf() TO postgres WITH GRANT OPTION;


--
-- TOC entry 4677 (class 0 OID 0)
-- Dependencies: 360
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: supabase_admin
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- TOC entry 4678 (class 0 OID 0)
-- Dependencies: 460
-- Name: FUNCTION add_student(p_student_data jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.add_student(p_student_data jsonb) TO anon;
GRANT ALL ON FUNCTION public.add_student(p_student_data jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.add_student(p_student_data jsonb) TO service_role;


--
-- TOC entry 4679 (class 0 OID 0)
-- Dependencies: 461
-- Name: FUNCTION add_transferee_transcript(p_student_id integer, p_transcript_data jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.add_transferee_transcript(p_student_id integer, p_transcript_data jsonb) TO anon;
GRANT ALL ON FUNCTION public.add_transferee_transcript(p_student_id integer, p_transcript_data jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.add_transferee_transcript(p_student_id integer, p_transcript_data jsonb) TO service_role;


--
-- TOC entry 4680 (class 0 OID 0)
-- Dependencies: 462
-- Name: FUNCTION assign_section_adviser(p_section_id integer, p_teacher_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.assign_section_adviser(p_section_id integer, p_teacher_id integer) TO anon;
GRANT ALL ON FUNCTION public.assign_section_adviser(p_section_id integer, p_teacher_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.assign_section_adviser(p_section_id integer, p_teacher_id integer) TO service_role;


--
-- TOC entry 4681 (class 0 OID 0)
-- Dependencies: 463
-- Name: FUNCTION compute_subject_final_grade(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.compute_subject_final_grade() TO anon;
GRANT ALL ON FUNCTION public.compute_subject_final_grade() TO authenticated;
GRANT ALL ON FUNCTION public.compute_subject_final_grade() TO service_role;


--
-- TOC entry 4682 (class 0 OID 0)
-- Dependencies: 464
-- Name: FUNCTION confirm_import(p_import_log_id integer, p_skip_errors boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.confirm_import(p_import_log_id integer, p_skip_errors boolean) TO anon;
GRANT ALL ON FUNCTION public.confirm_import(p_import_log_id integer, p_skip_errors boolean) TO authenticated;
GRANT ALL ON FUNCTION public.confirm_import(p_import_log_id integer, p_skip_errors boolean) TO service_role;


--
-- TOC entry 4683 (class 0 OID 0)
-- Dependencies: 465
-- Name: FUNCTION create_school_year(p_start_year character varying, p_end_year character varying, p_is_active boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_school_year(p_start_year character varying, p_end_year character varying, p_is_active boolean) TO anon;
GRANT ALL ON FUNCTION public.create_school_year(p_start_year character varying, p_end_year character varying, p_is_active boolean) TO authenticated;
GRANT ALL ON FUNCTION public.create_school_year(p_start_year character varying, p_end_year character varying, p_is_active boolean) TO service_role;


--
-- TOC entry 4684 (class 0 OID 0)
-- Dependencies: 507
-- Name: FUNCTION create_school_year(p_label character varying, p_start_date date, p_end_date date, p_is_active boolean, p_quarters_json jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_school_year(p_label character varying, p_start_date date, p_end_date date, p_is_active boolean, p_quarters_json jsonb) TO anon;
GRANT ALL ON FUNCTION public.create_school_year(p_label character varying, p_start_date date, p_end_date date, p_is_active boolean, p_quarters_json jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.create_school_year(p_label character varying, p_start_date date, p_end_date date, p_is_active boolean, p_quarters_json jsonb) TO service_role;


--
-- TOC entry 4685 (class 0 OID 0)
-- Dependencies: 466
-- Name: FUNCTION create_section(p_name character varying, p_grade_level smallint, p_school_year_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_section(p_name character varying, p_grade_level smallint, p_school_year_id integer) TO anon;
GRANT ALL ON FUNCTION public.create_section(p_name character varying, p_grade_level smallint, p_school_year_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.create_section(p_name character varying, p_grade_level smallint, p_school_year_id integer) TO service_role;


--
-- TOC entry 4686 (class 0 OID 0)
-- Dependencies: 511
-- Name: FUNCTION create_section(p_sy_id integer, p_grade smallint, p_name character varying, p_adviser integer, p_room character varying); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_section(p_sy_id integer, p_grade smallint, p_name character varying, p_adviser integer, p_room character varying) TO anon;
GRANT ALL ON FUNCTION public.create_section(p_sy_id integer, p_grade smallint, p_name character varying, p_adviser integer, p_room character varying) TO authenticated;
GRANT ALL ON FUNCTION public.create_section(p_sy_id integer, p_grade smallint, p_name character varying, p_adviser integer, p_room character varying) TO service_role;


--
-- TOC entry 4687 (class 0 OID 0)
-- Dependencies: 509
-- Name: FUNCTION create_student(p_lrn character varying, p_fname character varying, p_mname character varying, p_lname character varying, p_suffix character varying, p_gender public.gender_type, p_birthdate date, p_bplace character varying, p_nat character varying, p_rel character varying, p_mtongue character varying, p_addr text, p_brgy character varying, p_muni character varying, p_prov character varying, p_fnamed character varying, p_mnamed character varying, p_gnamed character varying, p_grel character varying, p_contact character varying, p_esname character varying, p_esid character varying, p_esaddr text, p_epept boolean, p_epdate date, p_eals boolean, p_eadate date, p_ecomp date, p_eavg numeric, p_ecit character varying, p_actype character varying, p_acrating numeric); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_student(p_lrn character varying, p_fname character varying, p_mname character varying, p_lname character varying, p_suffix character varying, p_gender public.gender_type, p_birthdate date, p_bplace character varying, p_nat character varying, p_rel character varying, p_mtongue character varying, p_addr text, p_brgy character varying, p_muni character varying, p_prov character varying, p_fnamed character varying, p_mnamed character varying, p_gnamed character varying, p_grel character varying, p_contact character varying, p_esname character varying, p_esid character varying, p_esaddr text, p_epept boolean, p_epdate date, p_eals boolean, p_eadate date, p_ecomp date, p_eavg numeric, p_ecit character varying, p_actype character varying, p_acrating numeric) TO anon;
GRANT ALL ON FUNCTION public.create_student(p_lrn character varying, p_fname character varying, p_mname character varying, p_lname character varying, p_suffix character varying, p_gender public.gender_type, p_birthdate date, p_bplace character varying, p_nat character varying, p_rel character varying, p_mtongue character varying, p_addr text, p_brgy character varying, p_muni character varying, p_prov character varying, p_fnamed character varying, p_mnamed character varying, p_gnamed character varying, p_grel character varying, p_contact character varying, p_esname character varying, p_esid character varying, p_esaddr text, p_epept boolean, p_epdate date, p_eals boolean, p_eadate date, p_ecomp date, p_eavg numeric, p_ecit character varying, p_actype character varying, p_acrating numeric) TO authenticated;
GRANT ALL ON FUNCTION public.create_student(p_lrn character varying, p_fname character varying, p_mname character varying, p_lname character varying, p_suffix character varying, p_gender public.gender_type, p_birthdate date, p_bplace character varying, p_nat character varying, p_rel character varying, p_mtongue character varying, p_addr text, p_brgy character varying, p_muni character varying, p_prov character varying, p_fnamed character varying, p_mnamed character varying, p_gnamed character varying, p_grel character varying, p_contact character varying, p_esname character varying, p_esid character varying, p_esaddr text, p_epept boolean, p_epdate date, p_eals boolean, p_eadate date, p_ecomp date, p_eavg numeric, p_ecit character varying, p_actype character varying, p_acrating numeric) TO service_role;


--
-- TOC entry 4688 (class 0 OID 0)
-- Dependencies: 467
-- Name: FUNCTION create_subject(p_name character varying, p_code character varying, p_grade_level smallint, p_description text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.create_subject(p_name character varying, p_code character varying, p_grade_level smallint, p_description text) TO anon;
GRANT ALL ON FUNCTION public.create_subject(p_name character varying, p_code character varying, p_grade_level smallint, p_description text) TO authenticated;
GRANT ALL ON FUNCTION public.create_subject(p_name character varying, p_code character varying, p_grade_level smallint, p_description text) TO service_role;


--
-- TOC entry 4689 (class 0 OID 0)
-- Dependencies: 468
-- Name: FUNCTION delete_school_year(p_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.delete_school_year(p_id integer) TO anon;
GRANT ALL ON FUNCTION public.delete_school_year(p_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.delete_school_year(p_id integer) TO service_role;


--
-- TOC entry 4690 (class 0 OID 0)
-- Dependencies: 469
-- Name: FUNCTION delete_section(p_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.delete_section(p_id integer) TO anon;
GRANT ALL ON FUNCTION public.delete_section(p_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.delete_section(p_id integer) TO service_role;


--
-- TOC entry 4691 (class 0 OID 0)
-- Dependencies: 470
-- Name: FUNCTION delete_student(p_student_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.delete_student(p_student_id integer) TO anon;
GRANT ALL ON FUNCTION public.delete_student(p_student_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.delete_student(p_student_id integer) TO service_role;


--
-- TOC entry 4692 (class 0 OID 0)
-- Dependencies: 471
-- Name: FUNCTION delete_subject(p_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.delete_subject(p_id integer) TO anon;
GRANT ALL ON FUNCTION public.delete_subject(p_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.delete_subject(p_id integer) TO service_role;


--
-- TOC entry 4693 (class 0 OID 0)
-- Dependencies: 472
-- Name: FUNCTION enroll_student(p_student_id integer, p_school_year_id integer, p_section_id integer, p_grade_level smallint, p_enrollment_date date); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.enroll_student(p_student_id integer, p_school_year_id integer, p_section_id integer, p_grade_level smallint, p_enrollment_date date) TO anon;
GRANT ALL ON FUNCTION public.enroll_student(p_student_id integer, p_school_year_id integer, p_section_id integer, p_grade_level smallint, p_enrollment_date date) TO authenticated;
GRANT ALL ON FUNCTION public.enroll_student(p_student_id integer, p_school_year_id integer, p_section_id integer, p_grade_level smallint, p_enrollment_date date) TO service_role;


--
-- TOC entry 4694 (class 0 OID 0)
-- Dependencies: 473
-- Name: FUNCTION export_sf10_pdf(p_student_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.export_sf10_pdf(p_student_id integer) TO anon;
GRANT ALL ON FUNCTION public.export_sf10_pdf(p_student_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.export_sf10_pdf(p_student_id integer) TO service_role;


--
-- TOC entry 4695 (class 0 OID 0)
-- Dependencies: 474
-- Name: FUNCTION generate_bulk_sf10(p_student_ids jsonb, p_options jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.generate_bulk_sf10(p_student_ids jsonb, p_options jsonb) TO anon;
GRANT ALL ON FUNCTION public.generate_bulk_sf10(p_student_ids jsonb, p_options jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.generate_bulk_sf10(p_student_ids jsonb, p_options jsonb) TO service_role;


--
-- TOC entry 4696 (class 0 OID 0)
-- Dependencies: 475
-- Name: FUNCTION get_class_grade_sheet(p_section_id integer, p_school_year_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_class_grade_sheet(p_section_id integer, p_school_year_id integer) TO anon;
GRANT ALL ON FUNCTION public.get_class_grade_sheet(p_section_id integer, p_school_year_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_class_grade_sheet(p_section_id integer, p_school_year_id integer) TO service_role;


--
-- TOC entry 4697 (class 0 OID 0)
-- Dependencies: 476
-- Name: FUNCTION get_class_grade_sheet(p_section_id integer, p_school_year_id integer, p_quarter_number smallint); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_class_grade_sheet(p_section_id integer, p_school_year_id integer, p_quarter_number smallint) TO anon;
GRANT ALL ON FUNCTION public.get_class_grade_sheet(p_section_id integer, p_school_year_id integer, p_quarter_number smallint) TO authenticated;
GRANT ALL ON FUNCTION public.get_class_grade_sheet(p_section_id integer, p_school_year_id integer, p_quarter_number smallint) TO service_role;


--
-- TOC entry 4698 (class 0 OID 0)
-- Dependencies: 477
-- Name: FUNCTION get_class_grade_sheet(p_section_name text, p_school_year_label text, p_quarter smallint); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_class_grade_sheet(p_section_name text, p_school_year_label text, p_quarter smallint) TO anon;
GRANT ALL ON FUNCTION public.get_class_grade_sheet(p_section_name text, p_school_year_label text, p_quarter smallint) TO authenticated;
GRANT ALL ON FUNCTION public.get_class_grade_sheet(p_section_name text, p_school_year_label text, p_quarter smallint) TO service_role;


--
-- TOC entry 4699 (class 0 OID 0)
-- Dependencies: 478
-- Name: FUNCTION get_general_average(p_section_name text, p_quarter text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_general_average(p_section_name text, p_quarter text) TO anon;
GRANT ALL ON FUNCTION public.get_general_average(p_section_name text, p_quarter text) TO authenticated;
GRANT ALL ON FUNCTION public.get_general_average(p_section_name text, p_quarter text) TO service_role;


--
-- TOC entry 4700 (class 0 OID 0)
-- Dependencies: 479
-- Name: FUNCTION get_import_preview(p_import_log_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_import_preview(p_import_log_id integer) TO anon;
GRANT ALL ON FUNCTION public.get_import_preview(p_import_log_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_import_preview(p_import_log_id integer) TO service_role;


--
-- TOC entry 4701 (class 0 OID 0)
-- Dependencies: 480
-- Name: FUNCTION get_school_profile(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_school_profile() TO anon;
GRANT ALL ON FUNCTION public.get_school_profile() TO authenticated;
GRANT ALL ON FUNCTION public.get_school_profile() TO service_role;


--
-- TOC entry 4702 (class 0 OID 0)
-- Dependencies: 515
-- Name: FUNCTION get_school_year_by_id(p_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_school_year_by_id(p_id integer) TO anon;
GRANT ALL ON FUNCTION public.get_school_year_by_id(p_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_school_year_by_id(p_id integer) TO service_role;


--
-- TOC entry 4703 (class 0 OID 0)
-- Dependencies: 514
-- Name: FUNCTION get_school_years(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_school_years() TO anon;
GRANT ALL ON FUNCTION public.get_school_years() TO authenticated;
GRANT ALL ON FUNCTION public.get_school_years() TO service_role;


--
-- TOC entry 4704 (class 0 OID 0)
-- Dependencies: 481
-- Name: FUNCTION get_sections(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_sections() TO anon;
GRANT ALL ON FUNCTION public.get_sections() TO authenticated;
GRANT ALL ON FUNCTION public.get_sections() TO service_role;


--
-- TOC entry 4705 (class 0 OID 0)
-- Dependencies: 510
-- Name: FUNCTION get_sections(p_sy_id integer, p_grade smallint); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_sections(p_sy_id integer, p_grade smallint) TO anon;
GRANT ALL ON FUNCTION public.get_sections(p_sy_id integer, p_grade smallint) TO authenticated;
GRANT ALL ON FUNCTION public.get_sections(p_sy_id integer, p_grade smallint) TO service_role;


--
-- TOC entry 4706 (class 0 OID 0)
-- Dependencies: 482
-- Name: FUNCTION get_sf10_full_history(p_student_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_sf10_full_history(p_student_id integer) TO anon;
GRANT ALL ON FUNCTION public.get_sf10_full_history(p_student_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_sf10_full_history(p_student_id integer) TO service_role;


--
-- TOC entry 4707 (class 0 OID 0)
-- Dependencies: 483
-- Name: FUNCTION get_student_academic_records(p_student_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_student_academic_records(p_student_id integer) TO anon;
GRANT ALL ON FUNCTION public.get_student_academic_records(p_student_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_student_academic_records(p_student_id integer) TO service_role;


--
-- TOC entry 4708 (class 0 OID 0)
-- Dependencies: 330
-- Name: TABLE students; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.students TO anon;
GRANT ALL ON TABLE public.students TO authenticated;
GRANT ALL ON TABLE public.students TO service_role;


--
-- TOC entry 4709 (class 0 OID 0)
-- Dependencies: 513
-- Name: FUNCTION get_student_by_id(p_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_student_by_id(p_id integer) TO anon;
GRANT ALL ON FUNCTION public.get_student_by_id(p_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_student_by_id(p_id integer) TO service_role;


--
-- TOC entry 4710 (class 0 OID 0)
-- Dependencies: 484
-- Name: FUNCTION get_student_details(p_student_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_student_details(p_student_id integer) TO anon;
GRANT ALL ON FUNCTION public.get_student_details(p_student_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_student_details(p_student_id integer) TO service_role;


--
-- TOC entry 4711 (class 0 OID 0)
-- Dependencies: 485
-- Name: FUNCTION get_student_enrollments(p_student_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_student_enrollments(p_student_id integer) TO anon;
GRANT ALL ON FUNCTION public.get_student_enrollments(p_student_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_student_enrollments(p_student_id integer) TO service_role;


--
-- TOC entry 4712 (class 0 OID 0)
-- Dependencies: 486
-- Name: FUNCTION get_student_grades(p_student_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_student_grades(p_student_id integer) TO anon;
GRANT ALL ON FUNCTION public.get_student_grades(p_student_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_student_grades(p_student_id integer) TO service_role;


--
-- TOC entry 4713 (class 0 OID 0)
-- Dependencies: 487
-- Name: FUNCTION get_student_sf10_data(p_student_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_student_sf10_data(p_student_id integer) TO anon;
GRANT ALL ON FUNCTION public.get_student_sf10_data(p_student_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_student_sf10_data(p_student_id integer) TO service_role;


--
-- TOC entry 4714 (class 0 OID 0)
-- Dependencies: 512
-- Name: FUNCTION get_students(p_search text, p_grade smallint, p_section text, p_sy text, p_sex text, p_limit integer, p_offset integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_students(p_search text, p_grade smallint, p_section text, p_sy text, p_sex text, p_limit integer, p_offset integer) TO anon;
GRANT ALL ON FUNCTION public.get_students(p_search text, p_grade smallint, p_section text, p_sy text, p_sex text, p_limit integer, p_offset integer) TO authenticated;
GRANT ALL ON FUNCTION public.get_students(p_search text, p_grade smallint, p_section text, p_sy text, p_sex text, p_limit integer, p_offset integer) TO service_role;


--
-- TOC entry 4715 (class 0 OID 0)
-- Dependencies: 488
-- Name: FUNCTION get_students_with_enrollments(p_grade text, p_section text, p_year text, p_sex text, p_search text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_students_with_enrollments(p_grade text, p_section text, p_year text, p_sex text, p_search text) TO anon;
GRANT ALL ON FUNCTION public.get_students_with_enrollments(p_grade text, p_section text, p_year text, p_sex text, p_search text) TO authenticated;
GRANT ALL ON FUNCTION public.get_students_with_enrollments(p_grade text, p_section text, p_year text, p_sex text, p_search text) TO service_role;


--
-- TOC entry 4716 (class 0 OID 0)
-- Dependencies: 489
-- Name: FUNCTION get_subjects(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_subjects() TO anon;
GRANT ALL ON FUNCTION public.get_subjects() TO authenticated;
GRANT ALL ON FUNCTION public.get_subjects() TO service_role;


--
-- TOC entry 4717 (class 0 OID 0)
-- Dependencies: 490
-- Name: FUNCTION get_teachers(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_teachers() TO anon;
GRANT ALL ON FUNCTION public.get_teachers() TO authenticated;
GRANT ALL ON FUNCTION public.get_teachers() TO service_role;


--
-- TOC entry 4718 (class 0 OID 0)
-- Dependencies: 491
-- Name: FUNCTION get_user_for_login(p_username character varying); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_user_for_login(p_username character varying) TO anon;
GRANT ALL ON FUNCTION public.get_user_for_login(p_username character varying) TO authenticated;
GRANT ALL ON FUNCTION public.get_user_for_login(p_username character varying) TO service_role;


--
-- TOC entry 4719 (class 0 OID 0)
-- Dependencies: 492
-- Name: FUNCTION recalculate_general_average(p_academic_record_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.recalculate_general_average(p_academic_record_id integer) TO anon;
GRANT ALL ON FUNCTION public.recalculate_general_average(p_academic_record_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.recalculate_general_average(p_academic_record_id integer) TO service_role;


--
-- TOC entry 4720 (class 0 OID 0)
-- Dependencies: 493
-- Name: FUNCTION register_user(p_username character varying, p_email character varying, p_password_hash text, p_role public.user_role); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.register_user(p_username character varying, p_email character varying, p_password_hash text, p_role public.user_role) TO anon;
GRANT ALL ON FUNCTION public.register_user(p_username character varying, p_email character varying, p_password_hash text, p_role public.user_role) TO authenticated;
GRANT ALL ON FUNCTION public.register_user(p_username character varying, p_email character varying, p_password_hash text, p_role public.user_role) TO service_role;


--
-- TOC entry 4721 (class 0 OID 0)
-- Dependencies: 494
-- Name: FUNCTION reorder_subject(p_subject_id integer, p_direction text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.reorder_subject(p_subject_id integer, p_direction text) TO anon;
GRANT ALL ON FUNCTION public.reorder_subject(p_subject_id integer, p_direction text) TO authenticated;
GRANT ALL ON FUNCTION public.reorder_subject(p_subject_id integer, p_direction text) TO service_role;


--
-- TOC entry 4722 (class 0 OID 0)
-- Dependencies: 432
-- Name: FUNCTION rls_auto_enable(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.rls_auto_enable() TO anon;
GRANT ALL ON FUNCTION public.rls_auto_enable() TO authenticated;
GRANT ALL ON FUNCTION public.rls_auto_enable() TO service_role;


--
-- TOC entry 4723 (class 0 OID 0)
-- Dependencies: 495
-- Name: FUNCTION save_class_grades(p_grades_data jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.save_class_grades(p_grades_data jsonb) TO anon;
GRANT ALL ON FUNCTION public.save_class_grades(p_grades_data jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.save_class_grades(p_grades_data jsonb) TO service_role;


--
-- TOC entry 4724 (class 0 OID 0)
-- Dependencies: 496
-- Name: FUNCTION set_updated_at(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.set_updated_at() TO anon;
GRANT ALL ON FUNCTION public.set_updated_at() TO authenticated;
GRANT ALL ON FUNCTION public.set_updated_at() TO service_role;


--
-- TOC entry 4725 (class 0 OID 0)
-- Dependencies: 497
-- Name: FUNCTION snapshot_enrollment_to_transcript(p_enrollment_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.snapshot_enrollment_to_transcript(p_enrollment_id integer) TO anon;
GRANT ALL ON FUNCTION public.snapshot_enrollment_to_transcript(p_enrollment_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.snapshot_enrollment_to_transcript(p_enrollment_id integer) TO service_role;


--
-- TOC entry 4726 (class 0 OID 0)
-- Dependencies: 498
-- Name: FUNCTION start_import(p_file_url text, p_section text, p_grade_level smallint, p_school_year text, p_quarter smallint, p_column_mappings jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.start_import(p_file_url text, p_section text, p_grade_level smallint, p_school_year text, p_quarter smallint, p_column_mappings jsonb) TO anon;
GRANT ALL ON FUNCTION public.start_import(p_file_url text, p_section text, p_grade_level smallint, p_school_year text, p_quarter smallint, p_column_mappings jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.start_import(p_file_url text, p_section text, p_grade_level smallint, p_school_year text, p_quarter smallint, p_column_mappings jsonb) TO service_role;


--
-- TOC entry 4727 (class 0 OID 0)
-- Dependencies: 499
-- Name: FUNCTION trg_auto_snapshot_on_finalize(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.trg_auto_snapshot_on_finalize() TO anon;
GRANT ALL ON FUNCTION public.trg_auto_snapshot_on_finalize() TO authenticated;
GRANT ALL ON FUNCTION public.trg_auto_snapshot_on_finalize() TO service_role;


--
-- TOC entry 4728 (class 0 OID 0)
-- Dependencies: 500
-- Name: FUNCTION trg_refresh_general_average(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.trg_refresh_general_average() TO anon;
GRANT ALL ON FUNCTION public.trg_refresh_general_average() TO authenticated;
GRANT ALL ON FUNCTION public.trg_refresh_general_average() TO service_role;


--
-- TOC entry 4729 (class 0 OID 0)
-- Dependencies: 501
-- Name: FUNCTION update_import_mappings(p_import_log_id integer, p_column_mappings jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_import_mappings(p_import_log_id integer, p_column_mappings jsonb) TO anon;
GRANT ALL ON FUNCTION public.update_import_mappings(p_import_log_id integer, p_column_mappings jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.update_import_mappings(p_import_log_id integer, p_column_mappings jsonb) TO service_role;


--
-- TOC entry 4730 (class 0 OID 0)
-- Dependencies: 502
-- Name: FUNCTION update_school_profile(p_name character varying, p_school_id character varying, p_district character varying, p_division character varying, p_region character varying, p_address text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_school_profile(p_name character varying, p_school_id character varying, p_district character varying, p_division character varying, p_region character varying, p_address text) TO anon;
GRANT ALL ON FUNCTION public.update_school_profile(p_name character varying, p_school_id character varying, p_district character varying, p_division character varying, p_region character varying, p_address text) TO authenticated;
GRANT ALL ON FUNCTION public.update_school_profile(p_name character varying, p_school_id character varying, p_district character varying, p_division character varying, p_region character varying, p_address text) TO service_role;


--
-- TOC entry 4731 (class 0 OID 0)
-- Dependencies: 503
-- Name: FUNCTION update_school_year(p_id integer, p_start_year character varying, p_end_year character varying, p_is_active boolean); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_school_year(p_id integer, p_start_year character varying, p_end_year character varying, p_is_active boolean) TO anon;
GRANT ALL ON FUNCTION public.update_school_year(p_id integer, p_start_year character varying, p_end_year character varying, p_is_active boolean) TO authenticated;
GRANT ALL ON FUNCTION public.update_school_year(p_id integer, p_start_year character varying, p_end_year character varying, p_is_active boolean) TO service_role;


--
-- TOC entry 4732 (class 0 OID 0)
-- Dependencies: 508
-- Name: FUNCTION update_school_year(p_id integer, p_label character varying, p_start_date date, p_end_date date, p_is_active boolean, p_quarters_json jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_school_year(p_id integer, p_label character varying, p_start_date date, p_end_date date, p_is_active boolean, p_quarters_json jsonb) TO anon;
GRANT ALL ON FUNCTION public.update_school_year(p_id integer, p_label character varying, p_start_date date, p_end_date date, p_is_active boolean, p_quarters_json jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.update_school_year(p_id integer, p_label character varying, p_start_date date, p_end_date date, p_is_active boolean, p_quarters_json jsonb) TO service_role;


--
-- TOC entry 4733 (class 0 OID 0)
-- Dependencies: 504
-- Name: FUNCTION update_section(p_id integer, p_name character varying, p_grade_level smallint, p_school_year_id integer); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_section(p_id integer, p_name character varying, p_grade_level smallint, p_school_year_id integer) TO anon;
GRANT ALL ON FUNCTION public.update_section(p_id integer, p_name character varying, p_grade_level smallint, p_school_year_id integer) TO authenticated;
GRANT ALL ON FUNCTION public.update_section(p_id integer, p_name character varying, p_grade_level smallint, p_school_year_id integer) TO service_role;


--
-- TOC entry 4734 (class 0 OID 0)
-- Dependencies: 505
-- Name: FUNCTION update_student(p_student_id integer, p_student_data jsonb); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_student(p_student_id integer, p_student_data jsonb) TO anon;
GRANT ALL ON FUNCTION public.update_student(p_student_id integer, p_student_data jsonb) TO authenticated;
GRANT ALL ON FUNCTION public.update_student(p_student_id integer, p_student_data jsonb) TO service_role;


--
-- TOC entry 4735 (class 0 OID 0)
-- Dependencies: 506
-- Name: FUNCTION update_subject(p_id integer, p_name character varying, p_code character varying, p_grade_level smallint, p_description text); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.update_subject(p_id integer, p_name character varying, p_code character varying, p_grade_level smallint, p_description text) TO anon;
GRANT ALL ON FUNCTION public.update_subject(p_id integer, p_name character varying, p_code character varying, p_grade_level smallint, p_description text) TO authenticated;
GRANT ALL ON FUNCTION public.update_subject(p_id integer, p_name character varying, p_code character varying, p_grade_level smallint, p_description text) TO service_role;


--
-- TOC entry 4736 (class 0 OID 0)
-- Dependencies: 444
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO supabase_realtime_admin;


--
-- TOC entry 4737 (class 0 OID 0)
-- Dependencies: 459
-- Name: FUNCTION broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO postgres;
GRANT ALL ON FUNCTION realtime.broadcast_changes(topic_name text, event_name text, operation text, table_name text, table_schema text, new record, old record, level text) TO dashboard_user;


--
-- TOC entry 4738 (class 0 OID 0)
-- Dependencies: 448
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO anon;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO service_role;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO supabase_realtime_admin;


--
-- TOC entry 4739 (class 0 OID 0)
-- Dependencies: 439
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO anon;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO authenticated;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO service_role;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO supabase_realtime_admin;


--
-- TOC entry 4740 (class 0 OID 0)
-- Dependencies: 438
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO anon;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO authenticated;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO service_role;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO supabase_realtime_admin;


--
-- TOC entry 4741 (class 0 OID 0)
-- Dependencies: 445
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO anon;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO authenticated;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO service_role;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO supabase_realtime_admin;


--
-- TOC entry 4742 (class 0 OID 0)
-- Dependencies: 456
-- Name: FUNCTION list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO anon;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO authenticated;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO service_role;
GRANT ALL ON FUNCTION realtime.list_changes(publication name, slot_name name, max_changes integer, max_record_bytes integer) TO supabase_realtime_admin;


--
-- TOC entry 4743 (class 0 OID 0)
-- Dependencies: 437
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO anon;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO authenticated;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO service_role;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO supabase_realtime_admin;


--
-- TOC entry 4744 (class 0 OID 0)
-- Dependencies: 458
-- Name: FUNCTION send(payload jsonb, event text, topic text, private boolean); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO postgres;
GRANT ALL ON FUNCTION realtime.send(payload jsonb, event text, topic text, private boolean) TO dashboard_user;


--
-- TOC entry 4745 (class 0 OID 0)
-- Dependencies: 433
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO anon;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO authenticated;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO service_role;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO supabase_realtime_admin;


--
-- TOC entry 4746 (class 0 OID 0)
-- Dependencies: 441
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO anon;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO authenticated;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO service_role;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO supabase_realtime_admin;


--
-- TOC entry 4747 (class 0 OID 0)
-- Dependencies: 457
-- Name: FUNCTION topic(); Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON FUNCTION realtime.topic() TO postgres;
GRANT ALL ON FUNCTION realtime.topic() TO dashboard_user;


--
-- TOC entry 4748 (class 0 OID 0)
-- Dependencies: 420
-- Name: FUNCTION _crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault._crypto_aead_det_decrypt(message bytea, additional bytea, key_id bigint, context bytea, nonce bytea) TO service_role;


--
-- TOC entry 4749 (class 0 OID 0)
-- Dependencies: 422
-- Name: FUNCTION create_secret(new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.create_secret(new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- TOC entry 4750 (class 0 OID 0)
-- Dependencies: 423
-- Name: FUNCTION update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid); Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO postgres WITH GRANT OPTION;
GRANT ALL ON FUNCTION vault.update_secret(secret_id uuid, new_secret text, new_name text, new_description text, new_key_id uuid) TO service_role;


--
-- TOC entry 4752 (class 0 OID 0)
-- Dependencies: 272
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.audit_log_entries TO postgres;
GRANT SELECT ON TABLE auth.audit_log_entries TO postgres WITH GRANT OPTION;


--
-- TOC entry 4753 (class 0 OID 0)
-- Dependencies: 292
-- Name: TABLE custom_oauth_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.custom_oauth_providers TO postgres;
GRANT ALL ON TABLE auth.custom_oauth_providers TO dashboard_user;


--
-- TOC entry 4755 (class 0 OID 0)
-- Dependencies: 286
-- Name: TABLE flow_state; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.flow_state TO postgres;
GRANT SELECT ON TABLE auth.flow_state TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.flow_state TO dashboard_user;


--
-- TOC entry 4758 (class 0 OID 0)
-- Dependencies: 277
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.identities TO postgres;
GRANT SELECT ON TABLE auth.identities TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- TOC entry 4760 (class 0 OID 0)
-- Dependencies: 271
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.instances TO postgres;
GRANT SELECT ON TABLE auth.instances TO postgres WITH GRANT OPTION;


--
-- TOC entry 4762 (class 0 OID 0)
-- Dependencies: 281
-- Name: TABLE mfa_amr_claims; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_amr_claims TO postgres;
GRANT SELECT ON TABLE auth.mfa_amr_claims TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_amr_claims TO dashboard_user;


--
-- TOC entry 4764 (class 0 OID 0)
-- Dependencies: 280
-- Name: TABLE mfa_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_challenges TO postgres;
GRANT SELECT ON TABLE auth.mfa_challenges TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_challenges TO dashboard_user;


--
-- TOC entry 4767 (class 0 OID 0)
-- Dependencies: 279
-- Name: TABLE mfa_factors; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.mfa_factors TO postgres;
GRANT SELECT ON TABLE auth.mfa_factors TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.mfa_factors TO dashboard_user;


--
-- TOC entry 4768 (class 0 OID 0)
-- Dependencies: 289
-- Name: TABLE oauth_authorizations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_authorizations TO postgres;
GRANT ALL ON TABLE auth.oauth_authorizations TO dashboard_user;


--
-- TOC entry 4770 (class 0 OID 0)
-- Dependencies: 291
-- Name: TABLE oauth_client_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_client_states TO postgres;
GRANT ALL ON TABLE auth.oauth_client_states TO dashboard_user;


--
-- TOC entry 4771 (class 0 OID 0)
-- Dependencies: 288
-- Name: TABLE oauth_clients; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_clients TO postgres;
GRANT ALL ON TABLE auth.oauth_clients TO dashboard_user;


--
-- TOC entry 4772 (class 0 OID 0)
-- Dependencies: 290
-- Name: TABLE oauth_consents; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.oauth_consents TO postgres;
GRANT ALL ON TABLE auth.oauth_consents TO dashboard_user;


--
-- TOC entry 4773 (class 0 OID 0)
-- Dependencies: 287
-- Name: TABLE one_time_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.one_time_tokens TO postgres;
GRANT SELECT ON TABLE auth.one_time_tokens TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.one_time_tokens TO dashboard_user;


--
-- TOC entry 4775 (class 0 OID 0)
-- Dependencies: 270
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.refresh_tokens TO postgres;
GRANT SELECT ON TABLE auth.refresh_tokens TO postgres WITH GRANT OPTION;


--
-- TOC entry 4777 (class 0 OID 0)
-- Dependencies: 269
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- TOC entry 4779 (class 0 OID 0)
-- Dependencies: 284
-- Name: TABLE saml_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_providers TO postgres;
GRANT SELECT ON TABLE auth.saml_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_providers TO dashboard_user;


--
-- TOC entry 4781 (class 0 OID 0)
-- Dependencies: 285
-- Name: TABLE saml_relay_states; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.saml_relay_states TO postgres;
GRANT SELECT ON TABLE auth.saml_relay_states TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.saml_relay_states TO dashboard_user;


--
-- TOC entry 4783 (class 0 OID 0)
-- Dependencies: 273
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT SELECT ON TABLE auth.schema_migrations TO postgres WITH GRANT OPTION;


--
-- TOC entry 4788 (class 0 OID 0)
-- Dependencies: 278
-- Name: TABLE sessions; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sessions TO postgres;
GRANT SELECT ON TABLE auth.sessions TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sessions TO dashboard_user;


--
-- TOC entry 4790 (class 0 OID 0)
-- Dependencies: 283
-- Name: TABLE sso_domains; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_domains TO postgres;
GRANT SELECT ON TABLE auth.sso_domains TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_domains TO dashboard_user;


--
-- TOC entry 4793 (class 0 OID 0)
-- Dependencies: 282
-- Name: TABLE sso_providers; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.sso_providers TO postgres;
GRANT SELECT ON TABLE auth.sso_providers TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE auth.sso_providers TO dashboard_user;


--
-- TOC entry 4796 (class 0 OID 0)
-- Dependencies: 268
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,MAINTAIN,UPDATE ON TABLE auth.users TO postgres;
GRANT SELECT ON TABLE auth.users TO postgres WITH GRANT OPTION;


--
-- TOC entry 4797 (class 0 OID 0)
-- Dependencies: 294
-- Name: TABLE webauthn_challenges; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_challenges TO postgres;
GRANT ALL ON TABLE auth.webauthn_challenges TO dashboard_user;


--
-- TOC entry 4798 (class 0 OID 0)
-- Dependencies: 293
-- Name: TABLE webauthn_credentials; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.webauthn_credentials TO postgres;
GRANT ALL ON TABLE auth.webauthn_credentials TO dashboard_user;


--
-- TOC entry 4799 (class 0 OID 0)
-- Dependencies: 267
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- TOC entry 4800 (class 0 OID 0)
-- Dependencies: 266
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

REVOKE ALL ON TABLE extensions.pg_stat_statements_info FROM postgres;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO postgres WITH GRANT OPTION;
GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- TOC entry 4801 (class 0 OID 0)
-- Dependencies: 310
-- Name: TABLE academic_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.academic_records TO anon;
GRANT ALL ON TABLE public.academic_records TO authenticated;
GRANT ALL ON TABLE public.academic_records TO service_role;


--
-- TOC entry 4803 (class 0 OID 0)
-- Dependencies: 311
-- Name: SEQUENCE academic_records_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.academic_records_id_seq TO anon;
GRANT ALL ON SEQUENCE public.academic_records_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.academic_records_id_seq TO service_role;


--
-- TOC entry 4804 (class 0 OID 0)
-- Dependencies: 312
-- Name: TABLE column_mappings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.column_mappings TO anon;
GRANT ALL ON TABLE public.column_mappings TO authenticated;
GRANT ALL ON TABLE public.column_mappings TO service_role;


--
-- TOC entry 4806 (class 0 OID 0)
-- Dependencies: 313
-- Name: SEQUENCE column_mappings_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.column_mappings_id_seq TO anon;
GRANT ALL ON SEQUENCE public.column_mappings_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.column_mappings_id_seq TO service_role;


--
-- TOC entry 4807 (class 0 OID 0)
-- Dependencies: 314
-- Name: TABLE enrollments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.enrollments TO anon;
GRANT ALL ON TABLE public.enrollments TO authenticated;
GRANT ALL ON TABLE public.enrollments TO service_role;


--
-- TOC entry 4809 (class 0 OID 0)
-- Dependencies: 315
-- Name: SEQUENCE enrollments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.enrollments_id_seq TO anon;
GRANT ALL ON SEQUENCE public.enrollments_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.enrollments_id_seq TO service_role;


--
-- TOC entry 4810 (class 0 OID 0)
-- Dependencies: 316
-- Name: TABLE import_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.import_logs TO anon;
GRANT ALL ON TABLE public.import_logs TO authenticated;
GRANT ALL ON TABLE public.import_logs TO service_role;


--
-- TOC entry 4812 (class 0 OID 0)
-- Dependencies: 317
-- Name: SEQUENCE import_logs_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.import_logs_id_seq TO anon;
GRANT ALL ON SEQUENCE public.import_logs_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.import_logs_id_seq TO service_role;


--
-- TOC entry 4813 (class 0 OID 0)
-- Dependencies: 318
-- Name: TABLE import_preview_rows; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.import_preview_rows TO anon;
GRANT ALL ON TABLE public.import_preview_rows TO authenticated;
GRANT ALL ON TABLE public.import_preview_rows TO service_role;


--
-- TOC entry 4815 (class 0 OID 0)
-- Dependencies: 319
-- Name: SEQUENCE import_preview_rows_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.import_preview_rows_id_seq TO anon;
GRANT ALL ON SEQUENCE public.import_preview_rows_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.import_preview_rows_id_seq TO service_role;


--
-- TOC entry 4816 (class 0 OID 0)
-- Dependencies: 320
-- Name: TABLE quarters; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.quarters TO anon;
GRANT ALL ON TABLE public.quarters TO authenticated;
GRANT ALL ON TABLE public.quarters TO service_role;


--
-- TOC entry 4818 (class 0 OID 0)
-- Dependencies: 321
-- Name: SEQUENCE quarters_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.quarters_id_seq TO anon;
GRANT ALL ON SEQUENCE public.quarters_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.quarters_id_seq TO service_role;


--
-- TOC entry 4819 (class 0 OID 0)
-- Dependencies: 322
-- Name: TABLE school; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.school TO anon;
GRANT ALL ON TABLE public.school TO authenticated;
GRANT ALL ON TABLE public.school TO service_role;


--
-- TOC entry 4821 (class 0 OID 0)
-- Dependencies: 323
-- Name: SEQUENCE school_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.school_id_seq TO anon;
GRANT ALL ON SEQUENCE public.school_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.school_id_seq TO service_role;


--
-- TOC entry 4822 (class 0 OID 0)
-- Dependencies: 324
-- Name: TABLE school_years; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.school_years TO anon;
GRANT ALL ON TABLE public.school_years TO authenticated;
GRANT ALL ON TABLE public.school_years TO service_role;


--
-- TOC entry 4824 (class 0 OID 0)
-- Dependencies: 325
-- Name: SEQUENCE school_years_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.school_years_id_seq TO anon;
GRANT ALL ON SEQUENCE public.school_years_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.school_years_id_seq TO service_role;


--
-- TOC entry 4825 (class 0 OID 0)
-- Dependencies: 326
-- Name: TABLE section_subjects; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.section_subjects TO anon;
GRANT ALL ON TABLE public.section_subjects TO authenticated;
GRANT ALL ON TABLE public.section_subjects TO service_role;


--
-- TOC entry 4827 (class 0 OID 0)
-- Dependencies: 327
-- Name: SEQUENCE section_subjects_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.section_subjects_id_seq TO anon;
GRANT ALL ON SEQUENCE public.section_subjects_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.section_subjects_id_seq TO service_role;


--
-- TOC entry 4828 (class 0 OID 0)
-- Dependencies: 328
-- Name: TABLE sections; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sections TO anon;
GRANT ALL ON TABLE public.sections TO authenticated;
GRANT ALL ON TABLE public.sections TO service_role;


--
-- TOC entry 4830 (class 0 OID 0)
-- Dependencies: 329
-- Name: SEQUENCE sections_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.sections_id_seq TO anon;
GRANT ALL ON SEQUENCE public.sections_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.sections_id_seq TO service_role;


--
-- TOC entry 4832 (class 0 OID 0)
-- Dependencies: 331
-- Name: SEQUENCE students_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.students_id_seq TO anon;
GRANT ALL ON SEQUENCE public.students_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.students_id_seq TO service_role;


--
-- TOC entry 4833 (class 0 OID 0)
-- Dependencies: 332
-- Name: TABLE subject_grades; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.subject_grades TO anon;
GRANT ALL ON TABLE public.subject_grades TO authenticated;
GRANT ALL ON TABLE public.subject_grades TO service_role;


--
-- TOC entry 4835 (class 0 OID 0)
-- Dependencies: 333
-- Name: SEQUENCE subject_grades_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.subject_grades_id_seq TO anon;
GRANT ALL ON SEQUENCE public.subject_grades_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.subject_grades_id_seq TO service_role;


--
-- TOC entry 4836 (class 0 OID 0)
-- Dependencies: 334
-- Name: TABLE subjects; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.subjects TO anon;
GRANT ALL ON TABLE public.subjects TO authenticated;
GRANT ALL ON TABLE public.subjects TO service_role;


--
-- TOC entry 4838 (class 0 OID 0)
-- Dependencies: 335
-- Name: SEQUENCE subjects_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.subjects_id_seq TO anon;
GRANT ALL ON SEQUENCE public.subjects_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.subjects_id_seq TO service_role;


--
-- TOC entry 4839 (class 0 OID 0)
-- Dependencies: 336
-- Name: TABLE teachers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.teachers TO anon;
GRANT ALL ON TABLE public.teachers TO authenticated;
GRANT ALL ON TABLE public.teachers TO service_role;


--
-- TOC entry 4841 (class 0 OID 0)
-- Dependencies: 337
-- Name: SEQUENCE teachers_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.teachers_id_seq TO anon;
GRANT ALL ON SEQUENCE public.teachers_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.teachers_id_seq TO service_role;


--
-- TOC entry 4842 (class 0 OID 0)
-- Dependencies: 338
-- Name: TABLE transcript_headers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transcript_headers TO anon;
GRANT ALL ON TABLE public.transcript_headers TO authenticated;
GRANT ALL ON TABLE public.transcript_headers TO service_role;


--
-- TOC entry 4844 (class 0 OID 0)
-- Dependencies: 339
-- Name: SEQUENCE transcript_headers_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.transcript_headers_id_seq TO anon;
GRANT ALL ON SEQUENCE public.transcript_headers_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.transcript_headers_id_seq TO service_role;


--
-- TOC entry 4845 (class 0 OID 0)
-- Dependencies: 340
-- Name: TABLE transcript_remedial_rows; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transcript_remedial_rows TO anon;
GRANT ALL ON TABLE public.transcript_remedial_rows TO authenticated;
GRANT ALL ON TABLE public.transcript_remedial_rows TO service_role;


--
-- TOC entry 4847 (class 0 OID 0)
-- Dependencies: 341
-- Name: SEQUENCE transcript_remedial_rows_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.transcript_remedial_rows_id_seq TO anon;
GRANT ALL ON SEQUENCE public.transcript_remedial_rows_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.transcript_remedial_rows_id_seq TO service_role;


--
-- TOC entry 4848 (class 0 OID 0)
-- Dependencies: 342
-- Name: TABLE transcript_subject_rows; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.transcript_subject_rows TO anon;
GRANT ALL ON TABLE public.transcript_subject_rows TO authenticated;
GRANT ALL ON TABLE public.transcript_subject_rows TO service_role;


--
-- TOC entry 4850 (class 0 OID 0)
-- Dependencies: 343
-- Name: SEQUENCE transcript_subject_rows_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.transcript_subject_rows_id_seq TO anon;
GRANT ALL ON SEQUENCE public.transcript_subject_rows_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.transcript_subject_rows_id_seq TO service_role;


--
-- TOC entry 4851 (class 0 OID 0)
-- Dependencies: 344
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- TOC entry 4853 (class 0 OID 0)
-- Dependencies: 345
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_id_seq TO anon;
GRANT ALL ON SEQUENCE public.users_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.users_id_seq TO service_role;


--
-- TOC entry 4854 (class 0 OID 0)
-- Dependencies: 346
-- Name: TABLE validation_errors; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.validation_errors TO anon;
GRANT ALL ON TABLE public.validation_errors TO authenticated;
GRANT ALL ON TABLE public.validation_errors TO service_role;


--
-- TOC entry 4856 (class 0 OID 0)
-- Dependencies: 347
-- Name: SEQUENCE validation_errors_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.validation_errors_id_seq TO anon;
GRANT ALL ON SEQUENCE public.validation_errors_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.validation_errors_id_seq TO service_role;


--
-- TOC entry 4857 (class 0 OID 0)
-- Dependencies: 309
-- Name: TABLE messages; Type: ACL; Schema: realtime; Owner: supabase_realtime_admin
--

GRANT ALL ON TABLE realtime.messages TO postgres;
GRANT ALL ON TABLE realtime.messages TO dashboard_user;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO anon;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO authenticated;
GRANT SELECT,INSERT,UPDATE ON TABLE realtime.messages TO service_role;


--
-- TOC entry 4858 (class 0 OID 0)
-- Dependencies: 295
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;
GRANT SELECT ON TABLE realtime.schema_migrations TO anon;
GRANT SELECT ON TABLE realtime.schema_migrations TO authenticated;
GRANT SELECT ON TABLE realtime.schema_migrations TO service_role;
GRANT ALL ON TABLE realtime.schema_migrations TO supabase_realtime_admin;


--
-- TOC entry 4859 (class 0 OID 0)
-- Dependencies: 298
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;
GRANT SELECT ON TABLE realtime.subscription TO anon;
GRANT SELECT ON TABLE realtime.subscription TO authenticated;
GRANT SELECT ON TABLE realtime.subscription TO service_role;
GRANT ALL ON TABLE realtime.subscription TO supabase_realtime_admin;


--
-- TOC entry 4860 (class 0 OID 0)
-- Dependencies: 297
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO anon;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE realtime.subscription_id_seq TO service_role;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO supabase_realtime_admin;


--
-- TOC entry 4862 (class 0 OID 0)
-- Dependencies: 300
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.buckets FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.buckets TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO postgres WITH GRANT OPTION;


--
-- TOC entry 4863 (class 0 OID 0)
-- Dependencies: 306
-- Name: TABLE buckets_analytics; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets_analytics TO service_role;
GRANT ALL ON TABLE storage.buckets_analytics TO authenticated;
GRANT ALL ON TABLE storage.buckets_analytics TO anon;


--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 307
-- Name: TABLE buckets_vectors; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.buckets_vectors TO service_role;
GRANT SELECT ON TABLE storage.buckets_vectors TO authenticated;
GRANT SELECT ON TABLE storage.buckets_vectors TO anon;


--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 301
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

REVOKE ALL ON TABLE storage.objects FROM supabase_storage_admin;
GRANT ALL ON TABLE storage.objects TO supabase_storage_admin WITH GRANT OPTION;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO postgres WITH GRANT OPTION;


--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 304
-- Name: TABLE s3_multipart_uploads; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads TO anon;


--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 305
-- Name: TABLE s3_multipart_uploads_parts; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.s3_multipart_uploads_parts TO service_role;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO authenticated;
GRANT SELECT ON TABLE storage.s3_multipart_uploads_parts TO anon;


--
-- TOC entry 4869 (class 0 OID 0)
-- Dependencies: 308
-- Name: TABLE vector_indexes; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT SELECT ON TABLE storage.vector_indexes TO service_role;
GRANT SELECT ON TABLE storage.vector_indexes TO authenticated;
GRANT SELECT ON TABLE storage.vector_indexes TO anon;


--
-- TOC entry 4870 (class 0 OID 0)
-- Dependencies: 274
-- Name: TABLE secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.secrets TO service_role;


--
-- TOC entry 4871 (class 0 OID 0)
-- Dependencies: 275
-- Name: TABLE decrypted_secrets; Type: ACL; Schema: vault; Owner: supabase_admin
--

GRANT SELECT,REFERENCES,DELETE,TRUNCATE ON TABLE vault.decrypted_secrets TO postgres WITH GRANT OPTION;
GRANT SELECT,DELETE ON TABLE vault.decrypted_secrets TO service_role;


--
-- TOC entry 2561 (class 826 OID 16557)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- TOC entry 2562 (class 826 OID 16558)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- TOC entry 2560 (class 826 OID 16556)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES TO dashboard_user;


--
-- TOC entry 2571 (class 826 OID 16636)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON SEQUENCES TO postgres WITH GRANT OPTION;


--
-- TOC entry 2570 (class 826 OID 16635)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON FUNCTIONS TO postgres WITH GRANT OPTION;


--
-- TOC entry 2569 (class 826 OID 16634)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: extensions; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA extensions GRANT ALL ON TABLES TO postgres WITH GRANT OPTION;


--
-- TOC entry 2574 (class 826 OID 16591)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2573 (class 826 OID 16590)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2572 (class 826 OID 16589)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2566 (class 826 OID 16571)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2568 (class 826 OID 16570)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2567 (class 826 OID 16569)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2553 (class 826 OID 16494)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2554 (class 826 OID 16495)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2552 (class 826 OID 16493)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2556 (class 826 OID 16497)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2551 (class 826 OID 16492)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2555 (class 826 OID 16496)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 2564 (class 826 OID 16561)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES TO dashboard_user;


--
-- TOC entry 2565 (class 826 OID 16562)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS TO dashboard_user;


--
-- TOC entry 2563 (class 826 OID 16560)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES TO dashboard_user;


--
-- TOC entry 2559 (class 826 OID 16550)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES TO service_role;


--
-- TOC entry 2558 (class 826 OID 16549)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS TO service_role;


--
-- TOC entry 2557 (class 826 OID 16548)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES TO service_role;


--
-- TOC entry 3795 (class 3466 OID 17161)
-- Name: ensure_rls; Type: EVENT TRIGGER; Schema: -; Owner: postgres
--

CREATE EVENT TRIGGER ensure_rls ON ddl_command_end
         WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
   EXECUTE FUNCTION public.rls_auto_enable();


ALTER EVENT TRIGGER ensure_rls OWNER TO postgres;

--
-- TOC entry 3788 (class 3466 OID 16575)
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- TOC entry 3793 (class 3466 OID 16654)
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO supabase_admin;

--
-- TOC entry 3787 (class 3466 OID 16573)
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- TOC entry 3794 (class 3466 OID 16657)
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO supabase_admin;

--
-- TOC entry 3789 (class 3466 OID 16576)
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- TOC entry 3790 (class 3466 OID 16577)
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

-- Completed on 2026-03-27 19:38:41

--
-- PostgreSQL database dump complete
--

\unrestrict jLTyJmuILYVP2GYyaSISUiuX19Nyz2ekIqcE1gOLBPT154CVbwOzehCIU5imBZs


 - -   P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%
 - -   S A V E   S T U D E N T   T R A N S C R I P T   H I S T O R Y   ( T r a n s f e r e e ) 
 - -   P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%P%
 
 C R E A T E   O R   R E P L A C E   F U N C T I O N   p u b l i c . s a v e _ s t u d e n t _ t r a n s c r i p t _ h i s t o r y ( 
         p _ s t u d e n t _ i d   i n t e g e r , 
         p _ r e c o r d s _ j s o n   j s o n b 
 )   R E T U R N S   t e x t 
 L A N G U A G E   p l p g s q l 
 A S   \ $ \ $ 
 D E C L A R E 
         v _ r e c o r d   j s o n b ; 
         v _ e n t r y   j s o n b ; 
         v _ h e a d e r _ i d   i n t e g e r ; 
         v _ s u b j e c t   j s o n b ; 
         v _ r o w _ o r d e r   s m a l l i n t ; 
 B E G I N 
         F O R   v _ r e c o r d   I N   S E L E C T   *   F R O M   j s o n b _ a r r a y _ e l e m e n t s ( p _ r e c o r d s _ j s o n )   L O O P 
                 F O R   v _ e n t r y   I N   S E L E C T   *   F R O M   j s o n b _ a r r a y _ e l e m e n t s ( v _ r e c o r d - > ' g r a d e Y e a r E n t r i e s ' )   L O O P 
                         I N S E R T   I N T O   t r a n s c r i p t _ h e a d e r s   ( 
                                 s t u d e n t _ i d ,   s o u r c e ,   
                                 s c h o o l _ n a m e ,   s c h o o l _ i d ,   d i s t r i c t ,   d i v i s i o n ,   r e g i o n , 
                                 g r a d e _ l e v e l ,   s e c t i o n _ n a m e ,   s c h o o l _ y e a r ,   a d v i s e r _ n a m e , 
                                 g e n e r a l _ a v e r a g e ,   f i n a l _ r e m a r k s 
                         )   V A L U E S   ( 
                                 p _ s t u d e n t _ i d ,   ' t r a n s f e r e e ' , 
                                 v _ r e c o r d - > > ' s c h o o l N a m e ' ,   v _ r e c o r d - > > ' s c h o o l I d ' ,   v _ r e c o r d - > > ' d i s t r i c t ' ,   v _ r e c o r d - > > ' d i v i s i o n ' ,   v _ r e c o r d - > > ' r e g i o n ' , 
                                 ( v _ e n t r y - > > ' g r a d e L e v e l ' ) : : s m a l l i n t ,   v _ e n t r y - > > ' s e c t i o n N a m e ' ,   v _ e n t r y - > > ' s c h o o l Y e a r ' ,   v _ r e c o r d - > > ' a d v i s e r N a m e ' , 
                                 ( N U L L I F ( v _ e n t r y - > > ' g e n e r a l A v e r a g e ' ,   ' ' ) ) : : n u m e r i c ,   v _ e n t r y - > > ' r e m a r k s ' 
                         )   R E T U R N I N G   i d   I N T O   v _ h e a d e r _ i d ; 
 
                         v _ r o w _ o r d e r   : =   1 ; 
                         F O R   v _ s u b j e c t   I N   S E L E C T   *   F R O M   j s o n b _ a r r a y _ e l e m e n t s ( v _ e n t r y - > ' s u b j e c t s ' )   L O O P 
                                 I N S E R T   I N T O   t r a n s c r i p t _ s u b j e c t _ r o w s   ( 
                                         t r a n s c r i p t _ h e a d e r _ i d ,   s u b j e c t _ n a m e , 
                                         i s _ m a p e h ,   m a p e h _ c o m p o n e n t , 
                                         q 1 _ g r a d e ,   q 2 _ g r a d e ,   q 3 _ g r a d e ,   q 4 _ g r a d e , 
                                         f i n a l _ r a t i n g ,   r e m a r k s ,   r o w _ o r d e r 
                                 )   V A L U E S   ( 
                                         v _ h e a d e r _ i d ,   v _ s u b j e c t - > > ' s u b j e c t N a m e ' , 
                                         C O A L E S C E ( ( v _ s u b j e c t - > ' i s M a p e h ' ) : : b o o l e a n ,   f a l s e ) ,   v _ s u b j e c t - > > ' m a p e h C o m p o n e n t ' , 
                                         ( N U L L I F ( v _ s u b j e c t - > > ' q 1 ' ,   ' ' ) ) : : n u m e r i c , 
                                         ( N U L L I F ( v _ s u b j e c t - > > ' q 2 ' ,   ' ' ) ) : : n u m e r i c , 
                                         ( N U L L I F ( v _ s u b j e c t - > > ' q 3 ' ,   ' ' ) ) : : n u m e r i c , 
                                         ( N U L L I F ( v _ s u b j e c t - > > ' q 4 ' ,   ' ' ) ) : : n u m e r i c , 
                                         ( N U L L I F ( v _ s u b j e c t - > > ' f i n a l R a t i n g ' ,   ' ' ) ) : : n u m e r i c , 
                                         C O A L E S C E ( v _ s u b j e c t - > > ' r e m a r k s ' ,   ' ' ) , 
                                         v _ r o w _ o r d e r 
                                 ) ; 
                                 v _ r o w _ o r d e r   : =   v _ r o w _ o r d e r   +   1 ; 
                         E N D   L O O P ; 
                 E N D   L O O P ; 
         E N D   L O O P ; 
 
         R E T U R N   ' S u c c e s s ' ; 
 E N D ; 
 \ $ \ $ ; 
  
 