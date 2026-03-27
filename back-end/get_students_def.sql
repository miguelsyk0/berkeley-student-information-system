CREATE OR REPLACE FUNCTION public.get_students_with_enrollments(p_grade text, p_section text, p_year text, p_sex text, p_search text)
 RETURNS TABLE(id integer, lrn character varying, first_name character varying, middle_name character varying, last_name character varying, name_extension character varying, gender gender_type, birthdate date, enrollment_id integer, school_year character varying, grade_level smallint, section_name character varying, status student_status)
 LANGUAGE plpgsql
AS $function$
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
$function$;
