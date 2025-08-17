-- Insert Additional Project
INSERT INTO project (name, description, creation_date, due_date, finish_date, status, user_id)
VALUES ('Project ALPHA', 'No description', '2024-01-01 08:00:00',
        '2024-11-01 08:00:00', '2024-10-01 08:00:00', 'COMPLETED',
        (SELECT id FROM app_user WHERE username = 'leader'));

-- Insert Additional Users
INSERT INTO app_user (username, first_name, surname, phone_number, email, password, role_id)
VALUES ('john_doe', 'John', 'Doe', '123456789', 'john.doe@example.com',
        '$2a$10$lE4SbaeYDe60FFkPMUGSEuQuKzb6g4Dj.ks.DBicGKEugYrNsVYea',
        (SELECT id FROM role WHERE name = 'ROLE_EMPLOYEE')),

       ('jane_smith', 'Jane', 'Smith', '987654321', 'jane.smith@example.com',
        '$2a$10$lE4SbaeYDe60FFkPMUGSEuQuKzb6g4Dj.ks.DBicGKEugYrNsVYea',
        (SELECT id FROM role WHERE name = 'ROLE_EMPLOYEE')),

       ('mike_jones', 'Mike', 'Jones', '555123456', 'mike.jones@example.com',
        '$2a$10$lE4SbaeYDe60FFkPMUGSEuQuKzb6g4Dj.ks.DBicGKEugYrNsVYea',
        (SELECT id FROM role WHERE name = 'ROLE_EMPLOYEE')),

       ('susan_clark', 'Susan', 'Clark', '444987321', 'susan.clark@example.com',
        '$2a$10$lE4SbaeYDe60FFkPMUGSEuQuKzb6g4Dj.ks.DBicGKEugYrNsVYea',
        (SELECT id FROM role WHERE name = 'ROLE_EMPLOYEE')),

       ('emma_wilson', 'Emma', 'Wilson', '333765432', 'emma.wilson@example.com',
        '$2a$10$lE4SbaeYDe60FFkPMUGSEuQuKzb6g4Dj.ks.DBicGKEugYrNsVYea',
        (SELECT id FROM role WHERE name = 'ROLE_EMPLOYEE')),

       ('oliver_brown', 'Oliver', 'Brown', '222123789', 'oliver.brown@example.com',
        '$2a$10$lE4SbaeYDe60FFkPMUGSEuQuKzb6g4Dj.ks.DBicGKEugYrNsVYea',
        (SELECT id FROM role WHERE name = 'ROLE_EMPLOYEE')),

       ('lucy_white', 'Lucy', 'White', '666987123', 'lucy.white@example.com',
        '$2a$10$lE4SbaeYDe60FFkPMUGSEuQuKzb6g4Dj.ks.DBicGKEugYrNsVYea',
        (SELECT id FROM role WHERE name = 'ROLE_EMPLOYEE')),

       ('daniel_harris', 'Daniel', 'Harris', '777654987', 'daniel.harris@example.com',
        '$2a$10$lE4SbaeYDe60FFkPMUGSEuQuKzb6g4Dj.ks.DBicGKEugYrNsVYea',
        (SELECT id FROM role WHERE name = 'ROLE_EMPLOYEE')),

       ('sophia_martin', 'Sophia', 'Martin', '888321654', 'sophia.martin@example.com',
        '$2a$10$lE4SbaeYDe60FFkPMUGSEuQuKzb6g4Dj.ks.DBicGKEugYrNsVYea',
        (SELECT id FROM role WHERE name = 'ROLE_EMPLOYEE')),

       ('liam_evans', 'Liam', 'Evans', '999456123', 'liam.evans@example.com',
        '$2a$10$lE4SbaeYDe60FFkPMUGSEuQuKzb6g4Dj.ks.DBicGKEugYrNsVYea',
        (SELECT id FROM role WHERE name = 'ROLE_EMPLOYEE'));

