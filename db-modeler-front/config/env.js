export default {
  // Redis 配置
  redis: {
    host: '127.0.0.1',
    port: 6379,
    db: 2
  },

  // 邮件服务配置
  email: {
    host: 'smtp.exmail.qq.com',
    port: 465,
    secure: true,
    user: 'your-email@example.com',
    pass: 'your-email-password',
    from: 'DB Modeler <your-email@example.com>'
  },

  // 重置密码验证码配置
  resetCode: {
    expiration: 600, // 10分钟
    length: 6
  }
};
