import redis from 'redis';
import {constant} from "../constants/constant.js";
const {REDIS_CACHE_PORT, REDIS_CACHE_HOST} = constant;
function retryStrategy(options) {
	if (options.error && options.error.code === 'ECONNREFUSED') {
			// End reconnecting on a specific error and flush all commands with
			// a individual error
			return new Error('The server refused the connection');
	}
	if (options.total_retry_time > 60 * 5 * 1000) {
			// End reconnecting after a specific timeout and flush all commands
			// with a individual error
			return new Error('Retry time exhausted');
	}
	if (options.attempt > 3) {
			// End reconnecting with built in error
			return undefined;
	}
	// reconnect after
	return Math.min(options.attempt * 100, 3000);
}

const cacheClient = async() => {
    
	//const client = redis.createClient(process.env.REDIS_CACHE_PORT, process.env.REDIS_CACHE_HOST, {retry_strategy: retryStrategy});
    const client = redis.createClient(REDIS_CACHE_PORT, REDIS_CACHE_HOST, {retry_strategy: retryStrategy});
    client.on('connect', function () {
		console.log('connected to cache redis');
	});
    client.on('error', error => 
		console.log('connected to cache redis Error: ' + error)
	);
   
        await client.connect();



//	client.select(process.env.REDIS_CACHE_DATABASE)
	// setInterval(function() {
//		client.ping();
//	}, 60000);
	return client;
}

const getValueFromCache = async (key) => {
	try {
		let client =await cacheClient();
        console.log('connected to cache redis');
		let data = await client.get(key);
        console.log('connected to cache redis',data);
		return JSON.parse(data);
	} catch(err) {
		console.log("fataa", err)
		return null;
	}
}

const setValueInCache=async (key, value, expire) => {
	const client = await cacheClient();
	return new Promise(function(resolve, reject){
		if(expire) {
			client.set(key, JSON.stringify(value),'EX',expire, function (err, reply) {
				if(err){
					console.log('+++++++++++++',err)
				}
				console.log('+++++++reply1++++++', reply)
				resolve({key: key, data: value});
				});
		} else {
			client.ttl(key, (err,ttl)=>{
				if(ttl){
					client.set(key, JSON.stringify(value),'EX',ttl, function (err, reply) {
						if(err){
							console.log('+++++++++++++',err)
						}
						console.log('+++++++reply2++++++', reply)
						resolve({key: key, data: value});
						});
				} 
				if(err){
					console.log("error in ttl",err)
				} 
			})

		}
	})
}
export const KrphRedis = {
    cacheClient, setValueInCache, getValueFromCache 
}
