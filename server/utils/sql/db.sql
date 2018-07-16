
-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `open_id` varchar(64) NOT NULL COMMENT '账号',
  `pwd` varchar(64) DEFAULT NULL COMMENT '密码',
  `channel` varchar(20) DEFAULT NULL COMMENT '渠道标示，如WeChat',
  `platform` int(11) DEFAULT NULL COMMENT '平台 0：其他，1：Android，2：IOS，3：Flash，4：HTML5',
  `account_type` int(11) DEFAULT NULL COMMENT '账号类型，0：自主创建，1微信账号，2QQ账号，3微博账号',
  `follow_wechat` int(11) DEFAULT NULL COMMENT '是否关注公众号（0：未关注，1：已关注）',
  `wxpush_switch` int(11) DEFAULT NULL COMMENT '微信推送开关（0：关闭，1：开启）',
  `create_time` int(11) DEFAULT NULL COMMENT '创建账号时间，秒',
  `login_time` int(11) DEFAULT NULL COMMENT '登录时间，秒',
  `off_time` int(11) DEFAULT NULL COMMENT '离线时间，秒',
  `city` varchar(64) DEFAULT NULL COMMENT '普通用户个人资料填写的城市',
  `province` varchar(64) DEFAULT NULL COMMENT '普通用户个人资料填写的省份',
  `country` varchar(64) DEFAULT NULL COMMENT '国家，如中国为CN',
  `phone` varchar(50) DEFAULT NULL COMMENT '手机号',
  PRIMARY KEY (`id`),
  UNIQUE KEY `open_id` (`open_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1000000 DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `rid` bigint(11) NOT NULL AUTO_INCREMENT,
  `open_id` varchar(64) NOT NULL COMMENT '账号',
  `nick` varchar(64) NOT NULL COMMENT '角色名',
  `gender` int(11) DEFAULT NULL COMMENT '男1，女2',
  `level` int(11) DEFAULT NULL COMMENT '等级',
  `leaf` int(11) DEFAULT NULL COMMENT '叶子，也就是开房用到的',
  `exp` int(11) DEFAULT NULL COMMENT '经验',
  `gold` int(11) DEFAULT NULL COMMENT '金币，类似欢乐豆之类的',
  `head` int(11) DEFAULT NULL COMMENT '系统默认的头像ID',
  `url_head` int(11) DEFAULT NULL COMMENT '其他头像ID的url',
  `forbid` int(11) DEFAULT NULL COMMENT '封号时间，秒',
  PRIMARY KEY (`rid`),
  UNIQUE KEY `open_id` (`open_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1000000 DEFAULT CHARSET=utf8mb4;



