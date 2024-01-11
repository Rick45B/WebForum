CREATE VIEW [recent_projects] AS
SELECT *
FROM projects
WHERE Type = 'recent'