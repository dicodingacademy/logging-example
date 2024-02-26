const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');
const logger = new winston.createLogger({
	format: winston.format.json(),
	transports: [
		new (winston.transports.Console)({
			timestamp: true,
			colorize: true,
		})
	]
});

if (process.env.NODE_ENV === 'production') {
	const cloudwatchConfig = {
		logGroupName: 'Application-Log-Group',
		logStreamName: 'Application-Log-Stream',
		awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
		awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
		awsRegion: process.env.AWS_REGION,
		messageFormatter: ({ level, message }) => `[${level}] : ${message}}}`
	}
	logger.add(new WinstonCloudWatch(cloudwatchConfig))
}

module.exports = logger;