USE testdb

GO

SET STATISTICS TIME ON

GO

WITH subs_with_levels AS (
	SELECT s.*, 0 AS level FROM subdivisions s JOIN collaborators c ON c.subdivision_id = s.id WHERE c.id = 710253
	UNION ALL
	SELECT s.*, level + 1 FROM subdivisions s
	JOIN subs_with_levels swl ON s.parent_id = swl.id
)

SELECT 
	c.id, 
	c.name, 
	swl.name AS sub_name, 
	swl.id AS sub_id, 
	swl.level AS sub_level, 
	(SELECT COUNT(*) FROM collaborators c WHERE c.subdivision_id = swl.id) AS colls_count 
FROM collaborators c 
JOIN subs_with_levels swl ON c.subdivision_id = swl.id
WHERE c.age < 40 AND swl.id NOT IN (100055, 100059)
ORDER BY sub_level

GO

SET STATISTICS TIME OFF