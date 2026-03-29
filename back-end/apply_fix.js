const db = require('./db');

const sql = `
DROP FUNCTION IF EXISTS public.get_sections(integer, smallint);

CREATE OR REPLACE FUNCTION public.get_sections(p_sy_id integer, p_grade smallint) 
RETURNS TABLE(id integer, name character varying, grade_level smallint, school_year_id integer, school_year character varying, adviser_id integer, adviser_name text, student_count bigint, room_number character varying)
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
    WHERE (p_sy_id IS NULL OR s.school_year_id = p_sy_id)
      AND (p_grade IS NULL OR s.grade_level = p_grade)
    GROUP BY s.id, s.name, s.grade_level, s.school_year_id, sy.label, s.adviser_id, t.last_name, t.first_name, s.room_number
    ORDER BY s.grade_level, s.name;
END;
$$;

DROP FUNCTION IF EXISTS public.get_sections();

CREATE OR REPLACE FUNCTION public.get_sections() 
RETURNS TABLE(id integer, name character varying, grade_level smallint, school_year_id integer, school_year character varying, adviser_id integer, adviser_name text, student_count bigint, room_number character varying)
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
`;

db.none(sql)
  .then(() => {
    console.log("Database updated successfully.");
    process.exit(0);
  })
  .catch(err => {
    console.error("Failed to update database:", err);
    process.exit(1);
  });