-- Assign Users to Projects
INSERT INTO user_project (project_id, user_id)
VALUES ((SELECT id FROM project WHERE name = 'Project ALPHA'),
        (SELECT id FROM app_user WHERE username = 'john_doe')),

       ((SELECT id FROM project WHERE name = 'Project ALPHA'),
        (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ((SELECT id FROM project WHERE name = 'Project ALPHA'),
        (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ((SELECT id FROM project WHERE name = 'Project ALPHA'),
        (SELECT id FROM app_user WHERE username = 'susan_clark')),

       ((SELECT id FROM project WHERE name = 'Project ALPHA'),
        (SELECT id FROM app_user WHERE username = 'emma_wilson')),

       ((SELECT id FROM project WHERE name = 'Project ALPHA'),
        (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ((SELECT id FROM project WHERE name = 'Project ALPHA'),
        (SELECT id FROM app_user WHERE username = 'lucy_white')),

       ((SELECT id FROM project WHERE name = 'Project ALPHA'),
        (SELECT id FROM app_user WHERE username = 'daniel_harris')),

       ((SELECT id FROM project WHERE name = 'Project ALPHA'),
        (SELECT id FROM app_user WHERE username = 'sophia_martin')),

       ((SELECT id FROM project WHERE name = 'Project ALPHA'),
        (SELECT id FROM app_user WHERE username = 'liam_evans'));

-- Create Additional Tasks
INSERT INTO task (title, description, creation_date, due_date, finish_date, difficulty, status, project_id)
VALUES ('Task 1', 'Task description', '2024-01-01 08:00:00', '2024-01-05 08:00:00', '2024-01-06 20:00:00', 'EASY',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 2', 'Task description', '2024-01-10 08:00:00', '2024-01-17 08:00:00', '2024-01-16 20:00:00', 'EASY',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 3', 'Task description', '2024-01-20 08:00:00', '2024-01-27 08:00:00', '2024-01-26 20:00:00', 'EASY',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 4', 'Task description', '2024-02-01 08:00:00', '2024-02-08 08:00:00', '2024-02-07 20:00:00', 'MEDIUM',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 5', 'Task description', '2024-02-15 08:00:00', '2024-02-19 08:00:00', '2024-02-21 20:00:00', 'MEDIUM',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 6', 'Task description', '2024-03-01 08:00:00', '2024-03-08 08:00:00', '2024-03-07 20:00:00', 'HARD',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 7', 'Task description', '2024-03-15 08:00:00', '2024-03-23 08:00:00', '2024-03-21 20:00:00', 'HARD',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 8', 'Task description', '2024-04-01 08:00:00', '2024-04-06 08:00:00', '2024-04-06 20:00:00', 'EASY',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 9', 'Task description', '2024-04-15 08:00:00', '2024-04-24 08:00:00', '2024-04-21 20:00:00', 'MEDIUM',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 10', 'Task description', '2024-05-01 08:00:00', '2024-05-05 08:00:00', '2024-05-07 20:00:00', 'MEDIUM',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 11', 'Task description', '2024-05-15 08:00:00', '2024-05-25 08:00:00', '2024-05-21 20:00:00', 'HARD',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 12', 'Task description', '2024-06-01 08:00:00', '2024-06-09 08:00:00', '2024-06-06 20:00:00', 'EASY',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 13', 'Task description', '2024-06-10 08:00:00', '2024-06-15 08:00:00', '2024-06-16 20:00:00', 'MEDIUM',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 14', 'Task description', '2024-07-01 08:00:00', '2024-07-09 08:00:00', '2024-07-06 20:00:00', 'HARD',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 15', 'Task description', '2024-07-10 08:00:00', '2024-07-18 08:00:00', '2024-07-16 20:00:00', 'EASY',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 16', 'Task description', '2024-07-20 08:00:00', '2024-07-24 08:00:00', '2024-07-26 20:00:00', 'MEDIUM',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 17', 'Task description', '2024-01-01 08:00:00', '2024-01-08 08:00:00', '2024-01-09 20:00:00', 'HARD',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 18', 'Task description', '2024-01-15 08:00:00', '2024-01-25 08:00:00', '2024-01-21 20:00:00', 'EASY',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 19', 'Task description', '2024-02-01 08:00:00', '2024-02-10 08:00:00', '2024-02-06 20:00:00', 'MEDIUM',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 20', 'Task description', '2024-02-10 08:00:00', '2024-02-19 08:00:00', '2024-02-16 20:00:00', 'HARD',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 21', 'Task description', '2024-03-01 08:00:00', '2024-03-09 08:00:00', '2024-03-07 20:00:00', 'EASY',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 22', 'Task description', '2024-03-15 08:00:00', '2024-03-26 08:00:00', '2024-03-21 20:00:00', 'MEDIUM',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 23', 'Task description', '2024-04-01 08:00:00', '2024-04-10 08:00:00', '2024-04-09 20:00:00', 'HARD',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 24', 'Task description', '2024-04-15 08:00:00', '2024-04-23 08:00:00', '2024-04-21 20:00:00', 'EASY',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 25', 'Task description', '2024-05-01 08:00:00', '2024-05-06 08:00:00', '2024-05-06 20:00:00', 'MEDIUM',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 26', 'Task description', '2024-05-10 08:00:00', '2024-05-12 08:00:00', '2024-05-16 20:00:00', 'HARD',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 27', 'Task description', '2024-06-01 08:00:00', '2024-06-05 08:00:00', '2024-06-07 20:00:00', 'EASY',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 28', 'Task description', '2024-06-15 08:00:00', '2024-06-25 08:00:00', '2024-06-21 20:00:00', 'MEDIUM',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 29', 'Task description', '2024-07-01 08:00:00', '2024-07-07 08:00:00', '2024-07-06 20:00:00', 'HARD',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA')),

       ('Task 30', 'Task description', '2024-07-10 08:00:00', '2024-07-17 08:00:00', '2024-07-16 20:00:00', 'EASY',
        'COMPLETED', (SELECT id FROM project WHERE name = 'Project ALPHA'));

-- Assign Tasks to Users
INSERT INTO user_task (task_id, user_id)
VALUES ((SELECT id FROM task WHERE title = 'Task 1'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ((SELECT id FROM task WHERE title = 'Task 2'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ((SELECT id FROM task WHERE title = 'Task 3'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ((SELECT id FROM task WHERE title = 'Task 4'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ((SELECT id FROM task WHERE title = 'Task 5'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ((SELECT id FROM task WHERE title = 'Task 6'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ((SELECT id FROM task WHERE title = 'Task 7'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ((SELECT id FROM task WHERE title = 'Task 8'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ((SELECT id FROM task WHERE title = 'Task 9'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ((SELECT id FROM task WHERE title = 'Task 10'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ((SELECT id FROM task WHERE title = 'Task 11'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ((SELECT id FROM task WHERE title = 'Task 12'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ((SELECT id FROM task WHERE title = 'Task 13'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ((SELECT id FROM task WHERE title = 'Task 14'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ((SELECT id FROM task WHERE title = 'Task 15'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ((SELECT id FROM task WHERE title = 'Task 16'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ((SELECT id FROM task WHERE title = 'Task 17'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ((SELECT id FROM task WHERE title = 'Task 18'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ((SELECT id FROM task WHERE title = 'Task 19'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ((SELECT id FROM task WHERE title = 'Task 20'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ((SELECT id FROM task WHERE title = 'Task 21'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ((SELECT id FROM task WHERE title = 'Task 22'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ((SELECT id FROM task WHERE title = 'Task 23'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ((SELECT id FROM task WHERE title = 'Task 24'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ((SELECT id FROM task WHERE title = 'Task 25'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ((SELECT id FROM task WHERE title = 'Task 26'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ((SELECT id FROM task WHERE title = 'Task 27'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ((SELECT id FROM task WHERE title = 'Task 28'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ((SELECT id FROM task WHERE title = 'Task 29'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ((SELECT id FROM task WHERE title = 'Task 30'), (SELECT id FROM app_user WHERE username = 'oliver_brown'));


INSERT INTO attendance (start_time, end_time, work_description, task_id, user_id)
VALUES ('2024-01-01 09:00:00', '2024-01-01 12:00:00', 'Initial planning for Task 1',
        (SELECT id FROM task WHERE title = 'Task 1'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-01 13:00:00', '2024-01-01 16:00:00', 'Brainstorming ideas for Task 1',
        (SELECT id FROM task WHERE title = 'Task 1'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-02 09:00:00', '2024-01-02 12:00:00', 'Worked on design aspects of Task 1',
        (SELECT id FROM task WHERE title = 'Task 1'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-02 13:00:00', '2024-01-02 16:00:00', 'Prototyping and drafting Task 1',
        (SELECT id FROM task WHERE title = 'Task 1'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-03 09:30:00', '2024-01-03 12:30:00', 'Implemented core functionality for Task 1',
        (SELECT id FROM task WHERE title = 'Task 1'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-03 13:30:00', '2024-01-03 16:30:00', 'Reviewing and refining implementation for Task 1',
        (SELECT id FROM task WHERE title = 'Task 1'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-04 10:00:00', '2024-01-04 13:00:00', 'Testing modules for Task 1',
        (SELECT id FROM task WHERE title = 'Task 1'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-04 14:00:00', '2024-01-04 17:00:00', 'Addressing bugs and feedback for Task 1',
        (SELECT id FROM task WHERE title = 'Task 1'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-05 09:00:00', '2024-01-05 12:00:00', 'Finalizing features of Task 1',
        (SELECT id FROM task WHERE title = 'Task 1'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-05 13:00:00', '2024-01-05 16:00:00', 'Preparing documentation for Task 1',
        (SELECT id FROM task WHERE title = 'Task 1'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-06 09:00:00', '2024-01-06 12:00:00', 'Final review and submission for Task 1',
        (SELECT id FROM task WHERE title = 'Task 1'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-10 09:00:00', '2024-01-10 12:00:00', 'Initial brainstorming for Task 2',
        (SELECT id FROM task WHERE title = 'Task 2'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-10 13:00:00', '2024-01-10 16:00:00', 'Outlining project scope for Task 2',
        (SELECT id FROM task WHERE title = 'Task 2'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-11 09:30:00', '2024-01-11 12:30:00', 'Started work on core features for Task 2',
        (SELECT id FROM task WHERE title = 'Task 2'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-11 13:30:00', '2024-01-11 16:30:00', 'Detailed implementation for Task 2',
        (SELECT id FROM task WHERE title = 'Task 2'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-12 10:00:00', '2024-01-12 13:00:00', 'Addressed feedback for Task 2',
        (SELECT id FROM task WHERE title = 'Task 2'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-12 14:00:00', '2024-01-12 17:00:00', 'Polished UI for Task 2',
        (SELECT id FROM task WHERE title = 'Task 2'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-13 09:00:00', '2024-01-13 12:00:00', 'Tested key functionalities for Task 2',
        (SELECT id FROM task WHERE title = 'Task 2'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-13 13:00:00', '2024-01-13 15:30:00', 'Fixed bugs identified in Task 2',
        (SELECT id FROM task WHERE title = 'Task 2'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-14 10:00:00', '2024-01-14 12:00:00', 'Conducted final testing for Task 2',
        (SELECT id FROM task WHERE title = 'Task 2'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-14 13:00:00', '2024-01-14 16:00:00', 'Prepared documentation for Task 2',
        (SELECT id FROM task WHERE title = 'Task 2'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-20 09:00:00', '2024-01-20 12:00:00', 'Initial planning and discussions for Task 3',
        (SELECT id FROM task WHERE title = 'Task 3'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-20 13:00:00', '2024-01-20 16:00:00', 'Created initial design draft for Task 3',
        (SELECT id FROM task WHERE title = 'Task 3'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-21 09:30:00', '2024-01-21 12:30:00', 'Implemented primary features for Task 3',
        (SELECT id FROM task WHERE title = 'Task 3'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-21 13:30:00', '2024-01-21 16:30:00', 'Reviewed code and made adjustments for Task 3',
        (SELECT id FROM task WHERE title = 'Task 3'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-22 10:00:00', '2024-01-22 13:00:00', 'Tested key functionalities of Task 3',
        (SELECT id FROM task WHERE title = 'Task 3'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-22 14:00:00', '2024-01-22 17:00:00', 'Resolved identified issues in Task 3',
        (SELECT id FROM task WHERE title = 'Task 3'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-23 09:00:00', '2024-01-23 12:00:00', 'Documented progress and implementation details for Task 3',
        (SELECT id FROM task WHERE title = 'Task 3'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-23 13:00:00', '2024-01-23 15:30:00', 'Prepared presentation materials for Task 3',
        (SELECT id FROM task WHERE title = 'Task 3'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-24 10:00:00', '2024-01-24 13:00:00', 'Conducted peer review for Task 3',
        (SELECT id FROM task WHERE title = 'Task 3'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-24 14:00:00', '2024-01-24 17:00:00', 'Incorporated review feedback into Task 3',
        (SELECT id FROM task WHERE title = 'Task 3'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-01-25 09:00:00', '2024-01-25 12:00:00', 'Final testing and quality assurance for Task 3',
        (SELECT id FROM task WHERE title = 'Task 3'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-01 09:00:00', '2024-02-01 12:00:00', 'Kick-off meeting and initial planning for Task 4',
        (SELECT id FROM task WHERE title = 'Task 4'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-01 13:00:00', '2024-02-01 16:00:00', 'Drafted project requirements for Task 4',
        (SELECT id FROM task WHERE title = 'Task 4'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-02 09:30:00', '2024-02-02 12:30:00', 'Designed core functionality for Task 4',
        (SELECT id FROM task WHERE title = 'Task 4'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-02 13:30:00', '2024-02-02 16:30:00', 'Reviewed design and addressed feedback for Task 4',
        (SELECT id FROM task WHERE title = 'Task 4'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-03 10:00:00', '2024-02-03 13:00:00', 'Started implementation of Task 4',
        (SELECT id FROM task WHERE title = 'Task 4'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-03 14:00:00', '2024-02-03 17:00:00', 'Implemented initial modules for Task 4',
        (SELECT id FROM task WHERE title = 'Task 4'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-04 09:00:00', '2024-02-04 12:00:00', 'Tested modules and recorded results for Task 4',
        (SELECT id FROM task WHERE title = 'Task 4'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-04 13:00:00', '2024-02-04 16:00:00', 'Fixed identified issues and retested for Task 4',
        (SELECT id FROM task WHERE title = 'Task 4'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-05 09:30:00', '2024-02-05 12:30:00', 'Finalized implementation for Task 4',
        (SELECT id FROM task WHERE title = 'Task 4'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-05 13:30:00', '2024-02-05 16:30:00', 'Conducted peer review and addressed final comments for Task 4',
        (SELECT id FROM task WHERE title = 'Task 4'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-06 10:00:00', '2024-02-06 13:00:00', 'Prepared documentation for Task 4',
        (SELECT id FROM task WHERE title = 'Task 4'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-06 14:00:00', '2024-02-06 16:00:00', 'Submitted final version of Task 4',
        (SELECT id FROM task WHERE title = 'Task 4'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-15 09:00:00', '2024-02-15 12:00:00', 'Kick-off and requirements gathering for Task 5',
        (SELECT id FROM task WHERE title = 'Task 5'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-15 13:00:00', '2024-02-15 16:00:00', 'Drafting initial workflow for Task 5',
        (SELECT id FROM task WHERE title = 'Task 5'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-16 09:30:00', '2024-02-16 12:30:00', 'Designed and implemented core functionality for Task 5',
        (SELECT id FROM task WHERE title = 'Task 5'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-16 13:30:00', '2024-02-16 16:30:00', 'Reviewed design with stakeholders for Task 5',
        (SELECT id FROM task WHERE title = 'Task 5'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-17 10:00:00', '2024-02-17 13:00:00', 'Started integrating features for Task 5',
        (SELECT id FROM task WHERE title = 'Task 5'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-17 14:00:00', '2024-02-17 17:00:00', 'Tested integrated components for Task 5',
        (SELECT id FROM task WHERE title = 'Task 5'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-18 09:00:00', '2024-02-18 12:00:00', 'Addressed bugs found during testing for Task 5',
        (SELECT id FROM task WHERE title = 'Task 5'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-18 13:00:00', '2024-02-18 16:00:00', 'Polished final features for Task 5',
        (SELECT id FROM task WHERE title = 'Task 5'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-19 09:30:00', '2024-02-19 12:30:00', 'Prepared documentation and test results for Task 5',
        (SELECT id FROM task WHERE title = 'Task 5'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-19 13:30:00', '2024-02-19 16:30:00', 'Conducted peer review and implemented feedback for Task 5',
        (SELECT id FROM task WHERE title = 'Task 5'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-20 10:00:00', '2024-02-20 13:00:00', 'Finalized implementation and testing for Task 5',
        (SELECT id FROM task WHERE title = 'Task 5'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-02-20 14:00:00', '2024-02-20 16:00:00', 'Submitted final version of Task 5',
        (SELECT id FROM task WHERE title = 'Task 5'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-01 09:00:00', '2024-03-01 12:00:00', 'Initial planning and requirements gathering for Task 6',
        (SELECT id FROM task WHERE title = 'Task 6'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-01 13:00:00', '2024-03-01 16:00:00', 'Drafting design and architecture for Task 6',
        (SELECT id FROM task WHERE title = 'Task 6'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-02 09:30:00', '2024-03-02 12:30:00', 'Started development on core modules for Task 6',
        (SELECT id FROM task WHERE title = 'Task 6'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-02 13:30:00', '2024-03-02 16:30:00', 'Continued work on Task 6 core functionality',
        (SELECT id FROM task WHERE title = 'Task 6'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-03 10:00:00', '2024-03-03 13:00:00', 'Implemented key features for Task 6',
        (SELECT id FROM task WHERE title = 'Task 6'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-03 14:00:00', '2024-03-03 17:00:00', 'Worked on integration of modules for Task 6',
        (SELECT id FROM task WHERE title = 'Task 6'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-04 09:00:00', '2024-03-04 12:00:00', 'Testing key functionalities for Task 6',
        (SELECT id FROM task WHERE title = 'Task 6'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-04 13:00:00', '2024-03-04 16:00:00', 'Bug fixing and quality improvements for Task 6',
        (SELECT id FROM task WHERE title = 'Task 6'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-05 09:00:00', '2024-03-05 12:00:00', 'Final adjustments and optimization for Task 6',
        (SELECT id FROM task WHERE title = 'Task 6'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-05 13:00:00', '2024-03-05 16:00:00', 'Documentation and reporting for Task 6',
        (SELECT id FROM task WHERE title = 'Task 6'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-06 09:00:00', '2024-03-06 12:00:00', 'Final testing and bug verification for Task 6',
        (SELECT id FROM task WHERE title = 'Task 6'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-06 13:00:00', '2024-03-06 16:00:00', 'Preparation for final submission of Task 6',
        (SELECT id FROM task WHERE title = 'Task 6'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-07 09:00:00', '2024-03-07 12:00:00', 'Post-submission checks and final reports for Task 6',
        (SELECT id FROM task WHERE title = 'Task 6'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-15 09:00:00', '2024-03-15 12:00:00', 'Initial planning and requirements gathering for Task 7',
        (SELECT id FROM task WHERE title = 'Task 7'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-15 13:00:00', '2024-03-15 16:00:00', 'Drafting initial design and workflow for Task 7',
        (SELECT id FROM task WHERE title = 'Task 7'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-16 09:00:00', '2024-03-16 12:00:00', 'Started core functionality development for Task 7',
        (SELECT id FROM task WHERE title = 'Task 7'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-16 13:00:00', '2024-03-16 16:00:00', 'Worked on system architecture for Task 7',
        (SELECT id FROM task WHERE title = 'Task 7'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-17 10:00:00', '2024-03-17 13:00:00', 'Developed key modules for Task 7',
        (SELECT id FROM task WHERE title = 'Task 7'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-17 14:00:00', '2024-03-17 17:00:00', 'Testing and debugging for Task 7',
        (SELECT id FROM task WHERE title = 'Task 7'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-18 09:00:00', '2024-03-18 12:00:00', 'Reviewed design and architecture for Task 7',
        (SELECT id FROM task WHERE title = 'Task 7'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-18 13:00:00', '2024-03-18 16:00:00', 'Integration of modules for Task 7',
        (SELECT id FROM task WHERE title = 'Task 7'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-19 09:00:00', '2024-03-19 12:00:00', 'Bug fixing and improvements for Task 7',
        (SELECT id FROM task WHERE title = 'Task 7'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-19 13:00:00', '2024-03-19 16:00:00', 'Polishing and final checks for Task 7',
        (SELECT id FROM task WHERE title = 'Task 7'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-20 09:00:00', '2024-03-20 12:00:00', 'Final testing and review for Task 7',
        (SELECT id FROM task WHERE title = 'Task 7'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-03-20 13:00:00', '2024-03-20 16:00:00', 'Submission of Task 7',
        (SELECT id FROM task WHERE title = 'Task 7'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-01 09:00:00', '2024-04-01 12:00:00', 'Initial planning and requirements gathering for Task 8',
        (SELECT id FROM task WHERE title = 'Task 8'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-01 13:00:00', '2024-04-01 16:00:00', 'Drafting the workflow for Task 8',
        (SELECT id FROM task WHERE title = 'Task 8'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-02 09:00:00', '2024-04-02 12:00:00', 'Designed initial architecture for Task 8',
        (SELECT id FROM task WHERE title = 'Task 8'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-02 13:00:00', '2024-04-02 16:00:00', 'Development of core features for Task 8',
        (SELECT id FROM task WHERE title = 'Task 8'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-03 10:00:00', '2024-04-03 13:00:00', 'Worked on UI components for Task 8',
        (SELECT id FROM task WHERE title = 'Task 8'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-03 14:00:00', '2024-04-03 17:00:00', 'Implemented backend functionality for Task 8',
        (SELECT id FROM task WHERE title = 'Task 8'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-04 09:00:00', '2024-04-04 12:00:00', 'Testing key functionalities for Task 8',
        (SELECT id FROM task WHERE title = 'Task 8'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-04 13:00:00', '2024-04-04 16:00:00', 'Bug fixing and feature improvement for Task 8',
        (SELECT id FROM task WHERE title = 'Task 8'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-05 09:00:00', '2024-04-05 12:00:00', 'Final testing and debugging for Task 8',
        (SELECT id FROM task WHERE title = 'Task 8'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-05 13:00:00', '2024-04-05 16:00:00', 'Final review and submission of Task 8',
        (SELECT id FROM task WHERE title = 'Task 8'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-15 09:00:00', '2024-04-15 12:00:00', 'Initial planning and setup for Task 9',
        (SELECT id FROM task WHERE title = 'Task 9'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-15 13:00:00', '2024-04-15 16:00:00', 'Drafted requirements and design for Task 9',
        (SELECT id FROM task WHERE title = 'Task 9'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-16 09:00:00', '2024-04-16 12:00:00', 'Development of core features for Task 9',
        (SELECT id FROM task WHERE title = 'Task 9'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-16 13:00:00', '2024-04-16 16:00:00', 'Worked on backend functionality for Task 9',
        (SELECT id FROM task WHERE title = 'Task 9'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-17 10:00:00', '2024-04-17 13:00:00', 'Integrated modules and tested functionality for Task 9',
        (SELECT id FROM task WHERE title = 'Task 9'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-17 14:00:00', '2024-04-17 17:00:00', 'Bug fixing and improvements for Task 9',
        (SELECT id FROM task WHERE title = 'Task 9'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-18 09:00:00', '2024-04-18 12:00:00', 'Tested key features of Task 9',
        (SELECT id FROM task WHERE title = 'Task 9'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-18 13:00:00', '2024-04-18 16:00:00', 'Final checks and fixes for Task 9',
        (SELECT id FROM task WHERE title = 'Task 9'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-19 09:00:00', '2024-04-19 12:00:00', 'Documentation for Task 9',
        (SELECT id FROM task WHERE title = 'Task 9'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-19 13:00:00', '2024-04-19 16:00:00', 'Final review and presentation of Task 9',
        (SELECT id FROM task WHERE title = 'Task 9'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-20 09:00:00', '2024-04-20 12:00:00', 'Final testing and bug fixes for Task 9',
        (SELECT id FROM task WHERE title = 'Task 9'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-04-20 13:00:00', '2024-04-20 16:00:00', 'Final submission of Task 9',
        (SELECT id FROM task WHERE title = 'Task 9'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-05-01 09:00:00', '2024-05-01 12:00:00', 'Initial planning and design for Task 10',
        (SELECT id FROM task WHERE title = 'Task 10'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-05-01 13:00:00', '2024-05-01 16:00:00', 'Drafted architecture and requirements for Task 10',
        (SELECT id FROM task WHERE title = 'Task 10'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-05-02 09:00:00', '2024-05-02 12:00:00', 'Development of core modules for Task 10',
        (SELECT id FROM task WHERE title = 'Task 10'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-05-02 13:00:00', '2024-05-02 16:00:00', 'Worked on integrating components for Task 10',
        (SELECT id FROM task WHERE title = 'Task 10'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-05-03 10:00:00', '2024-05-03 13:00:00', 'Tested features and fixed bugs for Task 10',
        (SELECT id FROM task WHERE title = 'Task 10'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-05-03 14:00:00', '2024-05-03 17:00:00', 'Worked on final touches and optimizations for Task 10',
        (SELECT id FROM task WHERE title = 'Task 10'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-05-04 09:00:00', '2024-05-04 12:00:00', 'Final testing and bug verification for Task 10',
        (SELECT id FROM task WHERE title = 'Task 10'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-05-04 13:00:00', '2024-05-04 16:00:00', 'Documentation and report generation for Task 10',
        (SELECT id FROM task WHERE title = 'Task 10'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-05-05 09:00:00', '2024-05-05 12:00:00', 'Review and finalization of Task 10',
        (SELECT id FROM task WHERE title = 'Task 10'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-05-05 13:00:00', '2024-05-05 16:00:00', 'Final review and submission of Task 10',
        (SELECT id FROM task WHERE title = 'Task 10'), (SELECT id FROM app_user WHERE username = 'john_doe')),

       ('2024-05-06 09:00:00', '2024-05-06 12:00:00', 'Post-submission checks and validation for Task 10',
        (SELECT id FROM task WHERE title = 'Task 10'), (SELECT id FROM app_user WHERE username = 'john_doe')),


       ('2024-05-15 09:00:00', '2024-05-15 12:00:00', 'Initial planning and scope definition for Task 11',
        (SELECT id FROM task WHERE title = 'Task 11'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-05-15 13:00:00', '2024-05-15 16:00:00', 'Drafting architecture and design for Task 11',
        (SELECT id FROM task WHERE title = 'Task 11'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-05-16 09:00:00', '2024-05-16 12:00:00', 'Developed core functionality for Task 11',
        (SELECT id FROM task WHERE title = 'Task 11'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-05-16 13:00:00', '2024-05-16 16:00:00', 'Continued work on system modules for Task 11',
        (SELECT id FROM task WHERE title = 'Task 11'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-05-17 10:00:00', '2024-05-17 13:00:00', 'Testing core features of Task 11',
        (SELECT id FROM task WHERE title = 'Task 11'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-05-17 14:00:00', '2024-05-17 17:00:00', 'Bug fixing and addressing feedback for Task 11',
        (SELECT id FROM task WHERE title = 'Task 11'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-05-18 09:00:00', '2024-05-18 12:00:00', 'Polishing features and optimizing performance for Task 11',
        (SELECT id FROM task WHERE title = 'Task 11'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-05-18 13:00:00', '2024-05-18 16:00:00', 'Final review of Task 11',
        (SELECT id FROM task WHERE title = 'Task 11'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-05-19 09:00:00', '2024-05-19 12:00:00', 'Preparation for submission of Task 11',
        (SELECT id FROM task WHERE title = 'Task 11'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-05-19 13:00:00', '2024-05-19 16:00:00', 'Final testing and bug fixes for Task 11',
        (SELECT id FROM task WHERE title = 'Task 11'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-05-20 09:00:00', '2024-05-20 12:00:00', 'Final documentation and review for Task 11',
        (SELECT id FROM task WHERE title = 'Task 11'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-05-20 13:00:00', '2024-05-20 16:00:00', 'Final submission and review of Task 11',
        (SELECT id FROM task WHERE title = 'Task 11'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-01 09:00:00', '2024-06-01 12:00:00', 'Initial planning and task breakdown for Task 12',
        (SELECT id FROM task WHERE title = 'Task 12'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-01 13:00:00', '2024-06-01 16:00:00', 'Designing layout and functionality for Task 12',
        (SELECT id FROM task WHERE title = 'Task 12'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-02 09:00:00', '2024-06-02 12:00:00', 'Started core feature development for Task 12',
        (SELECT id FROM task WHERE title = 'Task 12'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-02 13:00:00', '2024-06-02 16:00:00', 'Backend development for Task 12',
        (SELECT id FROM task WHERE title = 'Task 12'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-03 10:00:00', '2024-06-03 13:00:00', 'Frontend implementation for Task 12',
        (SELECT id FROM task WHERE title = 'Task 12'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-03 14:00:00', '2024-06-03 17:00:00', 'Testing core features of Task 12',
        (SELECT id FROM task WHERE title = 'Task 12'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-04 09:00:00', '2024-06-04 12:00:00', 'Bug fixing and improvements for Task 12',
        (SELECT id FROM task WHERE title = 'Task 12'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-04 13:00:00', '2024-06-04 16:00:00', 'Polishing features and finalizing for Task 12',
        (SELECT id FROM task WHERE title = 'Task 12'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-05 09:00:00', '2024-06-05 12:00:00', 'Documentation and testing for Task 12',
        (SELECT id FROM task WHERE title = 'Task 12'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-05 13:00:00', '2024-06-05 16:00:00', 'Final checks and submission for Task 12',
        (SELECT id FROM task WHERE title = 'Task 12'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-10 09:00:00', '2024-06-10 12:00:00', 'Initial planning and design for Task 13',
        (SELECT id FROM task WHERE title = 'Task 13'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-10 13:00:00', '2024-06-10 16:00:00', 'Drafted workflow and requirements for Task 13',
        (SELECT id FROM task WHERE title = 'Task 13'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-11 09:00:00', '2024-06-11 12:00:00', 'Worked on core functionality for Task 13',
        (SELECT id FROM task WHERE title = 'Task 13'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-11 13:00:00', '2024-06-11 16:00:00', 'Continued work on integration of Task 13',
        (SELECT id FROM task WHERE title = 'Task 13'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-12 10:00:00', '2024-06-12 13:00:00', 'Implemented additional features for Task 13',
        (SELECT id FROM task WHERE title = 'Task 13'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-12 14:00:00', '2024-06-12 17:00:00', 'Debugging and testing Task 13',
        (SELECT id FROM task WHERE title = 'Task 13'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-13 09:00:00', '2024-06-13 12:00:00', 'Refining code and features for Task 13',
        (SELECT id FROM task WHERE title = 'Task 13'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-13 13:00:00', '2024-06-13 16:00:00', 'Performed system testing for Task 13',
        (SELECT id FROM task WHERE title = 'Task 13'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-14 09:00:00', '2024-06-14 12:00:00', 'Finalized implementation and features for Task 13',
        (SELECT id FROM task WHERE title = 'Task 13'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-14 13:00:00', '2024-06-14 16:00:00', 'Final testing and debugging for Task 13',
        (SELECT id FROM task WHERE title = 'Task 13'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-15 09:00:00', '2024-06-15 12:00:00', 'Documentation and submission of Task 13',
        (SELECT id FROM task WHERE title = 'Task 13'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-06-15 13:00:00', '2024-06-15 16:00:00', 'Post-submission review for Task 13',
        (SELECT id FROM task WHERE title = 'Task 13'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-01 09:00:00', '2024-07-01 12:00:00', 'Initial planning and system design for Task 14',
        (SELECT id FROM task WHERE title = 'Task 14'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-01 13:00:00', '2024-07-01 16:00:00', 'Drafting features and workflow for Task 14',
        (SELECT id FROM task WHERE title = 'Task 14'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-02 09:00:00', '2024-07-02 12:00:00', 'Developing core components for Task 14',
        (SELECT id FROM task WHERE title = 'Task 14'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-02 13:00:00', '2024-07-02 16:00:00', 'Worked on integrations for Task 14',
        (SELECT id FROM task WHERE title = 'Task 14'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-03 10:00:00', '2024-07-03 13:00:00', 'Implementing additional functionalities for Task 14',
        (SELECT id FROM task WHERE title = 'Task 14'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-03 14:00:00', '2024-07-03 17:00:00', 'Testing and debugging for Task 14',
        (SELECT id FROM task WHERE title = 'Task 14'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-04 09:00:00', '2024-07-04 12:00:00', 'Refining and improving features for Task 14',
        (SELECT id FROM task WHERE title = 'Task 14'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-04 13:00:00', '2024-07-04 16:00:00', 'Completed system testing for Task 14',
        (SELECT id FROM task WHERE title = 'Task 14'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-05 09:00:00', '2024-07-05 12:00:00', 'Documentation and final review for Task 14',
        (SELECT id FROM task WHERE title = 'Task 14'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-05 13:00:00', '2024-07-05 16:00:00', 'Final debugging and optimization for Task 14',
        (SELECT id FROM task WHERE title = 'Task 14'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-06 09:00:00', '2024-07-06 12:00:00', 'Final submission and validation for Task 14',
        (SELECT id FROM task WHERE title = 'Task 14'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-10 09:00:00', '2024-07-10 12:00:00', 'Initial planning and setup for Task 15',
        (SELECT id FROM task WHERE title = 'Task 15'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-10 13:00:00', '2024-07-10 16:00:00', 'Drafting requirements and features for Task 15',
        (SELECT id FROM task WHERE title = 'Task 15'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-11 09:00:00', '2024-07-11 12:00:00', 'Developed core functionality for Task 15',
        (SELECT id FROM task WHERE title = 'Task 15'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-11 13:00:00', '2024-07-11 16:00:00', 'Worked on system architecture for Task 15',
        (SELECT id FROM task WHERE title = 'Task 15'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-12 10:00:00', '2024-07-12 13:00:00', 'Implemented main features for Task 15',
        (SELECT id FROM task WHERE title = 'Task 15'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-12 14:00:00', '2024-07-12 17:00:00', 'Tested core functionality for Task 15',
        (SELECT id FROM task WHERE title = 'Task 15'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-13 09:00:00', '2024-07-13 12:00:00', 'Addressed minor bugs and feedback for Task 15',
        (SELECT id FROM task WHERE title = 'Task 15'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-13 13:00:00', '2024-07-13 16:00:00', 'Polished features and optimized performance for Task 15',
        (SELECT id FROM task WHERE title = 'Task 15'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-14 09:00:00', '2024-07-14 12:00:00', 'Final testing for Task 15',
        (SELECT id FROM task WHERE title = 'Task 15'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-14 13:00:00', '2024-07-14 16:00:00', 'Documentation for Task 15',
        (SELECT id FROM task WHERE title = 'Task 15'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-15 09:00:00', '2024-07-15 12:00:00', 'Final submission and validation for Task 15',
        (SELECT id FROM task WHERE title = 'Task 15'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-20 09:00:00', '2024-07-20 12:00:00', 'Initial planning and design for Task 16',
        (SELECT id FROM task WHERE title = 'Task 16'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-20 13:00:00', '2024-07-20 16:00:00', 'Drafting architecture and feature requirements for Task 16',
        (SELECT id FROM task WHERE title = 'Task 16'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-21 09:00:00', '2024-07-21 12:00:00', 'Core functionality development for Task 16',
        (SELECT id FROM task WHERE title = 'Task 16'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-21 13:00:00', '2024-07-21 16:00:00', 'Worked on system integration for Task 16',
        (SELECT id FROM task WHERE title = 'Task 16'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-22 10:00:00', '2024-07-22 13:00:00', 'Implemented new features for Task 16',
        (SELECT id FROM task WHERE title = 'Task 16'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-22 14:00:00', '2024-07-22 17:00:00', 'Tested and debugged features for Task 16',
        (SELECT id FROM task WHERE title = 'Task 16'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-23 09:00:00', '2024-07-23 12:00:00', 'Worked on system enhancements for Task 16',
        (SELECT id FROM task WHERE title = 'Task 16'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-23 13:00:00', '2024-07-23 16:00:00', 'Addressed issues found during testing for Task 16',
        (SELECT id FROM task WHERE title = 'Task 16'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-24 09:00:00', '2024-07-24 12:00:00', 'Final checks and optimizations for Task 16',
        (SELECT id FROM task WHERE title = 'Task 16'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-24 13:00:00', '2024-07-24 16:00:00', 'Documentation and preparation for Task 16',
        (SELECT id FROM task WHERE title = 'Task 16'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-25 09:00:00', '2024-07-25 12:00:00', 'Final testing and review for Task 16',
        (SELECT id FROM task WHERE title = 'Task 16'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-07-25 13:00:00', '2024-07-25 16:00:00', 'Final submission and validation of Task 16',
        (SELECT id FROM task WHERE title = 'Task 16'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-01 09:00:00', '2024-01-01 12:00:00', 'Initial planning and task breakdown for Task 17',
        (SELECT id FROM task WHERE title = 'Task 17'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-01 13:00:00', '2024-01-01 16:00:00', 'Designing the workflow for Task 17',
        (SELECT id FROM task WHERE title = 'Task 17'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-02 09:00:00', '2024-01-02 12:00:00', 'Worked on core functionality for Task 17',
        (SELECT id FROM task WHERE title = 'Task 17'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-02 13:00:00', '2024-01-02 16:00:00', 'Worked on system integrations for Task 17',
        (SELECT id FROM task WHERE title = 'Task 17'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-03 10:00:00', '2024-01-03 13:00:00', 'Testing features of Task 17',
        (SELECT id FROM task WHERE title = 'Task 17'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-03 14:00:00', '2024-01-03 17:00:00', 'Debugging and resolving issues for Task 17',
        (SELECT id FROM task WHERE title = 'Task 17'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-04 09:00:00', '2024-01-04 12:00:00', 'Polishing and finalizing features for Task 17',
        (SELECT id FROM task WHERE title = 'Task 17'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-04 13:00:00', '2024-01-04 16:00:00', 'Testing and quality assurance for Task 17',
        (SELECT id FROM task WHERE title = 'Task 17'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-05 09:00:00', '2024-01-05 12:00:00', 'Documentation and submission for Task 17',
        (SELECT id FROM task WHERE title = 'Task 17'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-05 13:00:00', '2024-01-05 16:00:00', 'Final checks and review for Task 17',
        (SELECT id FROM task WHERE title = 'Task 17'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-06 09:00:00', '2024-01-06 12:00:00', 'Final verification for Task 17',
        (SELECT id FROM task WHERE title = 'Task 17'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-15 09:00:00', '2024-01-15 12:00:00', 'Initial planning and task breakdown for Task 18',
        (SELECT id FROM task WHERE title = 'Task 18'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-15 13:00:00', '2024-01-15 16:00:00', 'Designed features and workflows for Task 18',
        (SELECT id FROM task WHERE title = 'Task 18'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-16 09:00:00', '2024-01-16 12:00:00', 'Worked on core functionality for Task 18',
        (SELECT id FROM task WHERE title = 'Task 18'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-16 13:00:00', '2024-01-16 16:00:00', 'Developed system integrations for Task 18',
        (SELECT id FROM task WHERE title = 'Task 18'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-17 10:00:00', '2024-01-17 13:00:00', 'Tested key features for Task 18',
        (SELECT id FROM task WHERE title = 'Task 18'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-17 14:00:00', '2024-01-17 17:00:00', 'Bug fixing and improvements for Task 18',
        (SELECT id FROM task WHERE title = 'Task 18'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-18 09:00:00', '2024-01-18 12:00:00', 'Polishing features and final checks for Task 18',
        (SELECT id FROM task WHERE title = 'Task 18'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-18 13:00:00', '2024-01-18 16:00:00', 'Final review and testing for Task 18',
        (SELECT id FROM task WHERE title = 'Task 18'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-19 09:00:00', '2024-01-19 12:00:00', 'Documentation and report generation for Task 18',
        (SELECT id FROM task WHERE title = 'Task 18'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-19 13:00:00', '2024-01-19 16:00:00', 'Submission and final checks for Task 18',
        (SELECT id FROM task WHERE title = 'Task 18'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-01-20 09:00:00', '2024-01-20 12:00:00', 'Post-submission testing and review for Task 18',
        (SELECT id FROM task WHERE title = 'Task 18'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-01 09:00:00', '2024-02-01 12:00:00', 'Initial planning and task breakdown for Task 19',
        (SELECT id FROM task WHERE title = 'Task 19'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-01 13:00:00', '2024-02-01 16:00:00', 'Drafting features and requirements for Task 19',
        (SELECT id FROM task WHERE title = 'Task 19'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-02 09:00:00', '2024-02-02 12:00:00', 'Developed core features for Task 19',
        (SELECT id FROM task WHERE title = 'Task 19'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-02 13:00:00', '2024-02-02 16:00:00', 'Testing core modules for Task 19',
        (SELECT id FROM task WHERE title = 'Task 19'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-03 10:00:00', '2024-02-03 13:00:00', 'Bug fixing and debugging for Task 19',
        (SELECT id FROM task WHERE title = 'Task 19'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-03 14:00:00', '2024-02-03 17:00:00', 'Polishing features for Task 19',
        (SELECT id FROM task WHERE title = 'Task 19'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-04 09:00:00', '2024-02-04 12:00:00', 'Final testing for Task 19',
        (SELECT id FROM task WHERE title = 'Task 19'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-04 13:00:00', '2024-02-04 16:00:00', 'Fixing issues found during testing for Task 19',
        (SELECT id FROM task WHERE title = 'Task 19'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-05 09:00:00', '2024-02-05 12:00:00', 'Final submission and review for Task 19',
        (SELECT id FROM task WHERE title = 'Task 19'), (SELECT id FROM app_user WHERE username = 'jane_smith')),


       ('2024-02-10 09:00:00', '2024-02-10 12:00:00', 'Initial planning and design for Task 20',
        (SELECT id FROM task WHERE title = 'Task 20'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-10 13:00:00', '2024-02-10 16:00:00', 'Drafting system features and architecture for Task 20',
        (SELECT id FROM task WHERE title = 'Task 20'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-11 09:00:00', '2024-02-11 12:00:00', 'Worked on core modules for Task 20',
        (SELECT id FROM task WHERE title = 'Task 20'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-11 13:00:00', '2024-02-11 16:00:00', 'Continued feature development for Task 20',
        (SELECT id FROM task WHERE title = 'Task 20'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-12 10:00:00', '2024-02-12 13:00:00', 'Testing core functionality of Task 20',
        (SELECT id FROM task WHERE title = 'Task 20'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-12 14:00:00', '2024-02-12 17:00:00', 'Fixing bugs and improving performance for Task 20',
        (SELECT id FROM task WHERE title = 'Task 20'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-13 09:00:00', '2024-02-13 12:00:00', 'Refining features and adding improvements for Task 20',
        (SELECT id FROM task WHERE title = 'Task 20'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-13 13:00:00', '2024-02-13 16:00:00', 'System integration testing for Task 20',
        (SELECT id FROM task WHERE title = 'Task 20'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-14 09:00:00', '2024-02-14 12:00:00', 'Final checks and system optimization for Task 20',
        (SELECT id FROM task WHERE title = 'Task 20'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-14 13:00:00', '2024-02-14 16:00:00', 'Documentation and final review for Task 20',
        (SELECT id FROM task WHERE title = 'Task 20'), (SELECT id FROM app_user WHERE username = 'jane_smith')),

       ('2024-02-15 09:00:00', '2024-02-15 12:00:00', 'Final submission and validation for Task 20',
        (SELECT id FROM task WHERE title = 'Task 20'), (SELECT id FROM app_user WHERE username = 'jane_smith')),


       ('2024-03-01 09:00:00', '2024-03-01 12:00:00', 'Initial planning and task breakdown for Task 21',
        (SELECT id FROM task WHERE title = 'Task 21'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-01 13:00:00', '2024-03-01 16:00:00', 'Drafting requirements and workflow for Task 21',
        (SELECT id FROM task WHERE title = 'Task 21'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-02 09:00:00', '2024-03-02 12:00:00', 'Developing core features for Task 21',
        (SELECT id FROM task WHERE title = 'Task 21'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-02 13:00:00', '2024-03-02 16:00:00', 'Worked on system integration for Task 21',
        (SELECT id FROM task WHERE title = 'Task 21'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-03 10:00:00', '2024-03-03 13:00:00', 'Tested core modules for Task 21',
        (SELECT id FROM task WHERE title = 'Task 21'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-03 14:00:00', '2024-03-03 17:00:00', 'Bug fixing and improvements for Task 21',
        (SELECT id FROM task WHERE title = 'Task 21'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-04 09:00:00', '2024-03-04 12:00:00', 'Finalizing features and improvements for Task 21',
        (SELECT id FROM task WHERE title = 'Task 21'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-04 13:00:00', '2024-03-04 16:00:00', 'System testing and review for Task 21',
        (SELECT id FROM task WHERE title = 'Task 21'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-05 09:00:00', '2024-03-05 12:00:00', 'Documentation for Task 21',
        (SELECT id FROM task WHERE title = 'Task 21'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-05 13:00:00', '2024-03-05 16:00:00', 'Final submission and review for Task 21',
        (SELECT id FROM task WHERE title = 'Task 21'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-15 09:00:00', '2024-03-15 12:00:00', 'Initial planning and task breakdown for Task 22',
        (SELECT id FROM task WHERE title = 'Task 22'), (SELECT id FROM app_user WHERE username = 'mike_jones'))
        ,
       ('2024-03-15 13:00:00', '2024-03-15 16:00:00', 'Drafting design and features for Task 22',
        (SELECT id FROM task WHERE title = 'Task 22'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-16 09:00:00', '2024-03-16 12:00:00', 'Developing core features for Task 22',
        (SELECT id FROM task WHERE title = 'Task 22'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-16 13:00:00', '2024-03-16 16:00:00', 'Worked on system integration for Task 22',
        (SELECT id FROM task WHERE title = 'Task 22'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-17 10:00:00', '2024-03-17 13:00:00', 'Implemented key functionalities for Task 22',
        (SELECT id FROM task WHERE title = 'Task 22'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-17 14:00:00', '2024-03-17 17:00:00', 'Tested and debugged features for Task 22',
        (SELECT id FROM task WHERE title = 'Task 22'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-18 09:00:00', '2024-03-18 12:00:00', 'Polishing features and improving system performance for Task 22',
        (SELECT id FROM task WHERE title = 'Task 22'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-18 13:00:00', '2024-03-18 16:00:00', 'Final testing for Task 22',
        (SELECT id FROM task WHERE title = 'Task 22'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-19 09:00:00', '2024-03-19 12:00:00', 'Documentation for Task 22',
        (SELECT id FROM task WHERE title = 'Task 22'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-19 13:00:00', '2024-03-19 16:00:00', 'Final review and submission for Task 22',
        (SELECT id FROM task WHERE title = 'Task 22'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-03-20 09:00:00', '2024-03-20 12:00:00', 'Post-submission checks and review for Task 22',
        (SELECT id FROM task WHERE title = 'Task 22'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-01 09:00:00', '2024-04-01 12:00:00', 'Initial planning and breakdown for Task 23',
        (SELECT id FROM task WHERE title = 'Task 23'), (SELECT id FROM app_user WHERE username = 'mike_jones'))
        ,
       ('2024-04-01 13:00:00', '2024-04-01 16:00:00', 'Drafted requirements and system design for Task 23',
        (SELECT id FROM task WHERE title = 'Task 23'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-02 09:00:00', '2024-04-02 12:00:00', 'Developed core functionality for Task 23',
        (SELECT id FROM task WHERE title = 'Task 23'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-02 13:00:00', '2024-04-02 16:00:00', 'System integration for Task 23',
        (SELECT id FROM task WHERE title = 'Task 23'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-03 10:00:00', '2024-04-03 13:00:00', 'Bug fixing and improvements for Task 23',
        (SELECT id FROM task WHERE title = 'Task 23'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-03 14:00:00', '2024-04-03 17:00:00', 'Feature enhancement for Task 23',
        (SELECT id FROM task WHERE title = 'Task 23'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-04 09:00:00', '2024-04-04 12:00:00', 'Testing core modules for Task 23',
        (SELECT id FROM task WHERE title = 'Task 23'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-04 13:00:00', '2024-04-04 16:00:00', 'Finalizing features for Task 23',
        (SELECT id FROM task WHERE title = 'Task 23'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-05 09:00:00', '2024-04-05 12:00:00', 'Polishing and bug fixes for Task 23',
        (SELECT id FROM task WHERE title = 'Task 23'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-05 13:00:00', '2024-04-05 16:00:00', 'Documentation and review for Task 23',
        (SELECT id FROM task WHERE title = 'Task 23'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-06 09:00:00', '2024-04-06 12:00:00', 'Final testing and review for Task 23',
        (SELECT id FROM task WHERE title = 'Task 23'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-15 09:00:00', '2024-04-15 12:00:00', 'Initial planning and task breakdown for Task 24',
        (SELECT id FROM task WHERE title = 'Task 24'), (SELECT id FROM app_user WHERE username = 'mike_jones'))
        ,
       ('2024-04-15 13:00:00', '2024-04-15 16:00:00', 'Drafting design and feature requirements for Task 24',
        (SELECT id FROM task WHERE title = 'Task 24'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-16 09:00:00', '2024-04-16 12:00:00', 'Developed core functionality for Task 24',
        (SELECT id FROM task WHERE title = 'Task 24'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-16 13:00:00', '2024-04-16 16:00:00', 'Worked on integrations for Task 24',
        (SELECT id FROM task WHERE title = 'Task 24'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-17 10:00:00', '2024-04-17 13:00:00', 'Testing core features for Task 24',
        (SELECT id FROM task WHERE title = 'Task 24'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-17 14:00:00', '2024-04-17 17:00:00', 'Debugging and bug fixing for Task 24',
        (SELECT id FROM task WHERE title = 'Task 24'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-18 09:00:00', '2024-04-18 12:00:00', 'Polishing and optimizing features for Task 24',
        (SELECT id FROM task WHERE title = 'Task 24'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-18 13:00:00', '2024-04-18 16:00:00', 'Final testing and review for Task 24',
        (SELECT id FROM task WHERE title = 'Task 24'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-19 09:00:00', '2024-04-19 12:00:00', 'Final documentation and preparation for Task 24',
        (SELECT id FROM task WHERE title = 'Task 24'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-04-19 13:00:00', '2024-04-19 16:00:00', 'Final review and submission for Task 24',
        (SELECT id FROM task WHERE title = 'Task 24'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-05-01 09:00:00', '2024-05-01 12:00:00', 'Initial planning and task breakdown for Task 25',
        (SELECT id FROM task WHERE title = 'Task 25'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-05-01 13:00:00', '2024-05-01 16:00:00', 'Designing features and system architecture for Task 25',
        (SELECT id FROM task WHERE title = 'Task 25'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-05-02 09:00:00', '2024-05-02 12:00:00', 'Developed core modules for Task 25',
        (SELECT id FROM task WHERE title = 'Task 25'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-05-02 13:00:00', '2024-05-02 16:00:00', 'Worked on system integration for Task 25',
        (SELECT id FROM task WHERE title = 'Task 25'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-05-03 10:00:00', '2024-05-03 13:00:00', 'Tested core functionalities for Task 25',
        (SELECT id FROM task WHERE title = 'Task 25'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-05-03 14:00:00', '2024-05-03 17:00:00', 'Bug fixing and optimization for Task 25',
        (SELECT id FROM task WHERE title = 'Task 25'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-05-04 09:00:00', '2024-05-04 12:00:00', 'Polishing features and improving system for Task 25',
        (SELECT id FROM task WHERE title = 'Task 25'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-05-04 13:00:00', '2024-05-04 16:00:00', 'Final testing and bug fixing for Task 25',
        (SELECT id FROM task WHERE title = 'Task 25'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-05-05 09:00:00', '2024-05-05 12:00:00', 'Documentation and reporting for Task 25',
        (SELECT id FROM task WHERE title = 'Task 25'), (SELECT id FROM app_user WHERE username = 'mike_jones')),

       ('2024-05-05 13:00:00', '2024-05-05 16:00:00', 'Final submission and review for Task 25',
        (SELECT id FROM task WHERE title = 'Task 25'), (SELECT id FROM app_user WHERE username = 'mike_jones')),


       ('2024-05-10 09:00:00', '2024-05-10 12:00:00', 'Initial planning and design for Task 26',
        (SELECT id FROM task WHERE title = 'Task 26'), (SELECT id FROM app_user WHERE username = 'oliver_brown'))
        ,
       ('2024-05-10 13:00:00', '2024-05-10 16:00:00', 'Worked on task features and requirements for Task 26',
        (SELECT id FROM task WHERE title = 'Task 26'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-05-11 09:00:00', '2024-05-11 12:00:00', 'Developed core functionality for Task 26',
        (SELECT id FROM task WHERE title = 'Task 26'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-05-11 13:00:00', '2024-05-11 16:00:00', 'Worked on system integration for Task 26',
        (SELECT id FROM task WHERE title = 'Task 26'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-05-12 10:00:00', '2024-05-12 13:00:00', 'Tested main features for Task 26',
        (SELECT id FROM task WHERE title = 'Task 26'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-05-12 14:00:00', '2024-05-12 17:00:00', 'Bug fixing and feature improvements for Task 26',
        (SELECT id FROM task WHERE title = 'Task 26'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-05-13 09:00:00', '2024-05-13 12:00:00', 'Refining features and improving Task 26',
        (SELECT id FROM task WHERE title = 'Task 26'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-05-13 13:00:00', '2024-05-13 16:00:00', 'Final testing for Task 26',
        (SELECT id FROM task WHERE title = 'Task 26'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-05-14 09:00:00', '2024-05-14 12:00:00', 'Optimization and final tweaks for Task 26',
        (SELECT id FROM task WHERE title = 'Task 26'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-05-14 13:00:00', '2024-05-14 16:00:00', 'Final documentation and submission for Task 26',
        (SELECT id FROM task WHERE title = 'Task 26'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-01 09:00:00', '2024-06-01 12:00:00', 'Initial planning and task breakdown for Task 27',
        (SELECT id FROM task WHERE title = 'Task 27'), (SELECT id FROM app_user WHERE username = 'oliver_brown'))
        ,
       ('2024-06-01 13:00:00', '2024-06-01 16:00:00', 'Designed system workflow for Task 27',
        (SELECT id FROM task WHERE title = 'Task 27'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-02 09:00:00', '2024-06-02 12:00:00', 'Worked on core functionality for Task 27',
        (SELECT id FROM task WHERE title = 'Task 27'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-02 13:00:00', '2024-06-02 16:00:00', 'Integrated key modules for Task 27',
        (SELECT id FROM task WHERE title = 'Task 27'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-03 10:00:00', '2024-06-03 13:00:00', 'Testing main features for Task 27',
        (SELECT id FROM task WHERE title = 'Task 27'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-03 14:00:00', '2024-06-03 17:00:00', 'Bug fixing and refining Task 27',
        (SELECT id FROM task WHERE title = 'Task 27'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-04 09:00:00', '2024-06-04 12:00:00', 'Optimized features for Task 27',
        (SELECT id FROM task WHERE title = 'Task 27'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-04 13:00:00', '2024-06-04 16:00:00', 'Final testing for Task 27',
        (SELECT id FROM task WHERE title = 'Task 27'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-05 09:00:00', '2024-06-05 12:00:00', 'Documentation and reporting for Task 27',
        (SELECT id FROM task WHERE title = 'Task 27'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-05 13:00:00', '2024-06-05 16:00:00', 'Final review and preparation for Task 27',
        (SELECT id FROM task WHERE title = 'Task 27'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-15 09:00:00', '2024-06-15 12:00:00', 'Initial planning and task breakdown for Task 28',
        (SELECT id FROM task WHERE title = 'Task 28'), (SELECT id FROM app_user WHERE username = 'oliver_brown'))
        ,
       ('2024-06-15 13:00:00', '2024-06-15 16:00:00', 'Drafted system architecture and design for Task 28',
        (SELECT id FROM task WHERE title = 'Task 28'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-16 09:00:00', '2024-06-16 12:00:00', 'Developed core features for Task 28',
        (SELECT id FROM task WHERE title = 'Task 28'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-16 13:00:00', '2024-06-16 16:00:00', 'Integration of subsystems for Task 28',
        (SELECT id FROM task WHERE title = 'Task 28'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-17 10:00:00', '2024-06-17 13:00:00', 'Testing core functionality for Task 28',
        (SELECT id FROM task WHERE title = 'Task 28'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-17 14:00:00', '2024-06-17 17:00:00', 'Fixing bugs and refining system for Task 28',
        (SELECT id FROM task WHERE title = 'Task 28'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-18 09:00:00', '2024-06-18 12:00:00', 'Refining features and enhancing system performance for Task 28',
        (SELECT id FROM task WHERE title = 'Task 28'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-18 13:00:00', '2024-06-18 16:00:00', 'Final testing for Task 28',
        (SELECT id FROM task WHERE title = 'Task 28'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-19 09:00:00', '2024-06-19 12:00:00', 'Documentation and reporting for Task 28',
        (SELECT id FROM task WHERE title = 'Task 28'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-19 13:00:00', '2024-06-19 16:00:00', 'Final review and submission for Task 28',
        (SELECT id FROM task WHERE title = 'Task 28'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-06-20 09:00:00', '2024-06-20 12:00:00', 'Post-submission checks and validation for Task 28',
        (SELECT id FROM task WHERE title = 'Task 28'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-01 09:00:00', '2024-07-01 12:00:00', 'Initial planning and task breakdown for Task 29',
        (SELECT id FROM task WHERE title = 'Task 29'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-01 13:00:00', '2024-07-01 16:00:00', 'Drafting design and system architecture for Task 29',
        (SELECT id FROM task WHERE title = 'Task 29'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-02 09:00:00', '2024-07-02 12:00:00', 'Developed core features for Task 29',
        (SELECT id FROM task WHERE title = 'Task 29'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-02 13:00:00', '2024-07-02 16:00:00', 'Worked on system integration for Task 29',
        (SELECT id FROM task WHERE title = 'Task 29'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-03 10:00:00', '2024-07-03 13:00:00', 'Tested core modules for Task 29',
        (SELECT id FROM task WHERE title = 'Task 29'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-03 14:00:00', '2024-07-03 17:00:00', 'Bug fixing and feature improvement for Task 29',
        (SELECT id FROM task WHERE title = 'Task 29'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-04 09:00:00', '2024-07-04 12:00:00', 'Optimizing performance for Task 29',
        (SELECT id FROM task WHERE title = 'Task 29'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-04 13:00:00', '2024-07-04 16:00:00', 'Final testing for Task 29',
        (SELECT id FROM task WHERE title = 'Task 29'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-05 09:00:00', '2024-07-05 12:00:00', 'Documentation and final reporting for Task 29',
        (SELECT id FROM task WHERE title = 'Task 29'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-05 13:00:00', '2024-07-05 16:00:00', 'Final review and submission for Task 29',
        (SELECT id FROM task WHERE title = 'Task 29'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-10 09:00:00', '2024-07-10 12:00:00', 'Initial planning and task breakdown for Task 30',
        (SELECT id FROM task WHERE title = 'Task 30'), (SELECT id FROM app_user WHERE username = 'oliver_brown'))
        ,
       ('2024-07-10 13:00:00', '2024-07-10 16:00:00', 'Drafting features and system design for Task 30',
        (SELECT id FROM task WHERE title = 'Task 30'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-11 09:00:00', '2024-07-11 12:00:00', 'Developing core functionality for Task 30',
        (SELECT id FROM task WHERE title = 'Task 30'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-11 13:00:00', '2024-07-11 16:00:00', 'Integration of features for Task 30',
        (SELECT id FROM task WHERE title = 'Task 30'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-12 10:00:00', '2024-07-12 13:00:00', 'Testing core features for Task 30',
        (SELECT id FROM task WHERE title = 'Task 30'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-12 14:00:00', '2024-07-12 17:00:00', 'Bug fixing and refinement for Task 30',
        (SELECT id FROM task WHERE title = 'Task 30'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-13 09:00:00', '2024-07-13 12:00:00', 'Refining features and performance for Task 30',
        (SELECT id FROM task WHERE title = 'Task 30'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-13 13:00:00', '2024-07-13 16:00:00', 'System testing for Task 30',
        (SELECT id FROM task WHERE title = 'Task 30'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-14 09:00:00', '2024-07-14 12:00:00', 'Final review and documentation for Task 30',
        (SELECT id FROM task WHERE title = 'Task 30'), (SELECT id FROM app_user WHERE username = 'oliver_brown')),

       ('2024-07-14 13:00:00', '2024-07-14 16:00:00', 'Final submission and checks for Task 30',
        (SELECT id FROM task WHERE title = 'Task 30'), (SELECT id FROM app_user WHERE username = 'oliver_brown'));












