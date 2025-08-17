-- Insert Roles
INSERT INTO role (name)
VALUES ('ROLE_ADMIN'),
       ('ROLE_LEADER'),
       ('ROLE_EMPLOYEE');

-- Insert Users
INSERT INTO app_user (username, first_name, surname, phone_number, email, password, role_id)
VALUES ('admin', 'Admin', 'User', 777777777, 'admin@example.com',
        '$2a$10$lE4SbaeYDe60FFkPMUGSEuQuKzb6g4Dj.ks.DBicGKEugYrNsVYea',
        (SELECT id FROM role WHERE name = 'ROLE_ADMIN')),

       ('leader', 'Leader', 'User', 888888888, 'leader@example.com',
        '$2a$10$lE4SbaeYDe60FFkPMUGSEuQuKzb6g4Dj.ks.DBicGKEugYrNsVYea',
        (SELECT id FROM role WHERE name = 'ROLE_LEADER')),

       ('employee', 'Employee', 'User', 999999999, 'employee@example.com',
        '$2a$10$lE4SbaeYDe60FFkPMUGSEuQuKzb6g4Dj.ks.DBicGKEugYrNsVYea',
        (SELECT id FROM role WHERE name = 'ROLE_EMPLOYEE')),

       ('leader2', 'Second', 'Leader', 11111111, 'leader2@example.com',
        '$2a$10$lE4SbaeYDe60FFkPMUGSEuQuKzb6g4Dj.ks.DBicGKEugYrNsVYea',
        (SELECT id FROM role WHERE name = 'ROLE_LEADER'));

-- Insert Projects
INSERT INTO project (name, description, creation_date, due_date, finish_date, status, user_id)
VALUES ('Update issues labels', 'Description for this project not available', CURRENT_DATE,
        CURRENT_DATE + INTERVAL '80' DAY, NULL, 'PLANNED',
        (SELECT id FROM app_user WHERE username = 'leader')),

       ('Create internal application', 'Description for this project not available', CURRENT_DATE - INTERVAL '5' DAY,
        CURRENT_DATE + INTERVAL '80' DAY, NULL, 'PLANNED',
        (SELECT id FROM app_user WHERE username = 'leader')),

       ('First stage of rebuilding XYZ software', 'Description for this project not available',
        CURRENT_DATE - INTERVAL '50' DAY, CURRENT_DATE + INTERVAL '10' DAY, CURRENT_DATE - INTERVAL '8' DAY,
        'COMPLETED', (SELECT id FROM app_user WHERE username = 'leader2')),

       ('Another project ABCD', 'Description for this project not available', CURRENT_DATE - INTERVAL '5' DAY,
        CURRENT_DATE + INTERVAL '60' DAY, NULL, 'IN_PROGRESS',
        (SELECT id FROM app_user WHERE username = 'leader2'));

-- Insert Tasks
INSERT INTO task (title, description, creation_date, due_date, finish_date, difficulty, status, project_id)
VALUES ('Define project scope', 'Define the scope and requirements of the project',
        CURRENT_DATE - INTERVAL '5' DAY, CURRENT_DATE + INTERVAL '5' DAY, CURRENT_DATE - INTERVAL  '1' DAY,
        'EASY', 'COMPLETED', (SELECT id FROM project WHERE name = 'Update issues labels')),

       ('Create initial prototype', 'Develop a prototype for demonstration',
        CURRENT_DATE - INTERVAL '2' DAY, CURRENT_DATE + INTERVAL '5' DAY, NULL,
        'MEDIUM', 'IN_PROGRESS', (SELECT id FROM project WHERE name = 'Update issues labels')),

       ('Prepare project documentation', 'Documentation for stakeholders', CURRENT_DATE,
        CURRENT_DATE + INTERVAL '8' DAY, NULL, 'MEDIUM','TODO',
        (SELECT id FROM project WHERE name = 'Update issues labels')),

       -- Additional Tasks for the second project
       ('Define project architecture', 'Define the technical architecture of the application',
        CURRENT_DATE, CURRENT_DATE + INTERVAL '10' DAY, NULL,
        'MEDIUM','TODO', (SELECT id FROM project WHERE name = 'Create internal application')),

       ('Develop user authentication', 'Create user authentication system',
        CURRENT_DATE, CURRENT_DATE + INTERVAL '15' DAY, NULL,
        'HARD','TODO', (SELECT id FROM project WHERE name = 'Create internal application')),

       ('Prepare final demo', 'Prepare final demonstration of the application to stakeholders',
        CURRENT_DATE, CURRENT_DATE + INTERVAL '10' DAY, NULL,
        'MEDIUM','TODO', (SELECT id FROM project WHERE name = 'Create internal application'));
