DROP TABLE IF EXISTS `test`.`user`;
DROP TABLE IF EXISTS `test`.`point_use`;
DROP TABLE IF EXISTS `test`.`point`;
DROP TABLE IF EXISTS `test`.`member`;

-- test.`user` definition
CREATE TABLE `test`.`user` (
  `id` int NOT NULL AUTO_INCREMENT, 
  `firstName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `lastName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `isActive` tinyint NOT NULL DEFAULT 1,
   PRIMARY KEY (`id`)
   ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- test.`member` definition

CREATE TABLE `test`.`member` (
  `id` int NOT NULL AUTO_INCREMENT,
  `membername` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- test.`point` definition

CREATE TABLE `test`.`point` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` enum('SAVE','USE','USE_CANCLE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int NOT NULL,
  `breakdown` varchar(255) COLLATE utf8mb4_unicode_ci,
  `expiration_date` date NOT NULL DEFAULT (date_format((now() + interval 1 year),_utf8mb4'%Y-%m-%d')),
  `member_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_9399c30a2304f6948938f84b06d` (`member_id`),
  CONSTRAINT `FK_9399c30a2304f6948938f84b06d` FOREIGN KEY (`member_id`) REFERENCES `member` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `test`.`point_use` (
  `id` int NOT NULL AUTO_INCREMENT,
  `point_id_use` int NOT NULL,
  `point_id` int NOT NULL,
  `amount` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_cc8b26f836bfcad25b443f0b421` (`point_id`),
  CONSTRAINT `FK_cc8b26f836bfcad25b443f0b421` FOREIGN KEY (`point_id`) REFERENCES `point` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO test.`member` (id, membername, created_at) VALUES(1, 'wishty1', '2022-12-19 01:15:27.581947');
INSERT INTO test.`member` (id, membername, created_at) VALUES(2, 'wishty2', '2022-12-19 01:15:27.581947');
INSERT INTO test.`member` (id, membername, created_at) VALUES(3, 'wishty3', '2022-12-19 01:15:27.581947');

INSERT INTO test.`point` (id, category, amount, breakdown, expiration_date, member_id, created_at) VALUES(1, 'SAVE', 10000, '가입축하 적립',  '2022-12-19', 1, '2021-12-19 01:16:00.841971');
INSERT INTO test.`point` (id, category, amount, breakdown, expiration_date, member_id, created_at) VALUES(2, 'SAVE', 5000, '추천인 적립',  '2023-12-19', 1, '2022-12-19 01:45:45.611627');
INSERT INTO test.`point` (id, category, amount, breakdown, expiration_date, member_id, created_at) VALUES(3, 'SAVE', 10000, '가입축하 적립',  '2023-12-19', 2,  '2022-12-19 02:41:16.054394');
INSERT INTO test.`point` (id, category, amount, breakdown, expiration_date, member_id, created_at) VALUES(4, 'SAVE', 5000, '추천인 적립',  '2023-12-19', 2, '2022-12-19 01:16:00.841971');
INSERT INTO test.`point` (id, category, amount, breakdown, expiration_date, member_id, created_at) VALUES(5, 'SAVE', 50000, '당첨적립',  '2023-12-19', 3, '2022-12-19 02:59:54.923237');
INSERT INTO test.`point` (id, category, amount, breakdown, expiration_date, member_id, created_at) VALUES(6, 'SAVE', 3000, '깜짝 적립',  '2023-12-19', 1, '2022-12-19 03:32:34.015535');
INSERT INTO test.`point` (id, category, amount, breakdown, expiration_date, member_id, created_at) VALUES(7, 'USE', -7000, '적립금 사용', '2023-12-19', 1, '2022-12-19 03:32:34.015535');

INSERT INTO test.`point_use` (id, point_id_use, point_id, amount, created_at) VALUES(1, 7, 2, 5000, CURRENT_TIMESTAMP(6));
INSERT INTO test.`point_use` (id, point_id_use, point_id, amount, created_at) VALUES(2, 7, 6, 2000, CURRENT_TIMESTAMP(6));