CREATE TABLE `member` (
	`user_id`	bigint	NOT NULL	COMMENT '멤버',
	`username`	varchar(255)	NULL	COMMENT '이메일 (학교 이메일)',
	`display_name`	varchar(255)	NULL	COMMENT '닉네임',
	`real_name`	varchar(255)	NULL	COMMENT '본명',
	`password`	varchar(255)	NULL	COMMENT '비밀번호',
	`phone_number`	char(13)	NULL	COMMENT '전화번호',
	`role`	enum('ROLE_ADMIN', 'ROLE_USER')	NULL,
	`affiliation`	varchar(255)	NULL	COMMENT '소속된 학교',
	`created_at`	datetime(6)	NULL	COMMENT '가입 일시',
	`updated_at`	datetime(6)	NULL	COMMENT '정보 수정 일시'
);

CREATE TABLE `club` (
	`club_id`	bigint	NOT NULL	COMMENT '동아리',
	`club_name`	varchar(255)	NULL	COMMENT '동아리 이름',
	`manager_id`	bigint	NULL	COMMENT '동아리 대표자 id',
	`logo_image`	varchar(255)	NULL	COMMENT '로고 이미지',
	`detail_image`	varchar(255)	NULL	COMMENT '상세 이미지',
	`join_info`	VARCHAR(255)	NULL,
	`created_at`	datetime(6)	NULL	COMMENT '생성 일시',
	`updated_at`	datetime(6)	NULL	COMMENT '정보 수정 일시'
);

CREATE TABLE `club_recruitment` (
	`recruitment_id`	bigint	NOT NULL,
	`club_id`	bigint	NOT NULL,
	`title`	varchar(255)	NULL,
	`content`	text	NULL,
	`writer_id`	bigint	NULL,
	`maxMembers`	int	NULL,
	`application_deadline`	datetime(6)	NULL,
	`status`	enum('RECRUITING', 'CLOSED')	NULL,
	`views`	int	NULL,
	`created_at`	datetime(6)	NULL,
	`updated_at`	datetime(6)	NULL
);

CREATE TABLE `comment` (
	`comment_id`	bigint	NOT NULL,
	`recruitment_id`	bigint	NOT NULL,
	`user_id`	bigint	NOT NULL	COMMENT '멤버',
	`content`	text	NULL,
	`created_at`	datetime(6)	NULL,
	`updated_at`	datetime(6)	NULL
);

CREATE TABLE `notification` (
	`notification_id`	bigint	NOT NULL,
	`member_id`	bigint	NOT NULL,
	`message`	varchar(255)	NULL,
	`is_read`	boolean	NULL,
	`created_at`	datetime(6)	NULL
);

CREATE TABLE `application` (
	`application_id`	bigint	NOT NULL,
	`recruitment_id`	bigint	NOT NULL,
	`user_id`	bigint	NOT NULL	COMMENT '멤버',
	`status`	enum('PENDING', 'APPROVED', 'REJECTED')	NULL,
	`application_content`	text	NULL	COMMENT '지원서 내용',
	`submitted_at`	datetime(6)	NULL	COMMENT '지원서 제출 일시',
	`updated_at`	datetime(6)	NULL	COMMENT '지원서 상태 변경 일시'
);

CREATE TABLE `favorite_club` (
	`favorite_id`	bigint	NOT NULL,
	`member_id`	bigint	NOT NULL,
	`club_id`	bigint	NOT NULL	COMMENT '동아리',
	`created_at`	datetime(6)	NULL
);

CREATE TABLE `like` (
	`like_id`	bigint	NOT NULL,
	`user_id`	bigint	NOT NULL	COMMENT '멤버',
	`recruitment_id`	bigint	NOT NULL,
	`club_id`	bigint	NOT NULL
);

ALTER TABLE `member` ADD CONSTRAINT `PK_MEMBER` PRIMARY KEY (
	`user_id`
);

ALTER TABLE `club` ADD CONSTRAINT `PK_CLUB` PRIMARY KEY (
	`club_id`
);

ALTER TABLE `club_recruitment` ADD CONSTRAINT `PK_CLUB_RECRUITMENT` PRIMARY KEY (
	`recruitment_id`,
	`club_id`
);

ALTER TABLE `comment` ADD CONSTRAINT `PK_COMMENT` PRIMARY KEY (
	`comment_id`,
	`recruitment_id`,
	`user_id`
);

ALTER TABLE `notification` ADD CONSTRAINT `PK_NOTIFICATION` PRIMARY KEY (
	`notification_id`,
	`member_id`
);

ALTER TABLE `application` ADD CONSTRAINT `PK_APPLICATION` PRIMARY KEY (
	`application_id`,
	`recruitment_id`,
	`user_id`
);

ALTER TABLE `favorite_club` ADD CONSTRAINT `PK_FAVORITE_CLUB` PRIMARY KEY (
	`favorite_id`,
	`member_id`,
	`club_id`
);

ALTER TABLE `like` ADD CONSTRAINT `PK_LIKE` PRIMARY KEY (
	`like_id`,
	`user_id`,
	`recruitment_id`,
	`club_id`
);

ALTER TABLE `club_recruitment` ADD CONSTRAINT `FK_club_TO_club_recruitment_1` FOREIGN KEY (
	`club_id`
)
REFERENCES `club` (
	`club_id`
);

ALTER TABLE `comment` ADD CONSTRAINT `FK_club_recruitment_TO_comment_1` FOREIGN KEY (
	`recruitment_id`
)
REFERENCES `club_recruitment` (
	`recruitment_id`
);

ALTER TABLE `comment` ADD CONSTRAINT `FK_member_TO_comment_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `member` (
	`user_id`
);

ALTER TABLE `notification` ADD CONSTRAINT `FK_member_TO_notification_1` FOREIGN KEY (
	`member_id`
)
REFERENCES `member` (
	`user_id`
);

ALTER TABLE `application` ADD CONSTRAINT `FK_club_recruitment_TO_application_1` FOREIGN KEY (
	`recruitment_id`
)
REFERENCES `club_recruitment` (
	`recruitment_id`
);

ALTER TABLE `application` ADD CONSTRAINT `FK_member_TO_application_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `member` (
	`user_id`
);

ALTER TABLE `favorite_club` ADD CONSTRAINT `FK_member_TO_favorite_club_1` FOREIGN KEY (
	`member_id`
)
REFERENCES `member` (
	`user_id`
);

ALTER TABLE `favorite_club` ADD CONSTRAINT `FK_club_TO_favorite_club_1` FOREIGN KEY (
	`club_id`
)
REFERENCES `club` (
	`club_id`
);

ALTER TABLE `like` ADD CONSTRAINT `FK_member_TO_like_1` FOREIGN KEY (
	`user_id`
)
REFERENCES `member` (
	`user_id`
);

ALTER TABLE `like` ADD CONSTRAINT `FK_club_recruitment_TO_like_1` FOREIGN KEY (
	`recruitment_id`
)
REFERENCES `club_recruitment` (
	`recruitment_id`
);

ALTER TABLE `like` ADD CONSTRAINT `FK_club_recruitment_TO_like_2` FOREIGN KEY (
	`club_id`
)
REFERENCES `club_recruitment` (
	`club_id`
);

