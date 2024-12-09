INSERT INTO field_template (id, name, description, type, default_value, required, unique_field, min_length, max_length, pattern, created_at, updated_at)
VALUES ('1', 'Test Template', 'Test Description', 'string', 'default', true, false, 1, 255, '.*', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO field_template (id, name, description, type, default_value, required, unique_field, min_length, max_length, pattern, created_at, updated_at)
VALUES ('2', 'Test Template 2', 'Test Description 2', 'number', '0', false, true, null, null, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO tag (id, name, created_at, updated_at)
VALUES ('1', 'Test Tag', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO tag (id, name, created_at, updated_at)
VALUES ('2', 'Test Tag 2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO template_tag (template_id, tag_id)
VALUES ('1', '1');

INSERT INTO template_tag (template_id, tag_id)
VALUES ('1', '2');
